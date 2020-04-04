import { OrderRepository } from "../order-repository";
import { OrderEventPublisher } from "../event/order-event-publisher";
import { OrderId } from "../order";

export class CancelOrderService{

    private orderRepository: OrderRepository
    private orderEventPublisher: OrderEventPublisher

    constructor(depends:{
        orderRepository: OrderRepository,
        orderEventPublisher: OrderEventPublisher
    }){
        this.orderEventPublisher = depends.orderEventPublisher
        this.orderRepository = depends.orderRepository
    }

    async cancel(orderId: string): Promise<void>{
        const order = await this.orderRepository.ofId(new OrderId(orderId))
        order.cancel()

        await this.orderRepository.save(order)

        this.orderEventPublisher.orderCanceled(order)
    }
}