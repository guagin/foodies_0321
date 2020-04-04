import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Order, OrderStatus } from "order/domain/order/order"
import { Product } from "order/domain/order/product"
import { OrderEventPublisher } from "../event/order-event-publisher"
import { PlaceOrderService } from "./place-order-service"

describe('place order service',()=>{
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

        const placeOrder = new PlaceOrderService({
            orderRepository,
            orderEventPublisher: new OrderEventPublisher(eventPublisher),
        })

        await placeOrder.place(orderId.toValue())

        const placedOrder = await orderRepository.ofId(orderId)

        expect(placedOrder).toBeDefined()
        expect(placedOrder.status).toBe(OrderStatus.placed)
    })
})