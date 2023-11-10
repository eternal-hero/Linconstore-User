import { useEffect, useState } from "react";
import { handleRateChange } from "../Helpers/Exchange";

export const useCurrency = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [excangeRate, setExchangeRate] = useState<Record<string, number>>(null);

  const loadExchangeRate = async () => {
    const poundsResponse: number = await handleRateChange("Pounds");
    const euroResponse: number = await handleRateChange("EUR");
    const usdResponse: number = await handleRateChange("USD");
    const audResponse: number = await handleRateChange("AUD");
    const bgnResponse: number = await handleRateChange("BGN");
    const cadResponse: number = await handleRateChange("CAD");
    const hrkResponse: number = await handleRateChange("HRK");
    const czkResponse: number = await handleRateChange("CZK");
    const dkkResponse: number = await handleRateChange("DKK");
    const hufResponse: number = await handleRateChange("HUF");
    const mzdResponse: number = await handleRateChange("MZD");
    const nokResponse: number = await handleRateChange("NOK");
    const plnResponse: number = await handleRateChange("PLN");
    const sekResponse: number = await handleRateChange("SEK");
    const chfResponse: number = await handleRateChange("CHF");
    const mxnResponse: number = await handleRateChange("MXN");
    const exchangeRate: Record<string, number> = {
      "USD": usdResponse,
      "Pounds": poundsResponse,
      "EUR": euroResponse,
      "AUD": audResponse,
      "BGN": bgnResponse,
      "CAD": cadResponse,
      "HRK": hrkResponse,
      "CZK": czkResponse,
      "DKK": dkkResponse,
      "HUF": hufResponse,
      "MXN": mxnResponse,
      "MZD": mzdResponse,
      "NOK": nokResponse,
      "PLN": plnResponse,
      "SEK": sekResponse,
      "CHF": chfResponse
    };

    // contextApi.handleRateChange(exchangeRate);
    setExchangeRate(exchangeRate);

    localStorage.setItem("exchange", JSON.stringify(exchangeRate));
  };

  const calculatedRate = (currency: string) => {
    if (!excangeRate) {
      return 1;
    }
    return excangeRate[`${currency}`];
  };

  useEffect(() => {
    const exchangeRateString = localStorage.getItem("exchange");
    setIsLoading(true);
    if (exchangeRateString) {
      setExchangeRate(JSON.parse(exchangeRateString));
    } else {
      loadExchangeRate();
    }
  }, []);

  return calculatedRate;
};
