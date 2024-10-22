import axios from "axios";

interface ResponseInterface {
    status: number,
    data: any
}

function createUrl(url: string) {
    return import.meta.env.VITE_BASE_URL + url;
}

function getAuthToken() {
    return "Bearer " + sessionStorage.getItem("authToken");
}


function createResponseObject(hasError: boolean, response: ResponseInterface | null, error: any) {
    if(hasError == false) {
        console.log("Response data::::", response?.data);
        return {
            hasError,
            error: null,
            data: response?.data,
            status: response?.status
        };
    } else {
        console.log("Error::::", error);
        throw ({
            hasError,
            error: error,
            data: null,
            status: response?.status
        });
    }
}

interface Register {
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    tags?: string[],
    cityOrLGA: string,
    state: string,
    role: string,
    password: string,
    organizationName?: string,
}

async function register(register: Register) {

    try {
        const response = await axios.post(createUrl("v1/auth/register"), register);


        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function verifyEmail(verificationId: string, otp: string) {
    try {
        
        const response = await axios.post(createUrl("v1/auth/verify-email"), {
            verificationId, otp
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function login(emailOrUsername: string, password: string) {
    try {
        
        const response = await axios.post(createUrl("v1/auth/login"), {
            emailOrUsername, password
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function getEvents(page: number = 1, limit: number = 20) {
    try {
        
        const response = await axios.get(createUrl(`v1/user/events/${page}/${limit}`));

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function getEventById(eventId: string) {
    try {
        
        const response = await axios.get(createUrl(`v1/user/event/${eventId}`));

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}


async function searchForAnEvent(searchWord: string, page: number = 1, limit: number = 10) {
    try {
        
        const response = await axios.post(createUrl(`v1/user/search-an-event/${page}/${limit}`), {
            searchWord
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function searchForAnOrganizer(searchWord: string, page: number = 1, limit: number = 10) {
    try {
        
        const response = await axios.post(createUrl(`v1/user/search-an-organizer/${page}/${limit}`), {
            searchWord
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}


async function getEventsWhenLoggedIn(page: number = 1, limit: number = 20) {
    try {
        
        const response = await axios.get(createUrl(`v1/user/events-when-loggedin/${page}/${limit}`), {
            headers: {
                Authorization: getAuthToken()
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

export interface TicketTypesForEvent {
    ticketType: "regular" | "vip" | "vvip" | "table-for-2" | "table-for-10";
    ticketDescription: string;
    cost: number;
    totalTicketsAvailable: number;
}

async function createAnEvent(
    title: string,
    description: string,
    dateAndTime: string,
    eventFlyer: string,
    venue: string,
    tags: string[],
    cityOrLGA: string,
    state: string,
    ticketTypesForEvent: TicketTypesForEvent[],
) {
    try {

        console.log("ticketTypesForEvent", ticketTypesForEvent);
        
        const response = await axios.post(createUrl(`v1/user/create-event`), {
            title,
            description,
            dateAndTime,
            eventFlyer,
            venue,
            tags,
            cityOrLGA,
            state,
            ticketTypesForEvent
        }, {
            headers: {
                Authorization: getAuthToken()
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

interface BuyingFor {
    ticketTypeId: string;
    emails: string[]
}

async function registerForAnEvent(eventId: string, buyingForMyself: boolean, buyingFor: BuyingFor, totalAmountToPay: number) {
    try {
       
        const response = await axios.post(createUrl(`v1/user/attend-event`), {
            eventId,
            buyingForMyself,
            buyingFor,
            totalAmountToPay
        }, {
            headers: {
                Authorization: getAuthToken()
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function myProfile() {
    try {
       
        const response = await axios.get(createUrl(`v1/user/profile`), {
            headers: {
                Authorization: getAuthToken()
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function myEvents(page: number = 1, limit: number = 20) {
    try {
       
        const response = await axios.get(createUrl(`v1/user/my-events/${page}/${limit}`), {
            headers: {
                Authorization: getAuthToken()
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function myEventById(myEventId: string) {
    try {
       
        const response = await axios.get(createUrl(`v1/user/my-event/${myEventId}`), {
            headers: {
                Authorization: getAuthToken()
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function editMyEventById(
    myEventId: string,
    title: string,
    description: string,
    dateAndTime: string,
    eventFlyer: string,
    venue: string,
    tags: string[],
    cityOrLGA: string,
    state: string,
    country: string
) {
    try {
       
        const response = await axios.put(createUrl(`v1/user/my-event/${myEventId}`), {
            title,
            description,
            dateAndTime,
            eventFlyer,
            venue,
            tags,
            cityOrLGA,
            state,
            country
        }, {
            headers: {
                Authorization: getAuthToken()
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function myTickets(page: number = 1, limit: number = 20) {
    try {
       
        const response = await axios.get(createUrl(`v1/user/my-tickets/${page}/${limit}`), {
            headers: {
                Authorization: getAuthToken()
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function uploadFile(file: any) {
    try {

        const formData = new FormData();

        formData.append("file", file);
       
        const response = await axios.post(createUrl(`v1/user/upload-file`), formData, {
            headers: {
                Authorization: getAuthToken(),
                "Content-Type": "multipart/form-data"
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

async function uploadFiles(files: any) {
    try {

        const formData = new FormData();

        formData.append("files", files);
       
        const response = await axios.post(createUrl(`v1/user/upload-files`), formData, {
            headers: {
                Authorization: getAuthToken(),
                "Content-Type": "multipart/form-data"
            }
        });

        return createResponseObject(false, response, null);

    } catch (error) {
        return createResponseObject(true, null, error);
    }
}

export {
    register,
    verifyEmail,
    login,
    getEvents,
    getEventById,
    createAnEvent,
    searchForAnEvent,
    searchForAnOrganizer,
    getEventsWhenLoggedIn,
    registerForAnEvent,
    myProfile,
    myEvents,
    myEventById,
    editMyEventById,
    myTickets,
    uploadFile,
    uploadFiles,
    getAuthToken
}