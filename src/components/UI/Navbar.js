import { useHistory } from "react-router-dom";
import "./Navbar.scss";
import Auth from "./Auth";
import UserContext from "../../util/UserContext.js";
import { useContext } from "react";
import axios from "axios";
import server from "../../util/server";
import logo2 from "../../files/food-logo.png";

function Navbar() {
  const history = useHistory();

  const { user, getUser } = useContext(UserContext);

  async function isUserLogged() {
    await getUser();
  }

  async function logOut() {
    await axios.get(`${server}/user/logOut`);
    history.push("./");
    await getUser();
  }
  return (
    <div className="navbar-header">
      <div className="container">
        <div className="header">
          <img
            className="logo"
            src={logo2}
            alt="logo"
            onClick={() => history.push("/")}
          />
          <div className="navigation">
            {!user && <Auth isUserLogged={isUserLogged} />}
            {user && (
              <>
                <h3>Hello {user.userName}</h3>

                {user && (
                  <button onClick={() => history.push("/")}>View Menu</button>
                )}
                {user.isAdmin && (
                  <button onClick={() => history.push("/admin")}>
                    Admin page
                  </button>
                )}
                {user.isCustomer && (
                  <button onClick={() => history.push("/account")}>
                    My account
                  </button>
                )}
                {user.isCourier && (
                  <button onClick={() => history.push("/courier")}>
                    Orders
                  </button>
                )}
                <button onClick={logOut}>Log out</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
