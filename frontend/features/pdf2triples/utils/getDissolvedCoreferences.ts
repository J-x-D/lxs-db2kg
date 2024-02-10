import axios, { AxiosError, AxiosResponse } from "axios";

type APIError = {
  error: string;
  response?: undefined;
};

type APISuccess = {
  error?: undefined;
  response: string;
};

type DissolvedCoreferencesResponse = APISuccess | APIError;

export default async function getDissolvedCoreferences(
  text: string,
): Promise<DissolvedCoreferencesResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) return { error: "Backend URL not found" };

  try {
    const response: AxiosResponse<APISuccess> = await axios.post(
      backendUrl + "/solve_coreferences",
      {
        text,
      },
    );

    const capitalizeAfterPeriod = (inputString: string) => {
      return inputString.replace(
        /(?:^|[.!?]\s+)([a-z])/g,
        function (match, letter) {
          return match.toUpperCase();
        },
      );
    };

    return { response: capitalizeAfterPeriod(response.data.response) };
  } catch (err) {
    const axiosError = err as AxiosError<APIError>;
    const { response } = axiosError;

    if (response?.data.error) return { error: response.data.error };
    if (axiosError?.code === "ERR_NETWORK")
      return {
        error:
          "Network error. Make sure the backend is running and you have an internet connection.",
      };
    if (axiosError?.message) return { error: axiosError.message };

    return { error: "Unknown error" };
  }
}
