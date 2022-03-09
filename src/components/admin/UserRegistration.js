import axios from "axios";
import { useEffect, useState } from "react";
import server from "../../util/server";
import "./UserRegistration.scss";

function UserRegistration() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userVerifyPassword, setUserVerifyPassword] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userZip, setUserZip] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCourier, setIsCourier] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");

  function clearFields() {
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserVerifyPassword("");
    setUserAddress("");
    setUserZip("");
    setUserPhone("");
    setIsAdmin("");
    setIsCourier("");
    setIsCustomer("");
    setSelectedRole("");
  }

  useEffect(() => {
    if (selectedRole === "Admin") {
      setIsAdmin(true);
      setIsCourier(false);
      setIsCustomer(false);
    }
    if (selectedRole === "Courier") {
      setIsAdmin(false);
      setIsCourier(true);
      setIsCustomer(false);
    }
    if (selectedRole === "Customer") {
      setIsAdmin(false);
      setIsCourier(false);
      setIsCustomer(true);
    }
  }, [selectedRole]);

  async function register(e) {
    e.preventDefault();

    const registerData = {
      name: userName,
      email: userEmail,
      password: userPassword,
      address: userAddress,
      zipCode: userZip,
      phone: userPhone,
      isAdmin: isAdmin,
      isCourier: isCourier,
      isCustomer: isCustomer,
    };

    if (userPassword !== userVerifyPassword) {
      console.log("password not matching");
      return;
    }

    if (
      userName &&
      userEmail &&
      userPassword &&
      userAddress &&
      userZip &&
      selectedRole
    ) {
      try {
        await axios
          .post(`${server}/user/register`, registerData)
          .then(clearFields());
      } catch (err) {
        console.log(err);
        return;
      }
    }
  }

  return (
    <div className="user-registration box">
      <h2>Add new user</h2>
      <form onSubmit={register}>
        <input
          type="text"
          placeholder="User name as on door bell"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="User email"
          required
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="User phone number"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="User password"
          required
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Retype user password"
          required
          value={userVerifyPassword}
          onChange={(e) => setUserVerifyPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="User address (street & number)"
          required
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="User zip code"
          required
          value={userZip}
          onChange={(e) => setUserZip(e.target.value)}
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Select User Role</option>
          <option value="Admin">Admin</option>
          <option value="Courier">Courier</option>
          <option value="Customer">Customer</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default UserRegistration;
