import { TakeOut, TakeOutId } from "./take-out"

const Day = 1000 * 60 * 60 * 24

describe('create take out', ()=>{
    it('should pass', ()=>{
        const takeOut = new TakeOut(
            new TakeOutId('t0'),
            {
            createdBy: 'ricky',
            startedAt: new Date(),
            endAt: new Date(Date.now() + Day),
            orders: [],
            enabled: true
        })
    })
})


describe('isAvailable', ()=>{
    it('return true', ()=>{
        const takeOut = new TakeOut(
            new TakeOutId('t0'),
            {
            createdBy: 'ricky',
            startedAt: new Date(),
            endAt: new Date(Date.now() + Day),
            orders: [],
            enabled: true
        })

        expect(takeOut.isAvailable(new Date())).toBe(true)
    })

    it('return false', ()=>{
        const takeOut = new TakeOut(
            new TakeOutId('t0'),
            {
            createdBy: 'ricky',
            startedAt: new Date(),
            endAt: new Date(),
            orders: [],
            enabled: true
        })

        expect(takeOut.isAvailable(new Date())).toBe(false)
    })
})

describe('removeOrder', ()=>{
    it('should pass', ()=>{
        const takeOut = new TakeOut(
            new TakeOutId('t0'),
            {
            createdBy: 'ricky',
            startedAt: new Date(),
            endAt: new Date(Date.now() + Day),
            orders: [],
            enabled: true
        })

        takeOut.removeOrder("123","o1")
        expect(takeOut.orders.length).toBe(0)

        const takeOut2 = new TakeOut(
            new TakeOutId('t0'),
            {
            createdBy: 'ricky',
            startedAt: new Date(),
            endAt: new Date(Date.now() + Day),
            orders: ['o1'],
            enabled: true
        })

        takeOut2.removeOrder("123","o1")
        expect(takeOut2.orders.length).toBe(0)
    })

    it("should fail for not avaiable", ()=>{
        let error
        try{
            const takeOut = new TakeOut(
                new TakeOutId('t0'),
                {
                createdBy: 'ricky',
                startedAt: new Date(),
                endAt: new Date(),
                orders: [],
                enabled: true
            })
            
            takeOut.removeOrder("1234","o1")
        }catch(e){
            error = e
        }

        expect(error).toBeDefined()
    })
})

describe('appendOrder', ()=>{
    it('should pass', ()=>{

        const takeOut = new TakeOut(
            new TakeOutId('t0'),
            {
            createdBy: 'ricky',
            startedAt: new Date(),
            endAt: new Date(Date.now() + Day ),
            orders: [],
            enabled: true
        })
        
        takeOut.appendOrder("1234","o1")
        expect(takeOut.orders.length).toBe(1)

        const takeOut2 = new TakeOut(
            new TakeOutId('t0'),
            {
            createdBy: 'ricky',
            startedAt: new Date(),
            endAt: new Date(Date.now()),
            orders: [],
            enabled: true
        })

        takeOut2.appendOrder("ricky","o1")
        expect(takeOut2.orders.length).toBe(1)
    })

    it('should fail for not available', ()=>{
        let error 
        try{
            const takeOut = new TakeOut(
                new TakeOutId('t0'),
                {
                createdBy: 'ricky',
                startedAt: new Date(),
                endAt: new Date(),
                orders: [],
                enabled: true
            })
            
            takeOut.appendOrder("1234","o1")
        }catch(e){
            error = e
        }

        expect(error).toBeDefined()
    })
})