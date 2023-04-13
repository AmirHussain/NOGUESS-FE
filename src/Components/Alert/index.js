import React, { createContext, useEffect, useState } from 'react';
import theme from '../../theme';
import { makeStyles } from '@mui/styles';
import { Button, Card, ButtonGroup, Menu, MenuItem, Fab, Divider, Popover, Alert, AlertTitle, Backdrop, CircularProgress, Stack, Collapse } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../../redux/store/actions/user';

import providerOptions, { Networks } from '../walletConnect/providers';
import { Web3ProviderContext } from '../walletConnect/walletConnect';

const useStyles = makeStyles({
  walletConnect: theme.actionButton,
  drawer: theme.drawer,
  drawerPaper: theme.drawerPaper,
  drawerContainer: theme.drawerContainer,
  cardBackground: theme.cardBackground,
  alertStyle: {
    zIndex: theme.zIndex.drawer + 100000,
    background: 'white',
    width: '339px',
  },
});

export const vernofxAlertContext = createContext();

export function VernofxAlert({ children }) {
  const [alertArray, setAlertArray] = useState([]);

  const [showAlert, setShowAlert] = useState(true);
  const classes = useStyles();
  console.log(process, process.env);
  const { chainId } = React.useContext(Web3ProviderContext);

  useEffect(() => {}, [alertArray]);
  function setAlert(alertObject, index) {
    if (alertObject) {
      setShowAlert(false);

      const existingAlert = alertArray;
      console.log(alertArray);
      const newMessage = transformMessage(alertObject);
      if (index || index === 0) {
        existingAlert[index] = newMessage;
      } else {
        existingAlert.push(newMessage);
      }
      setAlertArray(existingAlert);
      setTimeout(() => {
        setShowAlert(true);
      });
      return index || existingAlert.length - 1;
    }
  }
  function removeAlert(index) {
    setShowAlert(false);
    alertArray[index].hidden = true;
    setAlertArray(alertArray);
    setTimeout(() => {
      setShowAlert(true);
    });
  }
  function transformMessage(alertObj) {
    if (alertObj.severity === 'error' && alertObj.error) {
      alertObj.description = alertObj.error.reason;
      if (alertObj.error.transactionHash) {
        alertObj.url = setUrl(alertObj.error.transactionHash);
      }
    } else if (alertObj.txHash) {
      alertObj.url = setUrl(alertObj.txHash);
    }

    return alertObj;
  }

  function setUrl(txhash) {
    const network = Networks.find((net) => net.chainId === chainId);
    return process.env[`REACT_APP_NETWORK_${network?.name}_URL`] + txhash;
  }

  return (
    <vernofxAlertContext.Provider
      value={{
        setAlert,
      }}
    >
      {showAlert && alertArray && alertArray.length && (
        <Stack
          spacing={2}
          sx={{
            width: '100%',
            display: 'flex',
            float: 'right',
            alignItems: 'end',
            margin: '77px 29px',
          }}
        >
          {alertArray?.map((ala, index) => (
            <>
              {ala && !ala.hidden && (
                <div className={classes.alertStyle}>
                  <Collapse in={!ala.hidden}>
                    <Alert onClose={() => removeAlert(index)} severity={ala.severity}>
                      <AlertTitle sx={{ display: 'flex' }}>
                        {' '}
                        {ala.severity === 'info' && <CircularProgress sx={{ width: '24px !important', height: '24px  !important' }} />}
                        <span style={{ marginLeft: '5px' }}>{ala.title}</span>
                      </AlertTitle>
                      {ala.description}{' '}
                      {ala.url && (
                        <>
                          —{' '}
                          <strong>
                            <a href={ala.url} target="_blank" rel="noreferrer">
                              view on blockexplorer!
                            </a>
                          </strong>
                        </>
                      )}
                    </Alert>
                  </Collapse>
                </div>
              )}
            </>
          ))}
        </Stack>
      )}
      {children}
    </vernofxAlertContext.Provider>
  );
}
