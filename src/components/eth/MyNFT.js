import React, { useContext, useEffect } from 'react';
import {
    makeStyles, Container, Typography,
} from '@material-ui/core';
// import { SimpleBackdrop } from './common/Loaders'
import { EthContext } from '../../context/EthContext';
import { getAccountTokenIds, getAccountTokens, } from './EthAccount';
import { SimpleBackdrop } from '../common/Loaders';
import { NFTTable } from './NFTTable';
// import LazyLoad from 'react-lazyload';

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
    const { ethTokenIds, getEthTokenIds, ethTokens, getEthTokens } = useContext(EthContext)
    useEffect(() => {
        if (!ethTokenIds) {
            getAccountTokenIds().then(tokenIds => getEthTokenIds(tokenIds))
        }
        if (ethTokenIds && !ethTokens) {
            getAccountTokens(ethTokenIds).then(tokens => getEthTokens(tokens))
        }
    }, [ethTokenIds, ethTokens, getEthTokenIds, getEthTokens])

    return (
        <React.Fragment>

            {ethTokens ?
                <Container maxWidth="md" component="main" className={classes.root}>
                    <div className={classes.title}>
                        <Typography component="h3" variant="h5" align="center" color="textPrimary" gutterBottom>
                            My NFT
                    </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" component="p">
                            Here is a list of your NFT
                    </Typography>
                    </div>
                    {/* {ethTokens && <NFTList tokens={ethTokens} />} */}
                    {ethTokens && <NFTTable tokens={ethTokens} />}
                </Container>
                : <SimpleBackdrop open={true} />}

        </React.Fragment>
    );
}