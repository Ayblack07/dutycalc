import type { Metadata } from "next";
import ExchangeRateClient from "./ExchangeRateClient";

export const metadata: Metadata = {
  title: "Exchange Rates – DutyCalc Pro",
  description:
    "View the latest Nigeria Customs exchange rates updated from the official portal. Stay informed for accurate duty calculations.",
};

export default function ExchangeRatePage() {
  return <ExchangeRateClient />;
}