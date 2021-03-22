import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 1),
    },
}));

export default function Main(props) {
    const classes = useStyles();
    const { report } = props;

    return (
        <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
                Report
      </Typography>
            <Divider />
            {report.map((post) => (
                <Paper elevation={0} className={classes.root} key={post.substring(0, 40)}>
                    {post}
                </Paper>
            ))}
        </Grid>
    );
}

Main.propTypes = {
    report: PropTypes.array,
};
