import { OrderRepository } from "../order-repository";
import { OrderEventPublisher } from "../event/order-event-publisher";
import { TakeOutRepository } from "order/domain/take-out/take-out-repository";
import { OrderId } from "../order";
import { OrderNotFound } from "../error/order-not-found";
import { TakeOutId } from "order/domain/take-out/take-out";
import { TakeOutNotFound } from "order/error/take-out-not-found";
import { ActivityNotAvailable } from "order/domain/take-out/error/activity-not-available";

export class AppendOrderService{
    private orderId: string
    constructor(
        private orderRepository: OrderRepository,
        private takeOutRepository: TakeOutRepository,
        private orderEventPublisher: OrderEventPublisher
    ){}

    append(orderId: string): AppendOrderService{
      this.orderId = orderId
      return this
    }

    async to(takeOutId: string): Promise<void>{
        const order = await this.orderRepository.ofId(new OrderId(this.orderId))
        if(!order){
            throw new OrderNotFound()
        }
        //
        const takeOut = await this.takeOutRepository.ofId(new TakeOutId(takeOutId))
        if(!takeOut ){
            throw new TakeOutNotFound()
        }

        if(!takeOut.isAvailable(new Date())){
            throw new ActivityNotAvailable()
        }

        order.appendTo(takeOutId)

        this.orderEventPublisher.orderAppended(order)

        await this.orderRepository.save(order)
    }
}