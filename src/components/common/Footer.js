import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
    footer: {
        // backgroundImage: `url(/assets/images/banner.png)`,
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: '100% 100%',
        marginTop: theme.spacing(1),
        backgroundColor: "#E0EDFF",
        [theme.breakpoints.down('xs')]: {
            backgroundImage: 'none',
        }
    },
    footerContent: {
        padding: theme.spacing(6, 0),
    },
    textContent: {
        // color: '#fff',
        [theme.breakpoints.down('xs')]: {
            color: '#000',
        }
    }
}));

export default function Footer() {
    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Container
                maxWidth={false}
            //  style={{ backdropFilter: "blur(4px)" }}
            >
                <Container maxWidth="lg" className={classes.footerContent}>
                    <Typography className={classes.textContent} variant="h6" align="center" gutterBottom>
                        Zodiacs Club
                    </Typography>
                    <Typography className={classes.textContent} variant="subtitle1" align="center" color="textSecondary" component="p">
                        Chinese zodiac signs
                    </Typography>
                    <Typography variant="body2" className={classes.textContent} align="center">
                        {'Copyright © '}
                        <Link href="https://zodiacs.club/">
                            <b>Zodiacs Club</b>
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Container>
            </Container>
        </footer>
    );
}
