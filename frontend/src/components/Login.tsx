import { useState } from "react";
import { fetchUserAndToken } from "../utls/APIRequests";
import { useStore } from "../Store";
import { Navigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "../utls/types";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useStore((state) => state.login);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return (
    <>
      <Navbar />
      <h2 className="text-xl text-center mt-6">Login</h2>
      <form
        className="border-2 border-cyan-700 p-4 mx-auto my-6 flex flex-col gap-2 w-5/6 items-center"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          setError("");
          try {
            const response = await fetchUserAndToken({
              username,
              password,
            });
            const { token } = response;
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            login(decodedToken, token);

            sessionStorage.setItem("token", token);
            console.log("Login response: ", { decodedToken, token });
            <Navigate to="/" replace={true} />; //TODO this doesn't work
          } catch (error) {
            console.error("Login failed: ", error);
          } finally {
            setIsLoading(false);
          }
          setUsername("");
          setPassword("");
          console.log("isAuth: ", isAuthenticated);
        }}
      >
        <label>
          Username:
          <input
            className="p-2 ml-2 border-b-2 border-red-400"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            className="p-2 ml-2 border-b-2 border-red-400"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {/* <input className="bg-cyan-600 p-2 m-2 rounded-md" disabled={isLoading} type="submit" /> */}
        <button
          className="bg-cyan-600 p-2 m-2 rounded-md text-white"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </>
  );
}

export default Login;
