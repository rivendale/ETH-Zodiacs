import React from 'react';
import BaseRouter from '../../routes';
import Footer from './Footer';
import Header from './Header';

export default function Layout() {
    return (
        <React.Fragment>
            <Header />
            <BaseRouter />
            <Footer />
        </React.Fragment>
    );
}