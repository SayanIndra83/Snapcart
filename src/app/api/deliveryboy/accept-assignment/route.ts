import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import AssignmentModel from "@/app/models/delivery-assignment.model";
import OrderModel from "@/app/models/order.model";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const session = await auth()
                if(!session || !session.user){
                    return NextResponse.json({
                        message: "Unauthorized user",
                        success:false
                    },{
                        status: 400
                    })
                }
        
                if(session.user.role !== "deliveryboy"){
                    return NextResponse.json({
                        message: "You are not allowed to perform this operation",
                        success:false
                    },{
                        status: 400
                    })
                }

                const id = session.user.id
                const {assignmentId, action} = await req.json()

                await dbConnect()

                const deliveryBoy = await UserModel.findById(id)
                if(!deliveryBoy){
                    return NextResponse.json({
                        message: "User not found",
                        success:false
                    },{
                        status: 404
                    })
                }

                const assignment = await AssignmentModel.findById(assignmentId)
                if(!assignment || assignment?.status != "brodcasted"){
                    return NextResponse.json({
                        message: "Assignment not found or expired",
                        success:false
                    },{
                        status: 404
                    })
                }

                const isAssigned = await AssignmentModel.findOne({
                    assignTo: deliveryBoy._id,
                    status:{$nin:["brodcasted", "completed"]}
                })

                if(isAssigned){
                    return NextResponse.json({
                        message: "You are already assigned to an order",
                        success:false
                    },{
                        status: 400
                    })
                }

                let status = ""
                if(action === "reject"){
                    const newAssignment = await AssignmentModel.findByIdAndUpdate(assignmentId, {
                        $pull: {brodcastedTo: deliveryBoy._id}
                    }, {new:true})
                    status = "Rejected"
                    if(newAssignment && newAssignment.brodcastedTo.length === 0){
                        const orderId = assignment.order
                        await OrderModel.findByIdAndUpdate(orderId, {
                        status: "pending"
                    })
                    }
                    await assignment.save()
                }
                if(action === 'accept'){
                    assignment.assignTo = deliveryBoy._id
                    assignment.status = "assigned"
                    assignment.brodcastedTo = []
                    assignment.acceptedAt = new Date()

                    status = "Accepted"
                    const orderId = assignment.order
                    const order = await OrderModel.findByIdAndUpdate(orderId, {
                        assignedDeliveryBoy: deliveryBoy._id
                    })

                    if(!order){
                        return NextResponse.json({
                            message: "Order not found",
                            success: false
                        }, {status: 404})
                    }

                    await assignment.save()

                    await AssignmentModel.updateMany({_id: {$ne: assignment._id},
                    brodcastedTo: deliveryBoy._id,
                    status: "brodcasted"
                    }, {
                        $pull:{brodcastedTo: deliveryBoy._id}
                    })
                }

            return NextResponse.json({
                        message: `Order ${status}`,
                        success:true
                    },{
                        status: 200
                    }) 

    } catch (error) {
        return NextResponse.json({
                        message: "An unexpected error occured",
                        success:false
                    },{
                        status: 500
                    })
    }
}