import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { ArrowCircleUpRounded, Edit, ExpandCircleDown, Token } from '@mui/icons-material';
import { TokenContext } from '../../tokenFactory';

import theme from './../../theme';
import { makeStyles } from '@mui/styles';
import AddUpdateAggregator from './addUpdateAggregator';
import { DataGrid } from '@mui/x-data-grid';
const useStyles = makeStyles({
    tabs: {
        "& .MuiButtonBase-root": {
            alignItems: 'start !important',
            maxWidth: '166px !important',
            borderRadius: '8px 0px 0px 8px',
            marginBottom: '12px',
            background: theme.SideHeaderBackground,
            "&.Mui-selected": {
                borderTop: '1px solid blue',
                borderLeft: '1px solid blue',
                borderBottom: '1px solid blue',
                left: '2px'
            }
        },


    },
    tabPanel: {
        height: 'calc(100vh - 90px)',
        borderLeft: '1px solid blue'
    },

    content: {
        color: theme.darkText,
        background: theme.contentBackGround,
        padding: '1%',
        position: 'relative',
        top: theme.headerHeight,
        overflow: 'auto',
        // height:'calc(100% - '+theme.headerHeight+') !important'
    },
    card: theme.card
});
export default function AdaptiveLimitations() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];

    const tableRows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    const { Tokens, TokenAggregators } = React.useContext(TokenContext);
    const [rows, setRows] = React.useState([]);
    const [newRow, setNewRow] = React.useState(true);
    const [currentRow, setCurrentRow] = React.useState([]);
    const classes = useStyles();
    const [openAddress, setOpenAddress] = React.useState();
    const handleClickOpen = (id) => {
        setOpenAddress(id);
    };

    const handleClose = () => {
        setOpenAddress('');
    };

    const editToken = (row) => {
        setNewRow(false)
        setCurrentRow(row)
        setOpenAddress(row.address);
    }

    const setAggregatorsAddress = (row) => {
        if (TokenAggregators && TokenAggregators.length) {

            const currentAggregator = TokenAggregators.find(agg => agg.tokenAddress === row.address);
            row.aggregator = currentAggregator
        }
    }
    React.useEffect(() => {
        if (Tokens && Tokens.length) {
            const updatedTokens = Object.assign([], Tokens);
            updatedTokens.forEach(row => setAggregatorsAddress(row))
            setRows(Tokens)
        }

    }, [Tokens, TokenAggregators]);

    return (
        <>
            <List sx={{ width: '100%' }}>

                {rows.map(row => {
                    return (
                        <>

                            <ListItem alignItems="flex-start" className={classes.card}
                                secondaryAction={
                                    <>
                                        {openAddress !== row.address && (
                                            <ExpandCircleDown sx={{ cursor: 'pointer' }} onClick={() => editToken(row)}></ExpandCircleDown>

                                        )}
                                        {openAddress === row.address && (
                                            <ExpandCircleDown sx={{ cursor: 'pointer', transform: 'rotate(180deg)' }} onClick={() => handleClose()}></ExpandCircleDown>

                                        )
                                        }

                                    </>
                                }>
                                <ListItemAvatar>
                                    <Avatar alt="" src={row.icon} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={row.name}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline', color: theme.lightText, fontSize: '14px' }}
                                                component="span"
                                            >
                                                {row?.aggregator?.decimals || 18} decimals {" — "} {row?.aggregator?.aggregator}
                                            </Typography>

                                        </React.Fragment>
                                    }
                                />
                                {
                                openAddress === row.address && (
                                    <DataGrid
                                        rows={tableRows}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        checkboxSelection
                                    />
                                )
                            }
                            </ListItem>
                            
                        </>

                    )
                })}

            </List >
        </>
    );
}