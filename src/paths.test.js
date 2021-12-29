const paths = require('./paths.js');

var pairInfo = []
var pathSpecs = []

describe('We should get the Path we expect', () =>{
    beforeAll(()=>{
        pairInfo.push({
            pair_id: 'element1-pairID',
            pair_name: `token0symbol-token1symbol`,
            token0_sym: 'token0symbol',
            token1_sym: 'token1symbol',
            reserve0: 101,
            reserve1: 102,
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
            reserve0: 103,
            reserve1: 104,
            token0Price: 12.1,
            token1Price: 42.5,
            token0_id: 'token0.id',
            token1_id: 'token1.id',
            token0_name: 'token0.name',
            token1_name: 'token1.name',
            volumeUSD: 'volumeUSD'
        });
        pairInfo.push({
            pair_id: 'element3-pairID',
            pair_name: `token0symbol-token1symbol`,
            token0_sym: 'token0symbol',
            token1_sym: 'token1symbol',
            reserve0: 105,
            reserve1: 106,
            token0Price: 512.1,
            token1Price: 452.5,
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

    test('Expect to get Path', async () => {
    const data = await paths.buildPaths(pairInfo, pathSpecs)
        console.log(data);
        expect(data).toEqual([{"a1": 102, "a3": 105, "b1": 101, "b2": 103, "c2": 104, "c3": 106, "pathname": "path1 Name"}, {"a1": 106, "a3": 101, "b1": 105, "b2": 103, "c2": 104, "c3": 102, "pathname": "path2 Name"}]);
    });

});