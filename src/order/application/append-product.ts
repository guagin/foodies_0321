import { OrderRepository } from "order/domain/order/order-repository";
import { OrderEventPublisher } from "order/domain/order/event/order-event-publisher";
import { DomainEventPublisher } from "domain-event-publisher";
import { Product } from "order/domain/order/product";
import { OrderId } from "order/domain/order/order";
import { AppendProductService } from "order/domain/order/service/append-product-service";
import { IncreaseProductAmountService } from "order/domain/order/service/increase-product-amount-service";

export class AppendProduct{
    private orderRepository: OrderRepository
    private orderEventPublisher: OrderEventPublisher

    private productsToAppend: Product[]

   constructor(depends: {
       orderRepository: OrderRepository,
       eventPublisher: DomainEventPublisher
   }){
       this.orderRepository = depends.orderRepository
        this.orderEventPublisher = new OrderEventPublisher(depends.eventPublisher)
    }

    append(product: Product[]): AppendProduct{
        this.productsToAppend = product
        return this
    }

    async to(orderId: string): Promise<void>{
       const order = await this.orderRepository.ofId(new OrderId(orderId))
       
        this.productsToAppend.forEach((productToAppend) => {
            if(order.isProductExists(productToAppend.id)){
                // how to deal with note?
                order.increateProductAmount(productToAppend.id, productToAppend.amount)
                return
            }
            order.appendProduct(productToAppend)
        })

        await this.orderRepository.save(order)
        this.orderEventPublisher.productAppended(order)
    }

    
}