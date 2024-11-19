import { jwtDecode } from "jwt-decode";
import { useStore } from "../Store";
import { CustomJwtPayload } from "../utls/types";

export const UserInfo = () => {
  const token = useStore((state) => state.token);
  const user = jwtDecode<CustomJwtPayload>(token!);
  console.log("UserInfo: ", user);

  return (
    <div className="bg-cyan-600 p-4 m-2 border-2 rounded-md w-[200px] text-white">
      {user ? <h2>{user?.userName}</h2> : <h2>No user found</h2>}
    </div>
  );
};
