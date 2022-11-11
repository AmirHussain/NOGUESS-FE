import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Edit } from '@mui/icons-material';
import { TokenContext } from '../../tokenFactory';

import theme from './../../theme';
import { makeStyles } from '@mui/styles';
import AddUpdateToken from './addUpdateToken';
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
export default function AdminTokens() {
    const { Tokens } = React.useContext(TokenContext);
    const [rows, setRows] = React.useState([]);
    const [newRow, setNewRow] = React.useState(true);
    const [currentRow, setCurrentRow] = React.useState([]);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const newToken = () => {
        setNewRow(true)
        setCurrentRow({})
        setOpen(true);
    }
    
    const editToken = (row) => {
        setNewRow(false)
        setCurrentRow(row)
        setOpen(true);
    }
    React.useEffect(() => {
        setRows(Tokens)
    }, [Tokens]);

    return (
        <>
            {open && (<AddUpdateToken open={open} newRow={newRow} currentRow={currentRow} setOpen={setOpen} handleClickOpen={handleClickOpen} handleClose={handleClose}></AddUpdateToken>)}
            <List sx={{ width: '100%' }}>
                <div className='d-flexSpaceBetween'>
                    <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'white', textAlign: 'left' }} variant="p" >
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.lightText, paddingBottom: '10px',cursor:'pointer' }} variant="p" onClick={()=>newToken()}>
                        + create Token
                    </Typography>
                </div>
                {rows.map(row => {
                    return (
                        <>

                            <ListItem alignItems="flex-start" className={classes.card}
                                secondaryAction={
                                    <Edit onClick={() => editToken(row)}
                                        sx={{ cursor: 'pointer' }}
                                    ></Edit>
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
                                                {row.symbol} {" — "}{row.address}
                                            </Typography>

                                        </React.Fragment>
                                    }
                                />
                            </ListItem>

                        </>
                    )
                })}


            </List>
        </>
    );
}