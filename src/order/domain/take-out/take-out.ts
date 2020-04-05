import { EntityId } from "entity-id";
import { Entity } from "entity";
import { ActivityNotAvailable } from "./error/user-not-authorized";

export class TakeOutId extends EntityId{}

interface TakeOutProps{
    createdBy: string
    startedAt: Date
    endAt: Date
    orders: string[]
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

    get orders(): string[]{
        return this.props.orders
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

    removeOrder(userId: string, orderId: string){

        if(!this.isAuthorized(userId)){
            throw new ActivityNotAvailable()
        }
        
        const foundIndex = this.props.orders.findIndex(o => o === orderId)
        if(foundIndex < 0){
            return
        }
      
        this.orders.splice(foundIndex, 1)
    }

    private isAuthorized(userId: string): boolean{
        return this.createdBy === userId || this.isAvailable(new Date())
    }

    appendOrder(userId: string, orderId: string){
        if(!this.isAuthorized(userId)){
            throw new ActivityNotAvailable()
        }

        const foundIndex = this.props.orders.findIndex( o=> o === orderId)
        if(foundIndex > -1){
            return 
        }

        this.orders.push(orderId)
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