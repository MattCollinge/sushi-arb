const uabca = (r1, r2, a1, b1, b2, c2, c3, a3, da)=>{
   
   const inner_numerator = (r1*r2) * (r1**2*r2**2*b1*c2*a3)
//    const inner_numerator = (r1**2*r2**2) //(b1*c2*a3)
   const inner_demoninator =  (b2*c3+r1*r2*b1*c3+r1**2*r2**2*b1*c2)

//    console.log(`numerator: ${inner_numerator}, denominator: ${inner_demoninator}`)

    const u = ((
            (
                (r1*r2) * ((r1**2*r2**2*b1*c2*a3) / 
                        (b2*c3+r1*r2*b1*c3+r1**2*r2**2*b1*c2))
            ) / 
                (
                    ((a1*b2*c3) / 
                    (b2*c3+r1*r2*b1*c3+r1**2*r2**2*b1*c2)) + r1*da
                )
            ) - 1.0 
        ) * da
    return u
}

const uacba = (r1, r2, a1, b1, b2, c2, c3, a3, da)=>{
    const u = ((
            (
                (r1*r2) * ((r1**2*r2**2*c3*b2*a1) / 
                        (c2*b1+r1*r2*c3*b1+r1**2*r2**2*c3*b2))
            ) / 
                (
                    ((a3*c2*b1) / 
                    (c2*b1+r1*r2*c3*b1+r1**2*r2**2*c3*b2)) + r1*da
                )
            ) - 1.0
        ) * da
    return u
}

const abExchange = async(r1, r2, a1, b1, da)=>{
    const exchange = (b1- ((a1*b1)/(a1 +(da * r1))*r2))
    return exchange;
}


module.exports.uabca = uabca;
module.exports.uacba = uacba;
module.exports.abExchange = abExchange;