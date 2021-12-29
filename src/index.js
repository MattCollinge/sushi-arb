const { parseSync } = require('@babel/core');
const sushiData = require('@sushiswap/sushi-data');
const colors = require('colors');
const objectsToCsv = require('objects-to-csv')

const arb = require('./arbCalculation.js');
const paths = require('./paths.js');
const chain = 'ETH' //Options are 'ETH' or 'FTM' or 'AVAX'

//TODO: Test this file !!!
sushiData.exchange
  .observePairs({exchangeChain:chain})
  .subscribe({next: (pairs) => savePair(pairs), error: (err) => console.log(err)})

const savePair = async(pairs) => {

      pairInfo = []
      
      pairs.forEach(element => {
        //    console.log("Pair:", element)
        var newEle = {
            pair_id: element.id,
            pair_name: `${element.token0.symbol}-${element.token1.symbol}`,
            token0_sym: element.token0.symbol,
            token1_sym: element.token1.symbol,
            reserve0: element.reserve0,
            reserve1: element.reserve1,
            token0Price: element.token0Price,
            token1Price: element.token1Price,
            token0_id: element.token0.id,
            token1_id: element.token1.id,
            token0_name: element.token0.name,
            token1_name: element.token1.name,
            volumeUSD: element.volumeUSD,
            txCount: element.txCount
        }
        // console.log(newEle)
        pairInfo.push(newEle)
      });
    
      const csv = new objectsToCsv(pairInfo)
      await csv.toDisk(`./data/arb-${chain}.csv`)//, { append: true })
        console.log(pairInfo)

      pathSpecs = await specPaths();
    
      let arbPaths = await paths.buildPaths(pairInfo,pathSpecs)

      await arbPaths.forEach((path) => {
        arbCheck(path);
      })

      
    
}

const specPaths = async()=> {
    pathSpecs = [];

    // path0 =  0x5cf235c56418109fb7f0aacca1b75a0a38047ca9	EFI-WETH	token1	token0
    //          0x3cc5519fb7f811159f30ba21dc2258341872dd67	EFI-USDT	token0	token1
    //          0x06da0fd433c1a5d7a4faa01111c044910a184553	WETH-USDT	token1	token0
    pathSpecs.push({name: 'WETH->EF->USDT->WETH',
    abID: '0x5cf235c56418109fb7f0aacca1b75a0a38047ca9',
    abInvert: true,
    bcID: '0x3cc5519fb7f811159f30ba21dc2258341872dd67',
    bcInvert: false,
    caID: '0x06da0fd433c1a5d7a4faa01111c044910a184553',
    caInvert: true})

    // path1 =  0xec8c342bc3e07f05b9a782bc34e7f04fb9b44502	FRAX-WETH	token1	token0
    //          0xe06f8d30ac334c857fc8c380c85969c150f38a6a	SUSHI-FRAX	token1	token0
    //          0x795065dcc9f64b5614c407a6efdc400da6221fb0	SUSHI-WETH	token0	token1
    pathSpecs.push({name: 'WETH->FRAX->SUSHI->WETH',
    abID: '0xec8c342bc3e07f05b9a782bc34e7f04fb9b44502',
    abInvert: true,
    bcID: '0xe06f8d30ac334c857fc8c380c85969c150f38a6a',
    bcInvert: true,
    caID: '0x795065dcc9f64b5614c407a6efdc400da6221fb0',
    caInvert: false})

    // path2 =  0x31d64f9403e82243e71c2af9d8f56c7dbe10c178	NFTX-WETH	token1	token0
    //          0xaf89678341f78261d1450f8464fb63614b366317	PUNK-NFTX	token1	token0
    //          0x0463a06fbc8bf28b3f120cd1bfc59483f099d332	PUNK-WETH	token0	token1
    pathSpecs.push({name: 'WETH->NFTX->PUNK->WETH',
    abID: '0x31d64f9403e82243e71c2af9d8f56c7dbe10c178',
    abInvert: true,
    bcID: '0xaf89678341f78261d1450f8464fb63614b366317',
    bcInvert: true,
    caID: '0x0463a06fbc8bf28b3f120cd1bfc59483f099d332',
    caInvert: false})

    // path3 =  0x17a2194d55f52fd0c711e0e42b41975494bb109b	ARMOR-WETH	token1	token0
    //          0x5a06bd8702f06b4f21382e8a87b1ab99a46b8768	ARMOR-DAI	token0	token1
    //          0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f	DAI-WETH	token0	token1
    pathSpecs.push({name: 'WETH->ARMOR->DAI->WETH',
    abID: '0x17a2194d55f52fd0c711e0e42b41975494bb109b',
    abInvert: true,
    bcID: '0x5a06bd8702f06b4f21382e8a87b1ab99a46b8768',
    bcInvert: false,
    caID: '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f',
    caInvert: false})

    // path4 =  0x1bec4db6c3bc499f3dbf289f5499c30d541fec97	MANA-WETH	token1	token0
    //          0x495f8ef80e13e9e1e77d60d2f384bb49694823ef	MANA-DAI	token0	token1
    //          0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f	DAI-WETH	token0	token1
    pathSpecs.push({name: 'WETH->MANA->DAI->WETH',
    abID: '0x1bec4db6c3bc499f3dbf289f5499c30d541fec97',
    abInvert: true,
    bcID: '0x495f8ef80e13e9e1e77d60d2f384bb49694823ef',
    bcInvert: false,
    caID: '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f',
    caInvert: false})

    // path5 =  0xfffae4a0f4ac251f4705717cd24cadccc9f33e06	OHM-WETH	token1	token0
    //          0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c	OHM-DAI	    token0	token1
    //          0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f	DAI-WETH	token0	token1
    pathSpecs.push({name: 'WETH->OHM->DAI->WETH',
    abID: '0xfffae4a0f4ac251f4705717cd24cadccc9f33e06',
    abInvert: true,
    bcID: '0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c',
    bcInvert: false,
    caID: '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f',
    caInvert: false})

    // path6 =  0x0eee7f7319013df1f24f5eaf83004fcf9cf49245	BAO-WETH	token1	token0
    //          0x072b999fc3d82f9ea08b8adbb9d63a980ff2b14d	BAO-USDC	token0	token1
    //          0x397ff1542f962076d0bfe58ea045ffa2d347aca0	USDC-WETH	token0	token1
    pathSpecs.push({name: 'WETH->BAO->USDC->WETH',
    abID: '0x0eee7f7319013df1f24f5eaf83004fcf9cf49245',
    abInvert: true,
    bcID: '0x072b999fc3d82f9ea08b8adbb9d63a980ff2b14d',
    bcInvert: false,
    caID: '0x397ff1542f962076d0bfe58ea045ffa2d347aca0',
    caInvert: false})

    // path7 =  0xe4ebd836832f1a8a81641111a5b081a2f90b9430	DYDX-WETH	token1	token0
    //          0xd59c7ee3bd7f9acf17bfa5bad059ae2ec4eee8f6	DYDX-USDC	token0	token1
    //          0x397ff1542f962076d0bfe58ea045ffa2d347aca0	USDC-WETH	token0	token1
    pathSpecs.push({name: 'WETH->DYDX->USDC->WETH',
    abID: '0xe4ebd836832f1a8a81641111a5b081a2f90b9430',
    abInvert: true,
    bcID: '0xd59c7ee3bd7f9acf17bfa5bad059ae2ec4eee8f6',
    bcInvert: false,
    caID: '0x397ff1542f962076d0bfe58ea045ffa2d347aca0',
    caInvert: false})

    // path8 =  0xce7e98d4da6ebda6af474ea618c6b175729cd366	FODL-WETH	token1	token0
    //          0xa5c475167f03b1556c054e0da78192cd2779087f	FODL-USDC	token0	token1
    //          0x397ff1542f962076d0bfe58ea045ffa2d347aca0	USDC-WETH	token0	token1
    pathSpecs.push({name: 'WETH->ARMOR->DAI->WETH',
    abID: '0xce7e98d4da6ebda6af474ea618c6b175729cd366',
    abInvert: true,
    bcID: '0xa5c475167f03b1556c054e0da78192cd2779087f',
    bcInvert: false,
    caID: '0x397ff1542f962076d0bfe58ea045ffa2d347aca0',
    caInvert: false})

    return pathSpecs
}

const arbCheck = async(abcPath) =>{
    r1 = 0.997
    r2 = 1.0
    delta_a = 5

    var abca = await arb.uabca(r1,r2,abcPath.a1, abcPath.b1, abcPath.b2, abcPath.c2, abcPath.c3, abcPath.a3, delta_a)
    var acba = await arb.uacba(r1,r2,abcPath.a1, abcPath.b1, abcPath.b2, abcPath.c2, abcPath.c3, abcPath.a3, delta_a)

    const toDisplayNumber = (num)=>{
        // Number(Math.round(parseFloat(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces)
        return num.toPrecision(4);
    }

    output = `Path:${abcPath.pathname} - uABCA: ${toDisplayNumber(abca)}, ACBA: ${toDisplayNumber(acba)}. 
    rAB-A: ${toDisplayNumber(abcPath.a1)},  rAB-B: ${toDisplayNumber(abcPath.b1)}
    rBC-B: ${toDisplayNumber(abcPath.b2)},  rBC-C: ${toDisplayNumber(abcPath.c2)}
    rCA-C: ${toDisplayNumber(abcPath.c3)},  rCA-A: ${toDisplayNumber(abcPath.a3)}`

    if(abca > 0){
        abcPath.abca = abca
        abcPath.acba = acba
        console.log(output.green.bold)
        const csv = new objectsToCsv([abcPath])
        await csv.toDisk(`./data/arbTS-${chain}.csv`, { append: true })
    }
    else if(acba > 0){
        abcPath.abca = abca
        abcPath.acba = acba
        console.log(output.red.bold)
        const csv = new objectsToCsv([abcPath])
        await csv.toDisk(`./data/arbTS-${chain}.csv`, { append: true })
    }
    else{
        console.log(output)
    }
}

