import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
// import Slide from '@material-ui/core/Slide';
// import { makeStyles } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// function TransitionUp(props) {
//     return <Slide {...props} direction="up" />;
// }

export const CustomSnackbar = ({ message, open, handleClose }) => {


    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {message}!
                </Alert>
            </Snackbar>
        </div>
    );
}
