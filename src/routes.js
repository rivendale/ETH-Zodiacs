import React from "react";
import {
    Route,
    Switch
} from "react-router-dom";
import { YearSign } from "./components/YearSign";
import { YearSigns } from "./components/YearSigns";
// import { Home } from './components/Home';
import { Sign } from "./components/Home";


const BaseRouter = () => (
    <div>
        <Switch>
            <Route exact path="/" component={Sign} />
            <Route exact path="/year-signs" component={YearSigns} />
            <Route exact path="/year-signs/:signId" component={YearSign} />
        </Switch>
    </div>
);

export default BaseRouter;
