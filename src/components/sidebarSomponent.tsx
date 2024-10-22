import { useLocation, useNavigate } from "react-router-dom";
import {
  toggleEventState,
  toggleSidebar,
} from "../store/slices/createEventSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { RootState } from "../store/store";
import { getAuthToken } from "../apiCalls/apiSdk";
import { useEffect, useState } from "react";
import { FaWpexplorer } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { BsCalendar2Event } from "react-icons/bs";
import { LuTicket } from "react-icons/lu";
import { RxAvatar } from "react-icons/rx";
import { LuLogOut } from "react-icons/lu";
import { LuLogIn } from "react-icons/lu";
import { GoPersonAdd } from "react-icons/go";
import { RiHeartsLine } from "react-icons/ri";

export function SidebarComponent() {
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const authValue = getAuthToken();

    console.log(authValue == "Bearer null");

    if(!(authValue == "Bearer null")) {
        setIsLoggedIn(true);
    } else {
        setIsLoggedIn(false);
    }

  }, []);

  const isSidebarOpen = useSelector(
    (state: RootState) => state.createEvent.sidebarValue
  );

  const setShowModal = (value: boolean) => {
    dispatch(toggleEventState(value));
  };

  const navigate = useNavigate();

  const logOut = () => {
    sessionStorage.removeItem("authToken");

    sessionStorage.removeItem("userDetails");
    setShowSidebar(false);
    navigate("/");
  };

  const setShowSidebar = (value: boolean) => {
    dispatch(toggleSidebar(value));
  };

  const loc = useLocation();

  return (
    <div
      className={`flex flex-col gap-4 w-full md:w-[20%] bg-[#f3f3f3] pt-10 text-[#133F40] fixed ${
        isSidebarOpen ? "top-0 left-0" : "top-0 left-[-500px]"
      } md:relative md:left-0 h-full pl-4 z-[100]`}
    >
      <div className="mb-8 font-bold flex justify-between items-center">
            <div className="text-[25px]">e-Terest</div>
        <div className="flex justify-end md:hidden">
          <button>
            <IoMdClose
              className="h-[20px] w-[20px] mr-[20px]"
              onClick={() => {
                setShowSidebar(false);
              }}
            />
          </button>
        </div>
      </div>

      <button className={`${loc.pathname == "/" && "font-bold"} text-left text-[18px] flex items-center gap-4`} onClick={() => {navigate("/"); setShowSidebar(false);}}><FaWpexplorer /> Explore</button>
      {isLoggedIn ? (
        <>
        <button
            className={`text-left text-[18px] flex items-center gap-4`}
            onClick={() => {
            setShowModal(true);
            setShowSidebar(false);
            }}
        >
           <IoMdAdd /> Add Event
        </button>
        <button className={`${loc.pathname == "/profile/my-events" && "font-bold"} text-left text-[18px] flex items-center gap-4`} onClick={() => {navigate("/profile/my-events");setShowSidebar(false);}}><BsCalendar2Event /> My Events</button>
        <button className={`${loc.pathname == "/profile/my-tickets" && "font-bold"} text-left text-[18px] flex items-center gap-4`} onClick={() => {navigate("/profile/my-tickets");setShowSidebar(false);}}><LuTicket /> My Tickets</button>
        {/* <button className={`${loc.pathname == "/profile/my-favourites" && "font-bold"} text-left text-[18px] flex items-center gap-4`} onClick={() => {navigate("/profile/my-favourites");setShowSidebar(false);}}><RiHeartsLine /> Favourites</button> */}
        <button className={`${loc.pathname == "/profile/my-profile" && "font-bold"} text-left text-[18px] flex items-center gap-4`} onClick={() => {navigate("/profile/my-profile");setShowSidebar(false);}}><RxAvatar /> Profile</button>
        
        <button className={`text-left text-[18px] flex items-center gap-4`} onClick={logOut}>
        <LuLogOut /> Log Out
        </button>
        </>
      ): (
        <>
        <button className="text-left text-[18px] flex items-center gap-4" onClick={() => {navigate("/login");setShowSidebar(false);}}><LuLogIn /> Login</button>
        <button className="text-left text-[18px] flex items-center gap-4" onClick={() => {navigate("/register");setShowSidebar(false);}}><GoPersonAdd /> Register</button>
        </>
      )}
    </div>
  );
}
