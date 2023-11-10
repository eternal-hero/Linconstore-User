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
} from "@mui/icons-material";
import { Stack } from "@mui/material";
interface IFAQ {
  question: string;
  answer: string;
}
const FAQAccordion: React.FC<IFAQ> = ({ question, answer }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {question}
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{answer}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default FAQAccordion;
