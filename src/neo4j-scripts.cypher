CREATE (USDC:Token {name:'USDC', id:'0x04068da6c83afcfa0e13ba15a6696662335d5b75'}), (WFTM:Token {name:'WFTM', id:'0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'}),
(DAI:Token{name:'DAI', id:'0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'})

CREATE (WFTM)-[:PAIR {rate:5, pair_id:'0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c', reserve0:44245740.32, reserve1:20372024.85}]->(USDC), (DAI)-[:PAIR {rate:2, pair_id:'0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c', reserve1:44245740.32, reserve0:20372024.85}]->(WFTM), (USDC)-[:PAIR {rate:1, pair_id:'0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc751c', reserve1:44245740.32, reserve0:20372024.85}]->(DAI)

MATCH p=(c:Token)-[:PAIR*..5]->(c)
WITH 1.0 AS startVal, 0.997 as r1, 1 as r2, relationships(p) AS r
WHERE c.name = 'WFTM'
WITH REDUCE(s = startVal, e IN  r | s * e.rate * r1 * r2) AS endVal, startVal
WHERE endVal > startVal
RETURN endVal - startVal AS Profit



MATCH x=(c:Token)-[:PAIR*..4]->(c)
WITH 1.0 AS startVal, 0.997 as r1, 1 as r2, relationships(x) AS r, x
WHERE c.name = "WFTM"
WITH x, REDUCE(s = startVal, e IN r | s * e.rate * r1 * r2) AS endVal, startVal
WHERE endVal > startVal
RETURN  [n IN NODES(x) WHERE n:Token | n.name ] AS Path, endVal - startVal AS Profit
ORDER BY Profit DESC
LIMIT 5

MATCH (n)-[r]-(m)
WITH n, r
DELETE n, r


MATCH p=(c:Token:FTM)-[:PAIR*..3]->(c)
WITH 1.0 AS startVal, 0.997 as r1, 1 as r2, relationships(p) AS r
WHERE c.name = 'WFTM'
with r, r1, r2,   
REDUCE(path='|', p IN r | path + '->'+ p.pair) as path,
REDUCE(s = startVal, e IN  r | s * e.rate * r1 * r2) AS endVal, startVal
call{
    with r, r1, r2
    unwind (r) as x
    return collect(x.token0_depth) as token0_depth, collect(x.token1_depth)as token1_depth
    }
call{
    with token0_depth, token1_depth
    return token0_depth[0] as a1, token1_depth[0] as b1, 
    token0_depth[1] as b2, token1_depth[1] as c2,
    token0_depth[2] as c3, token1_depth[2] as a3
}
call{
    with r1, r2, a1, b1, b2, c2
    return 
    (a1*b2)/(b2+r1*r2*b1) as av,
    (r1*r2*b1*c2)/(b2+r1*r2*b1) as cv
}
call{
    with r1,r2,av,cv,c3,a3
    return
    (av*c3)/(c3+r1*r2*cv) as a,
    (r1*r2*cv*a3)/(c3+r1*r2*cv) as a_dash
}
call{
    with r1,r2,a,a_dash
    return (sqrt(r1*r2*a_dash*a)-a)/r1 as da
}
call{
    with r1,r2,a,a_dash, da
    return (((r1*r2*a_dash)/(a*r1*da))-1)*da as uabc
}
call{
    with uabc, da
    return (((uabc+da)/da)-1)*100 as pcr
}
with da,path,r1,r2,a1,b1,b2,c2,c3,a3,av,cv,a,a_dash,uabc,pcr
WHERE uabc > 0 and da > 1
RETURN path,
a1,b1,b2,c2,c3,a3,av,cv,a,a_dash,da,uabc,pcr
order by pcr desc


MATCH p=(c:Token:FTM)-[:PAIR*..3]->(c)
WITH 1.0 AS startVal, 0.997 as r1, 1 as r2, relationships(p) AS r
WHERE c.name = 'WFTM'
with r, r1, r2,   
REDUCE(path='|', p IN r | path + '->'+ p.pair) as path //,
// REDUCE(s = startVal, e IN  r | s * e.rate * r1 * r2) AS endVal, startVal
call{
    with r, r1, r2
    unwind (r) as x
    return collect(x.token0_depth) as token0_depth, collect(x.token1_depth)as token1_depth
    }
call{
    with token0_depth, token1_depth
    return token0_depth[0] as a1, token1_depth[0] as b1, 
    token0_depth[1] as b2, token1_depth[1] as c2,
    token0_depth[2] as c3, token1_depth[2] as a3
}
call{
    with r1, r2, a1, b1, b2, c2
    return 
    (a1*b2)/(b2+r1*r2*b1) as av,
    (r1*r2*b1*c2)/(b2+r1*r2*b1) as cv
}
call{
    with r1,r2,av,cv,c3,a3
    return
    (av*c3)/(c3+r1*r2*cv) as a,
    (r1*r2*cv*a3)/(c3+r1*r2*cv) as a_dash
}
call{
    with r1,r2,a,a_dash
    return (sqrt(r1*r2*a_dash*a)-a)/r1 as da
}
call{
    with r1,r2,a,a_dash, da
    return (((r1*r2*a_dash)/(a*r1*da))-1)*da as uabc
}
call{
    with uabc, da
    return (((uabc+da)/da)-1)*100 as pcr
}
with da,path,r1,r2,a1,b1,b2,c2,c3,a3,av,cv,a,a_dash,uabc,pcr
WHERE uabc > 0 and da > 1
RETURN path,
a1,b1,b2,c2,c3,a3,av,cv,a,a_dash,da,uabc,pcr
order by pcr desc





Scratch>>>>>>>>

MATCH p=(c:Token:FTM)-[:PAIR*3..3 {chain:'FTM', exchange:'Spookyswap'}]->(c)
WITH 1.0 AS startVal, 0.997 as r1, 1 as r2, relationships(p) AS r
// WHERE c.name = 'WFTM'
with r, r1, r2,   
REDUCE(path='|', p IN r | path + '->'+ p.pair) as path 
call{
    with r, r1, r2
    unwind (r) as x
    return collect(x.token0_depth) as token0_depth, collect(x.token1_depth)as token1_depth
    }
call{
    with token0_depth, token1_depth
    return token0_depth[0] as a1, token1_depth[0] as b1, 
    token0_depth[1] as b2, token1_depth[1] as c2,
    token0_depth[2] as c3, token1_depth[2] as a3
}
call{
    with r1, r2, a1, b1, b2, c2
    return 
    (a1*b2)/(b2+r1*r2*b1) as av,
    (r1*r2*b1*c2)/(b2+r1*r2*b1) as cv
}
call{
    with r1,r2,av,cv,c3,a3
    return
    (av*c3)/(c3+r1*r2*cv) as a,
    (r1*r2*cv*a3)/(c3+r1*r2*cv) as a_dash
}
call{
    with r1,r2,a,a_dash
    return (sqrt(r1*r2*a_dash*a)-a)/r1 as da
}
call{
    with r1,r2,a,a_dash, da
    return (((r1*r2*a_dash)/(a+r1*da))-1)*da as uabc
}
call{
    with uabc, da
    return (((uabc+da)/da)-1)*100 as pcr
}
with r,da,path,r1,r2,a1,b1,b2,c2,c3,a3,av,cv,a,a_dash,uabc,pcr,
REDUCE(s = da, e IN  r | s * e.rate * r1 * r2) AS endVal
WHERE uabc > 0 and da > 0
RETURN path,
a1,b1,b2,c2,c3,a3,av,cv,a,a_dash,da,uabc,pcr, endVal,(endVal-da),  (endVal-da)/da
order by uabc desc