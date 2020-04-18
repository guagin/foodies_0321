import { UserView } from "authentication/query/domain/user/model/user"
import { Schema } from "mongoose"


type UserViewDocument = Document & UserView{
    createdAt: Date
    updatedAt: Date
}

const UserViewSchema = new Schema({
    _id: { type: String, required: true},
    name: { type: String, required: true},
    password: { type: String, required: true},
}, {
    timestamps: true,
    _id: false
})

export class MongoUserQueryRepository {

}