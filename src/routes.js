import React from "react";
import {
    Route,
    Switch
} from "react-router-dom";
import { YearSign } from "./components/YearSign";
import { YearSigns } from "./components/YearSigns";
import { Home } from "./components/Home";
import { EditYearSign } from "./components/EditYearSign";


const BaseRouter = () => (
    <div>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/year-signs" component={YearSigns} />
            <Route exact path="/zodiac-sign/:signId" component={YearSign} />
            <Route exact path="/zodiac-sign/edit/:signId" component={EditYearSign} />
        </Switch>
    </div>
);

export default BaseRouter;
