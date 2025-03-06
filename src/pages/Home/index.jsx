import { useEffect, useMemo, useState } from "react"
import { FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline"


const Home = () => {
  const [orders, setOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortString, setSortString] = useState("by_date")
  const filters = ["All", "Pending", "Completed"]

  const fetchOrders = async () => {
    const response = await fetch("/mockOrders.json")
    const data = await response.json()
    setOrders(data)
  }

  useEffect(() => {
    fetchOrders()
  }, [])


  const filteredOrders = useMemo(() => {
    return orders.filter((order) => filterStatus === 'All' || order.status == filterStatus)
  }, [orders, filterStatus])


  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      // Sort by date
      if (sortString === "by_date") {
        return new Date(a.timestamp) - new Date(b.timestamp)
      }
      // Else Sort by price
      return a.totalPrice - b.totalPrice
    })
  }, [filteredOrders, sortString])


  const markAsCompleted = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: "Completed" }
      }
      return order
    })
    setOrders(updatedOrders)
  }


  return (
    <div className="min-h-screen bg-cs-gray-50 py-10 px-3 text-sm">
      <div className="container mx-auto [&_svg]:size-4 [&_svg]:hidden [&_svg]:lg:block">
        <h2 className="text-xl lg:text-3xl font-bold">Order Management</h2>

        <div className="space-y-2 lg:space-y- mt-8">
          <div className=" bg-white rounded-lg px-2 py-3 lg:py-5 lg:px-10">
            <div className="text-sm flex flex-wrap1 items-center gap-5 lg:gap-8 text-gray-700 [&_select]:cursor-pointer lg:[&_select]:bg-cs-gray-50">
              {/* Filter */}
              <div className="flex items-center gap-2 ">
                <FunnelIcon />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="outline outline-transparent hover:outline-blue-400 p-2 rounded"
                >
                  {filters.map((filter) => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}cursor-pointer
                </select>
              </div>

              <div className="hidden lg:block border h-5"></div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowsUpDownIcon />
                <select
                  value={sortString} onChange={(e) => setSortString(e.target.value)}
                  className="outline outline-transparent hover:outline-blue-400 p-2 rounded"
                >
                  <option value="by_date">Sort by Date</option>
                  <option value="by_price">Sort by Price</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-x-auto py-10 lg:px-10">
            <table className="min-w-full">
              <thead>
                <tr className="bg-cs-gray-50">
                  <th className="p-2 whitespace-nowrap">Order ID</th>
                  <th className="p-2 whitespace-nowrap">Customer</th>
                  <th className="p-2 whitespace-nowrap">Items</th>
                  <th className="p-2 whitespace-nowrap">Total Price</th>
                  <th className="p-2 whitespace-nowrap">Status</th>
                  <th className="p-2 whitespace-nowrap">Timestamp</th>
                  <th className="p-2 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map(order => (
                  <tr key={order.id} className="border lg:border-0 lg:text-center">
                    <td className="pt-4 lg:pt-10 pb-2 border px-1 border-gray-200 lg:border-0 whitespace-nowrap">{order.id}</td>
                    <td className="pt-4 lg:pt-10 pb-2 border px-1 border-gray-200 lg:border-0 whitespace-nowrap">{order.customer}</td>
                    <td className="pt-4 lg:pt-10 pb-2 border px-1 border-gray-200 lg:border-0 whitespace-nowrap">{order.items.join(', ')}</td>
                    <td className="pt-4 lg:pt-10 pb-2 border px-1 border-gray-200 lg:border-0 whitespace-nowrap">$ {order.totalPrice}</td>
                    <td className="pt-4 lg:pt-10 pb-2 border px-1 border-gray-200 lg:border-0 whitespace-nowrap">{order.status}</td>
                    <td className="pt-4 lg:pt-10 pb-2 border px-1 border-gray-200 lg:border-0 whitespace-nowrap">{new Date(order.timestamp).toLocaleString()}</td>
                    <td className="pt-4 lg:pt-10 pb-2 border px-1 border-gray-200 lg:border-0 whitespace-nowrap">
                      {order.status === 'Pending' && (
                        <button
                          className="bg-blue-400 cursor-pointer text-white px-4 py-2 rounded"
                          onClick={() => markAsCompleted(order.id)}
                        >
                          Complete Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
