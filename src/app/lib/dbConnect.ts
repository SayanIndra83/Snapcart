import mongoose from "mongoose";

// type connectionObject = {
//     isConnected?: number
// }

// const connection:connectionObject = {}

let cache = global.mongoose;
// if cache does not exist then make them null
if(!cache){
    cache = global.mongoose = ({connection: null, promise: null})
}

    
async function dbConnect(): Promise<void>{
    if(!process.env.MONGODB_URI) throw Error("Please give a valid monogo url")

    // wheather it is connected 

    // if(connection.isConnected === 1){
    //     console.log("DB already connected !")
    //     return ;
    // }

    // if connection exist
    if(cache.connection){
        console.log("DB already connected")
        return;
    }

    if(!cache.promise){
        cache.promise = mongoose.connect(process.env.MONGODB_URI).then((conn)=> conn.connection)
    }
    try {
        cache.connection = await cache.promise;
        console.log("DB connected")
        return
    } catch (error) {
        console.log("DB not connected")
        process.exit(1)
    }
}

export default dbConnect;