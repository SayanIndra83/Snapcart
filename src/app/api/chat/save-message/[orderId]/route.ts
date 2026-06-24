import dbConnect from "@/app/lib/dbConnect";
import MessageModel from "@/app/models/Message.model";
import OrderModel from "@/app/models/order.model";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest, {params} : {params :Promise<{orderId : string}>}) {
    try {

        const {orderId} = await params
        const {text, time, senderId} = await req.json()

        // console.log({orderId, text, time, senderId})
        await dbConnect()
        const sender = await UserModel.findById(senderId)
        // console.log(sender)
        if(!sender) return NextResponse.json({
                message: "user not found",
                success: false
            }, {status: 404})

        
        

        if(!orderId || !text || !time || !senderId){ 
            // console.log("All credentials required")
            return NextResponse.json({
                message: "All credentials required",
                success: false
            }, {status: 400})}

        const room = await OrderModel.findById(orderId)

        if(!room){
            // console.log("Chat room does not exist")
            return NextResponse.json({
                message: "Chat room does not exist",
                success: false
            }, {status: 404})
        }

        const newMessage = await MessageModel.create({
            roomId : room._id,
            senderId,
            text,
            time
        })

        // console.log(newMessage)
        return NextResponse.json({
                newMessage,
                message: "Message created",
                success: true
            }, {status: 200})

    
    } catch (error) {
        return NextResponse.json({
                message: "An unexpected error occured",
                success: false
            }, {status: 500})
    }
}