import "./CustomerAccount.scss";
import UserContext from "../util/UserContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import server from "../util/server";
import { useHistory } from "react-router-dom";
import toDecimal from "../util/toDecimal";
import UserUpdate from "../components/UI/UserUpdate";

function CustomerAccount() {
  const { user, getUser } = useContext(UserContext);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [customerOrders, setcustomerOrders] = useState([]);

  const history = useHistory();

  useEffect(() => {
    // getUser();
    getUserOrders();
  }, []);

  async function getUserOrders() {
    try {
      const customerOrdersData = await axios.get(
        `${server}/order/get/userOrders/${user.id}`
      );
      setcustomerOrders(customerOrdersData.data);
    } catch (err) {
      console.log(err);
    }
  }

  function renderCustomerOrders() {
    return (
      <div className="account-page">
        {customerOrders.map((order) => {
          return (
            <div className="customer-single-order box" key={order._id}>
              <h3 className="order-date">Order date: {order.dateOrdered}</h3>
              <h4>Order ID: {order.orderInternalId}</h4>
              <h4>
                Order status: <span>{order.status}</span>
              </h4>
              {order.orderItems.map((item) => {
                return (
                  <div key={item.id}>
                    <div className="single-item">
                      <h4>
                        {item.itemNumber} - {item.itemName} - &euro;
                        {toDecimal(item.itemPrice)}
                      </h4>
                      <h4>
                        Quantity: {item.itemQuantity} - Price: &euro;
                        {toDecimal(item.itemTotalPrice)}
                      </h4>
                    </div>
                    <hr />
                  </div>
                );
              })}
              <div className="order-details">
                <h4 className="order-extra">
                  {order.extra !== "" && `Order extra: ${order.extra}`}
                </h4>
              </div>
              <h3 className="total-order">
                Total Order: &euro;{toDecimal(order.totalOrder)}
              </h3>
            </div>
          );
        })}
      </div>
    );
  }

  function cancelUpdate() {
    setShowUpdateUser(false);
  }

  return (
    <div className="customer container">
      {user
        ? user.isCustomer && (
            <div>
              <h1>Hello {user.userName}</h1>
              <button onClick={() => setShowUpdateUser(!showUpdateUser)}>
                Update my account
              </button>
              {showUpdateUser && (
                <UserUpdate user={user} cancelUpdate={cancelUpdate} />
              )}
              <h2>My orders</h2>
              {renderCustomerOrders()}
            </div>
          )
        : history.push("/")}
    </div>
  );
}

export default CustomerAccount;
