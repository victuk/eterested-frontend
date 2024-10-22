import { useEffect, useState } from "react";
import { myTickets } from "../apiCalls/apiSdk";
import { customErrorHandler } from "../utils/customErrorHandler";
import { toast } from "react-toastify";
import { PaginatedReponseInterface } from "../interfaces/responseInterfaces";
import moment from "moment";
import { MdOutlineAccessTime } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

export function MyTicketsComponent() {
  const [tickets, setTickets] = useState<PaginatedReponseInterface>({
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

  const [userId, setUserId] = useState("");

  const fetchEvents = async (page: number = 1, limit: number = 20) => {
    try {
      const events = await myTickets(page, limit);
      console.log("E-props", events.data);
      setTickets(events.data?.myTickets);
      setUserId(events.data.myId);
    } catch (error) {
      toast(customErrorHandler(error));
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {tickets.docs?.length == 0 ? (
        <div>No tickets currently</div>
      ) : (
        tickets.docs.map((t: any, index: number) => {
          return (
            <div className="bg-white flex justify-between gap-4 items-center p-4 mx-2" key={index}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-black font-bold text-[25px] cursor-pointer">{t.eventId.title}</div>
                <small style={{ fontFamily: "cursive" }}
                  className="px-4 py-1 w-fit border-2 border-[#DFBB67] text-[#DFBB67] font-bold rounded-[20px]">{(t.ticketTypeId.ticketType as string).toLocaleUpperCase()}</small>
                  <div className={`text-nowrap block md:hidden ${t.ticketStatus == "pending-payment" && "text-[#DFBB67]"} ${t.ticketStatus == "paid" && "text-green-400"} ${t.ticketStatus == "payment-failed" && "text-red-700"}`}>
                {(t.ticketStatus as string).replace(/-/, " ").toLocaleUpperCase()}
              </div>
              <div className="items-center text-black/[0.5]">
                Ticket bought by {t.buyerId._id == userId ? "you" : (t.buyerId.role == "user" ? `${t.buyerId.firstName} ${t.buyerId.lastName} for you` : `${t.buyerId.organizationName} for you`)}
              </div>
                <div className="flex gap-2 items-center text-black/[0.5]">
                  <MdOutlineAccessTime />{" "}
                  {moment(t.eventId.dateAndTime).format("LLLL")}
                </div>
                <div className="flex gap-2 items-center text-black/[0.5]">
                  <IoLocationOutline /> {t.eventId.venue}
                </div>
              </div>
              <div className={`text-nowrap hidden md:block ${t.ticketStatus == "pending-payment" && "text-[#DFBB67]"} ${t.ticketStatus == "paid" && "text-green-400"} ${t.ticketStatus == "payment-failed" && "text-red-700"}`}>
                {(t.ticketStatus as string).replace(/-/, " ").toLocaleUpperCase()}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
