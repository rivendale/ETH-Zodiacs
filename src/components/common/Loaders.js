import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { Grow, LinearProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

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
    spinningImg: {
        animation: '$spin 2s infinite linear',
        height: theme.spacing(15),
        width: theme.spacing(15),
        borderRadius: '50%',
    },
    '@keyframes spin': {
        '0%': {
            transform: 'rotate(0deg)',
        }, '100%': {
            transform: 'rotate(360deg)',
        },
    },
}));

export const SimpleBackdrop = ({ open }) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Backdrop className={classes.backdrop} open={open}>
                {/* <CircularProgress color="inherit" /> */}
                <img className={classes.spinningImg} alt="logo" src={"/assets/images/logo.png"} />

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

export const SnackBar = ({ successMessage, errorMessage, handleCloseSnackbar: handleClose, snackBarOpen: open }) => {

    return (
        <Snackbar TransitionComponent={Grow} open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={successMessage ? "success" : "error"}>
                {successMessage ? successMessage : errorMessage ? errorMessage : ""}
            </Alert>
        </Snackbar>
    );
}

