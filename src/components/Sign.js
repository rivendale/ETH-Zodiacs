import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Typography, Container, Grid, makeStyles, Fab, Box, Paper, Button } from '@material-ui/core';
import SignHeader from './SignHeader';
import Compatibility from './Compatibility.js';
import Main from './Report';
import Sidebar from './Sidebar';
import { GlobalContext } from "../context/GlobalState";
import api from '../api';
import { LinearLoader, SimpleBackdrop, Spinner } from './common/Loaders';
import { ethBrowserPresent, getAccount, getChainId, payMintingFee, verifyMinted } from './eth/EthAccount';
import Message from './common/MessageDialog';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import DeviceHubOutlinedIcon from '@material-ui/icons/DeviceHubOutlined';
import { EthContext } from '../context/EthContext';
import Config from '../config';
import { AlertMessage } from './common/Alert';
import moment from "moment";
import { Error404Page } from './common/Error404Page';
import Alert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';

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
  mintingDisplay: {
    width: "65%",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
    }
  },
  maticLogo: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    margin: theme.spacing("auto", 1, "auto", 2),

  },
  mintingFee: {
    margin: theme.spacing("auto", 0),
  },
  mintingFeeDisplay: {
    padding: theme.spacing(1),
  },
  editButton: {
    textTransform: "none",
    borderRadius: ".7em",
    whiteSpace: "nowrap",
    border: '1px solid #018AF2',
    color: "#312E58",
  },
}));


export const Sign = ({ history, match }) => {
  const classes = useStyles();
  const { yearSigns, sign, getYearSigns, getSign } = useContext(GlobalContext);
  const { ethAccount, accountStats, getAccountStats, chainId, getEthAccount, getEthChainId } = useContext(EthContext);
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
  const [dob, setDob] = useState(null)

  // let dob = match.params.dob

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
    let ethAcc = ethAccount || ""
    const { month, day, year } = userDob
    await api({
      method: "GET",
      url: `signs/query/?year=${year}&month=${month}&day=${day}&address=${ethAcc}`
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
    try {
      const param = atob(match.params.dob + "==")
      setDob(param)
    } catch (error) {
      setInvalidDate(true)
    }
    if (dob) {
      const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])-(19|20)\d{2}$/;
      if (!(dateRegex.test(dob))) {
        setInvalidDate(true)
      }
      else {
        const validDate = new Date(moment(dob, "MM-DD-YYYY"))
        if (new Date(moment().format("MM-DD-YYYY")) < validDate) setInvalidDate(true)
        else {
          const checked = moment(dob, "MM-DD-YYYY")
          const month = checked.format('M');
          const day = checked.format('D');
          const year = checked.format('YYYY');
          setUserDob({ month, day, year })
        }
      }
      setDateChecked(true)
    }
  }, [dob, match.params.dob])

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
  useEffect(() => {
    ethBrowserPresent().then(res => { setEthBrowserError(!res) })
  }, [])

  const connectAccount = async () => {
    if (!ethAccount) {
      const isEthBrowserPresent = await ethBrowserPresent()
      if (isEthBrowserPresent) {
        const account = await getAccount(true)
        getEthAccount(account)
        if (account) {
          getChainId().then(chainId => {
            getEthChainId(chainId)
          })
        }
      }
      else
        setEthBrowserError(true)
    }
  };
  const mintSign = useCallback(async (txHash) => {
    const data = {
      user_address: ethAccount,
      transaction_hash: txHash,
      dob: moment(dob).format('YYYY-MM-DD'),
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
      let updatedStats = accountStats
      updatedStats.pending_mints += 1
      updatedSign.minted = true
      getSign(updatedSign)
      getAccountStats(updatedStats)
    })
      .catch(err => {
        setMinting(false)
        if (err.response) {
          console.log(err.response)

        } else if (err.request) {
          console.log(err.request)
        }
      })
  }, [accountStats, dob, ethAccount, getAccountStats, getSign, sign])

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
          Your minted NFT should be listed in your <a href="/profile">NFT page</a> within 5 minutes of the transaction completion.
        </span>}
        {mintingError &&
          <AlertMessage message={mintingError} handleMessageClick={handleMessageClick} />
        }
        {!!(chainId && chainId !== 137) &&
          <div className={classes.mintingDisplay}>
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Please select Matic/Polygon Network in Metamask to mint NFT.
            </Alert>
          </div>
        }
        {!ethAccount && !ethBrowserError &&
          <Box>
            <Button startIcon={<SettingsEthernetIcon color="primary" />} onClick={connectAccount} variant="outlined" className={classes.editButton}>
              Connect your wallet to mint NFT
            </Button>
          </Box>}
        {!!(chainId && chainId === 137) && !transactionHash && sign && sign.day_animal &&
          <span>
            {sign.minted ?
              <Button startIcon={<VerifiedUserOutlinedIcon color="secondary" />} onClick={connectAccount} variant="outlined" className={classes.editButton}>
                NFT Minted
              </Button>
              : !minting && !mintingError ?
                <Grid container spacing={2}>
                  <Grid item sm={12} md={2}>
                    <Fab onClick={handleMintNFT} size="large" disabled={minting} variant="extended" style={{ textTransform: "none", padding: "1.2em" }}>
                      <DeviceHubOutlinedIcon className={classes.extendedIcon} />
                      Mint NFT
                    </Fab>
                  </Grid>
                  <Grid item sm={12} md={10}>
                    <Box component="span" display="flex" justifyContent="center" alignItems="left" className={classes.mintingDisplay}>
                      <Box elevation={2} component={Paper} display="flex" justifyContent="left" alignItems="left" className={classes.mintingFeeDisplay}>
                        <img src={"/assets/images/polygon-matic-logo.svg"} alt="minting" className={classes.maticLogo} />
                        <Typography className={classes.mintingFee}>
                          Mint this NFT for <b>{sign.minting_fee} Matic</b>  and Join the club
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                : minting ?
                  <div className={classes.mintingDisplay}>
                    Minting NFT... (Do not exit this page)
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
