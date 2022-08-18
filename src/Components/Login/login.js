import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import {makeStyles} from '@mui/styles'

import { metamaskProvider } from './walletConnect';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails, selectUserAddress } from '../../redux/userStore';
import { useHistory } from 'react-router-dom';
import { routes } from '../../routes';
import { USER } from '../../redux/store_types';

const LoginPage = () => {
  const router = useHistory();
  const address = useSelector(selectUserAddress);
  if (address) {
    router.push(routes.home);
  }
  const dispatch = useDispatch();
  const onConnectButtonClick = async (providerName) => {
    if (typeof window.ethereum === 'undefined') {
      alert('metamask not connected')
      return;
    }


    let provider = await metamaskProvider(providerName);
    
    const ntw = await provider.getNetwork();
    if (ntw.chainId != 80001) {
          return;
    }

    const signer = provider.getSigner();

    try {
      const address = await signer.getAddress();
      dispatch(
        setUserDetails({
          address,
          details: {
            name: 'Amir Hussain',
            avatar: ''

          },

        })
      );

      router.push(routes.home);
    } catch (error) {
      console.log('the message:', error);

      let message;

      if (error.code) {
        switch (error.code) {
          case 4001:
            message = 'User denied signing message. Aborting.';
            break;
          default:
            break;
        }
      } else if (error.isAxiosError) {
        switch (error.response?.data?.statusCode) {
          case 401:
            message = 'Unauthorized.';
            break;

          default:
            break;
        }
      }

      return;
    }
  };
  const WALLETS = {
    walletConnect: "walletconnect",
    metamask: "metamask",
    fortmatic: "fortmatic",
    torus: "torus"
  };

  return (
    <Box height={{ xs: '65vh', md: '60vh' }} width="100%" display="flex" justifyContent="center" alignItems="center">
      <Grid container alignItems="center" justify="center" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" >
            Login
          </Typography>
        </Grid>
        <Grid item xs={10} sm={8} md={6} lg={3} alignItems="center" justify="center" className={`testing-loginButton`} style={{ textAlign: 'center' }}>
          <button onClick={() => onConnectButtonClick(WALLETS.metamask)} >Connect to Metamask</button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
