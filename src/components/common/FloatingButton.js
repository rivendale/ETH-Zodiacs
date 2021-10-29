import React, { Fragment, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Fab, Tooltip } from '@material-ui/core';
import TwitterIcon from '@material-ui/icons/Twitter';

const useStyles = makeStyles((theme) => ({
    socials: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: theme.zIndex.drawer + 1,

    },
    fab: {
        margin: theme.spacing(.3),
    },
    socialIcon: {
        width: theme.spacing(3),
    },
}));

export const FloatingButton = () => {
    const classes = useStyles();
    const ref = useRef(null);
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        let timeoutId = null;
        window.onscroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { setOffset(window.pageYOffset) }, 150);

        }
    }, []);

    const socials = [
        {
            name: "discord",
            icon: <img className={classes.socialIcon} alt="discord" src={`/assets/images/discord.png`} />,
            link: "https://discord.gg/nBnxC4YJt3",
            tooltip: "Join our Discord server"
        },
        {
            name: "twitter",
            icon: <TwitterIcon color="primary" className={classes.socialIcon} />,
            link: "https://twitter.com/zodiacsclubnft",
            tooltip: "Follow us on Twitter"
        }
    ]
    return (
        <Fragment>
            {!!(offset > 500) &&
                <Box ref={ref} className={classes.socials} display="flex" justifyContent="center" flexDirection="column">
                    {socials.map(({ name, icon, link, tooltip }) =>
                        <Tooltip key={name} title={tooltip} arrow>
                            <Fab size="small" component="a" target="_blank" href={link} className={classes.fab}>
                                {icon}
                            </Fab>
                        </Tooltip>
                    )}
                </Box>}
        </Fragment>
    );
}
