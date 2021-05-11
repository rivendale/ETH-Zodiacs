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
import { SimpleBackdrop } from './common/Loaders';


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
    const { getSign, sign, yearSigns, getYearSigns } = useContext(GlobalContext);
    const [selectedDate, setDate] = useState(moment());
    const [dob, setDob] = useState(moment().format("MM-DD-YYYY"));
    const [open, setOpen] = useState(false);
    const [spinnerOpen, setSpinnerOpen] = useState(false);


    const history = useHistory()

    // the callback to useEffect can't be async, but you can declare async within
    const fetchSign = async () => {
        // use the await keyword to grab the resolved promise value
        // remember: await can only be used within async functions!
        setSpinnerOpen(true)
        let dateOfBirth = new Date(dob);
        await api({
            method: "GET",
            url: `signs/query/?year=${dateOfBirth.getFullYear()}&month=${dateOfBirth.getMonth() + 1}&day=${dateOfBirth.getUTCDate() + 1}`
        }).then(data => {
            // update local state with the retrieved data
            getSign(data.data.sign)
            localStorage.setItem("sign", JSON.stringify(data.data.sign))
            setSpinnerOpen(false)
            history.push({
                pathname: `/zodiac-sign/${data.data.sign.id}`,
                state: { userSign: data.data.sign }
            })
            // setOpen(true);
        })
            .catch(err => {
                if (err.response) {
                    console.log(err.response)
                } else if (err.request) {
                    console.log(err.request)
                    setSpinnerOpen(false)
                }
            })
    }

    // the callback to useEffect can't be async, but you can declare async within
    const fetchSigns = async () => {
        // use the await keyword to grab the resolved promise value
        // remember: await can only be used within async functions!
        // setSpinnerOpen(true)
        // let dateOfBirth = new Date(dob);
        await api({
            method: "GET",
            url: `signs/year/`
        }).then(data => {
            getYearSigns(data.data.signs)
        })
            .catch(err => {
                if (err.response) {
                    console.log(err.response)
                } else if (err.request) {
                    console.log(err.request)
                }
            })
    }
    useEffect(() => {
        if (!yearSigns.length) {
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
        fetchSign()
    }
    const dateFormatter = str => {
        return str;
    };
    return (
        <Fragment>
            {
                spinnerOpen === true ?
                    <SimpleBackdrop open={spinnerOpen} /> :
                    <Container component="main" maxWidth="xs">
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
                                            <KeyboardDatePicker
                                                autoOk={true}
                                                showTodayButton={true}
                                                label="Date of Birth"
                                                variant="outlined"
                                                required={true}
                                                fullWidth
                                                value={selectedDate}
                                                format="MM-DD-YYYY"
                                                inputValue={dob}
                                                onChange={handleChange}
                                                rifmFormatter={dateFormatter}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Get Sign
                        </Button>
                            </form>
                        </div>
                    </Container>}
            {sign && <SignModal sign={sign} open={open} handleClose={handleClose} />}
        </Fragment>
    );
}