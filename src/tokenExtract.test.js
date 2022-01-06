const token = require('./tokenExtract.js');

var pairInfo = []
var pathSpecs = []
var chain = 'FTM'
var exchange = 'Spookyswap'

describe('We should get the Path we expect', () =>{
    beforeAll(()=>{
        pairInfo.push({
            pair_id: 'element1-pairID',
            pair_name: `token0symbol-token1symbol`,
            token0_sym: 'token0symbol',
            token1_sym: 'token1symbol',
            reserve0: 10,
            reserve1: 5,
            token0Price: 2.1,
            token1Price: 4.5,
            token0_id: 'token0.id',
            token1_id: 'token1.id',
            token0_name: 'token0.name',
            token1_name: 'token1.name',
            volumeUSD: 'volumeUSD'
        });
        pairInfo.push({
            pair_id: 'element2-pairID',
            pair_name: `token0symbol-token1symbol`,
            token0_sym: 'token0symbol',
            token1_sym: 'token1symbol',
            reserve0: 5,
            reserve1: 10,
            token0Price: 12.1,
            token1Price: 42.5,
            token0_id: 'token0.id',
            token1_id: 'token1.id',
            token0_name: 'token0.name',
            token1_name: 'token1.name',
            volumeUSD: 'volumeUSD'
        });
    
        pathSpecs.push({
            name: 'path1 Name',
            abID: 'element1-pairID',
            abInvert: true,
            bcID: 'element2-pairID',
            bcInvert: false,
            caID: 'element3-pairID',
            caInvert: true});
        
        pathSpecs.push({
            name: 'path2 Name',
            abID: 'element3-pairID',
            abInvert: true,
            bcID: 'element2-pairID',
            bcInvert: false,
            caID: 'element1-pairID',
            caInvert: true});
    });

    test('Expect to get Token Array', async () => {

        const data = await token.extractTokenInfo(pairInfo, chain, exchange)

        let expected = [{
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
            // console.log(data);
            expect(data).toEqual(expected);
    });

    test('Expect to get Pair Array', async () => {

        const data = await token.extractPairInfo(pairInfo, chain, exchange)

        let expected = [{
            id: 'element1-pairID',
            ticker: 'token0symbol-token1symbol',
            token0: 'token0symbol',
            token1: 'token1symbol',
            token0_id: 'token0.id',
            token1_id: 'token1.id',
            token0_depth: 10,
            token1_depth: 5,
            rate0_1: 2,
            rate1_0: 0.5,
            maker_fee: 0,
            taker_fee: 0.997,
            exchange: 'Spookyswap',
            chain: 'FTM'
        },
        {
            id: 'element2-pairID',
            ticker: 'token0symbol-token1symbol',
            token0: 'token0symbol',
            token1: 'token1symbol',
            token0_id: 'token0.id',
            token1_id: 'token1.id',
            token0_depth: 5,
            token1_depth: 10,
            rate0_1: 0.5,
            rate1_0: 2,
            maker_fee: 0,
            taker_fee: 0.997,
            exchange: 'Spookyswap',
            chain: 'FTM'
        }]
            // console.log(data);
            expect(data).toEqual(expected);
    });

});