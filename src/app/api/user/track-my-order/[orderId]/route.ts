import dbConnect from "@/app/lib/dbConnect"
import OrderModel from "@/app/models/order.model"
import UserModel from "@/app/models/user.model"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, {params} : {params:Promise<{orderId : string}>}){
    try {


        const {orderId} = await params

        console.log(orderId)

        await dbConnect()
        const order = await OrderModel.findById(orderId).populate({
            path: "assignedDeliveryBoy",
            model: UserModel
        })

        if(!order){
            return NextResponse.json(
                {
                    message: "Order not found",
                    success: false
                }, {
                    status: 404
                }
            )
        }

        return NextResponse.json(
                {
                    order,
                    message: "Order found",
                    success: true
                }, {
                    status: 200
                }
            )
    } catch (error) {
        return NextResponse.json(
                {
                    message: "An unexpected error occured",
                    success: false
                }, {
                    status: 500
                }
            )
    }
}