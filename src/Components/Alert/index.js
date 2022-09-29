import { createContext, useEffect, useState } from 'react';
import theme from '../../theme';
import { makeStyles } from '@mui/styles';
import { Button, Card, ButtonGroup, Menu, MenuItem, Fab, Divider, Popover, Alert, AlertTitle, Backdrop, CircularProgress } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../../redux/store/actions/user';

import providerOptions from '../walletConnect/providers'


const useStyles = makeStyles({
    walletConnect: theme.actionButton,
    drawer: theme.drawer,
    drawerPaper: theme.drawerPaper,
    drawerContainer: theme.drawerContainer,
    cardBackground: theme.cardBackground
});

export const FluteAlertContext = createContext();

export function FluteAlert({ children }) {
    const [alert, setAlert] = useState("");
    const [alertToggle, setAlertToggle] = useState(false);


    useEffect(() => {
        setAlertToggle(true);
    }, [alert]);
    return (
        <FluteAlertContext.Provider
            value={{
                setAlert,
                setAlertToggle
            }}
        >
            {alert && alertToggle && (
                <div>
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={alertToggle}>
                        <Alert  onClose={() => setAlertToggle(false)} sx={{ zIndex: (theme) => theme.zIndex.drawer + 2, background: 'white', maxWidth: '-webkit-fill-available'}} severity={alert.severity}>
                            <AlertTitle sx={{ display: 'flex' }}> {alert.severity === 'info' && (
                                <CircularProgress sx={{ width: '24px !important' ,height: '24px  !important' }}/>
                            )}
                               <span style={{marginLeft:'5px'}}>{alert.title}</span> 
                            </AlertTitle>
                            {alert.description} — <strong>view on blockexplorer!</strong>
                        </Alert>
                    </Backdrop>



                </div>
            )}
            {
                children
            }

        </FluteAlertContext.Provider>
    );
}