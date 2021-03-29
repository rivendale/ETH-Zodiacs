import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Typography, Container, Grid, makeStyles } from '@material-ui/core';
import SignHeader from './SignHeader';
import Compatibility from './Compatibility.js';
import Main from './Report';
import Sidebar from './Sidebar';
import { GlobalContext } from "../context/GlobalState";
import { useHistory } from 'react-router';
import api from '../api';
import { Spinner } from './common/Loaders';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  compatibility: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));


export const YearSign = () => {
  const classes = useStyles();
  const { yearSigns, sign, getYearSigns, getSign } = useContext(GlobalContext);
  const [bestCompatibility, setBestCompatibility] = useState([]);
  const [worstCompatibility, setWorstCompatibility] = useState([]);
  const [userSign, setUserSign] = useState({});
  const [signs, setSigns] = useState({});
  const [loading, setLoading] = useState(false);
  const [signUpdated, setSignUpdated] = useState(true);
  const history = useHistory()

  useEffect(() => {
    if (sign.id) {
      setUserSign(sign)
    }
    else if (localStorage.getItem("sign")) {
      setUserSign(JSON.parse(localStorage.getItem("sign")))
    }
  }, [sign])

  useEffect(() => {
    if (!!Object.keys(yearSigns).length) {
      setSigns(yearSigns)
    }
    else if (localStorage.getItem("yearSigns")) {
      setSigns(JSON.parse(localStorage.getItem("yearSigns")))
    }
  }, [yearSigns])

  const fetchSigns = useCallback(async () => {
    setLoading(true)
    await api({
      method: "GET",
      url: `year/`
    }).then(data => {
      getYearSigns(data.data.signs)
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

  const getCompatibility = useCallback(() => {
    setBestCompatibility([])
    signs.forEach(i => {
      if ((i.name !== userSign.name) && userSign.best_compatibility.indexOf(i.name) > -1) {
        setBestCompatibility(bestCompatibility => [...bestCompatibility, i])
      }
    })


    setWorstCompatibility([])
    signs.forEach(i => {
      if ((i.name !== userSign.name) && userSign.worst_compatibility.indexOf(i.name) > -1) {
        setWorstCompatibility(worstCompatibility => [...worstCompatibility, i])
      }
    })

    setSignUpdated(false)
  }, [signs, userSign.best_compatibility, userSign.name, userSign.worst_compatibility])
  useEffect(() => {
    if (userSign.id) {
      if (!signs.length) {
        fetchSigns()
      }
    }
  }, [bestCompatibility.length, fetchSigns, getCompatibility, signs, userSign.id])

  const handleClick = (e, value) => {
    e.preventDefault()
    const zodiacSign = signs.find(x => x.id === value)
    getSign(zodiacSign)
    setSignUpdated(true)
    history.push(`/zodiac-sign/${zodiacSign.id}`)
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevSign = usePrevious(userSign)
  useEffect(() => {
    if (signUpdated) {
      if (userSign.id && !!Object.keys(signs).length) {
        getCompatibility()
      }
      if (prevSign && (!!Object.keys(prevSign).length) && (userSign.id) && (prevSign.id !== userSign.id)) {
        console.log(prevSign.id, userSign.id)
        // getCompatibility()
      }
    }
  }, [getCompatibility, prevSign, signUpdated, signs, userSign.id])

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        {userSign.id && <main>
          <SignHeader post={{ title: userSign.name, description: userSign.description, image: userSign.image_url }} />
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="Rat Description" report={userSign.report} />
            <Sidebar
              positiveTraits={userSign.positive_traits.join(', ')}
              negativeTraits={userSign.negative_traits.join(', ')}
              monthAnimal={userSign.month_animal}
              dayAnimal={userSign.day_animal}
              element={userSign.element}
              force={userSign.force}
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
        </main>
        }
      </Container>
    </React.Fragment>
  );
}
