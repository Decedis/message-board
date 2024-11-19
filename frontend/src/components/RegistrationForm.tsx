import { useState } from "react";
import { RegisterUser } from "../utls/APIRequests";

export const RegistrationForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //setup fetch for registration

    return (
    <div>
        <h2 className="text-xl text-center mt-5">Registration Form</h2>
    <form 
        className="border-2 border-cyan-700 p-4 mx-auto my-6 flex flex-col gap-2 w-5/6 items-center"
        onSubmit={(e) => {
            e.preventDefault()
            RegisterUser({username, password});
            // console.log({
            //     username,
            //     password,
            // })
            setUsername("");
            setPassword("");
        }}>
        <label>
            Username:
            <input className="p-2 ml-2 border-b-2 border-red-400" type="text" onChange={(e) => setUsername(e.target.value)}/>
        </label>

        <label>
            Password:
            <input className="p-2 ml-2 border-b-2 border-red-400" type="password" onChange={(e) => setPassword(e.target.value)}/>
        </label>
        <input className="bg-cyan-600 p-2 m-2 rounded-md" type="submit" />
    </form>
    </div>
    )
}