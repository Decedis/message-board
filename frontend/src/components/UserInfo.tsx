import { jwtDecode } from "jwt-decode";
import { useStore } from "../Store";
import { CustomJwtPayload } from "../utls/types";

export const UserInfo = () => {
  const token = useStore((state) => state.token);
  if (!token) {
    return (
      <div className="bg-red-600 p-4 m-2 border-2 rounded-md w-[200px] text-white">
        <h2>No user found</h2>
      </div>
    );
  }
  try {
    const user = jwtDecode<CustomJwtPayload>(token!);
    console.log("UserInfo: ", user);

    return (
      <div className="bg-cyan-600 p-4 m-2 border-2 rounded-md w-[200px] text-white">
        {user ? <h2>{user?.userName}</h2> : <h2>No user found</h2>}
      </div>
    );
  } catch (error) {
    console.error("Error decoding token: ", error);
    return (
      <div className="bg-red-900 p-4 m-2 border-2 rounded-md w-[200px] text-white font-bold">
        <h2>Invalid Token</h2>
      </div>
    );
  }
};
