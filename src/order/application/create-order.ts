import { OrderRepository } from "order/domain/order/order-repository";

import { OrderId } from "order/domain/order/order";
import { CreateOrderService } from "order/domain/order/service/create-order.service";
import { DomainEventPublisher } from "domain-event-publisher";
import { OrderEventPublisher } from "order/domain/order/event/order-event-publisher";

export class CreateOrder {

    private orderRepository: OrderRepository
    private orderEventPublisher: OrderEventPublisher

    constructor(
        depends:{
            orderRepository: OrderRepository,
            eventPublisher: DomainEventPublisher
        }
    ){
        this.orderRepository = depends.orderRepository
        this.orderEventPublisher = new OrderEventPublisher(depends.eventPublisher)
    }

    async create(userId: string): Promise<OrderId>{
        const createOrderService = new CreateOrderService({
            orderRepository: this.orderRepository,
            eventPublisher: this.orderEventPublisher
        })

        const orderId = await createOrderService.create({
            userId
        })
        
        return orderId
    }
}