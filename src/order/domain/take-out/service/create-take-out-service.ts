import { TakeOut, TakeOutId } from "../take-out";
import { TakeOutRepository } from "../take-out-repository";
import { TakeOutEventPublisher } from "../event/take-out-event-publisher";

export class CreateTakeOutService{
    constructor(private takeOutRepository: TakeOutRepository, private takeOutEventPublisher: TakeOutEventPublisher){}

    async create(input: {
        title: string
        description: string
        createdBy: string
        startedAt: Date
        endAt: Date
    }): Promise<TakeOutId>{
        const id = await this.takeOutRepository.nextId()

        const takeOut = new TakeOut(id, {
            createdBy : input.createdBy,
            title: input.title,
            description: input.description,
            startedAt: input.startedAt,
            endAt: input.endAt,
            enabled: true
        })

        await this.takeOutRepository.save(takeOut)

        this.takeOutEventPublisher.takeOutCreated(takeOut)

        return id
    }
}