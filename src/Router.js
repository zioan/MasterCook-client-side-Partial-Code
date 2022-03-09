import React from "react";
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import Footer from "./components/UI/Footer";
import Navbar from "./components/UI/Navbar";
import AdminPage from "./pages/AdminPage";
import CourierPage from "./pages/CourierPage";
import CustomerAccount from "./pages/CustomerAccount";
import Home from "./pages/Home";

function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/admin">
          <AdminPage />
        </Route>
        <Route path="/account">
          <CustomerAccount />
        </Route>
        <Route path="/courier">
          <CourierPage />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default Router;
