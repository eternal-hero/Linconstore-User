import {
  Box,
  Rating,
  Typography,
  Checkbox,
  Slider,
} from "@mui/material";
import FilterHeader from "./FilterHeader";

const SideFilter = () => {
  const rates = [5, 4, 3, 2, 1, 0];
  return (
    <Box
      sx={{
        display: {
          xs: "none",
          md: "block",
          marginTop: 0,
          marginRight: 8,
          background: "#1fa75938",
          width: "20%",
          padding: "20px",
        },
      }}
    >
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 1,
        }}
      >
        <Typography color={"black"} fontWeight={"bold"}>
          Filters
        </Typography>
        <Typography>Clear All</Typography>
      </Box>
      <FilterHeader title="By Rating" />
      {rates.map((rate, index) => (
        <Box
          key={index}
          sx={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginBottom: 1,
          }}
        >
          <Checkbox sx={{ padding: 0 }} />
          <Rating
            name="read-only"
            value={rate}
            readOnly
            sx={{ fontSize: "20px" }}
          />
        </Box>
      ))}

      <FilterHeader title="By Pricing" />
      <Slider
        aria-label="Temperature"
        defaultValue={[0, 30]}
        color="secondary"
      />

      <Slider
        aria-label="time-indicator"
        size="small"
        defaultValue={[0, 50]}
        step={1}
        // onChange={(_, value) => setFilterPrice(value as number)}
        sx={{
          color: "#0ba659",
          height: 4,
          "& .MuiSlider-thumb": {
            width: 10,
            height: 10,
            transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:before": {
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            },
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0px 0px 0px 8px ${"rgb(0 0 0 / 16%)"}`,
            },
            "&.Mui-active": {
              width: 20,
              height: 20,
            },
          },
          "& .MuiSlider-rail": {
            opacity: 0.28,
          },
        }}
      />
    </Box>
  );
};

export default SideFilter;
