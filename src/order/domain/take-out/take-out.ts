import { EntityId } from "entity-id";
import { Entity } from "entity";

export class TakeOutId extends EntityId{}

interface TakeOutProps{
    createdBy: string
    title: string
    description: string
    startedAt: Date
    endAt: Date
    enabled: boolean
}

export class TakeOut extends Entity{
    private props: TakeOutProps
    constructor(
        id: TakeOutId,
        props: TakeOutProps,
    ){
        super(id)
        this.props = props
    }

    get createdBy(): string{
        return this.props.createdBy
    }

    get title(): string{
        return this.props.title
    }

    get description(): string{
        return this.props.description
    }

    get startedAt(): Date{
        return this.props.startedAt
    }

    get endAt(): Date{
        return this.props.endAt
    }

    isAvailable(current: Date): boolean{
        return (
            this.props.enabled && 
            this.props.startedAt.getTime() <= current.getTime() && 
            current.getTime() < this.props.endAt.getTime()        
        )
    }

    disable(){
        this.props = {
            ...this.props,
            enabled: false
        }
    }

    enable(){
        this.props = {
            ...this.props,
            enabled: false
        }
    }
}