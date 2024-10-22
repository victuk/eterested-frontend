import { toast } from "react-toastify";
import DefaultLayout from "../components/layout/defaultLayout";
import { useEffect, useState } from "react";
import { EventInterface } from "../interfaces/responseInterfaces";
import { useParams } from "react-router-dom";
import { getEventById, registerForAnEvent } from "../apiCalls/apiSdk";
import { MdOutlineAccessTime } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import moment from "moment";
import { IoMdClose } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import { SpinLoaderTwo } from "../components/spinnerComponents";
import PaystackPop from "@paystack/inline-js";
import { customErrorHandler } from "../utils/customErrorHandler";

export default function ViewEventPage() {
  //   const navigate = useNavigate();

  const [ticketModalState, setTicketModalState] = useState("idle");

  const [showModal, setShowModal] = useState(false);

  const [eventDetails, setEventDetails] = useState<EventInterface>({});

  const [ticketDetails, setTicketDetails] = useState([]);

  const params = useParams();

  const [buyForMyself, setBuyForMyself] = useState(false);
  const [buyForOthers, setBuyForOthers] = useState(false);

  const [ticketTypeChoosen, setTicketTypeChoosen] = useState("");
  const [otherEmailInput, setOtherEmailInput] = useState("");
  const [otherEmails, setOtherEmails] = useState<string[]>([]);

  const addEmail = () => {
    const emailAlreadyAdded = otherEmails.find((e) => e == otherEmailInput);

    if (emailAlreadyAdded) {
      toast("This email is already in the list");
      return;
    }

    setOtherEmails(otherEmails.concat(otherEmailInput));

    setOtherEmailInput("");
  };

  const removeEmail = (email: string) => {
    const newEmailList = otherEmails.filter((e) => e != email);
    setOtherEmails(newEmailList);
  };

  const buyTicket = async () => {
    try {
      setTicketModalState("loading");

      const ticket: any = ticketDetails.find(
        (t: any) => t.ticketType == ticketTypeChoosen
      );

      const buyingFor = {
        ticketTypeId: ticket._id as string,
        emails: otherEmails,
      };

      const purchaseResponse = await registerForAnEvent(
        params.uid as string,
        buyForMyself,
        buyingFor,
        totalToPay
      );

      console.log(purchaseResponse.data.paymentDetails);

      if (purchaseResponse.data.paymentDetails != null) {
        toast("Make a payment");
        const popup = new PaystackPop();
        popup.resumeTransaction(
          purchaseResponse.data.paymentDetails.data.access_code
        );
        return;
      }

      toast(
        `Your ${
          purchaseResponse.data?.newTickets.length > 1 ? "tickets" : "ticket"
        } has been created successfully!`
      );

      setShowModal(false);

      // console.log("purchaseResponse", purchaseResponse.data.paymentDetails.data.access_code);
    } catch (error: any) {
      console.log("za error", error);
      toast(customErrorHandler(error));
    } finally {
      setTicketModalState("idle");
    }
  };

  const fetchEvent = async () => {
    try {
      const event = await getEventById(params!!.uid as string);
      setEventDetails(event.data.eventDetails);
      setTicketDetails(event.data.eventTicketTypes);
    } catch (error) {
      toast("An error has occurred while trying to get event Details");
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const [totalToPay, setTotalToPay] = useState(0);

  useEffect(() => {
    const costFor1Ticket = ticketTypeChoosen
      ? (ticketDetails as any[]).find(
          (t: any) => t?.ticketType == ticketTypeChoosen
        ).cost
      : 0;
    let totalNumberOfAtendee = 0;

    if (buyForMyself == true) {
      totalNumberOfAtendee = otherEmails.length + 1;
    } else {
      totalNumberOfAtendee = otherEmails.length;
    }

    setTotalToPay(costFor1Ticket * totalNumberOfAtendee);
  }, [ticketTypeChoosen, otherEmails, buyForMyself]);

  useEffect(() => {
    if(buyForOthers == false) {
        setOtherEmails([]);
    }
  }, [buyForOthers]);

  return (
    <DefaultLayout>
      <div className="bg-white h-full m-4">
        <div className="flex flex-col gap-4 m-4">
          <div className="flex items-center text-black font-bold text-[25px] mt-4">
            <div>{eventDetails.title}</div>
            {/* <div className="bg-[grey]/[0.2] rounded-full p-2 cursor-pointer">
              <FaRegHeart />
            </div> */}
          </div>
          {eventDetails.eventFlyer && (
            <img
              src={eventDetails.eventFlyer}
              className="w-full h-full md:h-[400px] rounded-xl"
            />
          )}
          <div className="flex items-center text-black/[0.5] text-[20px]">
            {eventDetails.description}
          </div>
          <div className="flex items-center gap-2 text-black/[0.5]">
            <MdOutlineAccessTime />
            <div>{moment(eventDetails.dateAndTime).format("LLLL")}</div>
          </div>
          <div className="flex items-center gap-2 text-black/[0.5]">
            <IoLocationOutline />
            <div>{eventDetails.venue}</div>
          </div>
        </div>
        <div className="mt-8 bg-[#133F40] w-[90%] md:w-[450px] mr-auto p-8 rounded-r-[40px] relative flex flex-col gap-4" id="tickets">
          <div className="w-fit absolute left-[50%] translate-x-[-50%] top-[-15px] bg-white text-[#133F40] font-bold text-[20px] rounded-[20px] px-4 border-2 border-[#133F40]">
            Tickets
          </div>
          {ticketDetails.map((ticket: any, index: number) => {
            return (
              <div
                className="rounded-[20px] bg-white text-black p-4 flex flex-col gap-2"
                key={index}
              >
                <small
                  style={{ fontFamily: "cursive" }}
                  className="px-4 py-1 w-fit border-2 border-[#DFBB67] text-[#DFBB67] font-bold rounded-[20px]"
                >
                  {(ticket.ticketType as string).toLocaleUpperCase().replace(/-/, " ")}
                </small>
                <div className="flex items-center gap-1">
                  <div
                    style={{ fontFamily: "cursive" }}
                    className="text-[20px] font-bold"
                  >
                    NGN{ticket.cost}{" "}
                    <span className="text-black/[0.5]">per person</span>
                  </div>
                </div>
                <div className="text-black/[0.8]">
                  {ticket.ticketDescription}
                </div>
                <div>
                    {ticket.totalTicketsBought} of {ticket.totalTicketsAvailable}
                </div>
                <button
                  className="bg-[#DFBB67] text-black font-bold py-2 rounded-[20px]"
                  onClick={() => {
                    setShowModal(true);
                    setTicketTypeChoosen(ticket.ticketType);
                  }}
                >
                  BUY
                </button>

                {/* Modal */}
                <div
                  className={`${
                    showModal ? "flex justify-center items-center" : "hidden"
                  } w-full h-screen fixed top-0 left-0 bg-[transparent] backdrop-blur-sm overflow-y-auto z-[200]`}
                >
                  <div className="flex flex-col bg-white p-8 m-4 border border-black/[0.2] rounded-2xl w-full md:w-[400px]">
                    <div className="flex justify-end mb-4">
                      <IoMdClose
                        className="h-[20px] w-[20px]"
                        onClick={() => {
                          setShowModal(false);
                        }}
                      />
                    </div>
                    <div className="text-center font-bold text-[20px] mb-8">
                      Who are you buying the "
                      {ticketTypeChoosen.toLocaleUpperCase().replace(/-/, " ")}"
                      ticket for?
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={buyForMyself}
                        onChange={() => {
                          setBuyForMyself(!buyForMyself);
                        }}
                      />{" "}
                      I am also buying for myself
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={buyForOthers}
                        onChange={() => {
                          setBuyForOthers(!buyForOthers);
                        }}
                      />{" "}
                      Buy for others
                    </div>
                    {buyForOthers && (
                      <div className="flex flex-col gap-4 mt-4">
                        <div>
                          <small className="text-black/[0.5]">
                            Recepient's Email
                          </small>
                          <div className="flex gap-4">
                            <input
                              value={otherEmailInput}
                              onChange={(e) => {
                                setOtherEmailInput(e.target.value);
                              }}
                              type="email"
                              placeholder="johndoe@gmail.com"
                              className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                            />
                            <button
                              onClick={addEmail}
                              className="border-black/[0.2] border-[1px] rounded-md px-4"
                            >
                              Add
                            </button>
                          </div>
                          <div className="pt-4 flex flex-col gap-2">
                            {otherEmails.map((email: string, index: number) => (
                              <div
                                className="flex justify-between items-center"
                                key={index}
                              >
                                <div>{email}</div>
                                <button
                                  onClick={() => {
                                    removeEmail(email);
                                  }}
                                >
                                  <MdOutlineDelete className="h-[20px] w-[20px]" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <button
                        className="bg-[#DFBB67] w-full text-black font-bold py-2 rounded-[20px] mt-4"
                        onClick={() => {
                          buyTicket();
                        }}
                      >
                        {ticketModalState == "loading" ? (
                          <SpinLoaderTwo />
                        ) : (ticketDetails as any[]).find(
                            (t: any) => t?.ticketType == ticketTypeChoosen
                          )?.cost == 0 ? (
                          "Get for Free"
                        ) : (
                          `Checkout (Pay ${totalToPay})`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Modal ends here */}
              </div>
            );
          })}
        </div>
      </div>
    </DefaultLayout>
  );
}
