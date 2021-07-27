import React, { Fragment, useCallback, useContext, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
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
import { Link as RouterLink } from "react-router-dom";
import { DeviceContext } from '../../context/DeviceContext';
import { EthContext } from '../../context/EthContext';
import { addressStats, ethBrowserPresent, getAccount, getConnectedAccount } from '../eth/EthAccount';
import { EthIcon } from './EthIcon';
import HomeIcon from '@material-ui/icons/Home';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import PersonIcon from '@material-ui/icons/Person';

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
        textTransform: "none",
        borderRadius: ".9em",
        whiteSpace: "nowrap",
        "@media (max-width: 1047px)": {
            margin: theme.spacing("auto", "auto", "auto", 1),
        },

    },
    mobileAuthButtons: {
        margin: theme.spacing(2, "auto"),
    },
    logo: {
        display: "flex",
        justifyContent: "center",
    },
    logoText: {
        margin: theme.spacing("auto", 1),
    },
    logoImage: {
        maxWidth: 45,
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
}));
const headersData = [
    {
        label: "Home",
        href: "/",
        icon: <HomeIcon />,
    },
    {
        label: "All Signs",
        href: "/year-signs",
        icon: <ClearAllIcon />,
    },
    {
        label: "My Assets",
        href: "/my-signs",
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
    const { ethAccount, getEthAccount, accountStats, getAccountStats } = useContext(EthContext)
    const [setEthBrowserError] = React.useState(false)
    const [accountChecked, setAccountChecked] = React.useState(false)
    const [statsChecked, setStatsChecked] = React.useState(false)
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
                }
            })
            setAccountChecked(true)
        }
    }, [accountChecked, getEthAccount])
    const connectAccount = async () => {
        if (!ethAccount) {
            const isEthBrowserPresent = await ethBrowserPresent()
            if (isEthBrowserPresent) {
                const account = await getAccount(true)
                getEthAccount(account)
            }
            else
                setEthBrowserError(true)
        }
    };

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
                        <Typography style={{ margin: ".8em" }} variant="body2" noWrap >
                            <EthIcon id="eth-account" ethAccount={ethAccount} />
                        </Typography>
                    </Fragment>}

                {accountChecked && !ethAccount &&

                    <Button onClick={connectAccount} fullWidth color="primary" variant="outlined" className={classes.authButton}>
                        Connect with Metamask
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
                            <Button fullWidth color="primary" variant="outlined" className={clsx(classes.authButton, classes.mobileAuthButtons)}>
                                {accountStats.pending_mints} mints remaining
                            </Button>}
                    </Box>}
            </Fragment>
        )
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
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
                        <img
                            src="/assets/images/EthsignsLogo.png"
                            alt="logo"
                            href="/"
                            className={classes.logoImage}
                        />
                        {!smDeviceView &&
                            <Button component={RouterLink} fullWidth to="/" className={classes.logoText}>
                                Eth Signs
                            </Button>}
                    </Box>
                    {!mobileView && <Fragment>
                        <Box className={classes.navigation}>{navigationButtons()}</Box>
                        <Box className={classes.authButtons}>
                            {accountStats &&
                                <Button fullWidth color="primary" variant="outlined" className={classes.authButton}>
                                    {accountStats.tokens_minted} tokens minted
                                </Button>}
                            {accountStats &&
                                <Button fullWidth color="primary" variant="outlined" className={classes.authButton}>
                                    {accountStats.remaining_mints} mints remaining
                                </Button>}
                            {!!(accountStats && accountStats.pending_mints) &&
                                <Button fullWidth color="primary" variant="outlined" className={classes.authButton}>
                                    {accountStats.pending_mints} mints remaining
                                </Button>
                            }
                            {balanceModule()}
                            {profileModule()}
                        </Box>
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
                        {/* <ListItem>
                            <div style={{ height: "5vh", }}>
                                <div style={{ marginTop: "4vh" }}>
                                    {toggleModule()}
                                </div>
                            </div>
                        </ListItem> */}
                    </List>
                </Drawer>
            }
        </div >
    );
}
