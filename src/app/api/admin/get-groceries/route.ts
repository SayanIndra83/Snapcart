import dbConnect from "@/app/lib/dbConnect";
import GroceryModel from "@/app/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect()
        const groceries = await GroceryModel.find({})

        return NextResponse.json({
            groceries,
            message: "Groceries fetched",
            success: true
        }, {status : 200})
    } catch (error) {
        return NextResponse.json({
            message: "An unexpected error occured",
            success: false
        }, {status : 500})
    }
}