const { parseSync } = require('@babel/core');
const sushiData = require('@sushiswap/sushi-data');
const colors = require('colors');
const objectsToCsv = require('objects-to-csv')
const yargs = require('yargs');

const arb = require('./arbCalculation.js');
const paths = require('./paths.js');
var chain // = 'FTM' //Options are 'ETH' or 'FTM', 'Spooky_FTM', or 'AVAX'

//TODO: Test this file !!!

const argv = yargs
    // .option('chain', {
    //     alias: 'c',
    //     description: 'Sets which chain to monitor for Arb opportunities (ETH, FTM, AVAX)',
    //     type: 'string'
    //   })
  .command('chain', 'Sets which chain to monitor for Arb opportunities', {
    sym: {
      description: 'the symbol to denote which chain to watch',
      alias: 's',
      type: 'string'
    }
  })
  .help()
  .alias('help', 'h').argv;

  if (argv._.includes('chain')) {
    chain = argv.sym || 'ETH';
    console.log('argv.symbol:', argv.sym)
  }else{
    chain = 'ETH';
    console.log('Defaulting to EThereum Chain...')
  }
  console.log(argv);

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
            txCount: element.txCount,
            reserveETH: element.reserveETH,
            reserveUSD: element.reserveUSD,
            trackedReserveETH: element.trackedReserveETH
        }
        // console.log(newEle)
        pairInfo.push(newEle)
      });
    
    //   const csv = new objectsToCsv(pairInfo)
    //   await csv.toDisk(`./data/arb-${chain}.csv`)//, { append: true })
        // console.log(pairInfo)

      var pathSpecs
      switch(chain){
        case "ETH": {
                pathSpecs = await specPathsETH();
            }break;
        case "FTM": {
                pathSpecs = await specPathsFTM();
            }break;
        case "AVAX": {
                pathSpecs = await specPathsAVAX();
            }break;
        case "Spooky_FTM": {
                pathSpecs = await specPathsSpookyFTM();
            }break;
        default:{
                pathSpecs = await specPathsETH();
            }break;
      }
    
      let arbPaths = await paths.buildPaths(pairInfo,pathSpecs)

      await arbPaths.forEach((path) => {
        arbCheck(path);
      })
    }

const specPathsETH = async()=> {
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

const specPathsFTM = async()=> {
    pathSpecs = [];

    // path0 =  0x84311ecc54d7553378c067282940b0fdfb913675	WFTM-ICE	token0	token1
    //          0x93698ad941359a3c771e15cfce345abe0191e035	fUSDT-ICE	token1	token0
    //          0xd019dd7c760c6431797d6ed170bffb8faee11f99	fUSDT-WFTM	token0	token1
    pathSpecs.push({name: 'WFTM->ICE->fUSDT->WFTM',
    abID: '0x84311ecc54d7553378c067282940b0fdfb913675',
    abInvert: false,
    bcID: '0x93698ad941359a3c771e15cfce345abe0191e035',
    bcInvert: true,
    caID: '0xd019dd7c760c6431797d6ed170bffb8faee11f99',
    caInvert: false})

    // path1 =  0x84311ecc54d7553378c067282940b0fdfb913675	WFTM-ICE	token0	token1
    //          0x206d807c14709db7c1c7500395178d9f72da7160	FUSD-ICE	token1	token0
    //          0x8623836f527350ec50691479674df0cd7773810c	WFTM-FUSD	token1	token0
    pathSpecs.push({name: 'WFTM->ICE->FUSD->WFTM',
    abID: '0x84311ecc54d7553378c067282940b0fdfb913675',
    abInvert: false,
    bcID: '0x206d807c14709db7c1c7500395178d9f72da7160',
    bcInvert: true,
    caID: '0x8623836f527350ec50691479674df0cd7773810c',
    caInvert: true})

    // path2 =  0xfa7ca6e6d17368e0a1fa9c75f2ebe5a8d7be9fc6	LQDR-WFTM	token1	token0
    //          0xa1bb6830fabddb99ed365c0611a33741c5e6173f	fUSDT-LQDR	token1	token0
    //          0xd019dd7c760c6431797d6ed170bffb8faee11f99	fUSDT-WFTM	token0	token1
    pathSpecs.push({name: 'WFTM->LQDR->fUSDT->WFTM',
    abID: '0xfa7ca6e6d17368e0a1fa9c75f2ebe5a8d7be9fc6',
    abInvert: true,
    bcID: '0xa1bb6830fabddb99ed365c0611a33741c5e6173f',
    bcInvert: true,
    caID: '0xd019dd7c760c6431797d6ed170bffb8faee11f99',
    caInvert: false})

    // path3 =  0xe74a6b1f2034c8c137610cafad49a6763cd25865	WFTM-FRAX	token0	token1
    //          0x4669751cd7933c9ca2ac8147ae7043d8561f4c8d	fUSDT-FRAX	token1	token0
    //          0xd019dd7c760c6431797d6ed170bffb8faee11f99	fUSDT-WFTM	token0	token1
    pathSpecs.push({name: 'WFTM->FRAX->fUSDT->WFTM',
    abID: '0xe74a6b1f2034c8c137610cafad49a6763cd25865',
    abInvert: false,
    bcID: '0x4669751cd7933c9ca2ac8147ae7043d8561f4c8d',
    bcInvert: true,
    caID: '0xd019dd7c760c6431797d6ed170bffb8faee11f99',
    caInvert: false})

    // path4 =  0x3ac28d350c59ef9054b305dfe9078fadc3cecabe	ZOO-WFTM	token1	token0
    //          0x426a2cada81ad02c3e00b692cf6f15894f202e85	USDC-ZOO	token1	token0
    //          0xa48869049e36f8bfe0cc5cf655632626988c0140	USDC-WFTM	token0	token1
    pathSpecs.push({name: 'WFTM->ZOO->USDC->WFTM',
    abID: '0x3ac28d350c59ef9054b305dfe9078fadc3cecabe',
    abInvert: true,
    bcID: '0x426a2cada81ad02c3e00b692cf6f15894f202e85',
    bcInvert: true,
    caID: '0xa48869049e36f8bfe0cc5cf655632626988c0140',
    caInvert: false})

    // path5 =  0x3ac28d350c59ef9054b305dfe9078fadc3cecabe	ZOO-WFTM	token1	token0
    //          0x14e2c315a4a5414edbcbe5d521f8f4e2ff48c22a	fUSDT-ZOO	token1	token0
    //          0xd019dd7c760c6431797d6ed170bffb8faee11f99	fUSDT-WFTM	token0	token1
    pathSpecs.push({name: 'WFTM->ZOO->fUSDT->WFTM',
    abID: '0x3ac28d350c59ef9054b305dfe9078fadc3cecabe',
    abInvert: true,
    bcID: '0x14e2c315a4a5414edbcbe5d521f8f4e2ff48c22a',
    bcInvert: true,
    caID: '0xd019dd7c760c6431797d6ed170bffb8faee11f99',
    caInvert: false})

    // path6 =  0x3ac28d350c59ef9054b305dfe9078fadc3cecabe	ZOO-WFTM	token1	token0
    //          0xc1f902921e41f5522f44130761f93e0f92fee355	ZOO-FUSD	token0	token1
    //          0x8623836f527350ec50691479674df0cd7773810c	WFTM-FUSD	token1	token0
    pathSpecs.push({name: 'WFTM->ZOO->FUSD->WFTM',
    abID: '0x3ac28d350c59ef9054b305dfe9078fadc3cecabe',
    abInvert: true,
    bcID: '0xc1f902921e41f5522f44130761f93e0f92fee355',
    bcInvert: false,
    caID: '0x8623836f527350ec50691479674df0cd7773810c',
    caInvert: true})

    // path7 =  0x27884c7647deb61c9f2b9202d1141bb84661756b	WFTM-AAVE	token0	token1
    //          0x2d89bb3b1448152002453aa37fbe4051afdbf56d	USDC-AAVE	token1	token0
    //          0xa48869049e36f8bfe0cc5cf655632626988c0140	USDC-WFTM	token0	token1
    pathSpecs.push({name: 'WFTM->AAVE->USDC->WFTM',
    abID: '0x27884c7647deb61c9f2b9202d1141bb84661756b',
    abInvert: false,
    bcID: '0x2d89bb3b1448152002453aa37fbe4051afdbf56d',
    bcInvert: true,
    caID: '0xa48869049e36f8bfe0cc5cf655632626988c0140',
    caInvert: false})

    // path8 =  0xd019dd7c760c6431797d6ed170bffb8faee11f99	fUSDT-WFTM	token1	token0
    //          0x8be92f3d64e91d08ab1cc8a5c487da3f1695b11e	USDC-fUSDT	token1	token0
    //          0xa48869049e36f8bfe0cc5cf655632626988c0140	USDC-WFTM	token0	token1
    pathSpecs.push({name: 'WFTM->fUSDT->USDC->WFTM',
    abID: '0xd019dd7c760c6431797d6ed170bffb8faee11f99',
    abInvert: true,
    bcID: '0x8be92f3d64e91d08ab1cc8a5c487da3f1695b11e',
    bcInvert: true,
    caID: '0xa48869049e36f8bfe0cc5cf655632626988c0140',
    caInvert: false})

    // path9 =  0xa48869049e36f8bfe0cc5cf655632626988c0140	USDC-WFTM	token1	token0
    //          0x19aea462d6d917a75b8971711d0af44f76e129d7	USDC-FUSD	token0	token1
    //          0x8623836f527350ec50691479674df0cd7773810c	WFTM-FUSD	token1	token0
    pathSpecs.push({name: 'WFTM->USDC->FUSD->WFTM',
    abID: '0xa48869049e36f8bfe0cc5cf655632626988c0140',
    abInvert: true,
    bcID: '0x19aea462d6d917a75b8971711d0af44f76e129d7',
    bcInvert: false,
    caID: '0x8623836f527350ec50691479674df0cd7773810c',
    caInvert: true})

    // path10 = 0xa48869049e36f8bfe0cc5cf655632626988c0140	USDC-WFTM	token1	token0
    //          0xbd0eec56da621b6b31e3d06614f7853624e1c0af	USDC-DAI	token0	token1
    //          0xd32f2eb49e91aa160946f3538564118388d6246a	WFTM-DAI	token1	token0
    pathSpecs.push({name: 'WFTM->USDC->DAI->WFTM',
    abID: '0xa48869049e36f8bfe0cc5cf655632626988c0140',
    abInvert: true,
    bcID: '0xbd0eec56da621b6b31e3d06614f7853624e1c0af',
    bcInvert: false,
    caID: '0xd32f2eb49e91aa160946f3538564118388d6246a',
    caInvert: true})

    // path11 = 0x2ed684f14f951b467f2066c663f488cd0f0475e7	WFTM-MIM	token0	token1
    //          0xffdc0531288dc91c1f49db03a90ed84725e9eda7	USDC-MIM	token1	token0
    //          0xa48869049e36f8bfe0cc5cf655632626988c0140	USDC-WFTM	token0	token1
    pathSpecs.push({name: 'WFTM->MIM->USDC->WFTM',
    abID: '0x2ed684f14f951b467f2066c663f488cd0f0475e7',
    abInvert: false,
    bcID: '0xffdc0531288dc91c1f49db03a90ed84725e9eda7',
    bcInvert: true,
    caID: '0xa48869049e36f8bfe0cc5cf655632626988c0140',
    caInvert: false})

    // path12 = 0x3d0bd54c48c2c433ea6fed609cc3d5fb7a77622b	WFTM-ETH	token0	token1
    //          0xed88d84c8728baaa53fd7226c9e55bd36e777ade	ETH-LINK	token0	token1
    //          0x1ca86e57103564f47ffcea7259a6ce8cc1301549	WFTM-LINK	token1	token0
    pathSpecs.push({name: 'WFTM->ETH->LINK->WFTM',
    abID: '0x3d0bd54c48c2c433ea6fed609cc3d5fb7a77622b',
    abInvert: false,
    bcID: '0xed88d84c8728baaa53fd7226c9e55bd36e777ade',
    bcInvert: false,
    caID: '0x1ca86e57103564f47ffcea7259a6ce8cc1301549',
    caInvert: true})

    // path13 = 0x3e5b15be38f91a0fc9f87e852b2c8106c5edad28	WFTM-BOMB	token0	token1
    //          0xc2998aeb0959aa07cd518c33484bb71acd834b41	BOMB-DAI	token0	token1
    //          0xd32f2eb49e91aa160946f3538564118388d6246a	WFTM-DAI	token1	token0
    pathSpecs.push({name: 'WFTM->BOMB->DAI->WFTM',
    abID: '0x3e5b15be38f91a0fc9f87e852b2c8106c5edad28',
    abInvert: false,
    bcID: '0xc2998aeb0959aa07cd518c33484bb71acd834b41',
    bcInvert: false,
    caID: '0xd32f2eb49e91aa160946f3538564118388d6246a',
    caInvert: true})

    // path14 = 0x063f4af894cb88de33f279e9ba45b5bc8c81f919	WFTM-GASB	token0	token1
    //          0xc83042ee50e88a13b1bf28a911dc14060607d4c7	GASB-DAI	token0	token1
    //          0xd32f2eb49e91aa160946f3538564118388d6246a	WFTM-DAI	token1	token0
    pathSpecs.push({name: 'WFTM->GASB->DAI->WFTM',
    abID: '0x063f4af894cb88de33f279e9ba45b5bc8c81f919',
    abInvert: false,
    bcID: '0xc83042ee50e88a13b1bf28a911dc14060607d4c7',
    bcInvert: false,
    caID: '0xd32f2eb49e91aa160946f3538564118388d6246a',
    caInvert: true})

    return pathSpecs
}

const specPathsAVAX = async()=> {
    pathSpecs = [];

    // path0 =  0xcbb424fd93cdec0ef330d8a8c985e8b147f62339	MIM-WAVAX	token1	token0
    //          0xdf347ad511e5cd692e3633fdb623918560e229d0	MIM-SUSHI.e	token0	token1
    //          0x84fe1a84c0448d1dc4199a40fe53db6a49ed6037	SUSHI.e-WAVAX	token0	token1
    pathSpecs.push({name: 'WAVAX->MIM->SUSHI.e->WAVAX',
    abID: '0xcbb424fd93cdec0ef330d8a8c985e8b147f62339',
    abInvert: true,
    bcID: '0xdf347ad511e5cd692e3633fdb623918560e229d0',
    bcInvert: false,
    caID: '0x84fe1a84c0448d1dc4199a40fe53db6a49ed6037',
    caInvert: false})

    return pathSpecs
}

const specPathsSpookyFTM = async()=> {
    pathSpecs = [];

    // path0 =  0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c	USDC-WFTM	token1	token0
    //          0x484237bc35ca671302d19694c66d617142fbc235	USDC-DAI	token0 	token1
    //          0xe120ffbda0d14f3bb6d6053e90e63c572a66a428	WFTM-DAI	token1 	token0
    pathSpecs.push({name: 'WFTM->USDC->DAI->WFTM',
    abID: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
    abInvert: true,
    bcID: '0x484237bc35ca671302d19694c66d617142fbc235',
    bcInvert: false,
    caID: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
    caInvert: true})

    // path1 =  0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c	USDC-WFTM	token1	token0
    //          0xfdef392adc84607135c24ca45de5452d77aa10de	USDC-fUSDT	token0 	token1
    //          0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410	fUSDT-WFTM	token0 	token1
    pathSpecs.push({name: 'WFTM->USDC->fUSDT->WFTM',
    abID: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
    abInvert: true,
    bcID: '0xfdef392adc84607135c24ca45de5452d77aa10de',
    bcInvert: false,
    caID: '0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410',
    caInvert: false})

    // path2 =  0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c	USDC-WFTM	token1	token0
    //          0x9dfd5b9983c55187e0aa0572daf19b28e46f26fb	USDC-GEIST	token0 	token1
    //          0x668ae94d0870230ac007a01b471d02b2c94ddcb9	WFTM-GEIST	token1	token0
    pathSpecs.push({name: 'WFTM->USDC->GEIST->WFTM',
    abID: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
    abInvert: true,
    bcID: '0x9dfd5b9983c55187e0aa0572daf19b28e46f26fb',
    bcInvert: false,
    caID: '0x668ae94d0870230ac007a01b471d02b2c94ddcb9',
    caInvert: true})

    // path3 =  0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c	USDC-WFTM	token1	token0
    //          0xf8cb2980120469d79958151daa45eb937c6e1ed6	USDC-BOO	token0 	token1
    //          0xec7178f4c41f346b2721907f5cf7628e388a7a58	WFTM-BOO	token1	token0
    pathSpecs.push({name: 'WFTM->USDC->BOO->WFTM',
    abID: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
    abInvert: true,
    bcID: '0xf8cb2980120469d79958151daa45eb937c6e1ed6',
    bcInvert: false,
    caID: '0xec7178f4c41f346b2721907f5cf7628e388a7a58',
    caInvert: true})

    // path4 =  0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c	USDC-WFTM	token1	token0
    //          0x596ad49f6da172be82286441bae6111848eea050	USDC-TOMB	token0 	token1
    //          0x2a651563c9d3af67ae0388a5c8f89b867038089e	WFTM-TOMB	token1	token0
    pathSpecs.push({name: 'WFTM->USDC->TOMB->WFTM',
    abID: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
    abInvert: true,
    bcID: '0x596ad49f6da172be82286441bae6111848eea050',
    bcInvert: false,
    caID: '0x2a651563c9d3af67ae0388a5c8f89b867038089e',
    caInvert: true})

    // path5 =  0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c	USDC-WFTM	token1	token0
    //          0x2276e28645a35dca7cce0958ebf6451a998dd1dc	USDC-SPELL	token0 	token1
    //          0x78f82c16992932efdd18d93f889141ccf326dbc2	WFTM-SPELL	token1	token0
    pathSpecs.push({name: 'WFTM->USDC->SPELL->WFTM',
    abID: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
    abInvert: true,
    bcID: '0x2276e28645a35dca7cce0958ebf6451a998dd1dc',
    bcInvert: false,
    caID: '0x78f82c16992932efdd18d93f889141ccf326dbc2',
    caInvert: true})

    // path6 =  0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c	USDC-WFTM	token1	token0
    //          0x72c0fb8c84d1050a8385e65212777eeb2fed3297	USDC-wsHEC	token0 	token1
    //          0x0bfe6f893a6bc443b575ddf361a30f39aa03e59c	WFTM-wsHEC	token1	token0
    pathSpecs.push({name: 'WFTM->USDC->wsHEC->WFTM',
    abID: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
    abInvert: true,
    bcID: '0x72c0fb8c84d1050a8385e65212777eeb2fed3297',
    bcInvert: false,
    caID: '0x0bfe6f893a6bc443b575ddf361a30f39aa03e59c',
    caInvert: true})

    // path7 =  0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c	USDC-WFTM	token1	token0
    //          0xf62475cbd5121e56fb09eb9727dd95e0755414ae	USDC-DMD	token0 	token1
    //          0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94	WFTM-DMD	token1	token0
    pathSpecs.push({name: 'WFTM->USDC->DMD->WFTM',
    abID: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
    abInvert: true,
    bcID: '0xf62475cbd5121e56fb09eb9727dd95e0755414ae',
    bcInvert: false,
    caID: '0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94',
    caInvert: true})
    
    // path8 =  0xe120ffbda0d14f3bb6d6053e90e63c572a66a428	WFTM-DAI	token0 	token1
    //          0x5783acda7cb2ac03889791b0a2c6cfe1566c2c8b	DAI-GEIST	token0 	token1
    //          0x668ae94d0870230ac007a01b471d02b2c94ddcb9	WFTM-GEIST	token1	token0
    pathSpecs.push({name: 'WFTM->DAI->GEIST->WFTM',
    abID: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
    abInvert: false,
    bcID: '0x5783acda7cb2ac03889791b0a2c6cfe1566c2c8b',
    bcInvert: false,
    caID: '0x668ae94d0870230ac007a01b471d02b2c94ddcb9',
    caInvert: true})

    // path9 =  0xe120ffbda0d14f3bb6d6053e90e63c572a66a428	WFTM-DAI	token0 	token1
    //          0x45414ee53417963a88c839ee614efe6e9459f2b2	BOO-DAI	    token1	token0
    //          0xec7178f4c41f346b2721907f5cf7628e388a7a58	WFTM-BOO	token1	token0
    pathSpecs.push({name: 'WFTM->DAI->BOO->WFTM',
    abID: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
    abInvert: false,
    bcID: '0x45414ee53417963a88c839ee614efe6e9459f2b2',
    bcInvert: true,
    caID: '0xec7178f4c41f346b2721907f5cf7628e388a7a58',
    caInvert: true})

    //path10 =  0xe120ffbda0d14f3bb6d6053e90e63c572a66a428	WFTM-DAI	token0 	token1
    //          0x4a217fbf837c6115b183eaac0245d6a72e8a98e4	fUSDT-DAI	token1	token0
    //          0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410	fUSDT-WFTM	token0 	token1
    pathSpecs.push({name: 'WFTM->DAI->fUSDT->WFTM',
    abID: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
    abInvert: false,
    bcID: '0x4a217fbf837c6115b183eaac0245d6a72e8a98e4',
    bcInvert: true,
    caID: '0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410',
    caInvert: false})

    //path11 =  0xe120ffbda0d14f3bb6d6053e90e63c572a66a428	WFTM-DAI	token0 	token1
    //          0xe22524a307c962c4c833291b12c0db249464ab3c	TOMB-DAI	token1	token0
    //          0x2a651563c9d3af67ae0388a5c8f89b867038089e	WFTM-TOMB	token1	token0
    pathSpecs.push({name: 'WFTM->DAI->TOMB->WFTM',
    abID: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
    abInvert: false,
    bcID: '0xe22524a307c962c4c833291b12c0db249464ab3c',
    bcInvert: true,
    caID: '0x2a651563c9d3af67ae0388a5c8f89b867038089e',
    caInvert: true})

    //path12 =  0xe120ffbda0d14f3bb6d6053e90e63c572a66a428	WFTM-DAI	token0 	token1
    //          0xc3f95f723921350cae9022b022e523f09454dc44	DAI-DMD	    token0 	token1
    //          0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94	WFTM-DMD	token1	token0
    pathSpecs.push({name: 'WFTM->DAI->DMD->WFTM',
    abID: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
    abInvert: false,
    bcID: '0xc3f95f723921350cae9022b022e523f09454dc44',
    bcInvert: false,
    caID: '0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94',
    caInvert: true})

    //path13 =  0x3cceb477fcb6cde90180983642486e68148d7b27	ZOO-WFTM	token1	token0
    //          0x98d9995a222e8322c81cd817bed590ba6a5fed6b	ZOO-BOO	    token0 	token1
    //          0xec7178f4c41f346b2721907f5cf7628e388a7a58	WFTM-BOO	token1	token0
    pathSpecs.push({name: 'WFTM->ZOO->BOO->WFTM',
    abID: '0x3cceb477fcb6cde90180983642486e68148d7b27',
    abInvert: true,
    bcID: '0x98d9995a222e8322c81cd817bed590ba6a5fed6b',
    bcInvert: false,
    caID: '0xec7178f4c41f346b2721907f5cf7628e388a7a58',
    caInvert: true})

    //path14 =  0x3cceb477fcb6cde90180983642486e68148d7b27	ZOO-WFTM	token1	token0
    //          0x7d9d5cb44cea8ed601c68c3da14b1f8cbf86a518	ZOO-TOMB	token0 	token1
    //          0x2a651563c9d3af67ae0388a5c8f89b867038089e	WFTM-TOMB	token1	token0
    pathSpecs.push({name: 'WFTM->ZOO->TOMB->WFTM',
    abID: '0x3cceb477fcb6cde90180983642486e68148d7b27',
    abInvert: true,
    bcID: '0x7d9d5cb44cea8ed601c68c3da14b1f8cbf86a518',
    bcInvert: false,
    caID: '0x2a651563c9d3af67ae0388a5c8f89b867038089e',
    caInvert: true})

    //path15 =  0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410	fUSDT-WFTM	token1	token0
    //          0xccd974e0450fe9d84cd10c2f75f13a48972bb449	fUSDT-SPELL	token0 	token1
    //          0x78f82c16992932efdd18d93f889141ccf326dbc2	WFTM-SPELL	token1	token0
    pathSpecs.push({name: 'WFTM->fUSDT->SPELL->WFTM',
    abID: '0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410',
    abInvert: true,
    bcID: '0xccd974e0450fe9d84cd10c2f75f13a48972bb449',
    bcInvert: false,
    caID: '0x78f82c16992932efdd18d93f889141ccf326dbc2',
    caInvert: true})

    //path16 =  0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410	fUSDT-WFTM	token1	token0
    //          0x03da3e1c3b4aa7f5458d63a45ca345e8bc470b15	fUSDT-DMD	token0 	token1
    //          0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94	WFTM-DMD	token1	token0
    pathSpecs.push({name: 'WFTM->fUSDT->DMD->WFTM',
    abID: '0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410',
    abInvert: true,
    bcID: '0x03da3e1c3b4aa7f5458d63a45ca345e8bc470b15',
    bcInvert: false,
    caID: '0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94',
    caInvert: true})

    //path17 =  0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410	fUSDT-WFTM	token1	token0
    //          0xbe8da8c007c45e8136b99f14481388cb4d76f8f8	fUSDT-BOO	token0 	token1
    //          0xec7178f4c41f346b2721907f5cf7628e388a7a58	WFTM-BOO	token1	token0
    pathSpecs.push({name: 'WFTM->fUSDT->BOO->WFTM',
    abID: '0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410',
    abInvert: true,
    bcID: '0xbe8da8c007c45e8136b99f14481388cb4d76f8f8',
    bcInvert: false,
    caID: '0xec7178f4c41f346b2721907f5cf7628e388a7a58',
    caInvert: true})

    //path18 =  0xec7178f4c41f346b2721907f5cf7628e388a7a58	WFTM-BOO	token0	token1
    //          0xad042d4ddaf9a965ca44173eeee1f0e47c365286	BOO-GEIST	token0	token1
    //          0x668ae94d0870230ac007a01b471d02b2c94ddcb9	WFTM-GEIST	token1	token0
    pathSpecs.push({name: 'WFTM->BOO->GEIST->WFTM',
    abID: '0xec7178f4c41f346b2721907f5cf7628e388a7a58',
    abInvert: false,
    bcID: '0xad042d4ddaf9a965ca44173eeee1f0e47c365286',
    bcInvert: false,
    caID: '0x668ae94d0870230ac007a01b471d02b2c94ddcb9',
    caInvert: true})

    //path19 =  0x1c94665fd3ecfa969feda7ed01e35522e6982022	WFTM-BADGER	token0	token1
    //          0x1b07d5524cec48a607371b4ba238859dc724e4da	BADGER-ICE	token0	token1
    //          0x1c94665fd3ecfa969feda7ed01e35522e6982022	WFTM-BADGER	token1	token0
    pathSpecs.push({name: 'WFTM->BADGER->ICE->WFTM',
    abID: '0x1c94665fd3ecfa969feda7ed01e35522e6982022',
    abInvert: false,
    bcID: '0x1b07d5524cec48a607371b4ba238859dc724e4da',
    bcInvert: false,
    caID: '0x623ee4a7f290d11c11315994db70fb148b13021d',
    caInvert: true})

    //path20 =  0x1c94665fd3ecfa969feda7ed01e35522e6982022	WFTM-BADGER	token0	token1
    //          0xa94cd059f9794d3bd5770b4d7cf5b78d5866ce03	CREAM-BADGERtoken1	token0
    //          0xb77b223490e1f5951ec79a8d09db9eab2adcb934	WFTM-CREAM	token1	token0
    pathSpecs.push({name: 'WFTM->BADGER->CREAM->WFTM',
    abID: '0x1c94665fd3ecfa969feda7ed01e35522e6982022',
    abInvert: false,
    bcID: '0xa94cd059f9794d3bd5770b4d7cf5b78d5866ce03',
    bcInvert: true,
    caID: '0xb77b223490e1f5951ec79a8d09db9eab2adcb934',
    caInvert: true})

    //path21 =  0xf0702249f4d3a25cd3ded7859a165693685ab577	WFTM-ETH	token0	token1
    //          0xec454eda10accdd66209c57af8c12924556f3abd	BTC-ETH	    token1	token0
    //          0xfdb9ab8b9513ad9e419cf19530fee49d412c3ee3	WFTM-BTC	token1	token0
    pathSpecs.push({name: 'WFTM->ETH->BTC->WFTM',
    abID: '0xf0702249f4d3a25cd3ded7859a165693685ab577',
    abInvert: false,
    bcID: '0xec454eda10accdd66209c57af8c12924556f3abd',
    bcInvert: true,
    caID: '0xfdb9ab8b9513ad9e419cf19530fee49d412c3ee3',
    caInvert: true})

    //path22 =  0xf0702249f4d3a25cd3ded7859a165693685ab577	WFTM-ETH	token0	token1
    //          0x0967b636ec4c02569d6cfc4f97fd7df8dad4e9a9	ETH-DMD	    token0	token1
    //          0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94	WFTM-DMD	token1	token0
    pathSpecs.push({name: 'WFTM->ETH->DMD->WFTM',
    abID: '0xf0702249f4d3a25cd3ded7859a165693685ab577',
    abInvert: false,
    bcID: '0x0967b636ec4c02569d6cfc4f97fd7df8dad4e9a9',
    bcInvert: false,
    caID: '0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94',
    caInvert: true})

    //path23 =  0xfdb9ab8b9513ad9e419cf19530fee49d412c3ee3	WFTM-BTC	token0	token1
    //          0xf6862656cbedaf8146474ef0af926f01c352178b	BTC-DMD	    token0	token1
    //          0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94	WFTM-DMD	token1	token0
    pathSpecs.push({name: 'WFTM->BTC->DMD->WFTM',
    abID: '0xfdb9ab8b9513ad9e419cf19530fee49d412c3ee3',
    abInvert: false,
    bcID: '0xf6862656cbedaf8146474ef0af926f01c352178b',
    bcInvert: false,
    caID: '0xf10f0eeb144eb223dd8ae7d5dd7f3327e63a3c94',
    caInvert: true})

    return pathSpecs
}

const arbCheck = async(abcPath) =>{
    var r1 
    var r2
    var delta_a

    switch(chain){
        case "ETH": {
                r1 = 0.997
                r2 = 1.0
                delta_a = 0.1
            }break;
        case "FTM": {
                r1 = 0.9975
                r2 = 1.0
                delta_a = 1
            }break;
        case "AVAX": {
                r1 = 0.997
                r2 = 1.0
                delta_a = 1
            }break;
        case "Spooky_FTM": {
                r1 = 0.9975
                r2 = 1.0
                delta_a = 1
            }break;
        default:{
                r1 = 0.997
                r2 = 1.0
                delta_a = 1
            }break;
      }


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

    abcPath.timestamp = Date.now()
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

