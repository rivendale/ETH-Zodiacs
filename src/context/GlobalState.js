import React, { createContext, useReducer } from "react";

const initialState = {
    yearSigns: [],
    monthSigns: [],
    daySigns: [],
    sign: null
};

function appReducer(state, action) {
    switch (action.type) {
        case "GET_YEAR_SIGNS":
            return {
                ...state,
                yearSigns: action.payload
            };
        case "GET_ZODIAC_SIGN":
            return {
                ...state,
                sign: action.payload
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
    function getSign(data) {
        localStorage.setItem("sign", JSON.stringify(data))
        dispatch({
            type: "GET_ZODIAC_SIGN",
            payload: data
        });
    }
    return (
        <GlobalContext.Provider
            value={{
                yearSigns: state.yearSigns,
                sign: state.sign,
                getYearSigns,
                getSign
            }}>
            {children}
        </GlobalContext.Provider>
    );
};