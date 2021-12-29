const arb = require('./arbCalculation.js');

var r1,
r2, 
a1, 
b1, 
b2, 
c2, 
c3, 
a3, 
da

describe('ABCA +ve Arb, ACBA -ve', () =>{
    beforeAll(()=>{
        r1=0.997,
        r2=1, 
        a1=5000, 
        b1=10000, 
        b2=1000, 
        c2=100000, 
        c3=10000, 
        a3=1000, 
        da=10
    });

    test('Expect ABCA to have utility (>0)', async () => {
    const data = await arb.uabca(r1, r2, a1, b1, b2, c2, c3, a3, da)
        console.log(data);
        expect(data).toBeGreaterThan(0);
    });

    test('Expect ACBA to have utility (<0)', async () => {
        const data = await arb.uacba(r1, r2, a1, b1, b2, c2, c3, a3, da)
            console.log(data);
            expect(data).toBeLessThanOrEqual(0);
    });

    test('Expect AB to exchange expected ampunt of B (~20)', async () => {
        const data = await arb.abExchange(r1, r2, a1, b1, da)
            // console.log(data);
            expect(data).toBe(19.900318764384792);
    });

    test('Expect BC to exchange expected ampunt of C (~1000)', async () => {
        const data = await arb.abExchange(r1, r2, b2, c2, da)
            // console.log(data);
            expect(data).toBe(987.1580343970709);
    });

    test('Expect AB-BC to exchange expected ampunt of C (~2000)', async () => {
        const data = await arb.abExchange(r1, r2, a1, b1, da)
            // console.log(data);
            // expect(data).toBe(19.900318764384792);

        const data2 = await arb.abExchange(r1, r2, b2, c2, data)
            // console.log(data);
            expect(data2).toBe(1945.4626008850755);
    });

    test('Expect CA to exchange expected ampunt of A (~1000)', async () => {
        const data = await arb.abExchange(r1, r2, c3, a3, da)
            // console.log(data);
            expect(data).toBe(0.9960069810398409);
    });

    test('Expect AB-BC-CA to have exchange rate (>1)', async () => {
        const data = await arb.abExchange(r1, r2, a1, b1, da)
            // console.log(data);
            // expect(data).toBe(19.900318764384792);

        const data2 = await arb.abExchange(r1, r2, b2, c2, data)
            // console.log(data2);
            // expect(data2).toBe(1945.4626008850755);

        const data3 = await arb.abExchange(r1, r2, c3, a3, data2)
        // console.log(data3);
        // expect(data3).toBe(162.45284219678024);

        const pc_arb = (data3-da)/da;
        console.log(`pc-arg = ${pc_arb*100}%`);
        expect(pc_arb).toBeGreaterThan(1)
    });

    test('Expect AC-CB-BA to have exchange rate (<1)', async () => {
        const data = await arb.abExchange(r1, r2, a3, c3, da)
            // console.log(data);
            // expect(data).toBe(98.71580343970709);

        const data2 = await arb.abExchange(r1, r2, c2, b2, data)
            // console.log(data2);
            // expect(data2).toBe(0.9832288698222555);

        const data3 = await arb.abExchange(r1, r2, b1, a1, data2)
        // console.log(data3);
        // expect(data3).toBe(0.49009154895247775);

        const pc_arb = (data3-da)/da;
        console.log(`pc-arg = ${pc_arb*100}%`);
        expect(pc_arb).toBeLessThan(1)
    });
});

describe('ABCA -ve Arb, ACBA +ve', () =>{
    beforeAll(()=>{
        r1=0.997,
        r2=1, 
        a1=5000, 
        b1=10000, 
        b2=100000, 
        c2=1000, 
        c3=10000, 
        a3=1000, 
        da=10
    });

    test('Expect ABCA to have utility (>0)', async () => {
    const data = await arb.uabca(r1, r2, a1, b1, b2, c2, c3, a3, da)
        console.log(data);
        expect(data).toBeLessThanOrEqual(0);
    });

    test('Expect ACBA to have utility (<0)', async () => {
        const data = await arb.uacba(r1, r2, a1, b1, b2, c2, c3, a3, da)
            console.log(data);
            expect(data).toBeGreaterThanOrEqual(0);
    });

    test('Expect AB to exchange expected ampunt of B (~20)', async () => {
        const data = await arb.abExchange(r1, r2, a1, b1, da)
            // console.log(data);
            expect(data).toBe(19.900318764384792);
    });

    test('Expect BC to exchange expected ampunt of C (~0.1)', async () => {
        const data = await arb.abExchange(r1, r2, b2, c2, da)
            // console.log(data);
            expect(data).toBe(0.0996900609009117);
    });

    test('Expect AB-BC to exchange expected ampunt of C (~0.2)', async () => {
        const data = await arb.abExchange(r1, r2, a1, b1, da)
        
        const data2 = await arb.abExchange(r1, r2, b2, c2, data)
            // console.log(data);
            expect(data2).toBe(0.1983668208781637);
    });

    test('Expect CA to exchange expected ampunt of A (~1000)', async () => {
        const data = await arb.abExchange(r1, r2, c3, a3, da)
            // console.log(data);
            expect(data).toBe(0.9960069810398409);
    });

    test('Expect AB-BC-CA to have exchange rate (>1)', async () => {
        const data = await arb.abExchange(r1, r2, a1, b1, da)
            // console.log(data);
            // expect(data).toBe(19.900318764384792);

        const data2 = await arb.abExchange(r1, r2, b2, c2, data)
            // console.log(data2);
            // expect(data2).toBe(1945.4626008850755);

        const data3 = await arb.abExchange(r1, r2, c3, a3, data2)
        // console.log(data3);
        // expect(data3).toBe(162.45284219678024);

        const pc_arb = (data3-da)/da;
        console.log(`pc-arg = ${pc_arb*100}%`);
        expect(pc_arb).toBeLessThan(1)
    });

    test('Expect AC-CB-BA to have exchange rate (<1)', async () => {
        const data = await arb.abExchange(r1, r2, a3, c3, da)
            // console.log(data);
            // expect(data).toBe(98.71580343970709);

        const data2 = await arb.abExchange(r1, r2, c2, b2, data)
            // console.log(data2);
            // expect(data2).toBe(0.9832288698222555);

        const data3 = await arb.abExchange(r1, r2, b1, a1, data2)
        // console.log(data3);
        // expect(data3).toBe(0.49009154895247775);

        const pc_arb = (data3-da)/da;
        console.log(`pc-arg = ${pc_arb*100}%`);
        expect(pc_arb).toBeGreaterThan(1)
    });
});