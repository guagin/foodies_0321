import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { OrderEventPublisher } from "../event/order-event-publisher"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Order, OrderStatus, OrderId } from "../order"
import { Product } from "../product"
import { CancelOrderService } from "./cancel-order-service"
import { OrderCanceled } from "event/order-cancel"

describe('cancel order service', ()=>{
    it('should pass', async ()=>{
        const orderRepository = new InMemoryOrderRepository()
        const eventPublisher = new SynchronizedDomainEventPublisher()
        const orderEventPublisher = new OrderEventPublisher(eventPublisher)

        const eventPromise = new Promise<string>((resolve)=>{
            eventPublisher.register<OrderCanceled>('OrderCanceled', (e)=>{
                resolve(e.payload.orderId)
            })
        })

        const orderId = await orderRepository.nextId()
        
        const order = new Order(orderId, {
            createdBy: "ricky",
            orderedProducts: [
                new Product({
                id: "p0",
                amount: 2,
                note: ""
                })
            ],
            status: OrderStatus.placed
        })

        await orderRepository.save(order)

        const cancelOrderService = new CancelOrderService({
            orderRepository,
            orderEventPublisher
        })

        await cancelOrderService.cancel(orderId.toValue())

        const cancelOrder = await orderRepository.ofId(orderId)

        expect(cancelOrder).toBeDefined()
        expect(cancelOrder.status).toBe(OrderStatus.canceled)

        const orderIdFromEvent = await eventPromise
        expect(orderIdFromEvent).toBe(orderId.toValue())
    })
})