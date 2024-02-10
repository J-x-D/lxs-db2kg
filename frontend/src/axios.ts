import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

// call setupCache only once an then export it
export const cache = setupCache(Axios);
