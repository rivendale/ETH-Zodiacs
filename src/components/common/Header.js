import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    makeStyles, Typography, Toolbar, Button, AppBar,
    Link, IconButton, Menu, MenuItem, Badge, Avatar, Tooltip,
} from '@material-ui/core';
import { StyledBadge } from './StyledBadge';
import { ethBrowserPresent, getAccount, getConnectedAccount } from '../eth/EthAccount';
import { EthContext } from '../../context/EthContext';
import Message from './MessageDialog';
import { EthIcon } from './EthIcon';


const useStyles = makeStyles((theme) => ({
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    badge: {
        paddingRight: theme.spacing(5)
    },
    icons: {
        width: "1.2em"
    },
    logo: {
        maxWidth: 45,
        "@media (max-width: 900px)": {
            display: "none",
        },
    },
}));


export default function Header() {
    const classes = useStyles();
    const { ethAccount, getEthAccount } = useContext(EthContext)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [ethBrowserError, setEthBrowserError] = useState(false)
    const open = Boolean(anchorEl);
    let history = useHistory();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getConnectedAccount().then(acc => {
            if (acc) {
                getEthAccount(acc)
            }
        })
    })
    const connectAccount = async () => {
        if (!ethAccount) {
            const isEthBrowserPresent = await ethBrowserPresent()
            if (isEthBrowserPresent) {
                const account = await getAccount()
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
                    <Typography noWrap className={classes.toolbarTitle}>
                        <Link variant="h6" color="inherit" href="/">
                            <img src="/assets/images/EthsignsLogo.png" alt="Ethsigns" className={classes.logo} />
                        </Link>
                    </Typography>
                    <Button href="/year-signs" color="primary" variant="text" className={classes.link}>
                        Year Signs
                    </Button>


                    {!ethAccount ?
                        <Button onClick={connectAccount} color="primary" variant="outlined" className={classes.link}>
                            Connect with Metamask
                        </Button> :
                        <Tooltip title={ethAccount}>
                            <Typography variant="body2" noWrap aria-label="deposit-funds">
                                <EthIcon ethAccount={ethAccount} />
                            </Typography>
                        </Tooltip>
                    }
                    <div>
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
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment >)
}