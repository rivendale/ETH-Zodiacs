import React, { useState, useContext, Fragment, useEffect } from "react";
import {
    colors,
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
    Paper,
    CardActionArea,
    Hidden,
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
import Carousel from 'react-material-ui-carousel'

var items = [
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/rat_rlchaa.png",
        name: "Rat",
        description: "First position in zodiac makes you charming and creative. Well, you are one analytical soul who loves to dig down deeper in everything you take up. A curious mind that always searching for something. Highly intelligent and one your own kind. Born optimistic, you seem to have a solution for everything. Sense of humor comes naturally to you so is your energetic attitude towards life."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/ox_a1bttx.png",
        name: "Ox",
        description: "Your home is very important. It is usually neat and organized, comfortable. Comfort is your top priority, and owing to your love of nature, you prefer living in a rural area rather than in a big city. You find solace in tending and planting your gardens, landscaping beautiful homes, and working the land. You are very responsible towards your family and friends. You willing to sacrifice anything for the welfare of your family. You are strong, disciplined, and do not take any shortcuts in life, but somehow, you need to learn to loosen up a little, become more humorous, and enjoy life to the fullest."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615526208/tiger_mi16hj.png",
        name: "Tiger",
        description: "Truly, you would make a fine revolutionary. You are playful and unpredictable, daring and reckless. Always hating to be ignored, you love the spotlight and crave attention. You jump into action and sometimes regret it afterward. Life with a Tiger is bound to be a colorful, volatile roller-coaster ride. It will be filled with joy, laughter, tears, and despair.  Money doesn’t impress you, nor does it motivate you. You’re  known for your generosity. Travel is many times a favorite leisure activity. Exotic getaways where tourists are rare suit you well. Although loyal and generous, you prefer to be in charge and never remain long in a subordinate position."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/rabbit_sjt1gi.png",
        name: "Rabbit",
        description: "Even though you are popular and loved by your friends and family, Rabbit people are pessimistic under the surface. You are sympathetic and truly soft at heart which makes you a famous socially. You are polite and gracious, and no one has such impeccable manners. Incapable of harsh words, you always try hard to keep the peace and make everyone happy. You don’t like to argue, and you’d rather enjoy a quiet, peaceful life. You can be very affectionate and obliging, but only to the ones you love."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/dragon_icj3pt.png",
        name: "Dragon",
        description: "You are born thinking you are perfect, and this makes you quite inflexible. Honor and integrity is your middle name, and you usually set up extremely high standards and rules to live by.  The leadership qualities you possess is so powerful that it probably emerges during childhood. You are often envied by others for your good fortune and good luck, you can do anything you want. In others for your good fortune and good luck, you can do anything you want. Outspoken, lucky, and financially fortunate, you show boundless energy and vitality."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/snake_jjbas8.png",
        name: "Snake",
        description: "You choose your friends carefully and can be extremely generous to them with your time and advice. You tend to exaggerate everything around you. You are clever and capable and do not like to waste time. You are a deep thinker who is always looking for opportunities. You know how to showcase your talents for the right promotion or get themselves noticed. You like to plan and calculate everything ahead, and then proceed in the most cost-and time-effective way. You are considerate and sensitive too."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/horse_flupw4.png",
        name: "Horse",
        description: "Enthusiastic and frank, you are quite lovable and easy to get along with. Charming and cheerful, you are very likable. Your vivacity and enthusiasm make you popular. Extroverted, energetic, and defiant against injustice, the Horse gallops valiantly through life, hurdling adversity and obstacles. Friendly, intelligent, and independent, noble quests and searches for greener pastures are your common traits. You have inexhaustible energy (including potent sexuality), yet are easygoing, witty, honest, and outspoken. You love being in a crowd and are quite a party animal. Impulsive as you appear, you know how to sway your audience and when it is the right time to stop for applause. You know that you are more cunning than intelligent."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/goat_nibmxx.png",
        name: "Goat",
        description: "Goat are gentle and reflective, constructively applying their intelligence to the prevention of harm. You cannot live without beauty, and you strive for tranquility. Peace-loving, ardent, and easygoing, you can get along with nearly everyone. Goat are the most sensitive of all the signs. This gentle soul is compassionate and loving, but tends toward moodiness and finds it difficult to work under pressure. You flourish in an environment where they can work at their own pace, in spaces that are aesthetically pleasing, and surrounded by approval, love, and support. You are sometimes potentially vulnerable and needy."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/monkey_zf2im5.png",
        name: "Monkey",
        description: "You cannot stand boredom, ill will, or rejection. Monkey-souls are competitive yet jovial companions. You feel comfortable speaking in public and is an excellent candidate for careers in politics, public relations, and teaching. You are popular and optimistic with almost everyone, and have a myriad of interests in life. No party can be complete without a Monkey guest because you know how to entertain and love to do so."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/rooster_ignojl.png",
        name: "Rooster",
        description: "You’ll spend whatever time it takes to achieve just the right look – though your will always be punctual. You are organized, a trait that’s reflected in your orderly homes.  When you love and admire someone, you will bend over backwards or even catch the moon just to keep the other person happy."
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/dog_jeb6ft.png",
        name: "Dog",
        description: "Slow to make close friends, few people are judged worthy of entering into your close circle. You will be frank with you when you are wrong, and will be ready to fight for you when you are being wronged. Usually animated and attractive, you have a unique sense of humor. A pessimist at heart, a dog thinks the worst is yet to come and is constantly anxious and doubtful about her own ability. "
    },
    {
        imgUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/pig_cg6lje.png",
        name: "Pig",
        description: "You are everyone’s best friend and a supportive team member. You are completely devoted and will sacrifice your own welfare for others. Your love for food and luxury makes you excellent chefs or restaurant owners. You are romantic, affectionate, and monogamous once you commit to a relationship."
    },

]

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
    pageTitle: {
        color: "#312E58",
        fontWeight: " bold",
        fontSize: " 1.8em",
        textTransform: " capitalize",
        margin: ".9em",
        padding: theme.spacing(2),
        width: "100%",
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
    },
    carouselCard: {
        display: 'flex',
        // minHeight: theme.spacing(45),
    },
    carouselCardDetails: {
        flex: 1,
        width: "100%",
        padding: theme.spacing(2),
        display: "grid",
        minHeight: theme.spacing(40),
    },
    carouselCardMedia: {
        width: 300,
    },
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
                    <Typography>
                        <b>
                            Enter your Date of birth and get your NFT
                        </b>
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
                    {!nfts?.total && <Typography
                        className={classes.pageTitle}
                        variant="h5"
                        color="textSecondary"
                        component={Paper}
                        elevation={2}
                        align="center">
                        Be the first to mint your own Zodiac Sign NFT!
                    </Typography>}
                    {!nfts?.total && <Carousel
                        animation="slide"
                        navButtonsAlwaysVisible
                        timeout={1000}
                        interval={6000}
                    >
                        {items.map((item, i) =>
                            <Grid item xs={12} key={i}>
                                <CardActionArea component="div">
                                    <Card className={classes.carouselCard}>
                                        <div className={classes.carouselCardDetails}>

                                            <CardContent
                                                style={{ gridArea: "1 / 1", zIndex: "1" }}
                                            >
                                                <Typography component="h2" variant="h5">
                                                    <b>
                                                        {item.name}
                                                    </b>
                                                </Typography>
                                                <Typography variant="subtitle1" paragraph>
                                                    {item.description}
                                                </Typography>
                                            </CardContent>
                                            <Hidden smUp>
                                                <CardMedia
                                                    component="div"
                                                    style={{ gridArea: "1 / 1", filter: "blur(2px)" }}
                                                    title={item.name}

                                                >
                                                    <BackgroundImage
                                                        src={item.imgUrl}
                                                        width="100%"
                                                        height="100%"
                                                        alt={item.name}
                                                        isResponsive
                                                        className={classes.cardImage}
                                                        lazyLoad
                                                    />
                                                </CardMedia>
                                            </Hidden>
                                        </div>
                                        <Hidden xsDown>
                                            <CardMedia className={classes.carouselCardMedia} image={item.imgUrl} title={item.name} />
                                        </Hidden>
                                    </Card>
                                </CardActionArea>
                            </Grid>
                        )}
                    </Carousel>}
                    {!!nfts?.total && <Typography
                        className={classes.pageTitle}
                        variant="h5"
                        color="textSecondary"
                        component={Paper}
                        elevation={2}
                        align="center">
                        Here are some minted zodiac signs
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
                                                    src={`https://api.allorigins.win/raw?url=${nft.image_url}`}
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