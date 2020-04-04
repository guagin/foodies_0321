import { EntityId } from "entity-id";
import { Entity } from "entity";
import { MealIsNotPreparing } from "./error/meal-is-not-preparing";
import { MealIsNotLaunched } from "./error/meal-is-not-launched";
import { MealIsNotShelved } from "./error/meal-is-not-shelved";


export class MealId extends EntityId{}

export enum MealStatus{
    preparing,
    launched,
    shelved
}

interface MealProps{
    name: string
    price: number
    describe: string
    pictures: string[]
    status: MealStatus
}

export class Meal extends Entity{
    private props: MealProps
    constructor(id: MealId, props: MealProps){
        super(id)
        this.props = props 
    }

    launch(): void{
        if(this.props.status === MealStatus.launched){
            return
        }
        if(this.props.status !== MealStatus.preparing){
            throw new MealIsNotPreparing()
        }
        this.props.status = MealStatus.launched
    }

    shelve(): void{
        if(this.props.status === MealStatus.shelved){
            return
        }
        if(this.props.status !== MealStatus.launched){
            throw new MealIsNotLaunched()
        }
        this.props.status = MealStatus.shelved
    }

    prepare(): void{
        if(this.props.status === MealStatus.preparing){
            return
        }
        if(this.props.status !== MealStatus.shelved){
            throw new MealIsNotShelved()
        }
        this.props.status = MealStatus.preparing
    }
}