import React from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
    },
    title: {
        padding: theme.spacing(8, 0, 6),
    },
}));


export const Error404Page = () => {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" component="main" className={classes.root}>
            <div className="flex flex-col flex-1 items-center justify-center p-16">

                <div className="max-w-512 text-center">

                    <Container maxWidth="lg" component="main" className={classes.title}>
                        <Typography align="center" variant="h1" color="inherit" className="font-medium mb-16">
                            404
                    </Typography>
                    </Container>

                    <Container >
                        <Typography align="center" variant="h5" color="textSecondary" className="mb-16">
                            Sorry but we could not find the page you are looking for
                    </Typography>
                    </Container>
                    <Container>
                        <Typography align="center" style={{ cursor: "pointer" }}>
                            <Link className="font-medium" to="/">Go back to home page</Link>
                        </Typography>
                    </Container>
                </div>
            </div>
        </Container>
    );
}
