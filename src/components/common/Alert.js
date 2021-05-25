import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '50%',
        // margin: "auto",
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        "@media (max-width: 688px)": {
            // margin: "auto",
            width: '100%',
        },

    },
}));
export const AlertMessage = ({ message, severity = "warning", buttonDisabled = false, handleMessageClick, btnMessage = "CANCEL" }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* <Alert onClose={() => { }}>This is a success alert — check it out!</Alert> */}
            <Alert
                severity={severity}
                action={
                    <Button disabled={buttonDisabled} color="inherit" size="small" onClick={handleMessageClick}>
                        {btnMessage}
                    </Button>

                }
            >
                {message}
            </Alert>
        </div >
    );
}
