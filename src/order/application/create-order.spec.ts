import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"

import { OrderStatus } from "order/domain/order/order"
import { CreateOrder } from "./create-order"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { OrderCreated } from "event/order-created"

describe('create order', ()=>{
    it('should pass', async ()=>{
        const eventPublisher = new SynchronizedDomainEventPublisher()
        const promiseToFetchOderIdByEvent = new Promise<string>(
            (resolve)=>{
                eventPublisher.register<OrderCreated>("OrderCreated", (e)=>{
                    resolve(e.payload.orderId)
                })
            }
        )
        const orderRepository = new InMemoryOrderRepository()
        const createOrder = new CreateOrder({
            orderRepository,
            eventPublisher
        })

        const orderId = await createOrder.create("ricky")

        const order = await orderRepository.ofId(orderId)

        expect(order).toBeDefined()

        const orders = await orderRepository.ofUserId('ricky')

        expect(orders).toBeDefined()
        expect(orders.length).toBeGreaterThan(0)

        // expect to receive event.
        const orderIdReceiveFromEvent = await promiseToFetchOderIdByEvent
        expect(orderIdReceiveFromEvent).toBe(order.id.toValue())
    })
})