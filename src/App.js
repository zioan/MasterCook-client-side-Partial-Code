import Router from "./Router";
import axios from "axios";
import { UserContextProvider } from "./util/UserContext";
import "./style/index.scss";
import { RecoilRoot } from "recoil";

axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <RecoilRoot>
        <Router />
      </RecoilRoot>
    </UserContextProvider>
  );
}

export default App;
