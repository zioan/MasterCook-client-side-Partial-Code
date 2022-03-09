import "./OrdersSection.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import server from "../../util/server";
import toDecimal from "../../util/toDecimal";
import SingleOrder from "../internal/SingleOrder";
import CompletedSingleOrder from "../internal/CompletedSingleOrder";

import { useRecoilState } from "recoil";
import { couriersState } from "../../util/atoms";
import CouriersOrder from "../internal/CouriersOrder";

function OrdersSection() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [outForDeliveryOrders, setOutForDeliveryOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [totalMoneyDelivered, setTotalMoneyDelivered] = useState(0);
  const [totalMoneyWaitingForDelivery, setTotalMoneyWaitingForDelivery] =
    useState(0);
  const [totalDay, setTotalDay] = useState(0);

  const [couriers, setCouriers] = useRecoilState(couriersState);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [showCourier, setShowCourier] = useState(false);

  useEffect(() => {
    rerenderOrders();
  }, []);

  useEffect(() => {
    rerenderOrders();
  }, [date]);

  function rerenderOrders() {
    setTotalMoneyDelivered(0);
    setTotalMoneyWaitingForDelivery(0);
    setTotalDay(0);
    getDayTotalSales();
    getCourierList();
    getPendingOrders();
    getOrdersForDelivery();
    getDeliveredOrders();
    // checkIncomingOrders();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      rerenderOrders();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  async function getCourierList() {
    try {
      const courierList = await axios.get(`${server}/user/couriers`);
      setCouriers(courierList.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getPendingOrders() {
    try {
      const orderList = await axios.get(`${server}/order/Pending`);
      setPendingOrders(orderList.data);
    } catch (err) {
      console.log(err);
    }
  }

  // Total orders
  async function getOrdersForDelivery() {
    try {
      const orderList = await axios.get(
        `${server}/order/Out for delivery/${date}`
      );
      setOutForDeliveryOrders(orderList.data);
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
      const orderList = await axios.get(`${server}/order/Delivered/${date}`);
      setDeliveredOrders(orderList.data);
      setTotalMoneyDelivered(
        orderList.data
          .map((item) => Number(item.totalOrder))
          .reduce((prev, next) => prev + next)
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function getDayTotalSales() {
    try {
      const orderList = await axios.get(`${server}/order/totalDay/${date}`);
      setTotalDay(
        orderList.data
          .map((item) => Number(item.totalOrder))
          .reduce((prev, next) => prev + next)
      );
    } catch (err) {
      console.log(err);
    }
  }
  //

  function renderPendingOrders() {
    return (
      <div>
        <h2>Pending Orders</h2>
        {pendingOrders.map((order) => {
          return (
            <SingleOrder
              key={order.id}
              order={order}
              rerenderOrders={rerenderOrders}
            />
          );
        })}
      </div>
    );
  }

  function renderOutForDeliveryOrders() {
    return (
      <div>
        {outForDeliveryOrders.map((order) => {
          return (
            <CompletedSingleOrder
              key={order.id}
              order={order}
              rerenderOrders={rerenderOrders}
            />
          );
        })}
      </div>
    );
  }

  function renderDeliveredOrders() {
    return (
      <div>
        {deliveredOrders.map((order) => {
          return (
            <CompletedSingleOrder
              key={order.id}
              order={order}
              rerenderOrders={rerenderOrders}
            />
          );
        })}
      </div>
    );
  }

  function couriersList() {
    return (
      <div className="courier">
        <button
          onClick={() => {
            setShowCourier(!showCourier);
          }}
        >
          Show Couriers Summary
        </button>
        {showCourier && (
          <>
            <label>Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                // rerenderOrders();
                //rerender courier data here
              }}
            />
            <h4 className="daily">
              Daily total orders: <span>&euro;{toDecimal(totalDay)}</span>
            </h4>
          </>
        )}
        {couriers.map((courier) => {
          return (
            <div className="single-courier" key={courier._id}>
              {showCourier && (
                <div>
                  <CouriersOrder
                    courier={courier}
                    date={date}
                    getCourierList={getCourierList}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function formatDate(date) {
    const dateArray = date.split("-");
    const day = dateArray[2];
    const month = dateArray[1];
    const year = dateArray[0];
    return `${day}.${month}.${year}`;
  }

  return (
    <div className="orders-container">
      {renderPendingOrders()}

      <div className="curier">
        <div className="couriers-list">{couriersList()}</div>
        <h2>
          Out for delivery - <span>{formatDate(date)}</span> : &euro;
          {toDecimal(totalMoneyWaitingForDelivery)}
        </h2>
        {totalMoneyWaitingForDelivery > 0 && (
          <div className="box">{renderOutForDeliveryOrders()}</div>
        )}
        <h2 className="delivered">
          Delivered Orders - <span>{formatDate(date)}</span> : &euro;
          {toDecimal(totalMoneyDelivered)}
        </h2>
        {totalMoneyDelivered > 0 && (
          <div className="box">{renderDeliveredOrders()}</div>
        )}
      </div>
    </div>
  );
}

export default OrdersSection;
