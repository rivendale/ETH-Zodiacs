import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Typography, Container, Grid, makeStyles } from '@material-ui/core';
import SignHeader from './SignHeader';
import Compatibility from './Compatibility.js';
import Main from './Report';
import Sidebar from './Sidebar';
import { GlobalContext } from "../context/GlobalState";
import api from '../api';
import { Spinner } from './common/Loaders';
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


export const YearSign = ({ history, match }) => {
  const classes = useStyles();
  const { yearSigns, sign, getYearSigns, getSign } = useContext(GlobalContext);
  const [bestCompatibility, setBestCompatibility] = useState([]);
  const [worstCompatibility, setWorstCompatibility] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [signUpdated, setSignUpdated] = useState(true);
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

    if (!Object.keys(yearSigns).length) {
      fetchSigns()
    }
    else if (!!Object.keys(yearSigns).length && !sign) {
      const zodiacSign = yearSigns.find(x => x.id === +signId)
      if (zodiacSign) getSign(zodiacSign)
      else setNotFound(true)
      console.log(zodiacSign)
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


  useEffect(() => {
    if (signUpdated) {
      if (sign && !!Object.keys(yearSigns).length) {
        getCompatibility()
      }
    }
  }, [getCompatibility, sign, signUpdated, yearSigns])
  return (
    <React.Fragment>
      {notFound && <Error404Page />}
      {sign && <Container maxWidth="lg" component="main">
        <SignHeader signId={signId} history={history} post={{ title: sign.name, description: sign.description, image: sign.image_url }} />
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
