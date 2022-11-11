import { CheckCircle, LibraryAddCheck } from '@mui/icons-material';
import { AppBar, Avatar, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icons } from '../../icons';
import { routes } from '../../routes';
import theme from '../../theme';

const useStyles = makeStyles({
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  cardmedia: {
    objectFit: 'scale-down'
  },
  chip: theme.chip,
  card: theme.card,
  avatar: {
    height: '20px  !important',
    width: '20px  !important',
  },
  avatar2: {
    height: '24px  !important',
    width: '24px  !important',
  },
  link: {
    cursor: 'pointer !important',
    zIndex: 100,
    textDecoration: 'none  !important', color: 'inherit  !important',
    "&:hover": {
        background: theme.hoverBackground,
        "& $card": {
            background: theme.hoverBackground,
            "& $cardContent": {
                background: theme.hoverBackground
            }
        },

    }
},

  cardContent: theme.cardContent,
  walletConnect: theme.walletConnect,
  actionButton: theme.actionButton2
});

function Governance() {
  const [rows, setRows] = React.useState([])
  const classes = useStyles();
  const setDataRows = () => {
    const r = []
    for (var i = 0; i < 5; i++) {
      r.push({id:77})
    }
    setRows(r)
  }
  React.useEffect(() => {
    setDataRows()
  }, [])
  return (
    < >
      <Grid container direction="row" justifyContent="center" alignItems="flex-center"
        spacing={2} style={{ width: '100%', textAlign: 'left' }}>

        <Grid item xs={8} sm={8} md={8}  >
          <div className='d-flexSpaceBetween'>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'white', textAlign: 'left' }} variant="p" >
              Proposals
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.lightText, paddingBottom: '10px' }} variant="p" >
              + create proposal
            </Typography>
          </div>

        </Grid>
        <Grid item xs={4} sm={4} md={4}  >
          <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'white', textAlign: 'left' }} variant="p" >
            Votting Wallet
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="center" alignItems="flex-center"
        spacing={2} style={{ width: '100%', textAlign: 'left' }}>

        <Grid item xs={8} sm={8} md={8}  >
          {rows.map(row => {

            return (
              <NavLink className={classes.link} to={{ pathname: routes.proposal + '/' + row.id }} >

              <Card className={classes.card} >
                <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >

                  <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%', textAlign: 'left', margin: 0 }}>

                    <Grid item xs={10} sm={10} md={10} style={{ borderRight: '0.5px solid ' + theme.borderColor, padding: 20 }} >

                      <Typography sx={{ fontSize: 12, fontWeight: 500, paddingBottom: '28px' }} variant="h4" >
                        <span className={classes.chip}>
                          #77
                        </span>
                        <Typography sx={{ fontSize: 11, width: '100%', color: theme.lightText, textAlign: 'left' }} variant="p" >
                          Not voted
                        </Typography>
                      </Typography>
                      <Typography sx={{ fontSize: '18px', width: '100%', color: 'white', textAlign: 'left' }} variant="h3" >
                        VIP-77 Upgrade comptroller and set supply
                      </Typography>
                    </Grid>

                    <Grid item xs={2} sm={2} md={2} sx={{ margin: 'auto', textAlign: 'center' }} >
                      <div className='d-flexSpaceAround'>
                        <CheckCircle htmlColor={theme.greenColor} color="white" fontSize='large'></CheckCircle>
                      </div>
                      <Typography sx={{ fontSize: '14px', width: '100%', color: 'white' }} variant="h3" >
                        Executed</Typography>
                    </Grid>

                  </Grid>

                </CardContent>
              </Card>
              </NavLink>
            )
          }

          )

          }

        </Grid>
        <Grid item xs={4} sm={4} md={4} >
          <Card className={classes.card} >

            <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >
              <Typography sx={{ fontSize: 14, fontWeight: 600, paddingBottom: '40px', color: theme.lightText }} variant="p" >
                Voting Weight
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center' ,paddingBottom: '20px', }}>
                <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                  {0.0}
                </span>
              </div>
              <Typography sx={{ fontSize: 14, fontWeight: 600, paddingBottom: '40px', color: theme.lightText }} variant="p" >
                Total Locked
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center',paddingBottom: '20px', }}>
                <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
                  <img className={classes.avatar} alt=""
                    src={Icons.ethereum} />
                </Avatar>  <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                  {0.0}
                </span>
              </div>
              <AppBar key="rightbar"
                position="relative"
                className={classes.rightDrawerHeader}
                sx={{ height:  'auto', boxShadow: 'none !important' } }

                color="transparent"

              >
                <Button sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="contained" >
                  Supply FluteToken</Button>
              </AppBar>
            </CardContent>
          </Card>
          <Card className={classes.card} >

            <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >
              <Typography sx={{ fontSize: 18, fontWeight: 500 }} variant="h4" >

                To vote you should:</Typography>
              <Typography sx={{}} variant="p" >
                <ol style={{ paddingLeft: 12 }}>
                  <li> Deposit your tokens in the XVS Vault
                  </li>
                  <li>
                    Delegate your voting power to yourself or somebody else
                  </li>
                </ol>
              </Typography>

            </CardContent>
          </Card>


        </Grid>
      </Grid>
    </>
  );
}

export default Governance;