import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Order, OrderStatus } from "order/domain/order/order"
import { Product } from "order/domain/order/product"
import { PlaceOrder } from "./place-order"

describe('place order',()=>{
    it('should success', async ()=>{
        const orderRepository = new InMemoryOrderRepository()
        const eventPublisher = new SynchronizedDomainEventPublisher()

        const orderId = await orderRepository.nextId()
        const order = new Order(orderId,{
            createdBy: "ricky",
            orderedProducts: [
                new Product({
                    id: "p0",
                    amount: 100,
                    note: ""
                }),
                new Product({
                    id: "p1",
                    amount: 100,
                    note: ""
                }),
                new Product({
                    id: "p2",
                    amount: 1,
                    note: ""
                })
            ],
            status: OrderStatus.pended
        })

        await orderRepository.save(order)

        const placeOrder = new PlaceOrder({
            orderRepository,
            eventPublisher,
        })

        await placeOrder.place(orderId.toValue())

        const placedOrder = await orderRepository.ofId(orderId)

        expect(placedOrder).toBeDefined()
        expect(placedOrder.status).toBe(OrderStatus.placed)
    })
})