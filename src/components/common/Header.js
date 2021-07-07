import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
    makeStyles, Typography, Toolbar, Button, AppBar,
    Link, IconButton, Menu, MenuItem, Avatar, Tooltip, Chip, Grid,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { StyledBadge } from './StyledBadge';
import { addressStats, ethBrowserPresent, getAccount, getConnectedAccount } from '../eth/EthAccount';
import { EthContext } from '../../context/EthContext';
import Message from './MessageDialog';
import { EthIcon } from './EthIcon';
import Config from '../../config';


const useStyles = makeStyles((theme) => ({
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        // flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    pending: {
        margin: theme.spacing(1, 1.5),
        color: theme.palette.info.main,
        borderColor: theme.palette.warning.main
    },
    badge: {
        paddingRight: theme.spacing(5)
    },
    icons: {
        width: "1.2em"
    },
    logo: {
        maxWidth: 45,
        // "@media (max-width: 900px)": {
        //     display: "none",
        // },
    },
}));


export default function Header(props) {
    const classes = useStyles();
    const history = useHistory()
    const { ethAccount, getEthAccount, accountStats, getAccountStats } = useContext(EthContext)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [ethBrowserError, setEthBrowserError] = useState(false)
    const [accountChecked, setAccountChecked] = useState(false)
    const [statsChecked, setStatsChecked] = useState(false)
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleRedirect = (to) => {
        setAnchorEl(null);
        history.push(to)
    };
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

    return (
        <React.Fragment>
            {ethBrowserError && <Message />}
            <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Grid container spacing={3}>
                        <Grid item xs={2}>
                            <Typography noWrap className={classes.toolbarTitle}>
                                <Link variant="h6" color="inherit" href="/">
                                    <img src="/assets/images/EthsignsLogo.png" alt="Ethsigns" className={classes.logo} />
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Grid container justify="space-around">
                                <Grid item xs={1}>
                                    <Button href="/year-signs" color="primary" variant="text" className={classes.link}>
                                        Year Signs
                                    </Button>
                                </Grid>
                                <Grid item xs={1}>
                                    <Button href="/my-signs" color="primary" variant="text" className={classes.link}>
                                        My Signs
                                    </Button>
                                </Grid>
                                {accountChecked && !ethAccount &&
                                    <Grid item xs={2}>
                                        <Button onClick={connectAccount} color="primary" variant="outlined" className={classes.link}>
                                            Connect with Metamask
                                        </Button>
                                    </Grid>
                                }
                                {accountStats &&
                                    <Grid item xs={1}>
                                        <Chip className={classes.link} color="primary" variant="outlined" label="Total Mints" avatar={<Avatar style={{ width: "5vh" }}>{accountStats.tokens_minted}</Avatar>} />
                                    </Grid>
                                }
                                {accountStats &&
                                    <Grid item xs={1}>
                                        <Chip className={classes.link} color="primary" variant="outlined" label="Remaining Mints" avatar={<Avatar style={{ width: "5vh" }} >{accountStats.remaining_mints}</Avatar>} />
                                    </Grid>
                                }
                                {!!(accountStats && accountStats.pending_mints) &&
                                    <Grid item xs={1}>
                                        <Chip className={classes.pending} variant="outlined" label="Pending Mints" avatar={<Avatar style={{ width: "5vh", backgroundColor: "#2196f3", color: "#fff" }}>{accountStats.pending_mints}</Avatar>} />
                                    </Grid>
                                }
                                {ethAccount &&
                                    <Grid item xs={1}>
                                        <Tooltip title={ethAccount} aria-label="eth-account" arrow>
                                            <Typography style={{ marginTop: "2vh" }} variant="body2" noWrap >
                                                <EthIcon id="eth-account" ethAccount={ethAccount} />
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    {ethAccount && Config.PUBLIC_KEY === ethAccount && <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
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
                                <Avatar alt="M" src={"."} />
                            </StyledBadge>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => handleRedirect("/profile")}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                    </div>}
                </Toolbar>
            </AppBar>
        </React.Fragment >)
}