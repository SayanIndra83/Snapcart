import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import AssignmentModel from "@/app/models/delivery-assignment.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect()
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
        const assignments = await AssignmentModel.find({
            brodcastedTo: id,
            status: "brodcasted"
        }).populate("order").sort({createdAt: -1})

        return NextResponse.json({
            message: "Assignments fetched",
            success: true,
            assignments
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
                        message: "An unexpected error occurred",
                        success:false
                    },{
                        status: 500
                    })
    }
}