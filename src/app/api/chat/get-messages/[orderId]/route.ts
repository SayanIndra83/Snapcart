import dbConnect from "@/app/lib/dbConnect";
import MessageModel from "@/app/models/Message.model";
import OrderModel from "@/app/models/order.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function  GET(req:NextRequest, {params} : {params: Promise<{orderId: mongoose.Types.ObjectId}>}) {
    try {
        const {orderId} = await params
        if(!orderId) {
            return NextResponse.json(
                {
                    message: "Provide order id",
                    success: false
                }, {
                    status: 400
                }
            )
        }

        await dbConnect()
        const room = await OrderModel.findById(orderId)

        // console.log(room)
        if(!room){
            return NextResponse.json({
                message: "Room not found",
                success: false
            }, {status: 404})
        }

        const messages = await MessageModel.find({
            roomId: room._id
        })

        return NextResponse.json({
                        messages,
                        message: "Messages fetched",
                        success: true
                    }, {status: 200})

    } catch (error) {
        return NextResponse.json({
                message: "An unexpected error occured",
                success: false
            }, {status: 500})
    }
}