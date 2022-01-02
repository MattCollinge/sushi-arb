const buildPathsOld = async(pairInfo, pairSpec) => {
    // console.log(abID)
    let firstPair = pairInfo.find(e => e.pair_id.toString() === pairSpec.abID)
    let secondPair = pairInfo.find(e => e.pair_id.toString() === pairSpec.bcID)
    let lastPair = pairInfo.find(e => e.pair_id.toString() === pairSpec.caID)
   
    // console.log(firstPair)
    return {a1: firstPair.reserve1, b1: firstPair.reserve0, 
        b2: secondPair.reserve0, c2: secondPair.reserve1,
        c3: lastPair.reserve1, a3: lastPair.reserve0,
         }
}

const buildPaths = async(pairInfo, pathSpecs) => {
    // let path = buildPath({pairID: pairSpec.abID, invert: true}, {pairID: pairSpec.bcID, invert: false}, {pairID: pairSpec.caID, invert: true})
    let paths = []
    // console.log(pathSpecs)

    pathSpecs.forEach((pathSpec)=>{
    
    let firstPair = pairInfo.find(e => e.pair_id.toString() === pathSpec.abID)
    let secondPair = pairInfo.find(e => e.pair_id.toString() === pathSpec.bcID)
    let lastPair = pairInfo.find(e => e.pair_id.toString() === pathSpec.caID)
   
    let path = {
        pathname: pathSpec.name,
        a1: pathSpec.abInvert ? firstPair.reserve1 : firstPair.reserve0, 
        b1: pathSpec.abInvert ? firstPair.reserve0 : firstPair.reserve1, 
        b2: pathSpec.bcInvert ? secondPair.reserve1 : secondPair.reserve0, 
        c2: pathSpec.bcInvert ? secondPair.reserve0 : secondPair.reserve1,
        c3: pathSpec.caInvert ? lastPair.reserve1 : lastPair.reserve0, 
        a3: pathSpec.caInvert ? lastPair.reserve0 : lastPair.reserve1,
        abTxCount: firstPair.txCount,
        bcTxCount: secondPair.txCount,
        caTxCount: lastPair.txCount
         }
    paths.push(path)
             
    });
    // console.log(paths)
    return paths;
}

module.exports.buildPaths = buildPaths;