import { useEffect, useState } from "react";
import {
  EventInterface,
  PaginatedReponseInterface,
} from "../interfaces/responseInterfaces";
import { myEvents } from "../apiCalls/apiSdk";
import moment from "moment";
import { MdOutlineAccessTime } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdSearchOff } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toggleEventState } from "../store/slices/createEventSlice";
import { customErrorHandler } from "../utils/customErrorHandler";
import { toast } from "react-toastify";

export function MyEventComponent() {

    const [events, setEvents] = useState<PaginatedReponseInterface>({
        docs: [],
        totalDocs: 0,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      });
    
      const dispatch = useDispatch();
    
      const setShowModal = (value: boolean) => {
        dispatch(toggleEventState(value));
      };
    
      const fetchEvents = async (page: number = 1, limit: number = 20) => {
        try {
          const events = await myEvents(page, limit);
          console.log("E-props", events.data);
          setEvents(events.data?.myEvents);
        } catch (error) {
          toast(customErrorHandler(error));
        }
      };
    
      useEffect(() => {
        fetchEvents();
      }, []);
    
      const navigate = useNavigate();

    return (
        <div className="p-2 flex flex-col gap-8">
      {events!!.docs.length == 0 ? (
        <div className="h-full w-full flex justify-center items-center bg-white">
            <div className="flex flex-col gap-4 p-10">
                <MdSearchOff  className="mx-auto h-[60px] w-[60px]"/>
                <div className="text-center">You have not created an event before</div>
                <button className="bg-[#133F40] text-white w-fit rounded-2xl px-4 py-2 mx-[auto]" onClick={() => {setShowModal(true)}}>Create event</button>
            </div>
        </div>
      ) : (events!!.docs.map((event: EventInterface, index: number) => {
        return (
          <div className="bg-white p-10 flex justify-between gap-4 items-center" key={index}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center text-black font-bold text-[25px] cursor-pointer" onClick={() => {navigate(`/event/${event._id}`)}}>
                {event.title}
              </div>
              {event.eventFlyer && (
                <img src={event.eventFlyer} className="w-full h-full md:h-[400px] rounded-xl" />
              )}
              <div className="flex items-center text-black/[0.5] text-[20px]">
                {event.description}
              </div>
              <div className="flex items-center gap-2 text-black/[0.5]">
                <MdOutlineAccessTime />
                <div>{moment(event.dateAndTime).format("LLLL")}</div>
              </div>
              <div className="flex items-center gap-2 text-black/[0.5]">
                <IoLocationOutline />
                <div>{event.venue}</div>
              </div>
            </div>
          </div>
        );
      }))}
    </div>
    );
}