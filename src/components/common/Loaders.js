import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    spinner: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },

        // top: 0,
        left: 0,
        // bottom: 0,
        right: 0,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    loader: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export const SimpleBackdrop = ({ open }) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>
    );
}


export const Spinner = () => {
    const classes = useStyles();

    return (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );
}

export const LinearLoader = () => {
    const classes = useStyles();

    return (
        <div className={classes.loader}>
            <LinearProgress color="secondary" />
        </div>
    );
}