import { OrderRepository } from "order/domain/order/order-repository";
import { OrderEventPublisher } from "order/domain/order/event/order-event-publisher";
import { PlaceOrderService } from "order/domain/order/service/place-order-service";
import { DomainEventPublisher } from "domain-event-publisher";

export class PlaceOrder{
    private orderRepository: OrderRepository
    
    private orderEventPublisher: OrderEventPublisher
    constructor(depends: {
        orderRepository: OrderRepository,
        eventPublisher: DomainEventPublisher    
    }){
        this.orderRepository = depends.orderRepository
        this.orderEventPublisher = new OrderEventPublisher(depends.eventPublisher)
    }

    async place(orderId: string): Promise<void>{
        const placeOrderServicve = new PlaceOrderService({
            orderRepository: this.orderRepository,
            orderEventPublisher: this.orderEventPublisher
        })

        await placeOrderServicve.place(orderId)
    }
}