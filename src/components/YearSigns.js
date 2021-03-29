import React, { useState, useContext, useEffect, Fragment } from 'react';
import {
    Container, Typography, Avatar,
    ListItemAvatar, ListItemText, Divider, ListItem, List,
    makeStyles,
    Link,
    ListItemSecondaryAction,
    IconButton
} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'; import { GlobalContext } from "../context/GlobalState";
import api from "../api";
import { Spinner } from './common/Loaders';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(8),
    },
    inline: {
        display: 'inline',
    },
}));

export const YearSigns = () => {
    const classes = useStyles();
    const { getYearSigns, } = useContext(GlobalContext);
    const [yearSigns, setYearSigns] = useState({ data: [], updated: false, isLoading: true });


    useEffect(() => {
        // the callback to useEffect can't be async, but you can declare async within
        async function fetchYearSigns() {
            // use the await keyword to grab the resolved promise value
            // remember: await can only be used within async functions!
            const { data } = await api({
                method: "GET",
                url: "year/"
            })
            // update local state with the retrieved data
            setYearSigns({ data: data.signs, updated: true, isLoading: false });
        }
        // fetchYearSigns will only run once after mount as the deps array is empty
        fetchYearSigns();
    }, []);
    useEffect(() => {
        if (yearSigns.updated) {
            getYearSigns(yearSigns.data)
            setYearSigns({ ...yearSigns, updated: false });
        }
    }, [yearSigns, getYearSigns])

    return (
        <Container>
            {yearSigns.isLoadings ? <Spinner /> :
                <List className={classes.root}>
                    {!!yearSigns.data.length && yearSigns.data.map((sign, key) => (
                        <Fragment key={key}>
                            <ListItem alignItems="flex-start">
                                <Link href={`/year-signs/${sign.id}`}>
                                    <ListItemAvatar>
                                        <Avatar alt={sign.name} src={sign.image_url} />
                                    </ListItemAvatar>
                                </Link>
                                <ListItemText
                                    primary={sign.name}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"

                                            >
                                                {sign.force}
                                            </Typography>
                                            {" —  "} {sign.report[~~(Math.random() * sign.report.length)].replace(/(.{170})..+/, "$1…")}
                                        </React.Fragment>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <Link href={`/zodiac-sign/${sign.id}`}>
                                        <IconButton color="inherit" aria-label="view details">
                                            <ArrowForwardIosIcon />
                                        </IconButton>
                                    </Link>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </Fragment>
                    ))}
                </List>}
        </Container>);
}
