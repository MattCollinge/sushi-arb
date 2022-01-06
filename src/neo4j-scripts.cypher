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