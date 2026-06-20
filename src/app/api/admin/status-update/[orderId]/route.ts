import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import AssignmentModel from "@/app/models/delivery-assignment.model";
import OrderModel from "@/app/models/order.model";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, {params} : {params: Promise<{orderId: string}>}) {
    try {
        const {status} = await req.json()
        const {orderId} = await params
        

        console.log({orderId, status})
        if(!orderId || !status) {
            return NextResponse.json({
                message:"All credententials required",
                sucess: false
            }, {status: 400})
        }

        const session = await auth()
        if(!session || !session.user || (session.user.role !== "admin")){
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
    // console.log(session.user)
    const email = session.user.email
    await dbConnect()

    const existingUser = await UserModel.findOne({email})
    // console.log(existingUser)
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

        const existingOrder = await OrderModel.findById(orderId).populate("user")
        if(!existingOrder) {
            return NextResponse.json({
                message:"Order not found",
                sucess: false
            }, {status: 404})
        }

        existingOrder.status = status;
        // console.log(existingOrder)
        let deliveryBoysPayload: any = []

        if(status === "out of delivery" && !existingOrder.assignment){
            const {lattitude, longitude} = existingOrder.address
            const nearByDeliveryBoys = await UserModel.find({
                role: "deliveryboy",
                  location: {
                    $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, lattitude] // Longitude, Latitude
                    },
                    $maxDistance: 10000
                    }
                }
            })

            const nearbyIds = nearByDeliveryBoys.map((ndb) => ndb._id)

            const busyIds = await AssignmentModel.find({
                assignTo:{$in:nearbyIds},
                status: "assigned"
            }).distinct("assingTo")

            const busyIdSet = new Set(busyIds.map(b => String(b)))

            const availableDeliveryBoys = nearByDeliveryBoys.filter((boys) => !busyIdSet.has(boys._id.toString()))

            const candidates = availableDeliveryBoys.map(boy => boy._id)

            if(candidates.length === 0){
                console.log(existingOrder)
                return NextResponse.json({
                message:"No delivery boy found nearby",
                sucess: false
            }, {status: 400})
            }

            const deliveryAssignment = await AssignmentModel.create({
            order: existingOrder._id,
            brodcastedTo: candidates,
            status: "brodcasted"
        })

        existingOrder.assignment = deliveryAssignment._id
        
        deliveryBoysPayload = availableDeliveryBoys.map((e) => {
            name: e.username
            phone: e.mobile
            id: e._id
            position: e.location?.coordinates
        })

        await deliveryAssignment.populate("order")
        }
        await existingOrder.save()
        await existingOrder.populate("user")

        console.log(existingOrder)
        return NextResponse.json({
                assigmet: existingOrder.assignment?._id,
                availableBoys: deliveryBoysPayload,
                message:"Delivery Status updated",
                sucess: true
            }, {status: 200})

    } catch (error) {
        return NextResponse.json({
                message:"An unexpected error occured",
                sucess: false
            }, {status: 500})
    }
}