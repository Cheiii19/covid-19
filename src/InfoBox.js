import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, dark, total, active, isRed, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      } ${dark && "MuiPaper-root"}`}
    >
      <CardContent className={`${dark && "infoBox_dark"}`}>
        <Typography
          color="textSecondary"
          gutterBottom
          className={`${dark && "infoBoxText_dark"}`}
        >
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>

        <Typography
          className={`infoBox__total ${dark && "infoBoxText_dark"}`}
          color="textSecondary"
        >
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
