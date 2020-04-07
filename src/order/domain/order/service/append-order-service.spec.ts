import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { InMemoryTakeOutRepository } from "order/intrastructure/persistence/in-memory-take-out-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { OrderAppended } from "event/order-appended"
import { CreateTakeOutService } from "order/domain/take-out/service/create-take-out-service"
import { TakeOutEventPublisher } from "order/domain/take-out/event/take-out-event-publisher"
import { CreateOrderService } from "./create-order.service"
import { OrderEventPublisher } from "../event/order-event-publisher"
import { AppendOrderService } from "./append-order-service"


const oneDay = 60*60*24*1000

describe('append order service', ()=>{
    it('should pass', async ()=>{
        const orderRepository = new InMemoryOrderRepository()
        const takeOutRepository = new InMemoryTakeOutRepository()
        const eventPublisher = new SynchronizedDomainEventPublisher()

        const eventPromise = new Promise<string>(resolve => {   
            eventPublisher.register<OrderAppended>("OrderAppended", (e)=>{
                resolve(e.payload.takeOutId)
            })
        })

        // create take out
        const createTakeOut = new CreateTakeOutService(
            takeOutRepository,
            new TakeOutEventPublisher(eventPublisher)
        )
        const takeOutId = await createTakeOut.create({
            createdBy: "ricky",
            title: "lunch",
            description: "",
            startedAt: new Date(),
            endAt: new Date(Date.now() + oneDay)
        })
        // create order 
        const createOrder = new CreateOrderService({
            orderRepository,
            eventPublisher: new OrderEventPublisher(eventPublisher)
        })

        const orderId = await createOrder.create({
            userId: "ricky"
        })

        const appendOrderService = new AppendOrderService(orderRepository, takeOutRepository, new OrderEventPublisher(eventPublisher))

        await appendOrderService.append(orderId.toValue()).to(takeOutId.toValue())

        expect(await eventPromise).toBe(takeOutId.toValue())
    })

    it('should pass', async ()=>{
        const orderRepository = new InMemoryOrderRepository()
        const takeOutRepository = new InMemoryTakeOutRepository()
        const eventPublisher = new SynchronizedDomainEventPublisher()

        const eventPromise = new Promise<string>(resolve => {   
            eventPublisher.register<OrderAppended>("OrderAppended", (e)=>{
                resolve(e.payload.takeOutId)
            })
        })

        // create take out
        const createTakeOut = new CreateTakeOutService(
            takeOutRepository,
            new TakeOutEventPublisher(eventPublisher)
        )
        const takeOutId = await createTakeOut.create({
            createdBy: "ricky",
            title: "lunch",
            description: "",
            startedAt: new Date(),
            endAt: new Date(Date.now())
        })
        // create order 
        const createOrder = new CreateOrderService({
            orderRepository,
            eventPublisher: new OrderEventPublisher(eventPublisher)
        })

        const orderId = await createOrder.create({
            userId: "ricky"
        })

        const appendOrderService = new AppendOrderService(orderRepository, takeOutRepository, new OrderEventPublisher(eventPublisher))

        let error

        try{

            await appendOrderService.append(orderId.toValue()).to(takeOutId.toValue())
            
        }catch(e){
            error = e
        }

        expect(error).toBeDefined()
    })
})