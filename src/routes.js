import React from "react";
import {
    Route,
    Switch
} from "react-router-dom";
import { YearSigns } from "./components/YearSigns";
// import { Home } from './components/Home';
import { Sign } from "./components/ZodiacSign";


const BaseRouter = () => (
    <div>
        <Switch>
            <Route exact path="/" component={Sign} />
            <Route exact path="/year-signs" component={YearSigns} />
        </Switch>
    </div>
);

export default BaseRouter;
