import dbConnect from "@/app/lib/dbConnect";
import OrderModel from "@/app/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET!)

export async function POST(req:NextRequest) {
    let event;
    const signature = req.headers.get('stripe-signature');
    const rawBody = await req.text()
    try {
        event = stripe.webhooks.constructEvent(
        rawBody,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

    } catch (error) {
        console.error('signature verification failed', error)
    }

    if(event?.type === "checkout.session.completed") {
        const session = event.data.object
        await dbConnect()
        await OrderModel.findByIdAndUpdate(session?.metadata?.orderId,{
            isPaid: true
        } )
    }

    return NextResponse.json({
        received: true
    }, {status: 200})
}