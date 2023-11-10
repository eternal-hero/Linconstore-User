import React, { useState } from 'react';
import { Collapse, Card, CardContent, Typography, IconButton, Box, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type CollapseItemProp = {
  title: string;
  content: string[];
  youtube?: React.ReactNode;
}

const CollapseItem: React.FC<CollapseItemProp> = ({ title, content, youtube }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleExpandClick = () => {
    setOpen(!open);
  };

  return (
    <Box my={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: "pointer" }} onClick={handleExpandClick}>
        <Typography variant="h6" fontWeight={500} component="div" fontSize={15}>
          {title}
        </Typography>
        <IconButton          
          sx={{
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform 0.3s',
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Box display={"flex"} flexDirection={isMobile ? "column" : "row"}>
          <CardContent sx={{width: "100%"}}>
            {
              content.map((item, index) => {
                return (
                  <Typography key={index} fontSize={14} fontWeight={item.split("TITLE:").length === 2 ? 700 : 500}>
                    {item.split("TITLE:").length === 2 ? item.split("TITLE:")[1] :item}
                  </Typography>
                )
              })
            }
          </CardContent>
          {
            youtube && (
              <CardContent sx={{width: "100%"}}>
                {youtube}
              </CardContent>
            )
          }
        </Box>
      </Collapse>
    </Box>
  );
};

export default CollapseItem;