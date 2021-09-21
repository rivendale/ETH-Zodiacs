import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

function Copyright() {
    return (
        <Typography variant="body2" style={{ color: '#FFFF' }} align="center">
            {'Copyright © '}
            <Link href="https://zodiacs.club/">
                <b>Zodiacs Club</b>
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    footer: {
        backgroundImage: `url(/assets/images/banner.png)`,
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: '100% 100%',
    },
    textContent: {
        padding: theme.spacing(6, 0),
        backdropFilter: "blur(4px)",
    }
}));

export default function Footer() {
    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Container maxWidth="lg" className={classes.textContent}>
                <Typography style={{ color: '#FFFF' }} variant="h6" align="center" gutterBottom>
                    Zodiacs Club
                </Typography>
                <Typography style={{ color: '#FFFF' }} variant="subtitle1" align="center" color="textSecondary" component="p">
                    Chinese zodiac signs
                </Typography>
                <Copyright />
            </Container>
        </footer>
    );
}

Footer.propTypes = {
    description: PropTypes.string,
    title: PropTypes.string,
};
