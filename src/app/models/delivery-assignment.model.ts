import mongoose, { Model } from "mongoose"

export interface IAssign extends Document {
_id?: mongoose.Types.ObjectId,
order: mongoose.Types.ObjectId,
user: mongoose.Types.ObjectId,
brodcastedTo : mongoose.Types.ObjectId[],
assignTo: mongoose.Types.ObjectId | null,
status: "brodcasted" | "assigned" | "completed",
acceptedAt: Date,
createdAt?: Date,
updatedAt ?: Date,
}

const assignmentSchema = new mongoose.Schema<IAssign>({
order:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
},
brodcastedTo:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}],
assignTo:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},
status:{
    type: String,
    enum: ["brodcasted", "assigned" ,"completed"],
    default: "brodcasted"
},
acceptedAt:{
    type: Date,
    default: Date.now()
},
}, {timestamps: true})

const AssignmentModel = mongoose.models.Assign as Model<IAssign> || mongoose.model<IAssign>("Assign", assignmentSchema)

export default AssignmentModel