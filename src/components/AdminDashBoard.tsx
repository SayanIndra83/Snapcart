import dbConnect from "@/app/lib/dbConnect";
import AdminDashboardClient from "./AdminDashboardClient";
import OrderModel from "@/app/models/order.model";
import UserModel from "@/app/models/user.model";
import GroceryModel from "@/app/models/grocery.model";
import { statSync } from "fs";

async function AdminDashBoard() {
  await dbConnect();
  const orders = await OrderModel.find({});
  const users = await UserModel.find({
    role: "user",
  });
  const groceries = await GroceryModel.find({});

  // total orders
  const totalOrders = orders.length;
  // total customer
  const totalCustomers = users.length;
  //total pending delivery
  const pendingDeliveries = orders.filter((o) => o.status === "pending").length;
  // total revenue
  const totRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  // for today's revenue
  const today = new Date();
  const startofToday = new Date(today);
  startofToday.setHours(0, 0, 0, 0);

  // calculation of today revenue
  const todaysOrders = orders.filter(
    (o) => new Date(o?.createdAt!) >= startofToday,
  );
  const todaysEarning = todaysOrders.reduce(
    (acc, o) => acc + (o.totalAmount || 0),
    0,
  );
  // for 7 days
  const sevenDayAgo = new Date();
  sevenDayAgo.setDate(today.getDate() - 6);
  const sevenDayOrders = orders.filter(
    (o) => new Date(o?.createdAt!) >= sevenDayAgo,
  );
  const sevenDayEarning = sevenDayOrders.reduce(
    (acc, o) => acc + (o.totalAmount || 0),
    0,
  );

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders
    },
    {
      title: "Total Customers",
      value: totalCustomers
    },
    {
      title: "Pending Deliveries",
      value: pendingDeliveries
    },
    {
      title: "Total Revenue",
      value: totRevenue
    },
  ]

  const chartData = []

    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)

        const ordersCnt = orders.filter((o) => new Date(o?.createdAt!) >= date && new Date(o?.createdAt!) < nextDay)
        chartData.push({
          day: date.toLocaleDateString("en-US", {weekday: "short"}),
          orders: ordersCnt.length
        })
    }

  return (
    <>
      <AdminDashboardClient
        earning={{
          today: todaysEarning,
          sevenDay: sevenDayEarning,
          total: totRevenue,
        }}
        stats = {stats}
        chartData = {chartData}
      />
    </>
  );
}

export default AdminDashBoard;
