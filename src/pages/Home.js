import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Category from "../components/internal/Category";
import NewOrder from "../components/UI/Order/NewOrder";
import server from "../util/server";
import { FiPhoneCall } from "react-icons/fi";

import { useRecoilState } from "recoil";
import { orderState } from "../util/atoms";
import "./Home.scss";

function Home() {
  const [order] = useRecoilState(orderState);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const categoryList = await axios.get(`${server}/category`);
      setCategories(categoryList.data);
    } catch (err) {
      console.log(err);
    }
  }

  function renderCategories() {
    return categories.map((category) => {
      return <Category key={category._id} category={category} />;
    });
  }

  return (
    <div className="container home-page">
      <div>{renderCategories()}</div>
      <div>
        <div className="phone-numbers">
          <FiPhoneCall size={50} />
          <div>
            <p>04488 23 60 10</p>
            <p>04488 23 60 40</p>
          </div>
        </div>
        <div className="hours">
          <div>
            <h3>Opening Hours</h3>
            <h4>Mo. - Fr. 10:00 - 22:00</h4>
            <h4>Sa. - Su. 11:00 - 23:00</h4>
          </div>
          <div>
            <h3>Online Orders</h3>
            <h4>Mo. - Fr. 11:00 - 21:00</h4>
            <h4>Sa. - Su. 12:00 - 22:00</h4>
          </div>
        </div>
        {order.length > 0 && <NewOrder />}
      </div>
    </div>
  );
}

export default Home;
