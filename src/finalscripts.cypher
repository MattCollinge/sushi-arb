MATCH p=(c:Token:FTM)-[:PAIR*3..3 {chain:'FTM', exchange:'Spookyswap'}]->(c) //Get all Circular Paths (c->...->c) between nodes with Label 'Token' and Label 'FTM' where the Relationship has the Label 'PAIR' and the properties 'Chain=FTM && Exchange=Spookyswap'
WITH 1.0 AS startVal, 0.997 as r1, 1 as r2, relationships(p) AS r //Set r1 and r2 values for Maker/Taker residual amount less fee
WHERE c.name = 'WFTM' //Make sure that the token is on the FTM Chain
with r, r1, r2,   
REDUCE(path='|', p IN r | path + '->'+ p.pair) as path // Create a text representation of the Circular Path Identified
call{
    with r, r1, r2
    unwind (r) as x
    return collect(x.token0_depth) as token0_depth, collect(x.token1_depth)as token1_depth //Unpack the Token infor from the paths into arrays
    }
call{// Get token depth for a1-b1, b2-c2, c3-a3 pairs
    with token0_depth, token1_depth
    return token0_depth[0] as a1, token1_depth[0] as b1, 
    token0_depth[1] as b2, token1_depth[1] as c2,
    token0_depth[2] as c3, token1_depth[2] as a3
}
call{//Intermediate values = av, cv
    with r1, r2, a1, b1, b2, c2
    return 
    (a1*b2)/(b2+r1*r2*b1) as av,
    (r1*r2*b1*c2)/(b2+r1*r2*b1) as cv
}
call{//Intermediate values = a, a_dash
    with r1,r2,av,cv,c3,a3
    return
    (av*c3)/(c3+r1*r2*cv) as a,
    (r1*r2*cv*a3)/(c3+r1*r2*cv) as a_dash
}
call{//Optimal Trade volume of intital token = da
    with r1,r2,a,a_dash
    return (sqrt(r1*r2*a_dash*a)-a)/r1 as da
}
call{//Utility of a->b->c = Uabc (How much you get extra on top of the original da)
    with r1,r2,a,a_dash, da
    return (((r1*r2*a_dash)/(a+r1*da))-1)*da as uabc
}
call{//Percentage Return on da amoount = pcr
    with uabc, da
    return (((uabc+da)/da)-1)*100 as pcr
}
with r,da,path,r1,r2,a1,b1,b2,c2,c3,a3,av,cv,a,a_dash,uabc,pcr,
REDUCE(s = da, e IN  r | s * e.rate * r1 * r2) AS endVal
WHERE uabc > 0 and da > 0
RETURN path,
a1,b1,b2,c2,c3,a3,av,cv,a,a_dash,da,uabc,pcr, endVal,(endVal-da),  (endVal-da)/da
order by uabc desc