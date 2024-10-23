import { toast } from "react-toastify";
import { customErrorHandler } from "../utils/customErrorHandler";
import { editMyPassword, editMyProfile, myProfile, uploadFile } from "../apiCalls/apiSdk";
import { useEffect, useState } from "react";
import { getLGAs, getStates } from "../utils/getStateAndLGA";
import { Tags } from "../interfaces/responseInterfaces";
import { tagProperties } from "../utils/tagProperties";

export function ProfileComponent() {
  const [myProfileDetails, setMyProfileDetails] = useState<any>({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [cityOrLGA, setCityOrLGA] = useState("");
  const [state, setState] = useState("");
  const [pic, setPic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchMyProfile = async () => {
    try {
      const profileDetails = await myProfile();
      console.log("profileDetails", profileDetails.data.profile);

      setMyProfileDetails(profileDetails.data.profile);

      setFirstName(profileDetails.data.profile.firstName);
      setLastName(profileDetails.data.profile.lastName);
      setOrganizationName(profileDetails.data.profile.organizationName);
      setEmail(profileDetails.data.profile.email);
      setUsername(profileDetails.data.profile.username);
      setPhoneNumber(profileDetails.data.profile.phoneNumber);
      setTags(profileDetails.data.profile.tags);
      setCityOrLGA(profileDetails.data.profile.cityOrLGA);
      setState(profileDetails.data.profile.state);
      setPic(profileDetails.data.profile.profilePic);
    } catch (error) {
      toast(customErrorHandler(error));
    }
  };

  const updateProfile = async () => {
    try {

        if(!phoneNumber || !tags || !cityOrLGA || !state) {
            toast("Kindly fill the form completely");
            return;
        }

        const updatedProfile = await editMyProfile({
            firstName,
            lastName,
            organizationName,
            phoneNumber,
            tags,
            cityOrLGA,
            state
        });

        toast("Profile updated successfully");

        setMyProfileDetails(updatedProfile.data.updatedDetails);

      setFirstName(updatedProfile.data.updatedDetails.firstName);
      setLastName(updatedProfile.data.updatedDetails.lastName);
      setOrganizationName(updatedProfile.data.updatedDetails.organizationName);
      setEmail(updatedProfile.data.updatedDetails.email);
      setUsername(updatedProfile.data.updatedDetails.username);
      setPhoneNumber(updatedProfile.data.updatedDetails.phoneNumber);
      setTags(updatedProfile.data.updatedDetails.tags);
      setCityOrLGA(updatedProfile.data.updatedDetails.cityOrLGA);
      setState(updatedProfile.data.updatedDetails.state);
      setPic(updatedProfile.data.updatedDetails.profilePic);

    } catch (error) {
        customErrorHandler(error);
    }
  }

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const [lgas, setLgas] = useState<string[]>([]);

  const updateLocalGovernment = () => {
    const lgaResult = getLGAs(state);
    console.log(lgaResult);
    if (lgaResult != undefined) {
      setLgas(lgaResult);
    }
  };

  useEffect(() => {
    updateLocalGovernment();
  }, [state]);

  const toggleTag = (slug: string) => {
    if (tags.find(tValue => tValue == slug)) {
      const updatedTag: string[] = tags.filter((tag: string) => tag != slug).map(t => t);
      setTags(updatedTag);
    } else {
      const updatedTag = tags.concat(slug);
      setTags(updatedTag);
    }
  };

  const changePic = async (file: any) => {
    try {
        const uploadResult = await uploadFile(file[0]);
        
        const updatedPic = await editMyProfile({
            profilePic: uploadResult.data.data.secure_url
        });

        setPic(updatedPic.data.updatedDetails.profilePic);
        console.log(uploadResult.data.data.secure_url);
        console.log(updatedPic.data.updatedDetails.profilePic);


    } catch (error) {
        toast(customErrorHandler(error));
    }
  }

  const updatePassword = async () => {
    try {

        if(!password || !confirmPassword) {
            toast("Password or confirm password is empty");
            return;
        }

        if(password != confirmPassword) {
            toast("Password does not match");
            return;
        }

        if(password.length < 8 || confirmPassword.length < 8) {
            toast("Password does not match");
            return;
        }
        
        const result = await editMyPassword(password, confirmPassword);

        toast(result.data.message);

        setPassword("");

        setConfirmPassword("");

    } catch (error) {
        toast(customErrorHandler(error));
    }
  }

  return (
    <div>
      <div className="p-4 flex flex-col justify-center items-center gap-4">
        <img
          src={
            pic == "default"
              ? "/avatar.png"
              : pic
          }
          className="h-[120px] w-[120px] rounded-full mx-auto"
        />
        <div>
            <label htmlFor="profile-pic" className="px-6 py-2 rounded-lg border-none font-bold bg-black text-white">Upload Profile Picture</label>
            <input type="file" id="profile-pic" className="hidden" onChange={(e) => {changePic(e?.target?.files as any)}} />
        </div>
      </div>
      <div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        <div>
                <small>New passwod</small>
                <input
                    type="password"
                    value={password}
                    placeholder="********"
                    className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                </div>

                <div>
                <small>Confirm password</small>
                <input
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                    onChange={(e) => {setConfirmPassword(e.target.value)}}
                />
                </div>
        </div>
        <div className="p-4 flex justify-end">
            <button onClick={updatePassword} className="px-6 py-2 rounded-lg border-none font-bold bg-black text-white">Change Password</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        {myProfileDetails.role == "user" && (
          <>
            <div>
              <small>First Name</small>
              <input
                value={firstName}
                className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                onChange={(e) => {setFirstName(e.target.value)}}
              />
            </div>

            <div>
              <small>Last Name</small>
              <input
                value={lastName}
                className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                onChange={(e) => {setLastName(e.target.value)}}
              />
            </div>
          </>
        )}

        {myProfileDetails.role == "organization" && (
          <div>
            <small>Organization Name</small>
            <input
              value={organizationName}
              className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
              onChange={(e) => {setOrganizationName(e.target.value)}}
            />
          </div>
        )}

        <div>
          <small>Username</small>
          <input
            value={username}
            className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40] bg-white/[0.5]"
            disabled
          />
        </div>

        <div>
          <small>Email</small>
          <input
            value={email}
            className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40] bg-white/[0.5]"
            disabled
          />
        </div>

        <div>
          <small>Phone Number</small>
          <input
            value={phoneNumber}
            className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
            onChange={(e) => {setPhoneNumber(e.target.value)}}
          />
        </div>

        <div>
          <small>State</small>
          <select
            value={state}
            className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
            onChange={(e) => {setState(e.target.value)}}
          >
            {getStates().map((state: string) => (
              <option value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <small>City Or LGA</small>
          <select
            value={cityOrLGA}
            className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
            onChange={(e) => {setCityOrLGA(e.target.value)}}
          >
            {lgas.length > 0 &&
              lgas.map((s: string) => <option value={s}>{s}</option>)}
          </select>
        </div>

        <div>
            <small className="text-white/[0.5]">Tags</small>
            <textarea
              placeholder="Tags"
              className="w-full rounded-md px-4 py-2 bg-white text-[#133F40]"
              value={tags
                .map((tag: string) => tag.split("-").map((t: string) => (t[0].toLocaleUpperCase() + t.slice(1))).join(" "))
                .join(", ")}
              disabled
            ></textarea>
            <div className="flex gap-2 flex-wrap">
            {tagProperties.map((t: Tags, index: number) => {
                  return (
                    <button
                    key={index}
                      className={`${
                        tags.find(ta => ta == t.slug)
                          ? "text-white font-bold bg-black"
                          : "text-black"
                      } px-2 py-1 rounded-lg border border-black`}
                      onClick={() => {
                      
                        toggleTag(t.slug as string);
                      }}
                    >
                      {t.name}
                    </button>
                  );
                })}
            </div>
          </div>

      </div>
        <div className="flex justify-end mt-8 p-4">
          <button onClick={updateProfile} className="px-6 py-2 rounded-lg border-none font-bold bg-black text-white">Update</button>
        </div>
    </div>
  );
}
