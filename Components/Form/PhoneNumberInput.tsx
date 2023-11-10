import * as React from "react";
import { Controller } from "react-hook-form";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { FormHelperText } from "@mui/material";

interface IPhoneNumberProps {
  label: string;
  name: string;
  error?: string;
  [x: string]: any;
  isActive?: string;
}

export default function PhoneNumberInput(props: IPhoneNumberProps) {
  const [isActive, setIsActive] = React.useState(props.isActive || null);
  return (
    <div className="phoneCustomInput">
      <label
        className={isActive ? "inputLabelActive" : ""}
        htmlFor="phoneInput"
      >
        {props.label}
      </label>
      <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => (
          <PhoneInput
            style={{ border: "0px", marginTop: 3 }}
            {...field}
            name={props.name}
            className={"phoneReg"}
            id="phoneInput"
            onChange={(value) => {
              if (value == undefined) {
                return setIsActive(null);
              }
              setIsActive(value);
              field.onChange(value);
            }}
          />
        )}
      />
      {props.error && (
        <FormHelperText sx={{ color: "#d32f2f" }}>
          {" "}
          {props.error}
        </FormHelperText>
      )}
    </div>
  );
}
