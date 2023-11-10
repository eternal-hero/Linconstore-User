import React from "react";
import TextField from "@mui/material/TextField";
type data = {
  message: string;
};
interface Input {
  id: string;
  size: "small" | "medium";
  field: [];
  data: data;
  type: string;
  multiple: boolean;
  required: boolean;
  variant: boolean;
  disabled: boolean;
}
const TextInput: React.JSXElementConstructor<any> = ({
  disabled,
  id,
  field,
  type,
  variant,
  size,
  data,
  multiple,
  required,
}: Input) => {
  return (
    <>
      <TextField
        margin="normal"
        required={!required}
        fullWidth
        multiline={multiple}
        rows={multiple ? 5 : 0}
        variant={variant ? "outlined" : "standard"}
        error={!!data}
        helperText={data?.message}
        {...field}
        InputLabelProps={{ shrink: true }}
        id={id}
        type={type ? type : "text"}
        label={id}
        name={id}
        disabled={disabled}
        autoComplete={id}
        size={size}
      />
    </>
  );
};

export default TextInput;
