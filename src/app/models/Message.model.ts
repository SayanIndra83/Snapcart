import mongoose, {Schema, models, Model} from "mongoose";

export interface IMessage extends Document{
    roomId : mongoose.Types.ObjectId,
    _id?: mongoose.Types.ObjectId,
    text: string,
    senderId: mongoose.Types.ObjectId,
    time: string
    createdAt ? : Date
    updatedAt ? : Date
}


const messageSchema = new Schema<IMessage>({
roomId:{
    type: Schema.Types.ObjectId,
    ref:"Order"
},
text:{
    type:String,
},
senderId:{
    type: Schema.Types.ObjectId,
    ref:"User"
},
time:{
    type: String
}

}, {timestamps: true})

const MessageModel = models.Message as Model<IMessage> || mongoose.model("Message", messageSchema)

export default MessageModel