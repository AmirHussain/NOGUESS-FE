import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Favorite, Share } from '@mui/icons-material';
import { Grid, Box, Typography, CardContent, Card, CardHeader, Avatar, IconButton, CardMedia, CardActions } from '@mui/material';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
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
});

export default function PinnedSubheaderList() {
  const classes = useStyles();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {Array.from(Array(4)).map((_, index) => (
          <Grid item xs={12} sm={6} md={6} ld={6} key={index}>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Word of the Day
                </Typography>

                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  adjective
                </Typography>
                <Typography variant="body2">
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1} mt={2}>
        {Array.from(Array(6)).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'red' }} aria-label="recipe"/>
                }
                action={<IconButton aria-label="settings">{/* <MoreVertIcon /> */}</IconButton>}
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
              <CardMedia
                component="img"
                height="194"
                src={
                  index === 0
                    ? 'https://picsum.photos/200/300?grayscale'
                    : index === 1
                    ? 'https://picsum.photos/id/237/200/300'
                    : index % 2 == 0
                    ? 'https://picsum.photos/id/870/200/300?grayscale&blur=2'
                    : 'https://picsum.photos/200/300/?blur'
                }
                alt="Paella dish"
                sx={classes.cardmedia}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to market">
                  <Favorite />
                </IconButton>
                <IconButton aria-label="share">
                  <Share />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
