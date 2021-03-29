import React from 'react';
import {
    Grid, Dialog, DialogTitle, DialogContent,
    Paper, makeStyles, Avatar, IconButton,
    Divider, useMediaQuery, useTheme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // overflow: 'scroll',
        margin: 0,
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

    details: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));


export const SignModal = ({ sign, open, handleClose }) => {
    const classes = useStyles();
    const theme = useTheme();

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div>

            <Dialog fullScreen={fullScreen} onClose={handleClose} aria-labelledby="sign-dialog" open={open}>
                <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <DialogTitle id="sign-dialog" onClose={handleClose}>
                    Zodiac Sign
                </DialogTitle>
                <DialogContent dividers>
                    <div className={classes.root}>
                        <Paper xs={12} sm={12} md={6}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={2}>
                                    <Avatar src={sign.image_url}
                                        variant="rounded" className={classes.large} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <Grid item xs={12}>
                                            <h4>{sign.name}</h4>

                                        </Grid>
                                        <Divider variant="middle" />
                                        <Grid item xs={12} className={classes.details}>
                                            <Grid container>
                                                <Grid item xs={12} sm={12}>
                                                    <b>Positive Traits:</b>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {sign.positive_traits.map(trait => (
                                                        <span key={trait}>{trait}, </span>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={12} sm={12}>
                                                    <b>Negative Traits:</b>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {sign.negative_traits.map(trait => (
                                                        <span key={trait}>{trait}, </span>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Divider variant="middle" />
                                        <Grid item xs={12} className={classes.details}>
                                            <Grid container>
                                                <Grid item xs={5} sm={4}>
                                                    <b>Best Compatibility:</b>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    {sign.best_compatibility.map(compatibility => (
                                                        <span key={compatibility}>{compatibility}, </span>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={5} sm={4}>
                                                    <b>Worst Compatibility:</b>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    {sign.worst_compatibility.map(compatibility => (
                                                        <span key={compatibility}>{compatibility}, </span>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <Grid container>
                                            <Grid item xs={12} sm={12}>
                                                <h4>Report</h4>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {sign.report.map((i, k) => (
                                                    <p key={k}>{i}</p>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                            </Grid>
                        </Paper>
                    </div>

                </DialogContent>

            </Dialog>

        </div>
    );
}