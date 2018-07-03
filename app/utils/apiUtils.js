// zen node returns inconsistent error messages, so we scan for all possible
// combinations to log descriptive errors to the console.
// So far all the possible error returns we've found are:
// err.message
// err.response
// err.response.data

// eslint-disable-next-line import/prefer-default-export
export const logApiError = (identifier, err = {}) => {
  if (err.message) {
    console.error(`[${identifier}]`, err)
  } else if (err.response && err.response.data) {
    console.error(`[${identifier}]`, err.response.data, err.response, err)
  } else if (err.response) {
    console.error(`[${identifier}]`, err.response, err)
  }
}
