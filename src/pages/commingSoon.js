import { ArrowBack, ArrowForwardIos, Forward, Forward10Rounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Col, Flex, Row } from "antd";
import React from "react";
import theme from "../theme";
import UserBalance from "../Components/Balance";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { routes } from "../routes";

const useStyles = makeStyles({
  walletConnect: theme.actionButton,
  App: {
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
  container: {
    width: "100%",
    margin: "15% auto",
  },
  welcomtext: {
    color: '#fff',
    fontSize: '4rem',
    lineHeight: '4rem',
    textTransform: 'uppercase',
    textAlign: 'left'
  },
  subtitle: {
    color: '#fff',
    display: 'block',
    fontSize: '1.5rem',
    width: '100%',
    textAlign: 'left'
  }
});

export default function ComingSoon() {
  const classes = useStyles();
  return (
    <div className={classes.app}>
      <div className={classes.container}>
        <Row>
          <Col xs={{ span: 24, offset: 1 }} md={{ span: 14 }} lg={{ span: 14 }}>
            <h1 className={classes.welcomtext}>
              Welcome Player
            </h1>
            <h1 className={classes.subtitle}>
              All numbers are genereated with true randomness
            </h1>
          </Col>
          <Col xs={{ span: 24, offset: 1 }} md={{ span: 6, offset: 2 }} lg={{ span: 6, offset: 2 }}>
            <h1 style={{ paddingTop: '16px' }}>
              <UserBalance></UserBalance>
              <NavLink to={routes.game}>

                <Button variant="text" className={classes.walletConnect} variant="contained" >
                  <Flex align="flex-center" justify="space-evenly" >
                    <span>Play Now</span> &nbsp;&nbsp;&nbsp;
                    <ArrowForwardIos color="primary" />
                  </Flex>
                </Button>
              </NavLink>

            </h1>
          </Col>


        </Row>

      </div>
    </div>
  );
}


