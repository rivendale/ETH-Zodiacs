import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    mainFeaturedPost: {
        position: 'relative',
        backgroundColor: theme.palette.grey[700],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        backgroundSize: "auto",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: theme.spacing(1),
        paddingRight: theme.spacing(3),
        textTransform: "none"
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    mainFeaturedPostContent: {
        position: 'relative',
        padding: theme.spacing(3),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(6),
            paddingRight: 0,
        },
    },
}));

export default function SignHeader(props) {
    const classes = useStyles();
    const { post } = props;
    return (
        <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(${post.image})` }}>
            {/* Increase the priority of the hero background image */}
            {<img style={{ display: 'none' }} src={post.image} alt={post.imageText} />}
            <div className={classes.overlay} />
            {/* <Fab variant="extended" className={classes.editIcon} color="primary" size="small" aria-label="edit" onClick={() => { history.push(`/zodiac-sign/edit/${signId}`) }}>
                <EditIcon className={classes.extendedIcon} /> Edit
            </Fab> */}
            <Grid container>
                <Grid item md={6}>
                    <div className={classes.mainFeaturedPostContent}>
                        <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                            {post.title}
                        </Typography>
                        <Typography variant="body2" color="inherit" paragraph>
                            {post.description}
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </Paper>
    );
}

SignHeader.propTypes = {
    post: PropTypes.object,
};
