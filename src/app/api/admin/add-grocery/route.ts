import { auth } from "@/app/auth";
import uploadOnCloudinary from "@/app/lib/cloudinary";
import dbConnect from "@/app/lib/dbConnect";
import GroceryModel from "@/app/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const session = await auth()
        if(!session){
            return NextResponse.json({
                message: "Unauthorized user",
                success:false
            },{
                status: 400
            })
        }

        if(session.user.role !== "admin"){
            return NextResponse.json({
                message: "You are not allowed to perform this operation",
                success:false
            },{
                status: 400
            })
        }

        const formData = await req.formData()
        const price = formData.get("price") as string
        const name = formData.get("name") as string
        const category= formData.get("category") as string
        const unit = formData.get("unit") as string
        const file = formData.get("image") as Blob |  null

        let imageUrl
        if(file){
            imageUrl = await uploadOnCloudinary(file)
        }

        if(!imageUrl){
            return NextResponse.json(
                {
                    message: "Something went wrong",
                    success: false
                },
                {
                    status: 400
                }
            )
        }

        await dbConnect()

        const grocery = await GroceryModel.create({
            price,
            name, 
            category,
            unit, 
            image: imageUrl
        })

        return NextResponse.json(
                {
                    message: "Grocery added",
                    success: true
                },
                {
                    status: 200
                }
            )

    } catch (error) {
        return NextResponse.json(
                {
                    message: "An unexpected error occurred",
                    success: false
                },
                {
                    status: 500
                }
            )
    }
}