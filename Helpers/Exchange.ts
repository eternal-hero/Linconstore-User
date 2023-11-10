import axios from "axios";
import { baseUrl } from "../Helpers/baseUrl";
// export const key = "c80ae48d-1edf-45fd-8914-f50f0567b7d9";
import ContextApi from "../Store/context/ContextApi";
import { useContext } from "react";
export const ExchangeCurrency: { value: string; label: string; symbol: string }[] = [
  { value: "EUR", label: "eur", symbol: "€" },
  { value: "AUD", label: "aud", symbol: "$" },
  { value: "BGN", label: "bgn", symbol: "лв" },
  { value: "CAD", label: "cad", symbol: "$" },
  { value: "HRK", label: "hrk", symbol: "kn" },
  { value: "CZK", label: "czk", symbol: "Kč" },
  { value: "DKK", label: "dkk", symbol: "kr" },
  { value: "HUF", label: "huf", symbol: "Ft" },
  { value: "NOK", label: "nok", symbol: "kr" },
  { value: "PLN", label: "pln", symbol: "zł" },
  { value: "NZD", label: "nzd", symbol: "$" },
  { value: "MXN", label: "mxn", symbol: "$" },
  { value: "Pounds", label: "gbp", symbol: "£" },
  { value: "SEK", label: "sek", symbol: "kr" },
  { value: "CHF", label: "chf", symbol: "Fr" },
  { value: "USD", label: "usd", symbol: "$" },
];

export const countryCurrency = [
  { abb: "AU", country: "Australia", currency: "AUD", symbol: "$" },
  { abb: "AT", country: "Austria", currency: "EUR", symbol: "€" },
  { abb: "BE", country: "Belgium", currency: "EUR", symbol: "€" },
  { abb: "BG", country: "Bulgaria", currency: "BGN", symbol: "лв" },
  { abb: "CA", country: "Canada", currency: "CAD", symbol: "$" },
  { abb: "HR", country: "Croatia", currency: "HRK", symbol: "kn" },
  { abb: "CY", country: "Cyprus", currency: "EUR", symbol: "€" },
  { abb: "CZ", country: "Czech", currency: "CZK", symbol: "Kč" },
  { abb: "DK", country: "Denmark", currency: "DKK", symbol: "kr" },
  { abb: "EE", country: "Estonia", currency: "EUR", symbol: "€" },
  { abb: "FI", country: "Finland", currency: "EUR", symbol: "€" },
  { abb: "FR", country: "France", currency: "EUR", symbol: "€" },
  { abb: "DE", country: "Germany", currency: "EUR", symbol: "€" },
  { abb: "GR", country: "Greece", currency: "EUR", symbol: "€" },
  { abb: "HU", country: "Hungary", currency: "HUF", symbol: "Ft" },
  { abb: "IE", country: "Ireland", currency: "EUR", symbol: "€" },
  { abb: "IT", country: "Italy", currency: "EUR", symbol: "€" },
  { abb: "LT", country: "Lithuania", currency: "EUR", symbol: "€" },
  { abb: "LU", country: "Luxembourg", currency: "EUR", symbol: "€" },
  { abb: "MX", country: "Mexico", currency: "MXN", symbol: "$" },
  { abb: "NL", country: "Netherlands", currency: "EUR", symbol: "€" },
  { abb: "NZ", country: "New Zealand", currency: "NZD", symbol: "$" },
  { abb: "NO", country: "Norway", currency: "NOK", symbol: "kr" },
  { abb: "PL", country: "Poland", currency: "PLN", symbol: "zł" },
  { abb: "PT", country: "Portugal", currency: "EUR", symbol: "€" },
  { abb: "ES", country: "Spain", currency: "EUR", symbol: "€" },
  { abb: "SE", country: "Sweden", currency: "SEK", symbol: "kr" },
  { abb: "CH", country: "Switzerland", currency: "CHF", symbol: "Fr" },
  { abb: "GB", country: "United Kingdom", currency: "Pounds", symbol: "£" },
  { abb: "US", country: "United States", currency: "USD", symbol: "$" },
]
// const config = useContext(ContextApi).config;
export const handleRateCountryChange = async (country: string): Promise<any> => {
  const countryItem: any = countryCurrency.find(
    (rate) => rate.country === country || rate.abb === country
  );
  
  const code = countryItem ? countryItem.abb : "GB";
  const currency = countryItem ? countryItem.currency : "Pounds";
  const symbol = countryItem ? countryItem.symbol : "£";
  const rateChange: { value: string; label: string } = ExchangeCurrency.find(
    (rate) => rate.value === currency
  );
  const label = rateChange ? rateChange.label : "gbp";
  const name = rateChange ? rateChange.value : "GBP";
  if (label === "usd") return { rate: 1, symbol: "$" };
  const response = await axios.patch(
    `${baseUrl}/rate/${name}`,
    {}
  );
  const data = response.data.rate;

  return { rate: data, symbol: symbol, label: label, code: code };
};

export const handleRateChange = async (value: string): Promise<number> => {
  const rateChange: { value: string; label: string } = ExchangeCurrency.find(
    (rate) => rate.value === value || rate.label === value
  );

  const label = rateChange ? rateChange.label : "gbp";
  const name = rateChange ? rateChange.value : "GBP";

  if (label === "usd") return 1;
  const response = await axios.patch(
    `${baseUrl}/rate/${name}`,
    {}
  );
  const data = response.data.rate;
  return data;
};

export const getCurrencySymbol = (value: string) => {
  const rateChange: { value: string; label: string; symbol: string } = ExchangeCurrency.find(
    (rate) => rate.value === value || rate.label === value 
  );
  const symbol = rateChange?.symbol;
  return symbol;
}

export const getUserCurrencySymbol = async (userString: any) => {
  let country = ""
  if (userString) {
    const userInfo = JSON.parse(userString);
    if(userInfo.currency){
      const response: number = await handleRateChange(userInfo.currency);
      const rateChange: { value: string; label: string; symbol: string } = ExchangeCurrency.find(
        (rate) => rate.value === userInfo.currency || rate.label === userInfo.currency
      );
      return { rate: response, symbol: rateChange.symbol, label: userInfo.currency }
    }else{
      if (userInfo.country) {
        country = userInfo.country
      }
    }
  } else {
    country = await fetchIpAddress();
  }
  const rateRes: any = await handleRateCountryChange(country);
  return rateRes
}

async function fetchIpAddress() {
  if(localStorage.getItem("userIpCountry")) {
    return localStorage.getItem("userIpCountry");
  } 
  else {
    const response = await fetch('https://ipapi.co/json/');
    const data: any = await response.json();
    if (data) {
      const res: any = await fetch(`https://ipinfo.io/${data.ip}?token=6c18281e43a4a1`);
      const locData: any = await res.json();
      localStorage.setItem("userIpCountry", locData.country)
      return locData?.country;
    }
  }
}