import axios from "axios"

async function emitEventHandler(event: string, data: any, socketId?: string) {
    try {
       const response = await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`, {socketId, event, data})
       console.log(response)
    } catch (error) {
        console.log(error)
    }
}

export default emitEventHandler
