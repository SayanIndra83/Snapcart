import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import emitEventHandler from "@/app/lib/emitEventHandler";
import AssignmentModel from "@/app/models/delivery-assignment.model";
import OrderModel from "@/app/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, {params} : {params : Promise<{orderId : string}>}) {
    try {
        const session = await auth()
        if(!session || !session.user) {
            return NextResponse.json({
                message: "Unauthorized access",
                success: false
            }, {status : 403})
        }

        const deliveryBoyId = session.user.id
        const {orderId} = await params
        const {otp} = await req.json()
        if(!orderId || !otp){
            return NextResponse.json({
                message: "All credentials required",
                success: false
            }, {status : 400})
        }

        await dbConnect()

        const order = await OrderModel.findById(orderId)
        if(!order){
            return NextResponse.json({
                message: "Order not found",
                success: false
            }, {status : 404})
        }

        if(order.status === "delivered" || order.isOtpVerified) {
            return  NextResponse.json({
                message: "Order already delivered",
                success: false
            }, {status: 401})
        }

        if(String(order.assignedDeliveryBoy) !== deliveryBoyId) return NextResponse.json({
            message: "You are not assigned to this order",
            success: false
        }, {status: 403})

        if(order.deliveryOtp !== otp) {
            return NextResponse.json({
            message: "Invalid OTP",
            success: false
        }, {status: 401})
        }

       order.status = "delivered"
       order.isOtpVerified = true
       order.deliveredAt = new Date()
       order.isPaid = true
       await order.save()

       const assignment = await AssignmentModel.findByIdAndUpdate(order.assignment, {
        status: "completed",
        assignTo: null
       }, {new : true})

       if(!assignment){
        return NextResponse.json({
            message: "Assignment not found",
            success: false
        }, {status: 404})
       }
       await order.populate("user assignedDeliveryBoy")
       await emitEventHandler("order-delivered", order)
       return NextResponse.json({
            message: "Order delivered",
            success: true
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            message: "An unexpected error occured",
            success: false
        }, {status: 500})
    }
}