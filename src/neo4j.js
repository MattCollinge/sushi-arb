const neo4j = require('neo4j-driver');

var neo4jURI = 'neo4j+s://fa7b4c94.databases.neo4j.io'
var driver
var connected = false

function template(strings, ...keys) {
    return (function(...values) {
      let dict = values[values.length - 1] || {};
      let result = [strings[0]];
      keys.forEach(function(key, i) {
        let value = Number.isInteger(key) ? values[key] : dict[key];
        result.push(value, strings[i + 1]);
      });
      return result.join('');
    });
  }

  // id: element.pair_id,
  // ticker: element.pair_name,
  // token0: element.token0_sym,
  // token1: element.token1_sym,
  // token0_id: element.token0_id,
  // token1_id: element.token1_id,
  // token0_depth: element.reserve0,
  // token1_depth: element.reserve1,
  // rate0_1: getRate(element.reserve0, element.reserve1),
  // rate1_0: getRate(element.reserve1, element.reserve0),
  // maker_fee: 0,
  // taker_fee: 0.997,
  // exchange: 'Spookyswap',
  // chain: 'FTM'

// MATCH (t0:Token {token_id: token0_id})
// MATCH (t1:Token {token_id: token1_id})
// MERGE (t0)-[rel:PAIR {pairId: pairId, pair: token0+’-'+token1, token0_depth: token0_depth, token1_depth: token1_depth, rate: rate0_1, maker_fee: maker_fee, taker_fee: taker_fee, exchange: exchange, chain: chain}]->(t1)
// MERGE (t1)-[rel:PAIR {pairId: pairId, pair: token1+’-'+token0, token0_depth: token1_depth, token1_depth: token0_depth, rate: rate1_0, maker_fee: maker_fee, taker_fee: taker_fee, exchange: exchange, chain: chain}]->(t0)

// CREATE CONSTRAINT [uniqueTokenTickerETH] [IF NOT EXISTS]
// FOR (n:Token:ETH)
// REQUIRE n.id IS UNIQUE

// CREATE CONSTRAINT [uniqueTokenTickerFTM] [IF NOT EXISTS]
// FOR (n:Token:FTM)
// REQUIRE n.id IS UNIQUE

// CREATE CONSTRAINT [uniqueTokenTickerAVAX] [IF NOT EXISTS]
// FOR (n:Token:AVAX)
// REQUIRE n.id IS UNIQUE

const generatePairUpsert = (pair)=>{
    let pairClosure = template`MATCH (t0:Token:${'chain'} {id: '${'token0_id'}'})
    MATCH (t1:Token:${'chain'} {id: '${'token1_id'}'})
    MERGE (t0)-[rel:PAIR {pairId: '${'id'}', pair: '${'token0'}-${'token1'}', token0_depth: ${'token0_depth'}, token1_depth: ${'token1_depth'}, rate: ${'rate0_1'}, maker_fee: ${'maker_fee'}, taker_fee: ${'taker_fee'}, exchange: '${'exchange'}', chain: '${'chain'}'}]->(t1)
    MERGE (t1)-[relrev:PAIR {pairId: '${'id'}', pair: '${'token1'}-${'token0'}', token0_depth: ${'token1_depth'}, token1_depth: ${'token0_depth'}, rate: ${'rate1_0'}, maker_fee: ${'maker_fee'}, taker_fee: ${'taker_fee'}, exchange: '${'exchange'}', chain: '${'chain'}'}]->(t0)`
    // pair.rate1_0 = neo4j.int(pair.rate1_0)
    // pair.rate0_1 = neo4j.int(pair.rate0_1)
    let insertStatement = pairClosure(pair);
    return insertStatement;
}

const writePairEdges = async (pairs)=> {
    for (const element of pairs){
     await writeToNeo4j(generatePairUpsert(element)) 
     console.log(`Written Pair:${element.token0}-${element.token1}`)  
    }
    return pairs.length;
}

  
const generateTokenInsert = (token)=>{
    let tokenClosure = template`MERGE (n:Token:${'chain'} {name:"${'ticker'}", id:"${'id'}", desc:"${'desc'}"}) RETURN n.name`
    let insertStatement = tokenClosure(token);
    return insertStatement;
}

const writeTokenNodes = async (tokens)=> {
    for (const element of tokens){
     await writeToNeo4j(generateTokenInsert(element))
     console.log(`Written Token:${element.ticker}`)     
    }
    return tokens.length;
}

const writeToNeo4j= async (payload)=> {
  var session = driver.session({
    database: 'neo4j',
    defaultAccessMode: neo4j.session.WRITE
  });

 const result = await session.writeTransaction(async txc => {
    // used transaction will be committed automatically, no need for explicit commit/rollback
  
    var result = await txc.run(
        payload
    //   "CREATE (USDC:Token {name:'USDC', id:'0x04068da6c83afcfa0e13ba15a6696662335d5b75'}), (WFTM:Token {name:'WFTM', id:'0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'}),(DAI:Token{name:'DAI', id:'0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'}) RETURN USDC"//"MERGE (alice:Person {name : 'Alice'}) RETURN alice.name AS name"
    )
    // at this point it is possible to either return the result or process it and return the
    // result of processing it is also possible to run more statements in the same transaction
    return result.records.map(record => record.get(0))//result.records.map(record => record.get('USDC'))
  })

  // console.log(result);
  return result
}


const connect = async()=> {
    driver = neo4j.driver(
    neo4jURI,
    neo4j.auth.basic('neo4j', 'g6Fnifq1Ej_Fp2oHUMhXGy9yatDgWboXourPx3HuP7Q')
    )
    connected = true
}

const exitHandler = async (options, exitCode) => {
    console.log('Exiting....')
    if (connected) {await driver.close()};
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
  }
  
  //do something when app is closing
  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  
  //catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  
  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
  process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
  
  //catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


module.exports.neo4jDriver = driver;
module.exports.writeToNeo4j = writeToNeo4j;
module.exports.connect = connect;
module.exports.writeTokenNodes = writeTokenNodes;
module.exports.generateTokenInsert = generateTokenInsert;
module.exports.writePairEdges = writePairEdges;