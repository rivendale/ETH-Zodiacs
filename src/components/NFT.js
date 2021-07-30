import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Typography, Container, Paper, Grid, makeStyles, Box, Button } from '@material-ui/core';
import SignHeader from './SignHeader';
import Compatibility from './Compatibility.js';
import Main from './Report';
import Sidebar from './Sidebar';
import { GlobalContext } from "../context/GlobalState";
import api from '../api';
import { SimpleBackdrop, Spinner } from './common/Loaders';
import { EthIcon } from './common/EthIcon';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  compatibility: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  mintedIcon: {
    textTransform: "none",
    color: "green",
    padding: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  tokenInfoWrapper: {
    margin: theme.spacing(1, 2),
    padding: theme.spacing(0, 2, 0, 0.8),
  },
  tokenInfo: {
    padding: theme.spacing(1),
  },
  tokenInfoSections: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'row',
    },
  },
  tokenInfoSectionsTitle: {
    margin: theme.spacing(1, 2),
  }
}));


export const NFT = ({ history, match }) => {
  const classes = useStyles();
  const { yearSigns, getYearSigns, getSign } = useContext(GlobalContext);
  const [bestCompatibility, setBestCompatibility] = useState([]);
  const [worstCompatibility, setWorstCompatibility] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nft, setNft] = useState(null);
  const [signUpdated, setSignUpdated] = useState(false);
  const [spinnerOpen, setSpinnerOpen] = useState(false)
  const [signFetched, setSignFetched] = useState(false)

  let signId = match.params.signId

  const fetchSigns = useCallback(async () => {
    setLoading(true)
    await api({
      method: "GET",
      url: `signs/year/`
    }).then(data => {
      getYearSigns(data.data.signs)
      setLoading(false)
    })
      .catch(err => {
        setLoading(false)
        setSignFetched(true)
        if (err.response) {
          console.log(err.response)
        } else if (err.request) {
          console.log(err.request)
        }
      })
  }, [getYearSigns])

  const fetchSign = useCallback(async () => {
    // use the await keyword to grab the resolved promise value
    // remember: await can only be used within async functions!
    setSpinnerOpen(true)
    await api({
      method: "GET",
      url: `nfts/${signId}`
    }).then(data => {
      // update local state with the retrieved data
      setNft(prevSign => ({ ...prevSign, ...data.data.nft }))
      setSpinnerOpen(false)
      setSignFetched(true)

    })
      .catch(err => {
        if (err.response) {
          console.log(err.response)
        } else if (err.request) {
          console.log(err.request)
          setSpinnerOpen(false)
        }
      })
  }, [signId])

  useEffect(() => {
    if (!signFetched) {

      fetchSign()
    }
    setSignUpdated(true)
  }, [fetchSign, signFetched])

  useEffect(() => {

    if (!Object.keys(yearSigns).length) {
      fetchSigns()
    }
  }, [fetchSigns, getSign, yearSigns])

  const getCompatibility = useCallback(() => {
    setBestCompatibility([])
    yearSigns.forEach(i => {
      if ((i.name !== nft.token_metadata.name) && nft.token_metadata.best_compatibility.indexOf(i.name) > -1) {
        setBestCompatibility(bestCompatibility => [...bestCompatibility, i])
      }
    })


    setWorstCompatibility([])
    yearSigns.forEach(i => {
      if ((i.name !== nft.token_metadata.name) && nft.token_metadata.worst_compatibility.indexOf(i.name) > -1) {
        setWorstCompatibility(worstCompatibility => [...worstCompatibility, i])
      }
    })

    setSignUpdated(false)
  }, [nft, yearSigns])


  const handleClick = (e, value) => {
    e.preventDefault()
    const zodiacSign = yearSigns.find(x => x.id === value)
    getSign(zodiacSign)
    // history.push(`/zodiac-sign/${value}`)
    history.push({
      pathname: `/zodiac-sign/${value}`,
      state: { userSign: zodiacSign, signUpdated: true }
    })
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }



  useEffect(() => {
    if (signUpdated) {
      if (nft && !!Object.keys(yearSigns).length) {
        getCompatibility()
      }
    }
  }, [getCompatibility, nft, signUpdated, yearSigns])
  const copyToClipboard = (content) => {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // setOpenSnackBar(true)
  };

  const handleRedirect = (url) => {
    window.open(url, '_blank')
  };
  return (
    <React.Fragment>
      {spinnerOpen && <SimpleBackdrop open={spinnerOpen} />}

      {nft && <Container maxWidth="lg" component="main">
        <SignHeader post={{ title: nft.token_metadata.name, description: nft.token_metadata.description, image: nft.image_url }} />
        <Grid container className={classes.tokenInfoWrapper} >
          <Grid item sm={12} md={8}>
            <Grid container component={Paper} className={classes.tokenInfo} spacing={5}>
              <Grid item xs={12} sm={4}>
                <Box className={classes.tokenInfoSections}>
                  <Typography className={classes.tokenInfoSectionsTitle}>
                    Owner
                  </Typography>
                  <Button onClick={(e) => { e.preventDefault(); copyToClipboard(nft.user_address) }}>

                    <EthIcon id="eth-account" ethAccount={nft.user_address} />
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box className={classes.tokenInfoSections}>
                  <Typography className={classes.tokenInfoSectionsTitle}>
                    IPFS URL
                  </Typography>
                  <Button style={{ textTransform: "none" }} endIcon={<OpenInNewIcon />} onClick={() => { handleRedirect(nft.token_url) }}>
                    {nft.token_url.substr(0, 10) + '...' + nft.token_url.substr(nft.token_url.length - 4, nft.token_url.length)}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box className={classes.tokenInfoSections}>
                  <Typography className={classes.tokenInfoSectionsTitle}>
                    Gateway URL
                  </Typography>
                  <Button style={{ textTransform: "none" }} endIcon={<OpenInNewIcon />} onClick={() => { handleRedirect(nft.gateway_token_url) }}>
                    {nft.gateway_token_url.substr(0, 10) + '...' + nft.gateway_token_url.substr(nft.gateway_token_url.length - 4, nft.gateway_token_url.length)}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={5} className={classes.mainGrid}>
          <Main title={nft.token_metadata.name} report={nft.token_metadata.report} />
          <Sidebar
            positiveTraits={nft.token_metadata.positive_traits.join(', ')}
            negativeTraits={nft.token_metadata.negative_traits.join(', ')}
            monthAnimal={nft.token_metadata.month_animal}
            dayAnimal={nft.token_metadata.day_animal}
            element={nft.token_metadata.element}
            force={nft.token_metadata.force}
          />
        </Grid>
        {loading ? <Spinner /> :
          <React.Fragment>
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              align="center"
              paragraph={true}
            >

              Best Compatibility
            </Typography>
            {bestCompatibility && <Grid container spacing={4} className={classes.compatibility}>
              {bestCompatibility.map((post) => (
                <Compatibility key={post.name} post={post} handleClick={handleClick} />
              ))}
            </Grid>}
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              align="center"
              paragraph={true}
            >
              Worst Compatibility
            </Typography>
            {worstCompatibility && <Grid container spacing={4} className={classes.compatibility}>
              {worstCompatibility.map((post) => (
                <Compatibility key={post.name} post={post} handleClick={handleClick} />
              ))}
            </Grid>
            }
          </React.Fragment>}

      </Container>}

    </React.Fragment>
  );
}
