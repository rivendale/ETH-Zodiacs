import React, { Fragment, useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";

import logo from '../logo.svg';
import '../App.css';
import api from "../api";

export const Home = () => {
    const { getYearSigns } = useContext(GlobalContext);
    const [yearSigns, setYearSigns] = useState({ data: [], updated: false });
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
            setYearSigns({ data: data, updated: true });
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
        <Fragment>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Welcome to Ethsigns app
                </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
        </a>
                </header>
            </div>
        </Fragment>
    );
}
