import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        whiteSpace: "nowrap",
        color: "brown"

    },
    icon: {
        width: "1.2em",
    }
}))

export const EthIcon = ({ ethAccount }) => {
    const classes = useStyles();
    return (
        <Fragment>
            <span className={classes.root}>
                <img className={classes.icon} alt="Etherium" src={"/assets/images/ethereum.svg"} /> {ethAccount?.substr(0, 6) + '...' + ethAccount?.substr(ethAccount?.length - 4, ethAccount?.length)}

            </span>
        </Fragment>
    )
}
