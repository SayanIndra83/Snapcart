import {Connection} from "mongoose";

declare global{
    var mongoose:{
        connection: Connection | null
        promise: promise<Connection> | null
    }
}

export {}