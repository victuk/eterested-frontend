import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Joi from "joi";
import { register } from "../apiCalls/apiSdk";
import { SpinLoaderTwo } from "../components/spinnerComponents";
import { tagProperties } from "../utils/tagProperties";
import { Tags } from "../interfaces/responseInterfaces";
import stateAndLga from "../nigeria-state-and-lgas.json";

export default function RegisterPage() {
  const schema = Joi.object({
    firstName: Joi.string().required().messages({
      "string.empty": "First name is required.",
    }),
    lastName: Joi.string().required().messages({
      "string.empty": "Last name is required.",
    }),
    organizationName: Joi.any().when("isAnOrganization", {
      is: "yes",

      then: Joi.required().messages({
        "string.empty": "Organization name is required.",
      }),
      otherwise: Joi.optional(),
    }),
    isAnOrganization: Joi.string().required(),
    username: Joi.string().min(6).required().messages({
      "string.empty": "Username is required.",
    }),
    email: Joi.string()
      .email({ tlds: { allow: ["com", "net"] } })
      .required()
      .messages({
        "string.empty": "Email is required.",
      }),
    tags: Joi.array().items(Joi.string().min(2)).min(2).required().messages({
      "string.empty": "Password is required.",
    }),
    cityOrLGA: Joi.string().required().messages({
      "string.empty": "City or Local Government Area is required.",
    }),
    state: Joi.string().required().messages({
      "string.empty": "State is required.",
    }),
    role: Joi.string().required(),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required.",
    }),
  });

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [isAnOrganization, setIsAnOrganization] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState<Tags[]>([]);
  const [cityOrLGA, setCityOrLGA] = useState("");
  const [state, setState] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [formState, setformState] = useState("idle");

  const changeIsOrganization = (e: any) => {
    if (e.target.value == "yes") {
      setIsAnOrganization("yes");
      setRole("organization");
    } else {
      setIsAnOrganization("no");
      setRole("user");
    }
  };

  const toggleTag = (tagValue: string, slug: string) => {
    if (tags.find(tValue => tValue.slug == slug)) {
      const updatedTag = tags.filter((tag) => tag.slug != slug);
      setTags(updatedTag);
    } else {
      const updatedTag = tags.concat({name: tagValue, slug});
      setTags(updatedTag);
    }
  };

  const registerButton = async () => {
    try {
      setformState("loading");

      const payload = {
        firstName,
        lastName,
        organizationName,
        isAnOrganization,
        username,
        email,
        tags: tags.map(t => t.slug) as string[],
        cityOrLGA,
        state,
        role,
        password,
      };

      const { error } = schema.validate(payload);

      if (error) {
        toast(error?.message, {
          className: "text-[black]",
        });
        return;
      }

      const registerResult = await register(payload);

      // console.log(registerResult.data.verificationId);

      navigate(`/verify-email/${registerResult.data.verificationId}`);
    } catch (error) {
      toast("An error occurred while trying to register");
    } finally {
      setformState("idle");
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/login.png')",
        backgroundSize: "cover",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div className="flex justify-center items-center h-full overflow-y-scroll">
        <div className="bg-[#133F40] w-[full] md:w-[600px] px-8 flex flex-col gap-4 py-10 rounded-xl mt-[400px] mb-10">
          <div>
            <small className="text-white/[0.5]">First name</small>
            <input
              placeholder="John"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className="w-full rounded-md px-4 py-2 text-[#133F40]"
            />
          </div>

          <div>
            <small className="text-white/[0.5]">Last name</small>
            <input
              placeholder="Doe"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className="w-full rounded-md px-4 py-2 text-[#133F40]"
            />
          </div>

          <div>
            <small className="text-white/[0.5]">You are an organization?</small>
            <div className="flex flex-col text-white">
              <div>
                <input
                  type="radio"
                  name="anorg"
                  value="yes"
                  onClick={changeIsOrganization}
                />{" "}
                Yes
              </div>
              <div>
                <input
                  type="radio"
                  name="anorg"
                  value="no"
                  onClick={changeIsOrganization}
                />{" "}
                No
              </div>
            </div>
          </div>

          <div
            className={`${
              !isAnOrganization || isAnOrganization == "no" ? "hidden" : "block"
            }`}
          >
            <small className="text-white/[0.5]">Organization Name</small>
            <input
              placeholder="John Doe Center"
              value={organizationName}
              onChange={(e) => {
                setOrganizationName(e.target.value);
              }}
              className="w-full rounded-md px-4 py-2 text-[#133F40]"
            />
          </div>

          <div>
            <small className="text-white/[0.5]">Username</small>
            <input
              placeholder="johndoe"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="w-full rounded-md px-4 py-2 text-[#133F40]"
            />
          </div>

          <div>
            <small className="text-white/[0.5]">Email</small>
            <input
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full rounded-md px-4 py-2 text-[#133F40]"
            />
          </div>
          <div>
            <small className="text-white/[0.5]">Tags</small>
            <textarea
              placeholder="Tags"
              className="w-full rounded-md px-4 py-2 bg-white text-[#133F40]"
              value={tags
                .map((tag: Tags) => tag.name)
                .join(", ")}
              disabled
            ></textarea>
            <div className="flex gap-2 flex-wrap">
            {tagProperties.map((t: Tags, index: number) => {
                  return (
                    <button
                    key={index}
                      className={`${
                        tags.find(ta => ta.slug == t.slug)
                          ? "text-[#122F40] font-bold bg-white"
                          : "text-white"
                      } px-2 py-1 rounded-lg border border-white`}
                      onClick={() => {
                        toggleTag(t.name as string, t.slug as string);
                      }}
                    >
                      {t.name}
                    </button>
                  );
                })}
            </div>
          </div>
          <div>
            <small className="text-white/[0.5]">State</small>
            <select
              name=""
              id=""
              value={state}
              onChange={(e) => {
                setState(e.target.value);
              }}
              className="w-full rounded-md px-4 py-2 text-[#133F40]"
            >
              <option value="">Select</option>
              <option value="akwa ibom">Akwa Ibom</option>
            </select>
          </div>
          <div>
            <small className="text-white/[0.5]">City/LGA</small>
            <select
              name=""
              id=""
              value={cityOrLGA}
              onChange={(e) => {
                setCityOrLGA(e.target.value);
              }}
              className="w-full rounded-md px-4 py-2 text-[#133F40]"
            >
              <option value="">Select</option>
              <option value="eket">Eket</option>
            </select>
          </div>
          <div>
            <small className="text-white/[0.5]">Password</small>
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              className="w-full rounded-md px-4 py-2 text-[#133F40]"
            />
          </div>
          <button
            onClick={registerButton}
            className="py-2 bg-white rounded-lg text-[#133F40] mt-4 font-bold"
          >
            {formState == "loading" ? <SpinLoaderTwo /> : "Register"}
          </button>
          <small className="text-white/[0.5]">
            Already have an account?{" "}
            <Link to="/login" className="text-white/[1]">
              Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
