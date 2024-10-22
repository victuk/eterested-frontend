import { getAuthToken } from "../apiCalls/apiSdk";

export function checIfLoggedIn () {
    const authValue = getAuthToken();

    console.log(authValue == "Bearer null");

    return !(authValue == "Bearer null") ? true : false;
}