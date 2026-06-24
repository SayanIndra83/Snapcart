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

                const formData = await req.formData()
                const price = formData.get("price") as string
                const name = formData.get("name") as string
                const category= formData.get("category") as string
                const unit = formData.get("unit") as string
                const file = formData.get("image") as Blob | null
                const {groceryId} = await params

                await dbConnect()
                const grocery = await GroceryModel.findById(groceryId)
                if(!grocery){
                    return  NextResponse.json({
                        message: "Grocery not found",
                        success: false
                    }, {status: 404})
                }

                let imageUrl
                if(file){
                    imageUrl = await uploadOnCloudinary(file)

                if(!imageUrl){
                    return NextResponse.json({
                        message: "Failed to upload image",
                        success: false
                    }, {status: 401})
                }

                }

                grocery.name = name
                if(imageUrl) grocery.image = imageUrl
                grocery.unit = unit
                grocery.category = category
                grocery.price = price

                await grocery.save()

                return  NextResponse.json({
                    message: "Grocery details saved",
                    success: true
                }, {status: 200})
    } catch (error) {
        return  NextResponse.json({
                    message: "An unexpected error occured",
                    success: false
                }, {status: 500})
    }
}