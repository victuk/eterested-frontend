export function customErrorHandler (error: any) {
    return error.error.response.data.message || error.error.response.data.errorMessage ? (
        error.error.response.data.message ? error.error.response.data.message : error.error.response.data.errorMessage
      ) : "An error occurred while trying to purchase this ticket"
}