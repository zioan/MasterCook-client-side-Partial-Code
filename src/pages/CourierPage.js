import axios from "axios";
import { useContext, useEffect, useState } from "react";
import server from "../util/server";
import "./CourierPage.scss";
import toDecimal from "../util/toDecimal";
import CompletedSingleOrder from "../components/internal/CompletedSingleOrder";
import UserContext from "../util/UserContext";
import { useHistory } from "react-router-dom";
import UserUpdate from "../components/UI/UserUpdate";

function OrdersSection() {
  const [outForDeliveryOrders, setOutForDeliveryOrders] = useState([]);
  const [deliveredOrders, setdeliveredOrders] = useState([]);

  const [ordersDelivered, setOrdersDelivered] = useState(0);
  const [ordersLeft, setOrdersLeft] = useState(0);

  const [totalMoneyDelivered, setTotalMoneyDelivered] = useState(0);
  const [totalMoneyWaitingForDelivery, setTotalMoneyWaitingForDelivery] =
    useState(0);

  const date = new Date().toISOString().substring(0, 10);

  const { user, getUser } = useContext(UserContext);
  const [showUpdateUser, setShowUpdateUser] = useState(false);

  const history = useHistory();

  useEffect(() => {
    getOrdersForDelivery();
    getDeliveredOrders();
  }, []);

  async function getOrdersForDelivery() {
    try {
      const orderList = await axios.get(
        `${server}/order/courier/get/Out for delivery/${user.userName}/${date}`
      );
      setOutForDeliveryOrders(orderList.data);
      setOrdersLeft(orderList.data.length);
      setTotalMoneyWaitingForDelivery(
        orderList.data
          .map((item) => Number(item.totalOrder))
          .reduce((prev, next) => prev + next)
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function getDeliveredOrders() {
    try {
      const orderList = await axios.get(
        `${server}/order/courier/get/Delivered/${user.userName}/${date}`
      );
      setdeliveredOrders(orderList.data);
      setOrdersDelivered(orderList.data.length);
      setTotalMoneyDelivered(
        orderList.data
          .map((item) => Number(item.totalOrder))
          .reduce((prev, next) => prev + next)
      );
    } catch (err) {
      console.log(err);
    }
  }

  function renderDeliveredOrders() {
    return (
      <div className="orders-for-delivery">
        {deliveredOrders.map((order) => {
          return <CompletedSingleOrder key={order._id} order={order} />;
        })}
      </div>
    );
  }

  function renderOutForDeliveryOrders() {
    return (
      <div className="orders-for-delivery">
        <h3>Orders for delivery</h3>
        <div>
          {outForDeliveryOrders.map((order) => {
            return (
              <div className="order" key={order.id}>
                <p>Order ID: {order.orderInternalId}</p>
                <button
                  className="delivered"
                  onClick={() => {
                    orderDelivered(order);
                  }}
                >
                  Mark as Delivered
                </button>
                {order.orderItems.map((orderItem) => {
                  return (
                    <div className="order-item" key={orderItem.id}>
                      <h4>
                        {orderItem.itemNumber} - {orderItem.itemName} -
                        <span> Quantity: {orderItem.itemQuantity}</span>
                      </h4>
                    </div>
                  );
                })}
                {order.extra !== "" && (
                  <h4 className="order-extra">{order.extra}</h4>
                )}
                <hr />
                <h4>Delivery to: {order.userName}</h4>
                <div>
                  <h4>Address: {order.deliveryAddress}</h4>
                  <h4>Zip: {order.zip}</h4>
                  <h4>Phone: {order.phone}</h4>
                </div>

                <button
                  onClick={() => {
                    driveToAddress(order);
                  }}
                >
                  Go to address
                </button>
                <div>
                  <h3 className="total-order">
                    Total: &euro;{toDecimal(order.totalOrder)}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function driveToAddress(order) {
    const address = order.deliveryAddress;
    const zip = order.zip;
    const userAddress = address.replaceAll(" ", "+");
    const completeAddress = `${userAddress}+${zip}`;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${completeAddress}&travelmode=driving`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function orderDelivered(order) {
    try {
      const orderStatus = { status: "Delivered" };
      await axios.put(`${server}/order/${order._id}`, orderStatus);
      getOrdersForDelivery();
      getDeliveredOrders();
    } catch (err) {
      console.log(err);
    }
  }

  function cancelUpdate() {
    setShowUpdateUser(false);
  }

  return (
    <div className="courier container ">
      {user
        ? user.isCourier && (
            <>
              <button onClick={() => setShowUpdateUser(!showUpdateUser)}>
                Update my account
              </button>
              {showUpdateUser && (
                <UserUpdate user={user} cancelUpdate={cancelUpdate} />
              )}
              <h3>
                Orders For Delivery: <span>{ordersLeft}</span> Total{" "}
                <span>
                  &euro;
                  {toDecimal(totalMoneyWaitingForDelivery)}
                </span>
              </h3>
              <div>{renderOutForDeliveryOrders()}</div>
              <h3>
                Delivered Orders: <span>{ordersDelivered}</span> Total{" "}
                <span>
                  &euro;
                  {toDecimal(totalMoneyDelivered)}
                </span>
              </h3>
              <div>{renderDeliveredOrders()}</div>
            </>
          )
        : history.push("/")}
    </div>
  );
}

export default OrdersSection;
