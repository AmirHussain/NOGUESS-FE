import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
App :{
    position: 'fixed',
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    textAlign: "center",
    background: "rgb(49, 49, 177)",
    background: `linear-gradient(
      0deg,
      rgba(49, 49, 177, 1) 0%,
      rgba(49, 49, 177, 1) 50%,
      rgba(49, 49, 177, 0.6) 100%
    )`,
  },
  container :{
    width: "100%",
    margin: "15% auto",
  }
});

export default function ComingSoon() {
  const classes = useStyles();
    return (
        <div className={classes.app}>
            <div className={classes.container}>
                <h1>
                    Feature
                    <br />
                    Coming Soon
                </h1>
            </div>
        </div>
    );
}


