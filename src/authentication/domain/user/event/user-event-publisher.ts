import { DomainEventPublisher } from "domain-event-publisher";
import { UserRegistered } from "event/user-registered";
import { UserLogined } from "event/user-logined";

export class UserEventPublisher{
    private applicationVeriosn = process.env.applicationVeriosn || "0.0.0.0"
    constructor(private eventPublisher: DomainEventPublisher){
    }

    userRegistered(
        input: {  
            userId: string
            name: string
            email: string
        }
    ){
        const event = new UserRegistered({...input},this.applicationVeriosn)
        this.eventPublisher.publish(event)
    }

    userLogined(
        input:{
            id: string,
            name: string
        }
    ){
        const event = new UserLogined({...input},this.applicationVeriosn)
        this.eventPublisher.publish(event)
    }
}