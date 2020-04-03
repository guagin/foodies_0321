import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { OrderId, Order, OrderStatus } from "order/domain/order/order"
import { Product } from "order/domain/order/product"
import { RemoveProduct } from "./remove-product"
import { ProductRemoved } from "event/product-removed"

describe('remove product', ()=>{
    it('should pass', async ()=>{
        const orderRepository = new InMemoryOrderRepository()
        const eventPublisher = new SynchronizedDomainEventPublisher()

        const promiseToRemoveProduct = new Promise<{ 
            id: string
            amount: number
            note?: string
        }[]>(
            (resolve)=>{
                eventPublisher.register<ProductRemoved>("ProductRemoved",(e)=>{
                    resolve(e.payload.products)
                })
        })
        const orderId = await orderRepository.nextId()
        const order = new Order(orderId, {
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

        const removeProduct = new RemoveProduct({
            orderRepository,
            eventPublisher
        })

        await removeProduct.remove([{
                id: "p0",
                amount: 1
            },{
                id: "p1",
                amount: 1
            },
            {
                id: "p2",
                amount: 1
            }
        ]).from(orderId.toValue())

        const updatedOrder = await orderRepository.ofId(orderId)
        expect(updatedOrder.products).toStrictEqual([
            new Product({
                id: "p0",
                amount: 99,
                note: ""
            }),
            new Product({
                id: "p1",
                amount: 99,
                note: ""
            })  
        ])

        const receivedProductFromEvent = await promiseToRemoveProduct
        expect(receivedProductFromEvent).toStrictEqual(
            [
                new Product({
                    id: "p0",
                    amount: 99,
                    note: ""
                }),
                new Product({
                    id: "p1",
                    amount: 99,
                    note: ""
                })
            ]
        )
    })
})
