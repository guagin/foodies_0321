import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Order, OrderStatus } from "order/domain/order/order"
import { Product } from "order/domain/order/product"
import { AppendProduct } from "./append-product"
import { ProductAppended } from "event/product-appended"

describe('append product', ()=>{
    it('should pass', async ()=>{
        const orderRepository = new InMemoryOrderRepository()
        const eventPublisher = new SynchronizedDomainEventPublisher()

        const promiseToReceiveProductAppended = new Promise<{
            id: string
            amount: number
            note?: string
        }[]>((resolve)=>{
            eventPublisher.register<ProductAppended>("ProductAppended", (e)=>{
                resolve(e.payload.products)
            })
        })


        const orderId = await orderRepository.nextId()
        const order = new Order(orderId, {
            createdBy: "ricky",
            orderedProducts: [ new Product({
                id: "p0",
                amount: 1,
                note: ""
            })],
            status: OrderStatus.pended
        })

        await orderRepository.save(order)

        const appendProductUsecase = new AppendProduct({
            orderRepository,
            eventPublisher,
        })

        await appendProductUsecase.append([new Product({
                id: "p0",
                amount: 100,
                note: ""
            }),
            new Product({
                id: "p1",
                amount: 100,
                note: ""
            }),
        ])
        .to(orderId.toValue())

        const updateOrder = await orderRepository.ofId(orderId)
        expect(updateOrder.products.length).toBe(2)
        expect(updateOrder.products).toStrictEqual([
            new Product({
                id: "p0",
                amount: 101,
                note: ""   
            }),
            new Product({
                id: "p1",
                amount: 100,
                note: ""
            }),
        ])

        const productAppendedReceiveFromPromise = await promiseToReceiveProductAppended
        expect(productAppendedReceiveFromPromise).toStrictEqual([
            new Product({
                id: "p0",
                amount: 101,
                note: ""   
            }),
            new Product({
                id: "p1",
                amount: 100,
                note: ""
            }),
        ])

    })
})