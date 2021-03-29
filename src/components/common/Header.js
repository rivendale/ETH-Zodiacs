
import {
    AppBar,
    Toolbar,
    Typography,
    makeStyles,
    Button,
    IconButton,
    Drawer,
    Link,
    MenuItem,
    Container,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';


const headersData = [
    {
        label: "My Sign",
        href: "/",
    },
    {
        label: "",
        href: "/year-signs",
    },
    {
        label: "",
        href: "#",
    },
    {
        label: "",
        href: "#",
    },
    {
        label: "About",
        href: "#",
    },
];

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    header: {
        backgroundColor: theme.palette.background.paper,
        // background: 'linear-gradient(to right bottom, #4a1a1b, #9e917a, #f7e4c1)',
        color: "inherit",
        "@media (max-width: 790px)": {
            paddingLeft: 0,
        },
    },
    logo: {
        maxWidth: 45,
        "@media (max-width: 900px)": {
            display: "none",
        },
    },
    companyLabel: {
        fontWeight: 700,
        size: "18px"
    },
    menuButton: {
        fontWeight: 700,
        size: "18px",
        marginLeft: "38px",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: 0,
    },
    drawerContainer: {
        padding: "20px 30px",
    },
}));

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};


export default function Header(props) {
    const { root, header, companyLabel, logo, menuButton, toolbar, drawerContainer } = useStyles();

    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });

    const { mobileView, drawerOpen } = state;

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 790
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({ ...prevState, mobileView: false }));
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());
    }, []);

    const displayDesktop = () => {
        return (
            <Toolbar component="nav" variant="dense" className={toolbar}>
                {ethSignsLogo}
                <div>{getMenuButtons()}</div>
            </Toolbar>
        );
    };

    const displayMobile = () => {
        const handleDrawerOpen = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: true }));
        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }));

        return (
            <Toolbar>
                <IconButton
                    {...{
                        edge: "start",
                        "aria-label": "menu",
                        "aria-haspopup": "true",
                        onClick: handleDrawerOpen,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    {...{
                        anchor: "left",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div className={drawerContainer}>{getDrawerChoices()}</div>
                </Drawer>

                <div>{ethSignsLogo}</div>
            </Toolbar>
        );
    };

    const getDrawerChoices = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Link
                    {...{
                        component: RouterLink,
                        to: href,
                        color: "inherit",
                        style: { textDecoration: "none" },
                        key: label,
                    }}
                >
                    <MenuItem>{label}</MenuItem>
                </Link>
            );
        });
    };

    const ethSignsLogo = (
        <React.Fragment>
            <Typography variant="h6" component="h1">
                <img src="/assets/images/EthsignsLogo.png" alt="Ethsigns" className={logo} />
            </Typography>
            <Typography variant="h6" component="h1">
                <Link
                    href="/"
                    variant="h6"
                    color="inherit"
                    className={companyLabel}
                >
                    Ethsigns
            </Link>
            </Typography>
        </React.Fragment>
    );

    const getMenuButtons = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Button
                    {...{
                        key: label,
                        color: "inherit",
                        to: href,
                        component: RouterLink,
                        className: menuButton,
                    }}
                >
                    {label}
                </Button>
            );
        });
    };

    return (
        <Container maxWidth="lg" className={root}>
            <AppBar position="sticky" className={header} variant="outlined">
                {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
        </Container>
    );
}
