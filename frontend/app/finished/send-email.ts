import { FormData, Response } from "./auto-email-send";

export function sendEmail(data: FormData): Promise<Response> {
  const apiEndpoint = "/api/email";

  return fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.error) {
        throw response.error;
      }
      return {
        success: true,
      };
    })
    .catch((err) => {
      console.log(err, typeof err);
      return {
        success: false,
        error: err,
      };
    });
}
