import { auth } from "@/app/auth";
import uploadOnCloudinary from "@/app/lib/cloudinary";
import dbConnect from "@/app/lib/dbConnect";
import GroceryModel from "@/app/models/grocery.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, {params}: {params : Promise<{groceryId : mongoose.Types.ObjectId}>}) {
    try {
         const session = await auth()
                if(!session){
                    return NextResponse.json({
                        message: "Unauthorized user",
                        success:false
                    },{
                        status: 403
                    })
                }
        
                if(session.user.role !== "admin"){
                    return NextResponse.json({
                        message: "You are not allowed to perform this operation",
                        success:false
                    },{
                        status: 403
                    })
                }

                const {groceryId} = await params
                if(!groceryId) {
                    return NextResponse.json({
                        message:"Grocery Id is required",
                        success: false
                    }, {status : 400})
                }
                await dbConnect()
               await GroceryModel.findByIdAndDelete(groceryId)

                return  NextResponse.json({
                    message: "Grocery deleted",
                    success: true
                }, {status: 200})
    } catch (error) {
        return  NextResponse.json({
                    message: "An unexpected error occured",
                    success: false
                }, {status: 500})
    }
}