import "./AdminPage.scss";
import UserContext from "../util/UserContext";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import NewProduct from "../components/admin/NewProduct";
import NewCategory from "../components/admin/NewCategory";
import ImagesEditor from "../components/admin/ImagesEditor";
import OrdersSection from "../components/admin/OrdersSection";
import UserRegistration from "../components/admin/UserRegistration";
import UserUpdate from "../components/UI/UserUpdate";

function AdminPage() {
  const { user, getUser } = useContext(UserContext);
  const [displayImages, setDisplayImages] = useState(false);
  const [displayCategory, setDisplayCategory] = useState(false);
  const [displayProducts, setDisplayProducts] = useState(false);
  const [displayUserRegistration, setDisplayUserRegistration] = useState(false);
  const [showUpdateUser, setShowUpdateUser] = useState(false);

  const history = useHistory();

  useEffect(() => {
    getUser();
  }, []);

  function cancelUpdate() {
    setShowUpdateUser(false);
  }

  return (
    <div className="container">
      {user
        ? user.isAdmin && (
            <div className="admin-page">
              <h1>Admin Page</h1>
              <div className="buttons">
                <button onClick={() => setDisplayImages(!displayImages)}>
                  Images
                </button>
                <button onClick={() => setDisplayCategory(!displayCategory)}>
                  Categories
                </button>
                <button onClick={() => setDisplayProducts(!displayProducts)}>
                  Products
                </button>
                <button
                  onClick={() =>
                    setDisplayUserRegistration(!displayUserRegistration)
                  }
                >
                  Add User
                </button>
                <button onClick={() => setShowUpdateUser(!showUpdateUser)}>
                  Update my account
                </button>
              </div>
              <div className="new-items">
                {showUpdateUser && (
                  <UserUpdate user={user} cancelUpdate={cancelUpdate} />
                )}
                {displayImages && <ImagesEditor />}
                {displayCategory && <NewCategory />}
                {displayProducts && <NewProduct />}
                {displayUserRegistration && <UserRegistration />}
              </div>
              <OrdersSection />
            </div>
          )
        : history.push("/")}
    </div>
  );
}

export default AdminPage;
