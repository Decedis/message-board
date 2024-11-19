import { Link } from "react-router-dom";
import { useStore } from "../Store";

export const Navbar = () => {
  const user = useStore((state) => state.user);
  const token = useStore((state) => state.token);
  const userLogout = useStore((state) => state.logout);

  console.log("User: ", user);
  console.log("Token: ", token);
  return (
    <nav className="bg-cyan-600 text-white p-4 mb-4 flex flex-row">
      {!user ? (
        <Link to={"/login"}>Login</Link>
      ) : (
        <button onClick={userLogout}>Logout</button>
      )}
    </nav>
  );
};
