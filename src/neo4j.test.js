const neo4j = require('./neo4j.js');

var pairInfo = []
var tokens = []
var chain = 'FTM'
var exchange = 'Spookyswap'

describe('We should get the Path we expect', () =>{
    beforeAll(()=>{
        neo4j.connect();
        tokens = [{
            id: 'token0.id',
            ticker: 'token0symbol',
            desc: 'token0.name',
            chain: 'FTM'
        },
        {
            id: 'token1.id',
            ticker: 'token1symbol',
            desc: 'token1.name',
            chain: 'FTM'
        }]
    });

    test('Expect to get +ve response after writing default payload', async () => {
        
        let payload = "MERGE (alice:Person {name : 'Alice'}) RETURN alice.name AS name"
        const data = await neo4j.writeToNeo4j(payload)
        console.log(data);

        let expected = [ 'Alice' ];

        expect(data).toEqual(expected);
        await neo4j.writeToNeo4j("Match (n {name: 'Alice'}) Delete n")
    });

    test('Expect to write Token Array', async () => {
        const data = await neo4j.writeTokenNodes(tokens)
        console.log(data);

        let expected = tokens.length;
        expect(data).toEqual(expected);
        await neo4j.writeToNeo4j("Match (n {name: 'token0symbol'}) Delete n")
        await neo4j.writeToNeo4j("Match (n {name: 'token1symbol'}) Delete n")
    });

    test('Expect to get formatted string', async () => {
        const data = await neo4j.generateTokenInsert(tokens[0])
        console.log(data);

        let expected = 'CREATE (token0symbol:Token:FTM {name:\'token0symbol\', id:\'token0.id\', desc:\'token0.name\'}) RETURN token0symbol.name';
        expect(data).toEqual(expected);
        await neo4j.writeToNeo4j("Match (n {name: 'token0symbol'}) Delete n")
    });    
});