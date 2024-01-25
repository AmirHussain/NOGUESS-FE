import React, { useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../theme';
import { AttachMoney } from '@mui/icons-material';
import { Web3ProviderContext } from '../walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { NUOGUESSAlertContext } from '../Alert';
import { bigToDecimal, bigToDecimalUnits, decimalToBig } from '../../utils/utils';
import { start_and_end } from '../../utils/common';
const useStyles = makeStyles({
    boxRoot: theme.boxRoot,
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
    cardmedia: {
        objectFit: 'scale-down',
    },
    root: {},
    boxRoot: theme.boxRoot,
    dividerRoot: {
        background: 'black',
    },
    lowMargin: {
        marginTop: '0px !important',
        marginBottom: '1px !important',
    },
    textBoldWhite: theme.textBoldWhite,
    sideBar: {
        background: '#050506',
        color: 'white',
    },
    textHighlighted: theme.textHighlighted,
    sectionHeading: theme.sectionHeading,
    textBoldWhite: theme.textBoldWhite,
    textMuted: theme.textMuted,
    innerCard: theme.innerCard,
    modal: theme.modal,
    textBold: theme.textBold,
});

export default function UserBalance() {
    const classes = useStyles();
    const [userBalance, setUserBalance] = React.useState(0);
    const [depositAmount, setDepositAmount] = React.useState(0);
    const [consecutiveWin, setConsecutiveWin] = React.useState(0);
    const { connectWallet, provider, signer, account } = React.useContext(Web3ProviderContext);
    const { setAlert } = React.useContext(NUOGUESSAlertContext);
    const [accountShort, setAccountShort] = React.useState('');
    const getUserBalance = async () => {
        const gameContract = makeContract(contractAddresses.game, abis.GAME, signer || provider);

        if (!account) {
            return
        }
        console.log(account)
        const response = await gameContract.getPlayerData(
            account
        )
        console.log(response)
        setUserBalance(bigToDecimal(response.balance))
        setConsecutiveWin(Number(response.consecutiveWinsInARow))
    }

    useEffect(() => [userBalance])
    const handleDeposit = async () => {
        const gameContract = makeContract(contractAddresses.game, abis.GAME, signer || provider);

        if (!account) {
            return
        }
        console.log(account)
        const tokenContract = makeContract(contractAddresses.token, abis.NGT, signer || provider);
        const approvalResponse = await tokenContract.approve(gameContract.address, decimalToBig(depositAmount.toString()));
        const response = await gameContract.deposit(
            decimalToBig(depositAmount.toString())
        )
        response.wait(2)
        getUserBalance()
    };
    const handleWithdraw = async () => {
        const gameContract = makeContract(contractAddresses.game, abis.GAME, signer || provider);
        if (!account) {
            return
        }
        console.log(account)
        const response = await gameContract.withdraw()
        response.wait(2)
        getUserBalance()
    };
    useEffect(() => {
        if (account) {
            getUserBalance()

            setInterval(() => {
                getUserBalance()
            }, 20000)
        }
        setAccountShort(start_and_end(account))
    }, [account])


    return (
        <Box>
            <div className="user-info-container">
                <h2>Welcome, {accountShort}! </h2>
                <p>Available Balance: {userBalance} NGT</p>
                <p>Consecutive Win: {consecutiveWin}</p>

                <button onClick={handleWithdraw}>Withdraw</button>
                <div>
                    <input
                        type="number"
                        placeholder="Deposit amount for game play"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                    />
                    <button onClick={handleDeposit}>Deposit</button>
                </div>
            </div>

        </Box>
    );
}
