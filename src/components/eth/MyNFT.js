import React, { useCallback, useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
    makeStyles, Container, Typography, Grid, Paper, Avatar, Box, Button,
} from '@material-ui/core';
// import { SimpleBackdrop } from './common/Loaders'
import { EthContext } from '../../context/EthContext';
import { getConnectedAccount, } from './EthAccount';
import { SimpleBackdrop } from '../common/Loaders';
import EditIcon from '@material-ui/icons/Edit';
import { NFTTable } from './NFTTable';
import api from '../../api';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(8, 0, 6),
        minHeight: '50vh',
        // margin: theme.spacing(1),
    },

    mainContainer: {
        display: 'flex',
        // padding: theme.spacing(1),
        // margin: theme.spacing(2, 0.1, 2, 0.1),
        flexDirection: 'column',
        alignItems: 'center',
    },

    paper: {
        color: theme.palette.text.secondary,
        // borderRadius: ".7em",
        marginTop: theme.spacing(5),

        background: "#FFFFFF",
        border: "1px solid #F6FAFF",
        boxSizing: "border-box",
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        minHeight: "18.5vh",
    },

    avatarContainer: {
        flex: 1
    },

    largeAvatar: {
        margin: theme.spacing(2),
        // width: "calc(100% - 1vw)",
        // height: "calc(100% - 8vh)",
        // "@media (max-width: 37px)": {
        //     width: "calc(100% - 1vw)",
        //     height: "calc(100% - 8vh)",
        //   },
        width: theme.spacing(12),
        height: theme.spacing(12),
        border: '3px solid #018AF2',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
            width: theme.spacing(10),
            height: theme.spacing(10),
        },
        [theme.breakpoints.down("xs")]: {
            width: theme.spacing(11),
            height: theme.spacing(11),
        }
    },

    userDetails: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: theme.spacing(1),
        flex: 1,
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(1, 2),
        },
    },

    editButton: {
        textTransform: "none",
        borderRadius: ".7em",
        whiteSpace: "nowrap",
        border: '1px solid #018AF2',
        color: "#312E58",
    },
    userDetailsTextContent: {
        margin: theme.spacing(1),
        color: "#312E58",
        whiteSpace: "nowrap",
    },

    tokensMinted: {
        padding: theme.spacing(2),
        color: "#312E58",
    },
    tokensMintedTitle: {
        height: theme.spacing(4),
    },
    tokensMintedValue: {
        fontWeight: "600",
        fontSize: "280%",
        minHeight: "76%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        "@media (max-width: 340px)": {
            fontSize: "240%",
        },
    },
    cardDetail: {
        display: 'flex',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
    title: {
        padding: theme.spacing(0, 8, 6),
    },
    cardFooter: {
        color: "#2196F3"
    },
}));
export const MyNFT = (props) => {
    const history = useHistory()

    const classes = useStyles();
    const [ethAccountPresent, setEthAccountPresent] = useState(true)
    const { ethTokens, getEthTokens, identityProfile, ethAccount, accountStats } = useContext(EthContext)
    const [loading, setLoading] = useState(null);

    const fetchSigns = useCallback(async (acc) => {
        setLoading(true)
        await api({
            method: "GET",
            url: `users/tokens/${acc}`
        }).then(data => {
            getEthTokens(data.data.nfts)
            //   setSignUpdated(true)
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
    }, [getEthTokens])


    useEffect(() => {
        if (loading !== null) { return }
        getConnectedAccount().then(acc => {
            if (!acc) { setEthAccountPresent(false); return }
            fetchSigns(acc)
        })
    }, [fetchSigns, loading])

    const handleClick = () => {
        history.push("/edit-profile")
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
    return (
        <React.Fragment>
            {!ethTokens && loading === true && <SimpleBackdrop open={true} />}

            {ethAccount &&
                <Container maxWidth={"lg"} component="main" className={classes.mainContainer}>
                    <Grid container spacing={3}>
                        <Grid item md={6} sm={6} xs={12} style={{ marginTop: ".1em" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <Grid container spacing={2} style={{ display: "flex", flexDirection: "row" }}>
                                            <Grid item xs={3} className={classes.avatarContainer}>
                                                <Avatar alt={ethAccount[6]} src={identityProfile?.avatar} className={classes.largeAvatar} />
                                            </Grid>
                                            <Grid item xs={9} className={classes.userDetails} >
                                                <Box className={classes.userDetailsTextContent}>
                                                    <Typography gutterBottom style={{ fontWeight: "800" }}>
                                                        {ethAccount.substr(0, 8) + '...' + ethAccount.substr(ethAccount.length - 4, ethAccount.length)}
                                                    </Typography>
                                                </Box>
                                                <Box className={classes.userDetailsTextContent}>
                                                    <Typography gutterBottom style={{ fontWeight: "400" }}>
                                                        {identityProfile?.name}
                                                    </Typography>
                                                </Box>
                                                <Box className={classes.userDetailsTextContent}>
                                                    <Button startIcon={<EditIcon color="primary" />} onClick={handleClick} variant="outlined" className={classes.editButton}>
                                                        Edit Profile
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Grid container spacing={2} style={{ display: "flex" }}>
                                <Grid item xs={6}>
                                    <Paper className={clsx(classes.paper, classes.tokensMinted)}>
                                        <Box className={classes.tokensMintedTitle}>Tokens Minted</Box>
                                        <Box className={classes.tokensMintedValue}>{accountStats?.tokens_minted}</Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} >
                                    <Paper className={clsx(classes.paper, classes.tokensMinted)}>
                                        <Box className={classes.tokensMintedTitle}>Pending Mints</Box>
                                        <Box className={classes.tokensMintedValue}>{accountStats?.pending_mints}</Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.grid} >
                        </Grid>
                    </Grid>
                </Container >
            }

            <Container maxWidth="md" component="main" className={classes.root}>
                {!!(!ethAccountPresent | (ethAccountPresent && (ethTokens && ethTokens.total < 1))) &&
                    <div>
                        <Typography component="h3" variant="h5" align="center" color="textPrimary" gutterBottom>
                            You do not have any NFTs
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" component="p">
                            Click <a href="/" >here</a> to enter your date of birth and mint NFT
                        </Typography>
                    </div>}

                {ethTokens?.total > 0 &&
                    <div className={classes.title}>
                        <Typography component="h3" variant="h5" align="center" color="textPrimary" gutterBottom>
                            Your Assets
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" component="p">
                            Here is a list of your NFT(s)
                        </Typography>
                        <NFTTable tokens={ethTokens.items} />
                    </div>
                }
            </Container>

        </React.Fragment>
    );
}