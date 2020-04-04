import { OrderRepository } from "../order-repository";
import { OrderEventPublisher } from "../event/order-event-publisher";
import { OrderId } from "../order";

export class PlaceOrderService{
    private orderRepository: OrderRepository
    private orderEventPublisher: OrderEventPublisher

    constructor(depends:{
        orderRepository: OrderRepository,
        orderEventPublisher: OrderEventPublisher
    }){
        this.orderRepository = depends.orderRepository
        this.orderEventPublisher = depends.orderEventPublisher
    }

    async place(orderId: string): Promise<void>{
        const order = await this.orderRepository.ofId(new OrderId(orderId))

        order.place()

        await this.orderRepository.save(order)
        this.orderEventPublisher.orderPlaced(order)
    }
}