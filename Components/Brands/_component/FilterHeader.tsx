import { Typography } from "@mui/material";

const FilterHeader = ({ title }) => {
  return (
    <Typography color={"black"} fontSize={12} sx={{ marginBottom: 1 }}>
      {title}
    </Typography>
  );
};

export default FilterHeader;
