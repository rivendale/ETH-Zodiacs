import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/styles';
import LazyLoad from 'react-lazyload';
import { trines } from "./common/extras";

const animals = {
  rat: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/rat_rlchaa.png",
  ox: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/ox_a1bttx.png",
  tiger: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615526208/tiger_mi16hj.png",
  rabbit: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/rabbit_sjt1gi.png",
  dragon: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/dragon_icj3pt.png",
  snake: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/snake_jjbas8.png",
  horse: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/horse_flupw4.png",
  goat: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/goat_nibmxx.png",
  monkey: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/monkey_zf2im5.png",
  rooster: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/rooster_ignojl.png",
  dog: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/dog_jeb6ft.png",
  pig: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/pig_cg6lje.png",

}


const useStyles = makeStyles((theme) => ({
  paper: {
    color: theme.palette.text.secondary,
    background: "#FFFFFF",
    border: "1px solid #F6FAFF",
    boxSizing: "border-box",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
    borderRadius: "16px",
    padding: theme.spacing(2),
  },
  baseAvatars: {
    // height: theme.spacing(20),
    width: theme.spacing(20),
    margin: theme.spacing("auto", 2),
  },
  trine: {
    margin: theme.spacing(2, 0, 6),
  },
  card: {
    background: "#FBFDFF",
    // border: "1px solid #F6FAFF",
    // boxSizing: "border-box",
    // boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
    // borderRadius: "16px",
    // marginBottom: theme.spacing(4),
  },
  cardImage: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: "center top",
  },
  detailsContainer: {
    // background: "#FFFFFF",
    // border: "1px solid #e4a687",
    // boxSizing: "border-box",
    margin: theme.spacing(2, "auto", 1),
    // borderRadius: "16px",
    // minHeight: theme.spacing(15),
  },
}));

export const Trines = ({ history, match }) => {
  const classes = useStyles();

  return (
    <Container>
      <Container component="main">
        {/* Hero unit */}
        <Box pt={8} pb={6} >
          <Container maxWidth="md">
            <Typography
              variant="h4"
              align="center"
              gutterBottom
            >
              <b>Welcome to zodiac club trines</b>
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
              The 12 Chinese zodiac signs are divided into four parts or trines, consisting of 3 animals each. The basic nature of signs belonging to a single trine is similar. All 3 signs of a single trine are very compatible to each other. At the same time, note that a sign can also be compatible to other signs. Two people are said to be compatible when they have similar or complementing characteristics or traits. Animals that are within 4 years of each other are believed to have similar personalities.
            </Typography>
            <Box className={classes.paper}>
              <Typography
                align="center"
                gutterBottom
              >
                <b>Here are the four trines trines</b>
              </Typography>
              {trines.map((trine, key) =>
                <Box className={classes.trine} key={key} display="flex" flexDirection="column" flexWrap="wrap">
                  <Typography variant="h6" color="textSecondary" paragraph align="center">
                    <b>{trine.id} trine</b>
                  </Typography>
                  <Typography gutterBottom align="center" variant="body2" color="textSecondary" component="p">
                    {trine.description}
                  </Typography>
                  <Box key={key} display="flex" justifyContent="space-between" flexDirection="row" flexWrap="wrap">
                    <Grid container spacing={4}>

                      {trine.animals.map((animal) => (
                        <Grid item key={animal} xs={12} sm={6} md={4}>
                          <Card className={classes.card}>
                            <LazyLoad height="140" offsetVertical={300} once offset={100}>


                              <CardMedia
                                component="img"
                                title={animal}
                                height="100%"
                                className={classes.cardImage}
                                image={animals[animal]}

                              >
                                {/* <BackgroundImage
                                  src={`${animals[animal]}`}
                                  width="100%"
                                  height="90%"
                                  alt={animal}
                                  isResponsive
                                  className={classes.cardImage}
                                  lazyLoad
                                /> */}
                              </CardMedia>
                            </LazyLoad>
                            {/* <CardMedia
                            component="img"
                            image={`${item.image_url}`}
                            alt="random"
                          /> */}
                            <CardContent>
                              <Typography style={{ textTransform: "capitalize" }} gutterBottom variant="h5" component="h2">
                                {animal}
                              </Typography>
                            </CardContent>
                            <CardActions className={classes.card}>
                              <Button style={{ color: "#312E58" }} className={classes.button} href={`/nft-trines/${animal}`} fullWidth variant="outlined" color="primary">
                                Trine NFTs
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>)}
            </Box>

          </Container>
        </Box>
      </Container>
    </Container>
  );
}
