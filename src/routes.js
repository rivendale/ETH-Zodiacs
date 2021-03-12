import React from "react";
import {
    Route,
    Switch
} from "react-router-dom";
import { Home } from './components/Home';
import { Sign } from "./components/ZodiacSign";


const BaseRouter = () => (
    <div>
        <Switch>
            <Route exact path="/" component={Sign} />
        </Switch>
    </div>
);

export default BaseRouter;
