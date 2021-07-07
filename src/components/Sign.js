import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Typography, Container, Grid, makeStyles, Fab } from '@material-ui/core';
import SignHeader from './SignHeader';
import Compatibility from './Compatibility.js';
import Main from './Report';
import Sidebar from './Sidebar';
import { GlobalContext } from "../context/GlobalState";
import api from '../api';
import { LinearLoader, SimpleBackdrop, Spinner } from './common/Loaders';
import { ethBrowserPresent, getAccount, payMintingFee, verifyMinted } from './eth/EthAccount';
import Message from './common/MessageDialog';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import DeviceHubOutlinedIcon from '@material-ui/icons/DeviceHubOutlined';
import { EthContext } from '../context/EthContext';
import Config from '../config';
import { AlertMessage } from './common/Alert';
import moment from "moment";
import { Error404Page } from './common/Error404Page';


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


export const Sign = ({ history, match }) => {
  const classes = useStyles();
  const { yearSigns, sign, getYearSigns, getSign } = useContext(GlobalContext);
  const { ethAccount } = useContext(EthContext);
  const [bestCompatibility, setBestCompatibility] = useState([]);
  const [worstCompatibility, setWorstCompatibility] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [signCheckedMinted, setSignCheckedMinted] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [signUpdated, setSignUpdated] = useState(false);
  const [ethBrowserError, setEthBrowserError] = useState(false)
  const [mintingError, setMintingError] = useState(null)
  const [userDob, setUserDob] = useState(null)
  const [dateChecked, setDateChecked] = useState(false)
  const [invalidDate, setInvalidDate] = useState(false)
  const [spinnerOpen, setSpinnerOpen] = useState(false)
  const [signFetched, setSignFetched] = useState(false)

  let dob = match.params.dob

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
    let dateOfBirth = new Date(userDob);
    let ethAcc = ethAccount || ""
    await api({
      method: "GET",
      url: `signs/query/?year=${dateOfBirth.getFullYear()}&month=${dateOfBirth.getMonth() + 1}&day=${dateOfBirth.getUTCDate() + 1}&address=${ethAcc}`
    }).then(data => {
      // update local state with the retrieved data
      getSign(data.data.sign)
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
  }, [ethAccount, getSign, userDob])

  useEffect(() => {
    const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])-(19|20)\d{2}$/;
    if (!(dateRegex.test(dob))) {
      setInvalidDate(true)
    }
    else {
      const validDate = new Date(moment(dob, "MM-DD-YYYY"))
      if (new Date(moment().format("MM-DD-YYYY")) < validDate) setInvalidDate(true)
      else setUserDob(validDate.toString())
    }
    setDateChecked(true)
  }, [dob])

  useEffect(() => {
    if (!signFetched && userDob && dateChecked) {

      fetchSign()
    }
    setSignUpdated(true)
  }, [dateChecked, fetchSign, signFetched, userDob])

  useEffect(() => {

    if (!Object.keys(yearSigns).length) {
      fetchSigns()
    }
  }, [fetchSigns, getSign, sign, yearSigns])

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

  const mintSign = useCallback(async (txHash) => {
    const dob = moment(new Date(localStorage.getItem("dob"))).format('YYYY-MM-DD')
    const data = {
      user_address: ethAccount,
      transaction_hash: txHash,
      dob,
      sign_hash: sign.hash
    }
    await api({
      method: "POST",
      url: `/users/mint/`,
      data
    }).then(data => {
      if (data.status === 200)
        setMinting(false)
      setTransactionHash(data.data.sign.transaction_hash)
      let updatedSign = sign
      updatedSign.minted = true
      getSign(updatedSign)
    })
      .catch(err => {
        setMinting(false)
        if (err.response) {
          console.log(err.response)

        } else if (err.request) {
          console.log(err.request)
        }
      })
  }, [ethAccount, getSign, sign])

  const handleMintNFT = (e) => {
    e.preventDefault()
    setEthBrowserError(false)
    ethBrowserPresent().then(status => {
      if (!status) { setEthBrowserError(true); return }
      setMinting(true)
      getAccount(true).then(acc => {
        if (!acc) { setMinting(false); return }
        payMintingFee({ amountToSend: sign.minting_fee }).then(data => {
          if (!data) { setMinting(false); return }
          const { transactionHash, errorMessage } = data
          if (errorMessage) { setMintingError(errorMessage); setMinting(false); return }
          else { mintSign(transactionHash) }
        })
      })
    })
  }
  useEffect(() => {
    if (ethAccount && sign) {
      if (!sign.minted && !signCheckedMinted) {
        verifyMinted(sign.hash, ethAccount).then((isMinted) => {
          let updatedSign = sign
          updatedSign.minted = isMinted
          getSign(updatedSign)
          setSignCheckedMinted(true)
        })
      }
    }
  }, [ethAccount, getSign, sign, signCheckedMinted])

  const handleMessageClick = (() => {
    setMintingError(null)
  })

  useEffect(() => {
    if (signUpdated) {
      if (sign && !!Object.keys(yearSigns).length) {
        getCompatibility()
      }
    }
  }, [getCompatibility, sign, signUpdated, yearSigns])
  return (
    <React.Fragment>
      {spinnerOpen && <SimpleBackdrop open={spinnerOpen} />}
      {ethBrowserError && <Message />}
      {invalidDate && <Error404Page />}

      {sign && <Container maxWidth="lg" component="main">
        <SignHeader post={{ title: sign.name, description: sign.description, image: sign.image_url }} />
        {transactionHash && <span>
          Your transaction is being processed. For more details, click <a rel="noopener noreferrer" href={`${Config.TX_EXPLORER}/${transactionHash}`} target="_blank">here</a> to view it <br />
          Your minted NFT should be listed in your <a href="/my-signs">NFT page</a> within 5 minutes of the transaction completion.
        </span>}
        {mintingError &&
          <AlertMessage message={mintingError} handleMessageClick={handleMessageClick} />
        }
        {!transactionHash && sign && sign.day_animal &&
          <span>
            {sign.minted ?
              <Fab size="small" variant="extended" className={classes.mintedIcon} >
                <VerifiedUserOutlinedIcon className={classes.extendedIcon} />
                Minted
              </Fab>
              : !minting && !mintingError ?
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
