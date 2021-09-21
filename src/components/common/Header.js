import React, { Fragment, useCallback, useContext, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Box, Button } from '@material-ui/core';
import { Link, Link as RouterLink } from "react-router-dom";
import { DeviceContext } from '../../context/DeviceContext';
import { EthContext } from '../../context/EthContext';
import {
    addressStats, ethBrowserPresent,
    getAccount, getConnectedAccount,
    getChainId
} from '../eth/EthAccount';
import HomeIcon from '@material-ui/icons/Home';
// import ClearAllIcon from '@material-ui/icons/ClearAll';
import PersonIcon from '@material-ui/icons/Person';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
// import { readProfile, authenticate3Id } from '../eth/identity';
import { StyledBadge } from './StyledBadge';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 0,
    },
    appBar: {
        backgroundColor: "#E0EDFF",
        // backgroundColor: "red",
        boxShadow: "none",
        color: "black",
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: theme.zIndex.drawer + 100,

    },
    appBarShift: {
        color: "black",
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: "black",
        textTransform: "none",
    },
    authButton: {
        margin: theme.spacing("auto", 3),
        padding: theme.spacing(1, 2.5),
        textTransform: "none",
        borderRadius: ".9em",
        whiteSpace: "nowrap",
        "@media (max-width: 1047px)": {
            margin: theme.spacing("auto", "auto", "auto", 1),
        },

    },
    mobileAuthButtons: {
        margin: theme.spacing(2, 2, 2, "auto"),
    },
    logo: {
        display: "flex",
        justifyContent: "center",
    },
    logoText: {
        margin: theme.spacing("auto", 1),
        textTransform: "none"
    },
    logoImage: {
        maxWidth: 45,
        // cursor: "pointer",
        // "@media (max-width: 900px)": {
        //     display: "none",
        // },
    },
    hide: {
        display: 'none',
    },
    authButtons: {
        display: "flex",
        // justifyContent: "space-between",
        justify: "space-evenly",
        // margin: theme.spacing("auto", 28),
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toggleIcon: {
        width: "5.1em",
        cursor: "pointer"
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    navigation: {
        marginLeft: theme.spacing(5),
        flexGrow: 1,
    },
    username: {
        // fontSize: "10px",
        margin: theme.spacing("auto", 1),
        whiteSpace: "nowrap",
    },
    // fontSize: "10px",
    rounded: {
        color: '#fff',
        backgroundColor: "#C2DAFF",
        margin: theme.spacing("auto", 1),
        width: "120px",
        borderRadius: ".6em",
    },
    toggleWrapper: {
        margin: theme.spacing("auto", 1, "auto", 1),
    },
    toggleTextOn: {
        margin: theme.spacing("auto", 1),
        color: "#312E58"
    },
    toggleTextOff: {
        margin: theme.spacing("auto", 1),
        color: "#A09FB2"
    },
    icon: {

        width: theme.spacing(4),
        height: theme.spacing(4),
        borderRadius: "50%",
        border: '1px solid #8247e5'

    },
    displayNone: {
        display: 'none',
    },
}));
const headersRawData = [
    {
        label: "Home",
        href: "/",
        icon: <HomeIcon />,
    },
    // {
    //     label: "All Signs",
    //     href: "/year-signs",
    //     icon: <ClearAllIcon />,
    // },
    {
        label: "My Profile",
        href: "/profile",
        icon: <PersonIcon />,
    },
];


const getWidth = () => window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

export default function Header() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { smDeviceView, mobileView, setMobileDevice, setSmallDevice } = useContext(DeviceContext)
    const { ethAccount, getEthAccount, accountStats,
        getAccountStats, getEthChainId } = useContext(EthContext)
    const [setEthBrowserError] = React.useState(false)
    const [accountChecked, setAccountChecked] = React.useState(false)
    const [ethereum, setEthereum] = React.useState(null)
    const [statsChecked, setStatsChecked] = React.useState(false)
    // const [threeIdChecked, setThreeIdChecked] = React.useState(false)
    // const [profileFetched, setProfileFetched] = React.useState(false)
    const [adminSet, setAdminSet] = React.useState(false);
    const [headersData, setHeadersData] = React.useState([...headersRawData])
    let [width, setWidth] = React.useState(getWidth());

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // save current window width in the state object

    // in this case useEffect will execute only once because
    // it does not have any dependencies.
    useEffect(() => {
        // timeoutId for debounce mechanism
        let timeoutId = null;
        const resizeListener = () => {
            // prevent execution of previous setTimeout
            clearTimeout(timeoutId);
            // change width from the state object after 150 milliseconds
            timeoutId = setTimeout(() => setWidth(getWidth()), 150);
        };
        // set resize listener
        window.addEventListener('resize', resizeListener);

        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener('resize', resizeListener);
        }
    }, [])
    useEffect(() => {
        return !!((width < 450) & open && !smDeviceView)
            ? setSmallDevice(true)
            : !!(width >= 450 & open && smDeviceView)
                ? setSmallDevice(false)
                : null

    }, [open, setSmallDevice, smDeviceView, width]);

    useEffect(() => {
        return !!(width < 1047 && !mobileView)
            ? setMobileDevice(true)
            : !!(width >= 1047 && mobileView)
                ? setMobileDevice(false)
                : null

    }, [mobileView, setMobileDevice, width]);




    const getStats = useCallback(() => {
        addressStats(ethAccount).then(({ stats }) => (getAccountStats(stats)))
        setStatsChecked(true)
    }, [ethAccount, getAccountStats])

    useEffect(() => {
        if (ethAccount && !statsChecked) {
            getStats()
        }
    }, [ethAccount, getStats, statsChecked])
    useEffect(() => {
        if (accountStats && !!accountStats.pending_mints) {
            setTimeout(() => { getStats(); }, 5000);
        }
    }, [accountStats, getStats])

    useEffect(() => {
        if (!accountChecked) {

            getConnectedAccount().then(acc => {
                if (acc) {
                    getEthAccount(acc)
                    getChainId().then(chainId => {
                        getEthChainId(chainId)
                    })
                }
            })
            setAccountChecked(true)
        }
    }, [accountChecked, getEthAccount, getEthChainId])
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
    // useEffect(() => {
    //     if (identityProfile && !identityProfile.name && !threeIdChecked) {
    //         authenticate3Id(ethAccount)
    //         setThreeIdChecked(true)
    //     }
    // }, [ethAccount, identityProfile, threeIdChecked])

    // useEffect(() => {

    //     if (ethAccount && !identityProfile && !profileFetched) {
    //         readProfile(ethAccount).then(profile => {
    //             setThreeIdProfile(profile)
    //             setProfileFetched(true)
    //         })
    //     }

    // }, [ethAccount, identityProfile, profileFetched, setThreeIdProfile])

    useEffect(() => {
        let timeoutId = null;
        if (window?.ethereum?.isConnected()) {
            setEthereum(window.ethereum)
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            ethereum?.on('accountsChanged', (accounts) => {
                getEthAccount(accounts[0])
                // readProfile(ethAccount).then(profile => {
                //     setThreeIdProfile(profile)
                // })
            });
            ethereum?.on('chainChanged', (chain) => {
                getEthChainId(parseInt(chain, 16))
            });
        }, 150);

    }, [ethAccount, ethereum, getEthAccount, getEthChainId])
    useEffect(() => {

        const adminNav = {
            label: "Admin",
            href: "/manage",
            icon: <SupervisorAccountIcon />,
        }
        if (ethAccount && accountStats) {
            if (headersData.some(nav => nav.label !== "Admin") && accountStats.is_admin && !adminSet) {
                setHeadersData([...headersData, adminNav])
                setAdminSet(true)
            }
        }
    }, [accountStats, adminSet, ethAccount, headersData])
    const navigationButtons = () => {
        return headersData.map(({ label, href, icon }) => {
            return (
                <Button
                    {...{
                        key: label,
                        color: "inherit",
                        to: href,
                        component: RouterLink,
                        className: classes.menuButton,
                        startIcon: icon
                    }}
                >
                    {label}
                </Button>
            );
        });
    };
    const profileModule = () => {
        return (
            <div>
                {ethAccount &&
                    <Fragment>
                        <Fragment>
                            <IconButton
                                color="inherit"
                            >
                                {/* <AccountCircle /> */}
                                <StyledBadge
                                    overlap="circle"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    variant="dot"
                                >
                                    <img className={classes.icon} alt="Etherium" src={"/assets/images/polygon-matic-logo.svg"} />
                                    {/* <Avatar style={{ border: '1px solid #018AF2' }} alt={"user.username"} src={"user.profile.image " ? "user.profile.image " : "."} /> */}
                                </StyledBadge>
                                <Typography className={classes.username} variant="subtitle1" component="p" gutterBottom>
                                    {ethAccount.substr(0, 6) + '...' + ethAccount.substr(ethAccount.length - 4, ethAccount.length)}
                                </Typography>
                            </IconButton>
                        </Fragment>

                        {/* <Typography style={{ margin: ".8em" }} variant="body2" noWrap >
                            <EthIcon id="eth-account" ethAccount={ethAccount} />
                        </Typography> */}
                    </Fragment>}

                {accountChecked && !ethAccount &&

                    <Button onClick={connectAccount} fullWidth color="primary" variant="outlined" className={classes.authButton}>
                        Connect Metamask Wallet
                    </Button>
                }

            </div>
        )
    };

    const balanceModule = () => {
        return (
            <Fragment>
                {/* {isLoggedIn && <Avatar variant="rounded" className={classes.rounded}>
                    <BalanceIcon balanceCents={user.profile.accountBalanceCents} />
                </Avatar>} */}
            </Fragment>
        )
    }
    const authModule = () => {
        return (
            <Fragment>
                {accountStats &&
                    <Box style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                        <Button fullWidth color="primary" variant="outlined" className={clsx(classes.authButton, classes.mobileAuthButtons)}>
                            {accountStats.tokens_minted} Tokens minted
                        </Button>
                        <Button fullWidth color="primary" variant="outlined" className={clsx(classes.authButton, classes.mobileAuthButtons)}>
                            {accountStats.remaining_mints} mints remaining
                        </Button>
                        {!!(accountStats && accountStats.pending_mints) &&
                            <Button fullWidth color="secondary" variant="outlined" className={clsx(classes.authButton, classes.mobileAuthButtons)}>
                                {accountStats.pending_mints} pending mints
                            </Button>}
                    </Box>}
            </Fragment>
        )
    }


    return (
        <div className={classes.root}>
            {/* <CssBaseline /> */}
            <AppBar
                position="static"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: !!(open && mobileView),
                })}
            >
                <Toolbar>
                    {!!(!open && mobileView) && <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        <MenuIcon />
                    </IconButton>}
                    <Box className={classes.logo}>
                        <Link to="/">
                            <img
                                src="/assets/images/logo.png"
                                alt="logo"
                                href="/"

                                className={classes.logoImage}
                            />
                        </Link>
                        {!smDeviceView &&
                            <Button component={RouterLink} fullWidth to="/" className={classes.logoText}>
                                Zodiacs Club
                            </Button>}
                    </Box>
                    {!mobileView && <Fragment>
                        <Box className={classes.navigation}>{navigationButtons()}</Box>
                        <Box className={classes.authButtons}>
                            {accountStats && width > 1225 &&
                                <Button fullWidth color="primary" variant="outlined" className={clsx(classes.authButton, !!(width < 1521 && accountStats.pending_mints) && classes.displayNone)}>
                                    {accountStats.tokens_minted} tokens minted
                                </Button>}
                            {accountStats && width > 1225 &&
                                <Button fullWidth color="primary" variant="outlined" className={clsx(classes.authButton, !!(width < 1521 && accountStats.pending_mints) && classes.displayNone)}>
                                    {accountStats.remaining_mints} mints remaining
                                </Button>}
                            {!!(accountStats && accountStats.pending_mints) &&
                                <Button fullWidth color="secondary" variant="outlined" className={classes.authButton}>
                                    {accountStats.pending_mints} pending mint
                                </Button>
                            }
                            {balanceModule()}
                            {profileModule()}
                        </Box>
                    </Fragment>}
                    {mobileView && <Fragment>
                        {!!(accountStats && accountStats.pending_mints) &&
                            <Box className={classes.authButtons}>

                                {!!(accountStats && accountStats.pending_mints) &&
                                    <Button fullWidth color="secondary" variant="outlined" className={classes.authButton}>
                                        {accountStats.pending_mints} pending mints
                                    </Button>
                                }
                            </Box>
                        }
                    </Fragment>}
                </Toolbar>
            </AppBar>
            {
                mobileView &&
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <List>
                        <ListItem>
                            {profileModule()}
                        </ListItem>
                        <ListItem>
                            {balanceModule()}
                        </ListItem>
                        {headersData.map(({ label, href }, key) => (
                            <ListItem key={key} button component="a" href={href} style={{ margin: "2vh" }}>
                                <ListItemText primary={label} />
                            </ListItem>
                        ))}
                        <ListItem>
                            {authModule()}
                        </ListItem>
                    </List>
                </Drawer>
            }
        </div >
    );
}
