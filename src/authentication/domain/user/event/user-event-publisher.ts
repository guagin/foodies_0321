import { DomainEventPublisher } from "domain-event-publisher";
import { UserRegistered } from "event/user-registered";

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
}