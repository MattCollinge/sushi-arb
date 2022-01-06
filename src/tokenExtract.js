const { Map, Set } = require('immutable');

const extractTokenInfo = async(pairInfo, chain) => { 
    var tokenSet = new Set();

    pairInfo.forEach(element => {
        tokenSet= tokenSet.add(Map({
            id: element.token0_id,
            ticker: element.token0_sym,
            desc: element.token0_name,
            chain: chain
        }))
        tokenSet = tokenSet.add(Map({
            id: element.token1_id,
            ticker: element.token1_sym,
            desc: element.token1_name,
            chain: chain
        }));
    });
   
    var tokens = []
    tokenSet.forEach((map)=>{tokens.push(map.toObject())})
    
    return tokens
}

const extractPairInfo = async(pairInfo, chain, exchange) => {
    var tokenSet = new Set();

    pairInfo.forEach(element => {
        tokenSet= tokenSet.add(Map({
            id: element.pair_id,
            ticker: element.pair_name,
            token0: element.token0_sym,
            token1: element.token1_sym,
            token0_id: element.token0_id,
            token1_id: element.token1_id,
            token0_depth: element.reserve0,
            token1_depth: element.reserve1,
            rate0_1: getRate(element.reserve0, element.reserve1),
            rate1_0: getRate(element.reserve1, element.reserve0),
            maker_fee: 0,
            taker_fee: 0.997,
            exchange: 'Spookyswap',
            chain: 'FTM'
        }))
    });
   
    var pairs = []
    tokenSet.forEach((map)=>{pairs.push(map.toObject())})
    
    return pairs
}

const getRate = (reserve0, reserve1) => {
    var result;
    
    if (reserve1 == 0){
        result = 1
    }else{
        result = reserve0/reserve1
    }

 return result;
}

module.exports.extractTokenInfo = extractTokenInfo;
module.exports.extractPairInfo = extractPairInfo;