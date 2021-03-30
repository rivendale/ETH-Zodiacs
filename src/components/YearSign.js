import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Typography, Container, Grid, makeStyles } from '@material-ui/core';
import SignHeader from './SignHeader';
import Compatibility from './Compatibility.js';
import Main from './Report';
import Sidebar from './Sidebar';
import { GlobalContext } from "../context/GlobalState";
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


export const YearSign = ({ history, match }) => {
  const classes = useStyles();
  const { yearSigns, sign, getYearSigns, getSign } = useContext(GlobalContext);
  const [bestCompatibility, setBestCompatibility] = useState([]);
  const [worstCompatibility, setWorstCompatibility] = useState([]);
  const [userSign, setUserSign] = useState({});
  const [signs, setSigns] = useState({});
  const [loading, setLoading] = useState(false);
  const [signUpdated, setSignUpdated] = useState(false);
  let signId = match.params.signId

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


  useEffect(() => {
    if (sign && sign.id) {
      setUserSign(sign)
    }
  }, [sign])

  useEffect(() => {
    if (!!Object.keys(yearSigns).length) {
      setSigns(yearSigns)
    }
    else {
      fetchSigns()
    }
  }, [fetchSigns, signId, signs, yearSigns])

  useEffect(() => {
  }, [getSign, signId, signs])
  if (!!Object.keys(signs).length && !signUpdated && !sign.id) {
    try {
      const zodiacSign = signs.find(x => x.id === +signId)
      setUserSign(zodiacSign)
      setSignUpdated(true)

    } catch (error) {
      console.log(error)

    }
  }

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
    localStorage.setItem("sign", JSON.stringify(zodiacSign))
    history.push(`/zodiac-sign/${value}`)
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
