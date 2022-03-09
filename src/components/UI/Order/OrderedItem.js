import { useEffect, useState } from "react";
import "./OrderedItem.scss";
import { BsTrash } from "react-icons/bs";
import toDecimal from "../../../util/toDecimal";

//display single ordered item
function OrderedItem({ item, index, onRemoveProduct, itemOrdered }) {
  const [itemQuantity, setItemQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);

  useEffect(() => {
    setTotalPrice(item.price * itemQuantity);
    itemOrdered(
      item.id,
      item.number,
      item.name,
      item.description,
      item.price,
      itemQuantity,
      totalPrice
    );
  });

  return (
    <div className="single-product">
      <div className="product-row">
        <h4 className="grid-order">
          {item.number} {item.name}
        </h4>

        <div className="grid-quantity">
          <button
            disabled={itemQuantity === 1}
            onClick={() => setItemQuantity(itemQuantity - 1)}
          >
            -
          </button>
          <p className="quantity">{itemQuantity}</p>
          <button onClick={() => setItemQuantity(itemQuantity + 1)}>+</button>
        </div>
        <h4 className="grid-price">&euro; {toDecimal(item.price)}</h4>
        <h4 className="grid-total">
          &euro;
          {toDecimal(totalPrice)}
        </h4>
        <button
          className="delete-item grid-remove"
          onClick={() => onRemoveProduct(index)}
        >
          <BsTrash />
        </button>
      </div>
    </div>
  );
}

export default OrderedItem;
