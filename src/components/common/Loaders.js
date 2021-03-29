import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    root: {
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
}));

export const SimpleBackdrop = ({ open }) => {
    const classes = useStyles();

    return (
        <div>
            <Backdrop className={classes.backdrop} open={open}>
                {/* <CircularProgress color="inherit" /> */}
            </Backdrop>
        </div>
    );
}


export const Spinner = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CircularProgress />
        </div>
    );
}