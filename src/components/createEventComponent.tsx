import {
  createAnEvent,
  TicketTypesForEvent,
  uploadFile,
} from "../apiCalls/apiSdk";
import { useNavigate } from "react-router-dom";
import { SpinLoaderTwo } from "../components/spinnerComponents";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { tagProperties, ticketTypes } from "../utils/tagProperties";
import { Tags, TicketDetailsInterface } from "../interfaces/responseInterfaces";
import { nanoid } from "nanoid";
import { toggleEventState } from "../store/slices/createEventSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getLGAs, getStates } from "../utils/getStateAndLGA";

export function CreateEventComponent() {
  const showModal = useSelector((state: RootState) => state.createEvent.value);
  const [modalTabValue, setModalTabValue] = useState("title-and-description");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const setShowModal = (value: boolean) => {
    dispatch(toggleEventState(value));
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateAndTime, setDateAndTime] = useState("");
  const [eventFlyer, setEventFlyer] = useState("");
  const [venue, setVenue] = useState("");

  const [tags, setTags] = useState<Tags[]>([]);
  const [cityOrLGA, setCityOrLGA] = useState("");
  const [state, setState] = useState("");
  const [_ticketTypesForEvent, _setTicketTypesForEvent] = useState<
    TicketTypesForEvent[]
  >([]);
  const [formState, setformState] = useState("idle");

  const uploadPicture = async (e: any) => {
    try {
      const response = await uploadFile(e.target.files[0]);
      console.log(response.data);
      setEventFlyer(response.data.data.secure_url);
    } catch (error) {
      console.log(error);
    }
  };

  const [ticketTypeName, setTicketTypeName] = useState("");
  const [ticketTypeSlug, setTicketTypeSlug] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketCost, setTicketCost] = useState("");
  const [totalTicketsAvailable, setTotalTicketsAvailable] = useState("");

  const [ticketTypesList, setTicketTypesList] = useState<
    TicketDetailsInterface[]
  >([]);

  const addEventTicketType = () => {

    if(!ticketTypeName || !ticketTypeSlug || !ticketDescription || !ticketCost || !totalTicketsAvailable) {
        toast("All fields are required");
        return;
    }

    const similarTicketExistsAlready = ticketTypesList.find(
      (t) => t.ticketType.slug == ticketTypeSlug
    );

    if (similarTicketExistsAlready) {
      toast("You can't add same type of ticket twice");
      return;
    }

    setTicketTypesList(
      ticketTypesList.concat({
        id: nanoid(),
        ticketType: {
          name: ticketTypeName,
          slug: ticketTypeSlug,
        },
        ticketDescription,
        ticketCost: parseFloat(ticketCost),
        totalTicketsAvailable: parseInt(totalTicketsAvailable),
      })
    );

    setTicketTypeName("");
    setTicketTypeSlug("");
    setTicketDescription("");
    setTicketCost("");
    setTotalTicketsAvailable("");
  };

  const changeTicketType = (slug: string) => {
    const ticketDetails = ticketTypes.find((t) => t.slug == slug);
    setTicketTypeName(ticketDetails!!.name);
    setTicketTypeSlug(ticketDetails!!.slug);
  };

  const createEventButton = async () => {
    try {
      setformState("loading");

      const tTypes = ticketTypesList.map((t: TicketDetailsInterface) => {
        return {
          ticketType: t.ticketType.slug,
          ticketDescription: t.ticketDescription,
          cost: t.ticketCost,
          totalTicketsAvailable: t.totalTicketsAvailable
        };
      });

      await createAnEvent(
        title,
        description,
        dateAndTime,
        eventFlyer,
        venue,
        tags.map((t) => t.slug as string),
        cityOrLGA,
        state,
        tTypes as TicketTypesForEvent[]
      );

      toast("Event created successfully");

      setShowModal(false);

      setModalTabValue("title-and-description");

      setTitle("");
      setDescription("");
      setDateAndTime("");
      setEventFlyer("");
      setVenue("");
      setTags([]);
      setCityOrLGA("");
      setState("");
      setTicketTypeName("");
      setTicketTypeSlug("");
      setTicketDescription("");
      setTicketCost("");
      setTicketTypesList([]);

      navigate("/");
    } catch (error) {
      toast("An error occurred while trying to create an event");
    } finally {
      setformState("idle");
    }
  };

  const removeEventTicket = (ticketId: string) => {
    const newTicket = ticketTypesList.filter(
      (ticket: TicketDetailsInterface) => ticket.id != ticketId
    );
    setTicketTypesList(newTicket);
  };

  const tabControl = (value: string) => {
    // if() {}
    setModalTabValue(value);
  };

  const toggleTag = (tagValue: string, slug: string) => {
    if (tags.find((tValue) => tValue.slug == slug)) {
      const updatedTag = tags.filter((tag) => tag.slug != slug);
      setTags(updatedTag);
    } else {
      const updatedTag = tags.concat({ name: tagValue, slug });
      setTags(updatedTag);
    }
  };

  const [lgas, setLgas] = useState<string[]>([]);

  const updateLocalGovernment = () => {
    const lgaResult = getLGAs(state);
    console.log(lgaResult);
    if(lgaResult != undefined) {

      setLgas(lgaResult);
    }

  }

  useEffect(() => {
    updateLocalGovernment();
  }, [state]);

  return (
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

        {modalTabValue == "title-and-description" && (
          <div className="flex flex-col gap-8">
            <div className="text-xl">Event Title and Description</div>
            <div>
              <small className="text-black/[0.5]">Title</small>
              <input
                className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                value={title}
                placeholder="Party"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>

            <div>
              <small className="text-black/[0.5]">Description</small>
              <textarea
                className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                placeholder="Party with John Doe"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                className="mt-4 py-2 px-4 text-[#133F40] rounded-lg"
                onClick={() => {
                  tabControl("date-flyer-venue");
                }}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {modalTabValue == "date-flyer-venue" && (
          <div className="flex flex-col gap-8">
            <div className="text-xl">Event Date, Flyer and Venue</div>
            <div>
              <small className="text-black/[0.5]">Event date and time</small>
              <input
                className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                value={dateAndTime}
                onChange={(e) => {
                  setDateAndTime(e.target.value);
                }}
                type="datetime-local"
              />
            </div>

            <div>
              <small className="text-black/[0.5]">Event flyer</small>
              <input
                className="w-full rounded-md px-4 border-black border-[1px] py-2 text-[#133F40]"
                //   value={eventFlyer}
                onChange={uploadPicture}
                type="file"
              />
            </div>

            <div>
              <small className="text-black/[0.5]">State</small>
              <select
                className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                }}
              >
                <option value="">Select</option>
                {getStates().map((state: string) => (<option value={state}>{state}</option>))}
              </select>
            </div>

            <div>
              <small className="text-black/[0.5]">City/LGA</small>
              <select
                className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                value={cityOrLGA}
                onChange={(e) => {
                  setCityOrLGA(e.target.value);
                }}
              >
                <option value="">Select</option>
                {lgas.length > 0 && lgas.map((s: string) => (<option value={s}>{s}</option>))}
              </select>
            </div>

            <div>
              <small className="text-black/[0.5]">Venue</small>
              <input
                className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                value={venue}
                onChange={(e) => {
                  setVenue(e.target.value);
                }}
                type="string"
              />
            </div>

            <div className="flex justify-between">
              <button
                className="mt-4 py-2 px-4 text-[#133F40] rounded-lg"
                onClick={() => {
                  tabControl("title-and-description");
                }}
              >
                <FaArrowLeft />
              </button>
              <button
                className="mt-4 py-2 px-4 text-[#133F40] rounded-lg"
                onClick={() => {
                  tabControl("tickettypes");
                }}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {modalTabValue == "tickettypes" && (
          <div className="flex flex-col gap-8">
            <div className="text-xl">Event Ticket Settings</div>
            <div>
              <small className="text-black/[0.5]">Ticket Types</small>
              <div className="flex flex-col gap-4 py-4">
                {ticketTypesList.map(
                  (eventTicket: TicketDetailsInterface, index: number) => {
                    return (
                      <div
                        className="bg-white text-black p-4 rounded-md border border-black/[0.2] flex flex-col gap-4" style={{boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}
                        key={index}
                      >
                        <div>
                          <button
                            className="flex justify-end mb-4"
                            onClick={() => {
                              removeEventTicket(eventTicket.id as string);
                            }}
                          >
                            <IoMdCloseCircleOutline className="h-[20px] w-[20px]" />
                          </button>
                        </div>

                        <small className="px-4  w-fit border-2 border-[#DFBB67] text-[#DFBB67] font-bold rounded-[20px]">{(eventTicket.ticketType.name as string).toLocaleUpperCase().replace(/-/, " ")}</small>
                        <div>{eventTicket.ticketDescription}</div>
                        <div>NGN{(eventTicket.ticketCost).toLocaleString()}</div>
                        <div>{eventTicket.totalTicketsAvailable} tickets available</div>
                      </div>
                    );
                  }
                )}
              </div>
              <div className="flex flex-col gap-4">
                <select
                  className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                  value={ticketTypeSlug}
                  onChange={(e) => {
                    changeTicketType(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  {ticketTypes.map((tType: Tags, index: number) => (
                    <option value={tType.slug} key={index}>
                      {tType.name}
                    </option>
                  ))}
                </select>
                <textarea
                  className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                  value={ticketDescription}
                  onChange={(e) => {
                    setTicketDescription(e.target.value);
                  }}
                  placeholder="Ticket Description"
                ></textarea>
                <input
                  className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                  type="number"
                  value={ticketCost}
                  onChange={(e) => {
                    setTicketCost(e.target.value);
                  }}
                  placeholder="Ticket Cost"
                />
                <input
                  type="number"
                  className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 text-[#133F40]"
                  placeholder="Total number of tickets to be sold"
                  value={totalTicketsAvailable}
                  onChange={(e) => {
                    setTotalTicketsAvailable(e.target.value);
                  }}
                />
                <button
                  onClick={addEventTicketType}
                  className="bg-[#133F40] text-white rounded-lg px-4 py-1"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                className="mt-4 py-2 px-4 text-[#133F40] rounded-lg"
                onClick={() => {
                  tabControl("date-flyer-venue");
                }}
              >
                <FaArrowLeft />
              </button>
              <button
                className="mt-4 py-2 px-4 text-[#133F40] rounded-lg"
                onClick={() => {
                  tabControl("tags");
                }}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {modalTabValue == "tags" && (
          <div>
            <div className="text-xl">Event Tags</div>
            <small className="text-black/[0.5]">Tags</small>
            <textarea
              placeholder="Tags"
              className="w-full rounded-md px-4 border-black/[0.2] border-[1px] py-2 bg-white text-[#133F40]"
              value={tags.map((tag: Tags) => tag.name).join(", ")}
              disabled
            ></textarea>

            <div className="flex gap-2 flex-wrap">
              {tagProperties.map((t: Tags, index: number) => {
                return (
                  <button
                    key={index}
                    className={`${
                      tags.find((ta) => ta.slug == t.slug)
                        ? "bg-[#122F40] text-white"
                        : "bg-[#133F40]/[0.2] text-black"
                    } px-2 py-1 rounded-lg`}
                    onClick={() => {
                      toggleTag(t.name as string, t.slug as string);
                    }}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between">
              <button
                className="mt-4 py-2 px-4 text-[#133F40] rounded-lg"
                onClick={() => {
                  tabControl("tickettypes");
                }}
              >
                <FaArrowLeft />
              </button>
              <button
                className="mt-4 py-2 px-4 bg-[#133F40] text-white rounded-lg"
                onClick={createEventButton}
              >
                {formState == "loading" ? <SpinLoaderTwo /> : "Create Event"}
              </button>
            </div>
          </div>
        )}

        {/* {modalTabValue == "state-lga" && (
            <div className="flex flex-col gap-8">
              
              <div className="flex justify-between items-center">
                <button
                  className="mt-4 py-2 px-4 text-[#133F40] rounded-lg"
                  onClick={() => {
                    tabControl("tags");
                  }}
                >
                  <FaArrowLeft />
                </button>
                
              </div>
            </div>
          )} */}
      </div>
    </div>
  );
}
