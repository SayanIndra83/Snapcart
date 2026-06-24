import { auth } from "@/app/auth"
import DeliveryBoyDashBoard from "./DeliveryBoyDashBoard"
import dbConnect from "@/app/lib/dbConnect"
import OrderModel from "@/app/models/order.model"



async function DeliveryBoy() {
  const session = await auth()
  const DeliveryBoyId = session?.user.id
  await dbConnect()
  const Deliveredorders = await OrderModel.find({
    assignedDeliveryBoy : DeliveryBoyId,
    isOtpVerified: true
  })

  // const pendingOrders = await OrderModel.find

  const today = new Date()
  const todaysOrders = Deliveredorders.filter((o) => new Date(o.deliveredAt!).getDate() === today.getDate()).length
  const todaysEarning = 40*todaysOrders
  // const sevenDay = new Date(today).setDate(today.getDate() - 6)

  return (
    <>
      <DeliveryBoyDashBoard earning={todaysEarning}/>
    </>
  )
}

export default DeliveryBoy
