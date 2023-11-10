import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FavoriteBorder,
  LocalShippingOutlined,
  PolicyOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface IDetails {
  shipping: string;
  care: string;
}
const SimpleAccordion: React.FC<IDetails> = ({ shipping, care }) => {
  const { t } = useTranslation();

  return (
    <div className="123">
      {care && care !== "nil" && (
        <Accordion
          sx={{
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={"icon-green"} />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Stack direction={"row"} spacing={2}>
              <InfoOutlined className={"icon-green"} />
              <Typography fontSize={14}> {t("product.accordion.care")}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{care}</Typography>
          </AccordionDetails>
        </Accordion>
      )}
      {shipping && shipping !== "nil" && (
        <Accordion
          sx={{
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={"icon-green"} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Stack direction={"row"} spacing={2}>
              <LocalShippingOutlined className={"icon-green"} />
              <Typography fontSize={14}>{t("product.accordion.shipping")}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{shipping}</Typography>
          </AccordionDetails>
        </Accordion>
      )}
      
    </div>
  );
};
export default SimpleAccordion;
