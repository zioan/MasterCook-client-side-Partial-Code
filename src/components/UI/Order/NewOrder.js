import "./NewOrder.scss";
import { useRecoilState } from "recoil";
import { orderState } from "../../../util/atoms";
import { useContext, useEffect, useState } from "react";
import OrderedItem from "./OrderedItem";
import UserContext from "../../../util/UserContext";
import axios from "axios";
import server from "../../../util/server";
import toDecimal from "../../../util/toDecimal";

// All order (cart) logic is inside NewOrder.js, OrderedItem.js and Product.js
// Product.js is rendered from Category.js
// Category.js is rendered from Home.js
// order state is stored with recoil in amons.js

function NewOrder() {
  const [order, setOrder] = useRecoilState(orderState);
  const [totalOrder, setTotalOrder] = useState(0);
  const [extra, setExtra] = useState("");

  const { user, getUser } = useContext(UserContext);

  const [notAuthName, setNotAuthName] = useState("");
  const [notAuthAddress, setNotAuthAddress] = useState("");
  const [notAuthPhone, setNotAuthPhone] = useState("");
  const [notAuthZip, setNotAuthZip] = useState("");

  function onRemoveProduct(i) {
    const filteredOrder = order.filter((product, index) => {
      return index !== i;
    });

    setOrder(filteredOrder);
  }

  let allItemsOrdered = [];

  function itemOrdered(
    id,
    number,
    name,
    description,
    price,
    quantity,
    totalPrice
  ) {
    const newItem = {
      id: id,
      itemNumber: number,
      itemName: name,
      itemDescription: description,
      itemPrice: price,
      itemQuantity: parseInt(quantity),
      itemTotalPrice: totalPrice,
    };

    if (allItemsOrdered.length > 0) {
      const newTotal = allItemsOrdered.filter((item) => item.id !== id);
      allItemsOrdered = newTotal;
      allItemsOrdered.push(newItem);
    } else {
      allItemsOrdered.push(newItem);
    }
    if (allItemsOrdered.length > 0) {
      setTotalOrder(
        allItemsOrdered
          .map((item) => item.itemTotalPrice)
          .reduce((prev, next) => prev + next)
      );
    }
  }

  async function sendOrder() {
    const newOrder = {
      orderItems: allItemsOrdered,
      user: user ? user.id : undefined,
      userName: user ? user.userName : notAuthName,
      deliveryAddress: user ? user.address : notAuthAddress,
      zip: user ? user.zipCode : notAuthZip,
      phone: user ? user.phone : notAuthPhone,
      totalOrder: totalOrder,
      extra: extra,
    };

    try {
      await axios.post(`${server}/order`, newOrder).then(setOrder([]));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="order-container">
      <div className="new-order">
        <h2 className="grid-order">Order</h2>
        <h4 className="grid-quantity">Quantity</h4>
        <h4 className="grid-price">Price</h4>
        <h4 className="grid-total">Total</h4>
        <div className="grid-remove"></div>
        <div className="order-table">
          <div>
            {order.map((item, index) => {
              return (
                <OrderedItem
                  key={item.id}
                  item={item}
                  index={index}
                  onRemoveProduct={onRemoveProduct}
                  itemOrdered={itemOrdered}
                />
              );
            })}
          </div>
        </div>
      </div>
      <textarea
        rows="3"
        placeholder="Order detail? eg. without onion, drinks not could etc."
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
      />
      <div className="total-cost">
        <h4>
          {totalOrder < 10 && <>Order must be at least &euro; 10 - </>}
          <span>Your Order &euro;{toDecimal(totalOrder)}</span>
        </h4>
      </div>
      {user && (
        <div className="delivery-detail">
          <hr />
          <div className="user-delivery-details">
            <h3>Delivery details:</h3>
            <div>
              <h4>{user.userName}</h4>
              <p>{user.address}</p>
              <p>{user.zipCode}</p>
            </div>
          </div>
          <button
            disabled={totalOrder < 10}
            className="order-btn"
            onClick={sendOrder}
          >
            Order Now
          </button>
        </div>
      )}
      {!user && (
        <div className="delivery-detail">
          <hr />
          <h3>All fields are required to send the order !</h3>
          <div className="user-delivery-details">
            <h3>Delivery details:</h3>
            <div>
              <input
                type="text"
                placeholder="Your name as on your door"
                value={notAuthName}
                onChange={(e) => setNotAuthName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Your street address and number"
                value={notAuthAddress}
                onChange={(e) => setNotAuthAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Your phone number"
                value={notAuthPhone}
                onChange={(e) => setNotAuthPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Zip code"
                value={notAuthZip}
                onChange={(e) => setNotAuthZip(e.target.value)}
              />
            </div>
          </div>
          <button
            disabled={
              notAuthName === "" ||
              notAuthAddress === "" ||
              notAuthPhone === "" ||
              notAuthZip === "" ||
              totalOrder < 10
            }
            className="order-btn"
            onClick={sendOrder}
          >
            Order Now
          </button>
        </div>
      )}
    </div>
  );
}

export default NewOrder;
