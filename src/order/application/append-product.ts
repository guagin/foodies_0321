import { OrderRepository } from "order/domain/order/order-repository";
import { OrderEventPublisher } from "order/domain/order/event/order-event-publisher";
import { DomainEventPublisher } from "domain-event-publisher";
import { OrderId } from "order/domain/order/order";
import { Product } from "order/domain/order/product";


export class AppendProduct{
    private orderRepository: OrderRepository
    private orderEventPublisher: OrderEventPublisher

    private productsToAppend: {id: string, amount: number}[]

   constructor(depends: {
       orderRepository: OrderRepository,
       eventPublisher: DomainEventPublisher
   }){
       this.orderRepository = depends.orderRepository
        this.orderEventPublisher = new OrderEventPublisher(depends.eventPublisher)
    }

    append(product: {id: string, amount: number}[]): AppendProduct{
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
            order.appendProduct(
                new Product({
                    id: productToAppend.id,
                    amount: productToAppend.amount,
                    note: ""
                })
            )
        })

        await this.orderRepository.save(order)
        this.orderEventPublisher.productAppended(order)
    }
}