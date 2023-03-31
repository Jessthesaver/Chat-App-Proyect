import React from "react";
import { Card, CardContent } from "@mui/material";
import cardStyles from "./cardStyles";

const BasicCard = ({ header, content }) => {
  return (
    <Card sx={cardStyles}>
      {header}
      <CardContent
        sx={{
          padding: 0,
          margin: 0,
        }}>
        {content}
      </CardContent>
    </Card>
  );
};

export default BasicCard;
