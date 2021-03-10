import React, { createContext, useReducer } from "react";

const initialState = {
    yearSigns: [],
    monthSigns: [],
    daySigns: [],
};

function appReducer(state, action) {
    switch (action.type) {
        case "GET_YEAR_SIGNS":
            return {
                ...state,
                yearSigns: action.payload
            };
        default:
            return state;
    }
}

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    function getYearSigns(data) {
        dispatch({
            type: "GET_YEAR_SIGNS",
            payload: data
        });
    }
    return (
        <GlobalContext.Provider
            value={{
                yearSigns: state.yearSigns,
                getYearSigns,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};