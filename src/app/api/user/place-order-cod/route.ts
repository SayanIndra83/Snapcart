import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import OrderModel from "@/app/models/order.model";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const session = await auth()
        if(!session || !session.user || session.user.role !== "user"){
        return Response.json(
            {
                success: false,
                message: "Unauthorized user"
            },
            {
                status: 401
            }
        )
    }

    const email = session.user.email
    await dbConnect()

    const existingUser = await UserModel.findOne({email})
    if(!existingUser){
        return Response.json(
            {
                success: false,
                message: "User not found"
            },
            {
                status: 404
            }
        )
    }

    const {paymentMethod, totalAmount, address, items} = await req.json()

    if(!paymentMethod || !totalAmount || !address || !items.length) 
        return NextResponse.json({
        message: "All credententials required",
        success: false
    }, {status: 400})

    if(paymentMethod !== "cod") {
        return NextResponse.json({
        message: "This can only be Cash on Delivery",
        success: false
    }, {status: 400})
    }

    const newOrder = await OrderModel.create({
        user: existingUser._id,
        items, paymentMethod, totalAmount, address
    })

    return NextResponse.json({
        newOrder,
        message: "Order placed",
        success: true
    }, {status: 200})

    } catch (error) {
       return NextResponse.json({
        message: "An unexpected error occured",
        success: false
       },
    {
        status: 500
    }) 
    }
}