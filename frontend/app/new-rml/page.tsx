import { Metadata } from "next";
import MainPage from "./main-page";

export const metadata: Metadata = {
  title: "LXS Application - Database Tool",
};

export default function Page() {
  return <MainPage />;
}
