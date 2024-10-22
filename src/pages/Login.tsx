import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { login } from "../apiCalls/apiSdk";
import { toast } from 'react-toastify';
import { SpinLoaderTwo } from "../components/spinnerComponents";

export default function LoginPage () {

    const navigate = useNavigate();

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [formState, setformState] = useState("idle");

    const loginButton = async () => {
        try {
            setformState("loading");

            const response = await login(emailOrUsername, password);

            sessionStorage.setItem("authToken", response.data.token);

            sessionStorage.setItem("userDetails", JSON.stringify(response.data.userDetails));

            console.log(response.data.token);

            navigate("/");

        } catch (error) {
            toast("An error occurred while trying to login");
        } finally {
            setformState("idle");
        }
    }

    return (
        <div style={{backgroundImage: "url('/login.png')", backgroundSize: "cover", height: "100vh"}}>

            <div className="flex justify-center items-center h-full">
                <div className="bg-[#133F40] w-[full] md:w-[600px] px-8 flex flex-col gap-4 py-10 rounded-xl">
                    <div>
                        <small className="text-white/[0.5]">Email or Username</small>
                        <input placeholder="johndoe@gmail.com" value={emailOrUsername} onChange={(e) => {setEmailOrUsername(e.target.value)}} className="w-full rounded-md px-4 py-2 text-[#133F40]" />
                    </div>
                    <div>
                        <small className="text-white/[0.5]">Password</small>
                        <input placeholder="********" type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} className="w-full rounded-md px-4 py-2 text-[#133F40]" />
                    </div>
                    <button className="py-2 bg-white rounded-lg text-[#133F40] mt-4 font-bold" onClick={loginButton}>{formState == "loading" ? <SpinLoaderTwo /> : "Login"}</button>
                    <small className="text-white/[0.5]">Don't have an account? <Link to="/register" className="text-white/[1]">Register</Link></small>
                </div>
            </div>
        </div>
    );
}