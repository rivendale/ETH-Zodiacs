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
    withStyles,
    Card,
    CardMedia,
    CardContent,
    CardActions,
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
import LazyLoad from 'react-lazyload';
import { EthIcon } from "./common/EthIcon";

import Tooltip from '@material-ui/core/Tooltip';
import { CustomSnackbar } from "./common/SnackBar";
import { BackgroundImage } from "react-image-and-background-image-fade";


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
        // height: "60vh",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // margin: theme.spacing("auto"
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
        margin: theme.spacing(3, 0, 2),
    },
    cardDetail: {
        display: 'flex',
        alignItems: 'baseline',
        height: '6vh',
        margin: theme.spacing(1, 1, 0),
    },
    mainCard: {
        minHeight: '60vh',
        // margin: "auto",
        // "@media (max-width: 955px)": {
        //     minHeight: '20vh'
        // },

    },
    card: {
        // display: 'block',
        // height: '60vh',
        transitionDuration: '0.3s',
        background: "#FFFFFF",
        border: "1px solid #F6FAFF",
        boxSizing: "border-box",
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
    },
    cardMedia: {
        // filter: "blur(4px)",
        height: '40vh',
        top: "10px",
        // "@media (max-width: 1113px)": {
        //     minHeight: '20vh'
        // },
        // height: "18vh",
    },
    cardImage: {
        // height: " 45vh",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: "center top",
        // [theme.breakpoints.down('sm')]: {
        //     height: " 45vh",
        // },
        // [theme.breakpoints.down('xs')]: {
        //     height: " 55vh",
        // }
    },
    ul: {
        listStyle: "none",
        padding: "0"
    }
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
export const Home = () => {
    const classes = useStyles(theme);
    const { sign, yearSigns, getYearSigns } = useContext(GlobalContext);
    const [selectedDate, setDate] = useState(moment());
    const [dob, setDob] = useState(moment().format("MM-DD-YYYY"));
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [signsFetched, setSignsFetched] = useState(false);
    // const [nftsFetched, setNftsFetched] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    // const [nftVariables, setNftVariables] = useState({
    //     page: 1, per_page: 10
    // })
    const [nfts, setNfts] = useState(null);
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
    const fetchNfts = async () => {
        // use the await keyword to grab the resolved promise value
        // remember: await can only be used within async functions!
        await api({
            method: "GET",
            url: `nfts/`
        }).then(data => {
            setNfts(data.data.nfts)
            // setNftsFetched(true)
        })
            .catch(err => {
                // setNftsFetched(true)

                if (err.response) {
                    console.log(err.response)
                } else if (err.request) {
                    console.log(err.request)
                }
            })
    }
    useEffect(() => {
        if (!nfts) {
            fetchNfts()
        }
    }, [nfts])


    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (date, value) => {
        setDob(value)
        setDate(date);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        history.push({ pathname: `/sign/${btoa(dob).replace("==", "")}` })
    }
    const dateFormatter = str => {
        return str;
    };


    const copyToClipboard = (content) => {
        const el = document.createElement('textarea');
        el.value = content;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setOpenSnackBar(true)
    };
    const handleCloseSnackbar = () => {
        setOpenSnackBar(false)
    }
    return (
        <Fragment>
            {openSnackBar && <CustomSnackbar message="Address copied" open={openSnackBar} handleClose={handleCloseSnackbar} />}
            <Container component="main" maxWidth="lg" className={classes.root}>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}></Avatar>
                    <Typography component="h1" variant="h5">
                        Enter your Date of birth
                    </Typography>
                    <Container maxWidth="xs">
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
                                Get Your Sign!
                            </Button>
                        </form>
                    </Container>
                    {nfts && <Typography
                        style={{ color: "#312E58", fontWeight: " bold", fontSize: " 1.8em", textTransform: " capitalize", margin: ".9em" }}
                        variant="h5"
                        color="textSecondary"
                        align="center">
                        Here are some minted signs
                    </Typography>}
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            {nfts && nfts.items.map((nft, k) =>
                                <Grid item key={k} xs={12} sm={6} md={4} className={classes.mainCard}>
                                    <Card className={classes.card}>
                                        <LazyLoad height="140" offsetVertical={300} once offset={100}>


                                            <CardMedia
                                                component="div"
                                                // style={{ backgroundImage: `url(${nft.image_url})` }}
                                                // alt={nft.token_metadata.name}
                                                title={nft.token_metadata.name}
                                                className={classes.cardImage}

                                            >
                                                <BackgroundImage
                                                    src={nft.image_url}
                                                    width="100%"
                                                    height="90%"
                                                    alt={nft.token_metadata.name}
                                                    isResponsive
                                                    className={classes.cardImage}
                                                    lazyLoad
                                                />
                                            </CardMedia>
                                        </LazyLoad>

                                        <CardContent style={{ display: "grid" }} >
                                            <div className={classes.cardMain}>
                                                <div className={classes.cardDetail}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={6}>
                                                            <Typography style={{ fontWeight: "800" }} component="h4" variant="h5" color="textPrimary">
                                                                {nft.token_metadata.name}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography>

                                                                <HtmlTooltip
                                                                    title={
                                                                        <React.Fragment>
                                                                            <Typography color="inherit">NFT owner</Typography>
                                                                            <em>{nft.user_address}</em> <br />  <b>{'Click the address to copy'}</b>
                                                                        </React.Fragment>
                                                                    }
                                                                >
                                                                    <Button onClick={(e) => { e.preventDefault(); copyToClipboard(nft.user_address) }}>

                                                                        <EthIcon id="eth-account" ethAccount={nft.user_address} />
                                                                    </Button>
                                                                </HtmlTooltip>
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                                <ul className={classes.ul}>
                                                    <Typography component="p" variant="subtitle1">
                                                        {nft.token_metadata.report[Math.floor(Math.random() * nft.token_metadata.report.length)].replace(/(.{150})..+/, "$1…")}
                                                    </Typography>
                                                </ul>
                                            </div>
                                        </CardContent>
                                        <CardActions className={classes.card}>
                                            <Button style={{ color: "#312E58" }} className={classes.button} href={`/nft/${nft.token_id}`} fullWidth variant="outlined" color="primary">
                                                NFT Details
                                            </Button>
                                        </CardActions>

                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </Container>
                </div>
            </Container>
            {sign && <SignModal sign={sign} open={open} handleClose={handleClose} />}
        </Fragment>
    );
}