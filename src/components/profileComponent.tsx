import { toast } from "react-toastify";
import { customErrorHandler } from "../utils/customErrorHandler";
import { myProfile } from "../apiCalls/apiSdk";
import { useEffect, useState } from "react";


export function ProfileComponent () {

    const [myProfileDetails, setMyProfileDetails] = useState<any>({});

    const fetchMyProfile = async () => {
        try {
            
            const profileDetails = await myProfile();
            console.log("profileDetails", profileDetails.data.profile);

            setMyProfileDetails(profileDetails.data.profile);

        } catch (error) {
            toast(customErrorHandler(error));
        }
    }

    useEffect(() => {
        fetchMyProfile();
    }, []);

    return (
        <div>
            <div className="p-4">
                <img src={myProfileDetails.profilePic == "default" ? "/avatar.png" : myProfileDetails.profilePic} className="h-[120px] w-[120px] rounded-full mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
                {
                    myProfileDetails.role == "user" && (
                        <>
                            <div>
                                <small>First Name</small>
                                <input value={myProfileDetails.firstName} className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]" />
                            </div>

                            <div>
                                <small>Last Name</small>
                                <input value={myProfileDetails.lastName} className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]" />
                            </div>
                        </>
                    )
                }

                {
                    myProfileDetails.role == "organization" && (
                        <div>
                            <small>Organization Name</small>
                            <input value={myProfileDetails.organizationName} className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]" />
                        </div>
                    )
                }

                <div>
                    <small>Email</small>
                    <input value={myProfileDetails.email} className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]" />
                </div>

                <div>
                    <small>Phone Number</small>
                    <input value={myProfileDetails.phoneNmber} className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]" />
                </div>

                <div>
                    <small>State</small>
                    <select value={myProfileDetails.state} className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"></select>
                </div>

                <div>
                    <small>City Or LGA</small>
                    <select value={myProfileDetails.cityOrLGA} className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"></select>
                </div>
            </div>
        </div>
    );
}