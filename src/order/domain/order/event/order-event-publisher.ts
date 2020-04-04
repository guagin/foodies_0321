
import { Order } from "../order";
import { DomainEventPublisher } from "domain-event-publisher";
import { OrderCreated } from "event/order-created";
import { ProductAppended } from "event/product-appended";
import { ProductRemoved } from "event/product-removed";
import { OrderPlaced } from "event/order-placed";

export class OrderEventPublisher{
    
    private applicationVeriosn = process.env.applicationVeriosn || "0.0.0.0"
    constructor(private eventPublisher: DomainEventPublisher){
    }

    orderCreated(order: Order): void{
        const event = new OrderCreated({
            userId: order.createdBy,
            orderId: order.id.toValue(),
            products: order.products
        }, this.applicationVeriosn)
        this.eventPublisher.publish(event)
    }

    productAppended(order: Order): void{
        const event = new ProductAppended({
            userId: order.createdBy,
            orderId: order.id.toValue(),
            products: order.products
        },
        this.applicationVeriosn)
        this.eventPublisher.publish(event)
    }

    productRemoved(order: Order): void{
        const event = new ProductRemoved({
            userId: order.createdBy,
            orderId: order.id.toValue(),
            products: order.products
        },this.applicationVeriosn)
        this.eventPublisher.publish(event)
    }

    orderPlaced(order: Order): void{
        const event = new OrderPlaced({
            userId: order.createdBy,
            orderId: order.id.toValue(),
            products: order.products
        },
        this.applicationVeriosn)
        this.eventPublisher.publish(event)
    }
}