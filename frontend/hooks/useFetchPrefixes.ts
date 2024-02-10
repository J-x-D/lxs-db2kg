import axios from "axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { useStore } from "store/store";
import { Prefix } from "types/Prefixes";

export default function useFetchPrefixes() {
  const { setAlert } = useStore();
  const url = "http://prefix.cc/context";

  const [loadingPrefixes, setLoadingPrefixes] = useState(false);
  const [error, setError] = useState("");
  const [prefixOptions, setPrefixOptions] = useState<Prefix[]>([]);

  async function fetchPrefixes() {
    try {
      setLoadingPrefixes(true);
      const response = await axios.get(url);
      const originalPrefixes: object = await response?.data["@context"];
      if (originalPrefixes && Object.keys(originalPrefixes).length > 0) {
        const transformedPrefixOptions: Prefix[] = Object.entries(
          originalPrefixes
        ).map(([prefix, url]: string[]) => ({
          prefix,
          url,
        })); // transform objects inside array to from key value pairs to objects with prefix and url properties
        setPrefixOptions(transformedPrefixOptions);
      }

      setLoadingPrefixes(false);
    } catch (error) {
      const err = error as AxiosError;
      console.log(error);
      setError(err.message);
      setLoadingPrefixes(false);
      setAlert({
        type: "error",
        message: `Error while fetching prefixes`,
        open: true,
      });
    }
  }

  return { prefixOptions, loadingPrefixes, error, fetchPrefixes };
}
