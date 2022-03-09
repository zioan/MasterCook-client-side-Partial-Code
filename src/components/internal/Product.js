import "./Product.scss";
import { useRecoilState } from "recoil";
import { orderState } from "../../util/atoms";
import toDecimal from "../../util/toDecimal";
import { BsFillCartPlusFill } from "react-icons/bs";

function Product({ product }) {
  //updating order items (state)
  const [order, setOrder] = useRecoilState(orderState);

  const newOrderedProduct = {
    id: product._id,
    number: product.number,
    name: product.name,
    description: product.description,
    price: product.price,
  };

  function addItem(id) {
    if (order.length > 0) {
      const orderClone = order.filter((item) => item.id !== id);
      setOrder(orderClone);
      setOrder((prevOrder) => {
        return [...prevOrder, newOrderedProduct];
      });
    } else {
      setOrder((prevOrder) => {
        return [...prevOrder, newOrderedProduct];
      });
    }
  }

  return (
    <div className="product-container">
      <div className="product">
        <div className="content">
          <h3 className="number">{product.number}</h3>
          <div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        </div>
        <div className="price">
          <h3>&euro; {toDecimal(product.price)}</h3>

          <button onClick={() => addItem(product.id)}>
            <BsFillCartPlusFill />
          </button>
        </div>
      </div>
      <hr className="delimiter" />
    </div>
  );
}

export default Product;
