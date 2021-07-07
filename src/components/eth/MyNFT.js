import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    makeStyles, Container, Typography,
} from '@material-ui/core';
// import { SimpleBackdrop } from './common/Loaders'
import { EthContext } from '../../context/EthContext';
import { getConnectedAccount, } from './EthAccount';
import { SimpleBackdrop } from '../common/Loaders';
import { NFTTable } from './NFTTable';
import api from '../../api';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(8, 0, 6),
        minHeight: '100vh',
        // margin: theme.spacing(1),
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

    const classes = useStyles();
    const [ethAccountPresent, setEthAccountPresent] = useState(true)
    const { ethTokens, getEthTokens } = useContext(EthContext)
    const [loading, setLoading] = useState(null);

    const fetchSigns = useCallback(async (acc) => {
        setLoading(true)
        await api({
            method: "GET",
            url: `users/tokens/${acc}`
        }).then(data => {
            getEthTokens(data.data)
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
    return (
        <React.Fragment>
            {!ethTokens && loading === true && <SimpleBackdrop open={true} />}
            <Container maxWidth="md" component="main" className={classes.root}>
                {!!(!ethAccountPresent | (ethAccountPresent && ethTokens && (Object.keys(ethTokens).length === 0))) &&
                    <div>
                        <Typography component="h3" variant="h5" align="center" color="textPrimary" gutterBottom>
                            You do not have any NFTs
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" component="p">
                            Click <a href="/" >here</a> to enter your date of birth and mint NFT
                        </Typography>
                    </div>}

                {ethTokens && (Object.keys(ethTokens).length > 0) &&
                    <div className={classes.title}>
                        <Typography component="h3" variant="h5" align="center" color="textPrimary" gutterBottom>
                            My NFT
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" component="p">
                            Here is a list of your NFT
                        </Typography>
                        <NFTTable tokens={ethTokens} />
                    </div>
                }
            </Container>

        </React.Fragment>
    );
}