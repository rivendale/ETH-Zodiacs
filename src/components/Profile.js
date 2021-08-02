import React, { useCallback, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Container, Paper } from '@material-ui/core';
import { useHistory } from 'react-router';

import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import { adminWithdraw, getTokenSupply } from './eth/EthAccount';
import { LinearLoader, Spinner } from './common/Loaders';
import { EthContext } from '../context/EthContext';
import Fab from '@material-ui/core/Fab';
import GetAppIcon from '@material-ui/icons/GetApp';
import Config from '../config';
import { AlertMessage } from './common/Alert';
import api from '../api';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1, 0, 6),
        minHeight: '60vh',
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    card: {
        display: 'flex',
    },
    mainCard: {
        margin: theme.spacing(1),
        padding: theme.spacing(1, 1, 1, 3),
        width: "100%",
        minHeight: "20vh",
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        width: 160,
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));


export const Profile = () => {
    const classes = useStyles();
    const { ethAccount } = useContext(EthContext)
    const [balance, setBalance] = React.useState(null)
    const [supply, setSupply] = React.useState(null)
    const [withdrawing, setWithdrawing] = React.useState(false)
    const [isAdmin, setIsAdmin] = React.useState(null)
    const [txHash, setTxHash] = React.useState(null)
    const [withdrawError, setWithdrawError] = React.useState(null)
    const [balanceFetched, setBalanceFetched] = React.useState(false)
    const history = useHistory()

    const fetchBalance = useCallback(async () => {
        // use the await keyword to grab the resolved promise value
        // remember: await can only be used within async functions!
        await api({
            method: "GET",
            url: `admin/wallet`
        }).then(data => {
            // update local state with the retrieved data
            setBalance(data.data.wallet)
        })
            .catch(err => {
                if (err.response) {
                    console.log(err.response)
                } else if (err.request) {
                    console.log(err.request)
                }
            })
        setBalanceFetched(true)
    }, [])

    useEffect(() => {
        if (ethAccount && Config.PUBLIC_KEY === ethAccount) { setIsAdmin(true) }
        else setIsAdmin(false)
    }, [ethAccount])

    useEffect(() => {
        if (isAdmin === false) {
            history.goBack()
        }
    })
    useEffect(() => {
        if (!balanceFetched && !balance) {
            fetchBalance()
        }
    })

    // getAdminBalance().then(bal => {
    //     if (bal) {
    //         setBalance(bal)
    //     }
    // })
    getTokenSupply().then(supply => {
        if (supply) {
            setSupply(supply)
        }
    })
    const handleWithdraw = () => {
        setWithdrawing(true)
        adminWithdraw().then(({ errorMessage, transactionHash }) => { setWithdrawError(errorMessage); setTxHash(transactionHash); setWithdrawing(false) })
    }
    const handleMessageClick = (() => {
        setWithdrawError(null)
    })
    return (
        <div className={classes.root}>
            <Container
                className={classes.content}
                maxWidth="lg" component="main"
            >
                <Typography align="center" variant="h4" component="h4" gutterBottom>
                    Admin Profile
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={4} md={4}>
                        <CardActionArea component="div">
                            <Paper className={classes.card}>
                                <div className={classes.mainCard}>
                                    <Typography component="h2" variant="h5" gutterBottom>
                                        Wallet Account
                                    </Typography>
                                    {ethAccount ?
                                        <Typography variant="body2" component="p" >
                                            {ethAccount.substr(0, 8) + '...' + ethAccount.substr(ethAccount.length - 8, ethAccount.length)}
                                        </Typography> :
                                        <LinearLoader />}
                                </div>
                            </Paper>
                        </CardActionArea>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <CardActionArea component="div">
                            <Paper className={classes.card}>
                                <div className={classes.mainCard}>

                                    <Typography component="h2" variant="h5" gutterBottom>
                                        Wallet Balance
                                    </Typography>
                                    <Grid container spacing={3} >

                                        <Grid item xs={12} sm={6}>
                                            {balance ?
                                                <Typography variant="body2" component="p" >
                                                    {balance?.wallet_balance} ETH
                                                </Typography> :
                                                <LinearLoader />}                                        </Grid>
                                        {!!(balance?.wallet_balance && +balance?.wallet_balance > 0) &&
                                            <Grid item xs={12} sm={6}>
                                                <Grid container direction="row" justify="flex-end">
                                                    {withdrawing ?
                                                        <Spinner /> :
                                                        <Fab style={{ textTransform: "none" }} onClick={handleWithdraw} variant="extended" color="primary" aria-label="withdraw">
                                                            <GetAppIcon className={classes.extendedIcon} />
                                                            Withdraw
                                                        </Fab>
                                                    }
                                                </Grid>
                                            </Grid>}
                                    </Grid>

                                </div>
                            </Paper>
                        </CardActionArea>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <CardActionArea component="div">
                            <Paper className={classes.card}>
                                <div className={classes.mainCard}>
                                    <Typography component="h2" variant="h5" gutterBottom>
                                        Total Tokens Minted
                                    </Typography>
                                    {supply ?
                                        <Typography variant="body2" component="p" >
                                            {supply}
                                        </Typography> :
                                        <LinearLoader />}
                                </div>
                            </Paper>
                        </CardActionArea>
                    </Grid>
                    {txHash &&
                        <Typography style={{ margin: "auto" }} variant="body2" component="p" align="center" >
                            Your transaction is being processed. For more details, click <a rel="noopener noreferrer" href={`${Config.TX_EXPLORER}/${txHash}`} target="_blank">here</a> to view it.
                        </Typography>
                    }
                    {withdrawError &&
                        <div style={{ paddingLeft: "33.3%", width: "100%", }}>
                            <AlertMessage message={withdrawError} handleMessageClick={handleMessageClick} />
                        </div>
                    }

                </Grid>
            </Container>
        </div>
    );
}
