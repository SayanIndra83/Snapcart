import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import emitEventHandler from "@/app/lib/emitEventHandler";
import OrderModel from "@/app/models/order.model";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// creating instance of stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)


export async function POST(req: NextRequest){
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

    const {paymentMethod, totalAmount, address, items} = await req.json()

    if(!paymentMethod || !totalAmount || !address || !items) 
        return NextResponse.json({
        message: "All credententials required",
        success: false
    }, {status: 400})

    const newOrder = await OrderModel.create({
        user: existingUser._id,
        items, paymentMethod, totalAmount, address
    })

    const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types:["card", "paypal", "upi"],
        mode:"payment",
        success_url:`${process.env.NEXT_BASE_URL}/user/order-success`,
        cancel_url:`${process.env.NEXT_BASE_URL}/user/payment-failed`,
        line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'SnapcartOrder Payment',
          },
          unit_amount: totalAmount*100,
        },
        quantity: 1,
      },
    ],
    metadata:{
        orderId: newOrder._id.toString()
    }
    })

    await newOrder.populate("user assignedDeliveryBoy")

    await emitEventHandler( "new-order", newOrder)

    return NextResponse.json({
        url: stripeSession.url,
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