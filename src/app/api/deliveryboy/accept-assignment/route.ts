import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import emitEventHandler from "@/app/lib/emitEventHandler";
import { sendMail } from "@/app/lib/mailer";
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
                    await assignment.save()
                    status = "Rejected"
                    const orderId = assignment.order
                    const assignedOrder = await OrderModel.findById(orderId);
                    if(assignedOrder && newAssignment && newAssignment.brodcastedTo.length === 0){
                    assignedOrder.status = "pending"
                    assignedOrder.assignment = null
                    await assignedOrder.save()
                    await AssignmentModel.findByIdAndDelete(assignmentId)
                    }

                    await emitEventHandler("order-reject", {status : assignedOrder?.status.toString(), orderId})
                    // await emitEventHandler("order-reject", assignedOrder)
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
                    }, {new: true})

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

                    // await assignment.populate("order")
                    // await emitEventHandler("order-accept", assignment)

                    
                    await order.populate("user assignedDeliveryBoy")
                    await emitEventHandler("accept-order", order)

                    const user = await UserModel.findById(order.user)

                    if(user) {
                    //send user a email that delivery boy assigned

                   const trackingUrl = `${process.env.NEXT_BASE_URL}/user/track-order/${order._id}`;
                    
                    const subject = "🛵 Your order is on the move!";
                    
                    const message = `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 24px;">
                            <h2 style="color: #16a34a; margin: 0; font-size: 24px; font-weight: bold;">Great news!</h2>
                            <p style="color: #4b5563; font-size: 16px; margin-top: 8px;">A delivery partner has been assigned to your order.</p>
                        </div>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.5;">Hi <strong>${user.username}</strong>,</p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                            Your order <strong>#${order._id.toString().slice(-6)}</strong> is currently being prepared for delivery. Here are your delivery partner's details in case you need to contact them:
                        </p>
                        
                        <div style="background-color: #f3f4f6; border-left: 4px solid #16a34a; border-radius: 8px; padding: 20px; margin: 24px 0;">
                            <p style="margin: 0 0 8px 0; color: #111827; font-size: 16px;">
                                <strong>Partner Name:</strong> <span style="text-transform: capitalize;">${deliveryBoy.username}</span>
                            </p>
                            <p style="margin: 0; color: #111827; font-size: 16px;">
                                <strong>Contact No:</strong> +91 ${deliveryBoy.mobile}
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${trackingUrl}" style="background-color: #16a34a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(22, 163, 74, 0.2);">
                                Track Your Order Live
                            </a>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
                        
                        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                            If you have any questions, feel free to contact our support team.
                            <br><br>
                            &copy; ${new Date().getFullYear()} Snapcart. All rights reserved.
                        </p>
                    </div>
                    `;
                    await sendMail(user.email, subject, message)}
                    
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