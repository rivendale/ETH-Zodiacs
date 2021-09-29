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
import { makeStyles, withStyles } from '@material-ui/styles';
import LazyLoad from 'react-lazyload';
import api from '../api';
import { Tooltip } from '@material-ui/core';
import { EthIcon } from './common/EthIcon';
import { SimpleBackdrop } from './common/Loaders';
import { elements, force, trines } from "./common/extras";
import { BackgroundImage } from 'react-image-and-background-image-fade';
import { Error404Page } from './common/Error404Page';

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
  main: {
    minHeight: theme.spacing(20),
  },
  card: {
    background: "#FBFDFF",
    border: "1px solid #F6FAFF",
    boxSizing: "border-box",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
    borderRadius: "16px",
  },
  cardImage: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: "center top",
  },
  detailsContainer: {
    background: "#FFFFFF",
    border: "1px solid #e4a687",
    boxSizing: "border-box",
    margin: theme.spacing(2, "auto", 1),
    borderRadius: "16px",
    minHeight: theme.spacing(15),
  },
  elementImage: {
    width: theme.spacing(10),
    height: theme.spacing(10),

  },
  forceImage: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginLeft: theme.spacing(5),
  },
}));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);
export const Trine = ({ history, match }) => {
  const classes = useStyles();
  const nftName = match?.params?.nftName
  const [trine, setTrine] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [nftTrine] = React.useState(trines.filter((a) => a.animals.includes(nftName?.toLowerCase()))?.[0])


  const fetchTrine = React.useCallback(async () => {
    setLoading(true)
    await api({
      method: "GET",
      url: `/trines/${nftName}`
    }).then(data => {
      setTrine(data.data)
      setLoading(false)

    })
      .catch(err => {
        if (err.response) {
          console.log(err.response)
        } else if (err.request) {
          console.log(err.request)
          setLoading(false)
        }
      })
  }, [nftName])

  React.useEffect(() => {
    if (nftName && !trine) {
      fetchTrine()
    }
  }, [nftName, trine, fetchTrine])

  const copyToClipboard = (content) => {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // setOpenSnackBar(true)
  };

  return (
    <Container>
      {loading ? <SimpleBackdrop open={true} /> :
        !nftTrine ? <Error404Page /> :
          <Container component="main">
            {/* Hero unit */}
            <Box pt={8} pb={6} >
              <Container maxWidth="md">
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                >
                  <b>Welcome to the {nftTrine.id} trine</b>
                </Typography>
                <Typography variant="h6" align="center" color="textSecondary" paragraph>
                  {nftTrine.description}
                </Typography>
                <Box className={classes.paper}>
                  <Typography
                    align="center"
                    gutterBottom
                  >
                    <b>Trine Members</b>
                  </Typography>
                  <Box display="flex" justifyContent="space-between" flexDirection="row" flexWrap="wrap">
                    {nftTrine.animals.map((animal) => (
                      <LazyLoad key={animal} height="140" offsetVertical={300} once offset={100}>
                        <img className={classes.baseAvatars} alt="animal" src={animals[animal]} />
                      </LazyLoad>
                    ))}
                  </Box>
                </Box>

              </Container>
            </Box>
            <Container className={classes.main} py={8} maxWidth="md">
              <Typography
                variant="h6"
                align="center"
                gutterBottom
              >
                {
                  !!trine?.length ?
                    <b>Here are the NFTs that belong to this trine</b>
                    :
                    <b>There are currently no NFTs that belong to this trine</b>
                }
              </Typography>
              <Grid container spacing={4}>
                {trine?.map((item, key) => (
                  <Grid item key={key} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <LazyLoad height="140" offsetVertical={300} once offset={100}>


                        <CardMedia
                          component="div"
                          // style={{ backgroundImage: `url(${nft.image_url})` }}
                          // alt={nft.token_metadata.name}
                          title={item.token_metadata.name}
                          className={classes.cardImage}

                        >
                          <BackgroundImage
                            src={`https://api.allorigins.win/raw?url=${item.image_url}`}
                            width="100%"
                            height="90%"
                            alt={item.token_metadata.name}
                            isResponsive
                            className={classes.cardImage}
                            lazyLoad
                          />
                        </CardMedia>
                      </LazyLoad>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box>
                          <b>Owner</b>:
                          <HtmlTooltip
                            title={
                              <React.Fragment>
                                <Typography color="inherit">NFT owner</Typography>
                                <em>{item.user_address}</em> <br />  <b>{'Click the address to copy'}</b>
                              </React.Fragment>
                            }
                          >
                            <Button onClick={(e) => { e.preventDefault(); copyToClipboard(item.user_address) }}>

                              <EthIcon id="eth-account" ethAccount={item.user_address} />
                            </Button>
                          </HtmlTooltip>
                        </Box>
                        <Grid container spacing={1} alignItems="center" justify="center">
                          <Grid item xs={6} className={classes.detailsContainer}>
                            <Typography color="textSecondary" align="center">
                              <b>Element</b>
                            </Typography>
                            <Box style={{ borderTop: "1px solid #d6af9b" }} display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                              <Typography variant="subtitle1">
                                {item.token_metadata.element}
                              </Typography>
                              <img className={classes.elementImage} src={elements.find(i => i.name === item.token_metadata.element.toLowerCase()).image} alt={item.token_metadata.element} />
                            </Box>
                          </Grid>
                          <Grid item xs={6} className={classes.detailsContainer}>
                            <Typography color="textSecondary" align="center">
                              <b>Force</b>
                            </Typography>
                            <Box style={{ paddingTop: "1.2em", borderTop: "1px solid #d6af9b" }} display="flex" flexDirection="row" alignItems="center">
                              <Typography variant="subtitle1" style={{ marginLeft: ".9em" }}>
                                {item.token_metadata.force}
                              </Typography>
                              <img className={classes.forceImage} src={force?.find(i => i.name === item.token_metadata.force.toLowerCase())?.image} alt={item.token_metadata.force} />
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions className={classes.card}>
                        <Button style={{ color: "#312E58" }} className={classes.button} href={`/nft/${item.token_id}`} fullWidth variant="outlined" color="primary">
                          NFT Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Container>
      }</Container>
  );
}
