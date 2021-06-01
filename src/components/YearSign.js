import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Typography, Container, Grid, makeStyles, Fab } from '@material-ui/core';
import SignHeader from './SignHeader';
import Compatibility from './Compatibility.js';
import Main from './Report';
import Sidebar from './Sidebar';
import { GlobalContext } from "../context/GlobalState";
import api from '../api';
import { LinearLoader, Spinner } from './common/Loaders';
import { getAccount, createNFTFromAssetData, ethBrowserPresent, verifyMinted, ethAction } from './eth/EthAccount';
import Message from './common/MessageDialog';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import DeviceHubOutlinedIcon from '@material-ui/icons/DeviceHubOutlined';
import { EthContext } from '../context/EthContext';
import Config from '../config';
import { AlertMessage } from './common/Alert';

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
}));


export const YearSign = ({ history, match }) => {
  const classes = useStyles();
  const { yearSigns, sign, getYearSigns, getSign } = useContext(GlobalContext);
  const { ethAccount } = useContext(EthContext);
  const [bestCompatibility, setBestCompatibility] = useState([]);
  const [worstCompatibility, setWorstCompatibility] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [signAlreadyMinted, setSignAlreadyMinted] = useState(null);
  const [transactionHash, setTransactionHash] = useState("");
  const [signUpdated, setSignUpdated] = useState(false);
  const [ethBrowserError, setEthBrowserError] = useState(false)
  const [mintingError, setMintingError] = useState(null)
  const [signHash, setSignHash] = useState(null)
  let signId = match.params.signId

  const fetchSigns = useCallback(async () => {
    setLoading(true)
    await api({
      method: "GET",
      url: `signs/year/`
    }).then(data => {
      getYearSigns(data.data.signs)
      setSignUpdated(true)
      setLoading(false)
    })
      .catch(err => {
        setLoading(false)
        if (err.response) {
          console.log(err.response)
        } else if (err.request) {
          console.log(err.request)
        }
      })
  }, [getYearSigns])


  useEffect(() => {
    const localSign = localStorage.getItem("sign") || null
    if (!sign && localSign) {

      getSign(JSON.parse(localSign))
    }
    setSignUpdated(true)
  }, [getSign, sign])

  useEffect(() => {

    if (!Object.keys(yearSigns).length) {
      fetchSigns()
    }
    else if (!!Object.keys(yearSigns).length && !sign) {
      const zodiacSign = yearSigns.find(x => x.id === +signId)
      getSign(zodiacSign)
    }
  }, [fetchSigns, getSign, sign, signId, yearSigns])

  const getCompatibility = useCallback(() => {
    setBestCompatibility([])
    yearSigns.forEach(i => {
      if ((i.name !== sign.name) && sign.best_compatibility.indexOf(i.name) > -1) {
        setBestCompatibility(bestCompatibility => [...bestCompatibility, i])
      }
    })


    setWorstCompatibility([])
    yearSigns.forEach(i => {
      if ((i.name !== sign.name) && sign.worst_compatibility.indexOf(i.name) > -1) {
        setWorstCompatibility(worstCompatibility => [...worstCompatibility, i])
      }
    })

    setSignUpdated(false)
  }, [yearSigns, sign])


  const handleClick = (e, value) => {
    e.preventDefault()
    const zodiacSign = yearSigns.find(x => x.id === value)
    getSign(zodiacSign)
    history.push(`/zodiac-sign/${value}`)
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    setSignUpdated(true)
  }

  const handleMintNFT = (e) => {
    e.preventDefault()
    setEthBrowserError(false)
    ethBrowserPresent().then(status => {
      if (!status) { setEthBrowserError(true); return }
      setMinting(true)
      getAccount(true).then(acc => {
        if (!acc) { setMinting(false); return }
        verifyMinted(sign.id, acc).then((isMinted) => {
          if (isMinted) { setSignAlreadyMinted(true); setMinting(false); return }
          createNFTFromAssetData(sign).then(data => {
            setMinting(false)
            if (!data) return
            const { hash, errorMessage } = data
            if (errorMessage) { setMintingError(errorMessage); return }
            setTransactionHash(hash)
            ethAction(signHash, acc, "add")
          })
        })
      })
    })
  }
  const checkMintStatus = useCallback(() => {
    if (ethAccount && sign) {
      setSignHash(sign.hash)
      verifyMinted(sign.hash, ethAccount).then((isMinted) => {
        setSignAlreadyMinted(isMinted)
      })
    }
    ethBrowserPresent().then(status => {
      if (!status) { setSignAlreadyMinted(false) }
    })

  }, [ethAccount, sign])

  const handleMessageClick = (() => {
    setMintingError(null)
  })

  useEffect(() => {
    if (signAlreadyMinted == null)
      if (ethAccount == null) { setSignAlreadyMinted(false) }
    checkMintStatus()
  }, [checkMintStatus, ethAccount, signAlreadyMinted])
  useEffect(() => {
    if (signUpdated) {
      checkMintStatus()
      if (sign && !!Object.keys(yearSigns).length) {
        getCompatibility()
      }
    }
  }, [checkMintStatus, getCompatibility, sign, signUpdated, yearSigns])
  return (
    <React.Fragment>
      {ethBrowserError && <Message />}
      {sign && <Container maxWidth="lg" component="main">
        <SignHeader signId={signId} history={history} post={{ title: sign.name, description: sign.description, image: sign.image_url }} />
        {transactionHash && <span>
          Your transaction is being processed. For more details, click <a rel="noopener noreferrer" href={`${Config.TX_EXPLORER}/${transactionHash}`} target="_blank">here</a> to view it <br />
          Your minted NFT should be listed in your <a href="/my-signs">NFT page</a> when the transaction completes
        </span>}
        {mintingError &&
          <AlertMessage message={mintingError} handleMessageClick={handleMessageClick} />
        }
        {!transactionHash && sign && sign.day_animal &&
          <span>
            {signAlreadyMinted == null ?
              <span >
                Loading Status...
              </span>
              :
              signAlreadyMinted ?
                <Fab size="small" variant="extended" className={classes.mintedIcon} >
                  <VerifiedUserOutlinedIcon className={classes.extendedIcon} />
                Minted
              </Fab>
                : !minting && !signAlreadyMinted && !mintingError ?
                  <Fab onClick={handleMintNFT} size="small" disabled={minting} variant="extended" style={{ textTransform: "none" }}>
                    <DeviceHubOutlinedIcon className={classes.extendedIcon} />
                  Mint NFT
                </Fab>
                  : minting ?
                    <div style={{ width: "65%" }}>
                      Minting NFT...
                    <LinearLoader />
                    </div>
                    : ""
            }
          </span>}

        <Grid container spacing={5} className={classes.mainGrid}>
          <Main title="Rat Description" report={sign.report} />
          <Sidebar
            positiveTraits={sign.positive_traits.join(', ')}
            negativeTraits={sign.negative_traits.join(', ')}
            monthAnimal={sign.month_animal}
            dayAnimal={sign.day_animal}
            element={sign.element}
            force={sign.force}
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
