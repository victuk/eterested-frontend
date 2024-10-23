import { BsSearch } from "react-icons/bs";
import { MdMenu } from "react-icons/md";
import { toggleSidebar } from "../store/slices/createEventSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../store/store";
import { updateEventSearch } from "../store/slices/eventSearchSlice";

export function SearchAndMenuComponent() {

    // const [searchValue, setSeatchValue] = useState("");

    const searchValue = useSelector((state: RootState) => state.eventSearch.search);

    const dispatch = useDispatch();

    const setSeatchValue = (value: string) => {
      dispatch(updateEventSearch(value));
    }

    const navigate = useNavigate();

    const setShowSidebar = (value: boolean) => {
        dispatch(toggleSidebar(value));
    }


const searchAction = (e: any) => {
        if(e == "Enter") {
          navigate(`/search?search=${searchValue}`);
        }
    }

  return (
    <div className="flex px-4 py-4 bg-[#f3f3f3] items-center justify-between text-[#133F40] gap-4 md:gap-10">
        <div className="font-bold text-[20px] text-nowrap block md:hidden">e-Terest</div>
      <div className="flex items-center gap- border-[#133F40] border-2 rounded-[20px] px-4 w-full md:w-[60%]">
        <input className="bg-transparent w-full py-1" placeholder="Search an event" value={searchValue} onChange={(e) => {setSeatchValue(e.target.value)}} onKeyDown={(e) => {searchAction(e.key)}} />
        <button>
          <BsSearch />
        </button>
      </div>
      <div className="flex md:hidden">
        <div>
            
        </div>
        <MdMenu className="h-[25px] w-[25px] text-[#133F40]" onClick={() => {setShowSidebar(true)}} />
      </div>
    </div>
  );
}
