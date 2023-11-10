import axios from "axios";
import { IRound } from "./Types";

export function numberWithCommas(x: number) {

  if (isNaN(x)) return;
  const newX = Number.isInteger(x) ? x : x.toFixed(2);
  return newX.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export const uploadImage = async (image: File | null) => {
  const data = new FormData();
  data.append("file", image as unknown as string);
  data.append("upload_preset", "linconstore");
  data.append("cloud_name", "linconstore-cloud")
  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/linconstore-cloud/image/upload",
      data,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    const newData = response.data;
    return newData.secure_url;
  } catch (e) {
    console.log(e);
  }
};
export const uploadImages = async (images: FileList[]) => {
  const updatedImages: File[] = [];
  for (const image of images) {
    const data = new FormData();
    data.append("file", image as unknown as string);
    data.append("cloud_name", "linconstore-cloud")
    data.append("upload_preset", "linconstore");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/linconstore-cloud/image/upload",
        data,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      const newData = response.data;
      updatedImages.push(newData.secure_url);
    } catch (e) {
      console.log(e);
    }
  }
  return updatedImages;
};
export const countryList: string[] = [
  "Australia",
  "Austria",
  "Belgium",
  "Bulgaria",
  "Canada",
  "Croatia",
  "Cyprus",
  "Czech",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Lithuania",
  "Luxembourg",
  "Mexico",
  "Netherland",
  "New Zealand",
  "Norway",
  "Poland",
  "Portugal",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom",
  "United States",
];

export const round = (N: number): any => {
  const fixed = N.toFixed(0);
  const length = fixed.toString().length;
  if (length === 1) return N;
  const numerHolder: IRound[] = [
    {
      number: 2,
      dec: 10,
    },
    {
      number: 3,
      dec: 100,
    },
    {
      number: 4,
      dec: 1000,
    },
    {
      number: 5,
      dec: 100000,
    },
    {
      number: 6,
      dec: 1000000,
    },
  ];
  const round: IRound = numerHolder.find((num) => num.number === length);
  const ceil = Math.ceil(N / round.dec) * round.dec;
  let str = ceil.toString().slice(0, -3);
  return parseInt(str) + "k";
};

export function capitalizeFirstLetter(string : string)  : string{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getHighestNumber = (number1 : number, number2: number) => {
  if(number1 > number2) return number1
  return number2
}

export const getLowestStock = (number: number[]) => {
  return Math.min(...number)
}

export const  formatNumber = (value : number) => {
  return value?.toFixed(1)
}

// concat if it is needed and country code exists
export const getLangPlusCountryCode = ({ code, country, isConcatNeeded }: { code: string, country?: string, isConcatNeeded?: boolean }, ch: string = '-') => {
  return (isConcatNeeded && country) ? `${code}${ch}${country}` : code
}