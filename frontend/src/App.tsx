import { useEffect } from "react";
import { Board } from "./components/Board";
import { Navbar } from "./components/Navbar";
import { useStore } from "./Store";
import { refetchUser } from "./utls/APIRequests";
import { UserInfo } from "./components/UserInfo";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "./utls/types";

function App() {
  const token = useStore((state) => state.token); //TODO look into `get`. The getToken may be better for this.
  const logout = useStore((state) => state.logout);
  const userLogin = useStore((state) => state.login);
  //Token check and User data-fetch happens here
  console.log("TOKEN: __", token);
  useEffect(() => {
    if (token) {
      refetchUser(token)
        .then((res) => {
          console.log("refetchUser at App.tsx RESPONSE:: ___", res);
          const decodedToken = jwtDecode<CustomJwtPayload>(res.token);
          console.log("DECODED TOKEN :: ==> ", decodedToken);
          return userLogin(decodedToken, token);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          return logout();
        });
    } else {
      logout();
    }
  }, [token, logout, userLogin]);
  return (
    <>
      <Navbar />
      <UserInfo />
      <Board />
    </>
  );
}

export default App;
