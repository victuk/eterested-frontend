import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  EventInterface,
  PaginatedReponseInterface,
} from "../interfaces/responseInterfaces";
import { toast } from "react-toastify";
import { customErrorHandler } from "../utils/customErrorHandler";
import { searchForAnEvent, searchForAnOrganizer } from "../apiCalls/apiSdk";
import DefaultLayout from "../components/layout/defaultLayout";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineAccessTime, MdSearchOff } from "react-icons/md";
import moment from "moment";

export default function SearchResultPage() {
  const [tabValue, setTabValue] = useState("events");

  const navigate = useNavigate();

  const [eventsSearchResult, setEventsSearchResult] =
    useState<PaginatedReponseInterface>({
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

  const [organizationsSearchResult, setOrganizationsSearchResult] =
    useState<PaginatedReponseInterface>({
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

  const [searchParams, _setSearchParams] = useSearchParams();

  const searchForResults = async () => {
    try {
      const eveResult = await searchForAnEvent(
        searchParams?.get("search") as string
      );
      const orgResult = await searchForAnOrganizer(
        searchParams?.get("search") as string
      );

      console.log("eveResult", eveResult);
      console.log("orgResult", orgResult);

      setEventsSearchResult(eveResult.data.eventsResult);
      setOrganizationsSearchResult(orgResult.data.organizers);
    } catch (error) {
      toast(customErrorHandler(error));
    }
  };

  useEffect(() => {
    searchForResults();
  }, [searchParams?.get("search") as string]);

  return (
    <DefaultLayout>
      <div>
        <div className="flex">
          <button
            className={`w-full py-2 bg-white ${
              tabValue == "events" ? "border-b-2 border-black font-bold" : ""
            }`}
            onClick={() => {
              setTabValue("events");
            }}
          >
            Events
          </button>
          <button
            className={`w-full py-2 bg-white ${
              tabValue == "organizations"
                ? "border-b-2 border-black font-bold"
                : ""
            }`}
            onClick={() => {
              setTabValue("organizations");
            }}
          >
            Organizations
          </button>
        </div>

        <div className="mt-2">
          {tabValue == "events" && (
            <div>
              <div className="font-bold text-[25px] py-4">
                Showing event results for "
                {searchParams?.get("search") as string}"
              </div>
              <div className="flex flex-col gap-4">
                {eventsSearchResult!!.docs.length == 0 ? (
                  <div className="h-full w-full flex justify-center items-center bg-white">
                    <div className="flex flex-col gap-4 p-10">
                      <MdSearchOff className="mx-auto h-[60px] w-[60px]" />
                      <div className="text-center">No events found</div>
                    </div>
                  </div>
                ) : (
                  eventsSearchResult!!.docs.map(
                    (event: EventInterface, index: number) => {
                      return (
                        <div
                          className="bg-white p-10 flex justify-between gap-4 items-center"
                          key={index}
                        >
                          <div className="flex flex-col gap-4">
                            <div
                              className="flex items-center text-black font-bold text-[25px] cursor-pointer"
                              onClick={() => {
                                navigate(`/event/${event._id}`);
                              }}
                            >
                              {event.title}
                            </div>
                            {event.eventFlyer && (
                              <img
                                src={event.eventFlyer}
                                className="w-full h-full md:h-[400px] rounded-xl"
                              />
                            )}
                            <div className="flex items-center text-black/[0.5] text-[20px]">
                              {event.description}
                            </div>
                            <div className="flex items-center gap-2 text-black/[0.5]">
                              <MdOutlineAccessTime />
                              <div>
                                {moment(event.dateAndTime).format("LLLL")}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-black/[0.5]">
                              <IoLocationOutline />
                              <div>{event.venue}</div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </div>
          )}

          {tabValue == "organizations" && (
            <div>
              <div className="font-bold text-[25px] py-4">
                Showing organizations results for "
                {searchParams?.get("search") as string}"
              </div>
              <div>
              {organizationsSearchResult!!.docs.length == 0 ? (
                  <div className="h-full w-full flex justify-center items-center bg-white">
                    <div className="flex flex-col gap-4 p-10">
                      <MdSearchOff className="mx-auto h-[60px] w-[60px]" />
                      <div className="text-center">No events found</div>
                    </div>
                  </div>
                ) : (
                    organizationsSearchResult!!.docs.map(
                    (event: any, index: number) => {
                      return (
                        <div
                          className="bg-white p-10 flex gap-4 items-center"
                          key={index}
                        >
                            <div>
                                <img src={event.profilePic == "default" ? "/avatar.png" : event.profilePic} className="h-[100px] w-[100px] md:h-[250px] md:w-[250px] rounded-[20px] mx-auto" />
                            </div>
                          <div className="flex flex-col gap-4">
                            <div
                              className="flex items-center text-black font-bold text-[25px] cursor-pointer"
                              onClick={() => {
                                navigate(`/event/${event._id}`);
                              }}
                            >
                              {event.organizationName}
                            </div>
                            {/* {event.eventFlyer && (
                              <img
                                src={event.eventFlyer}
                                className="w-full h-full md:h-[400px] rounded-xl"
                              />
                            )} */}
                            <div className="flex items-center gap-2 text-black/[0.5] text-[20px]">
                              Username: {event.username}
                            </div>
                            <div className="flex items-center gap-2 text-black/[0.5] text-[20px]">
                                Email: {event.email}
                            </div>
                            <div className="flex items-center text-black/[0.5] text-[20px]">
                              State: {(event.state as string).toLocaleUpperCase()}
                            </div>
                            <div className="flex items-center gap-2 text-black/[0.5] text-[20px]">
                                Phone Number: {event.phoneNmber ? event.phoneNmber : "--"}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
