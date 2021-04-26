import React, { createContext, useReducer } from "react";

const initialState = {
    ethAccount: null,
};

function ethReducer(state, action) {
    switch (action.type) {
        case "GET_ETH_ACCOUNT":
            return {
                ...state,
                ethAccount: action.payload
            };
        default:
            return state;
    }
}

export const EthContext = createContext(initialState);
export const EthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ethReducer, initialState);

    function getEthAccount(data) {
        dispatch({
            type: "GET_ETH_ACCOUNT",
            payload: data
        });
    }
    return (
        <EthContext.Provider
            value={{
                ethAccount: state.ethAccount,
                getEthAccount,
            }}>
            {children}
        </EthContext.Provider>
    );
};