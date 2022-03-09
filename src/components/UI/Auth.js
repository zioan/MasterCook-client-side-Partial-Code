import Modal from "./Modal";
import "./Auth.scss";
import { useState } from "react";
import Register from "./Register";
import Login from "./Login";

function Auth({ isUserLogged }) {
  const [modalOpenRegister, setModalOpenRgister] = useState(false);
  const [modalOpenLogin, setModalOpenLogin] = useState(false);

  function isUserRegistered() {
    setModalOpenRgister(false);
  }
  function isUserLogedIn() {
    setModalOpenLogin(false);
  }

  return (
    <div className="auth">
      {modalOpenRegister && (
        <Modal
          setModalOpenRgister={setModalOpenRgister}
          title="Register for faster orders and delivery"
        >
          <Register isUserRegistered={isUserRegistered} />
        </Modal>
      )}
      {modalOpenLogin && (
        <Modal
          setModalOpenLogin={setModalOpenLogin}
          title="Login to your account"
        >
          <Login isUserLogged={isUserLogged} isUserLogedIn={isUserLogedIn} />
        </Modal>
      )}

      <button
        onClick={() => {
          setModalOpenLogin(true);
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          setModalOpenRgister(true);
        }}
      >
        Register
      </button>
    </div>
  );
}

export default Auth;
