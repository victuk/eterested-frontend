import { useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { verifyEmail } from "../apiCalls/apiSdk";
import { toast } from 'react-toastify';
import { SpinLoaderTwo } from "../components/spinnerComponents";

export default function VerifyEmailPage () {

    const [otp, setOtp] = useState("");
    const [formState, setformState] = useState("idle");

    const params = useParams();

    const navigate = useNavigate();

    const verifyButton = async () => {

        try {
            setformState("loading");
            const verificationId = params.uid;

            await verifyEmail(verificationId as string, otp);

            navigate("/login");

        } catch (error) {
            toast("An error occurred while trying to verify your email");
        } finally {
            setformState("idle");
        }
    }

    return (
        <div style={{backgroundImage: "url('/login.png')", backgroundSize: "cover", height: "100vh"}}>
            <div className="flex justify-center items-center h-full">
                <div className="bg-[#133F40] w-[full] md:w-[600px] px-8 flex flex-col gap-4 py-10 rounded-xl">
                    <div className="text-white/[0.5]">An email has been sent to you, kindly check</div>
                    <div>
                        <small className="text-white/[0.5]">OTP</small>
                        <input placeholder="123456" className="w-full rounded-md px-4 py-2 text-[#133F40]" value={otp} onChange={(e) => {setOtp(e.target.value)}} />
                    </div>
                    <button className="py-2 bg-white rounded-lg text-[#133F40] mt-4 font-bold" onClick={verifyButton}>{formState == "loading" ? <SpinLoaderTwo /> : "Verify"}</button>
                </div>
            </div>
        </ div>
    );
}