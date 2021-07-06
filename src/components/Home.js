import React, { useState, useContext, Fragment, useEffect } from "react";
import {
    colors,
    Avatar,
    CssBaseline,
    Typography,
    Container,
    createMuiTheme,
    Grid,
    makeStyles,
    Button,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import api from "../api";
import { GlobalContext } from "../context/GlobalState";
import { SignModal } from "./SignModal";
import MomentUtils from "@date-io/moment";
import moment from "moment";


const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#556cd6"
        },
        secondary: {
            main: "#19857b"
        },
        error: {
            main: colors.red.A400
        },
        background: {
            default: "#fff"
        }
    }
});
const useStyles = makeStyles((theme) => ({
    root: {
        height: "60vh"
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));
export const Home = () => {
    const classes = useStyles(theme);
    const { sign, yearSigns, getYearSigns } = useContext(GlobalContext);
    const [selectedDate, setDate] = useState(moment());
    const [dob, setDob] = useState(moment().format("MM-DD-YYYY"));
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [signsFetched, setSignsFetched] = useState(false);

    const history = useHistory()


    // the callback to useEffect can't be async, but you can declare async within
    const fetchSigns = async () => {
        // use the await keyword to grab the resolved promise value
        // remember: await can only be used within async functions!
        await api({
            method: "GET",
            url: `signs/year/`
        }).then(data => {
            getYearSigns(data.data.signs)
            setSignsFetched(true)
        })
            .catch(err => {
                setSignsFetched(true)

                if (err.response) {
                    console.log(err.response)
                } else if (err.request) {
                    console.log(err.request)
                }
            })
    }
    useEffect(() => {
        if (!yearSigns.length && !signsFetched) {
            fetchSigns()
        }
    })


    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (date, value) => {
        setDob(value)
        setDate(date);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        history.push({ pathname: `/sign/${dob}` })
    }
    const dateFormatter = str => {
        return str;
    };
    return (
        <Fragment>
            <Container component="main" maxWidth="xs" className={classes.root}>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}></Avatar>
                    <Typography component="h1" variant="h5">
                        Enter your Date of birth
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                                    <Grid container justify="space-around">
                                        <KeyboardDatePicker
                                            autoOk
                                            showTodayButton
                                            animateYearScrolling
                                            label="Date of Birth"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            value={selectedDate}
                                            format="MM-DD-YYYY"
                                            placeholder="MM-DD-YYYY"
                                            inputValue={dob}
                                            onChange={handleChange}
                                            rifmFormatter={dateFormatter}
                                            disableFuture
                                            onError={(e) => (setError(!!e))}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={error}
                        >
                            Get Sign
                        </Button>
                    </form>
                </div>
            </Container>
            {sign && <SignModal sign={sign} open={open} handleClose={handleClose} />}
        </Fragment>
    );
}