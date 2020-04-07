import { TakeOutRepository } from "order/domain/take-out/take-out-repository";
import { DomainEventPublisher } from "domain-event-publisher";
import { TakeOutId } from "order/domain/take-out/take-out";
import { CreateTakeOutService } from "order/domain/take-out/service/create-take-out-service";
import { TakeOutEventPublisher } from "order/domain/take-out/event/take-out-event-publisher";

export class CreateTakeOut{
    constructor(
        private takeOutRepository: TakeOutRepository,
        private eventPublisher: DomainEventPublisher
    ){}

    async create(input: {
        createdBy: string,
        title: string,
        description: string,
        startedAt: Date,
        endAt: Date,
    }): Promise<TakeOutId>{
        const createTakeOutService = new CreateTakeOutService(
            this.takeOutRepository, 
            new TakeOutEventPublisher(this.eventPublisher)
        )

        const id = await createTakeOutService.create({...input})

        return id
    }
}