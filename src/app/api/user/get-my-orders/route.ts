import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import OrderModel from "@/app/models/order.model";
import UserModel from "@/app/models/user.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    try {
        const session = await auth()
        if(!session || !session.user){
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

    const id = existingUser._id;

    const orders = await OrderModel.find({user: id}).populate("user assignedDeliveryBoy").sort({createdAt: -1})


    return Response.json(
            {
                orders,
                success: true,
                message: "Order fetched"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "An unexpected error occured"
            },
            {
                status: 500
            }
        )
    }
}