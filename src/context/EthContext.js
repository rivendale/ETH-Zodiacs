import React, { createContext, useReducer } from "react";

const initialState = {
    ethAccount: null,
    ethTokenIds: null,
    ethTokens: null,
};

function ethReducer(state, action) {
    switch (action.type) {
        case "GET_ETH_ACCOUNT":
            return {
                ...state,
                ethAccount: action.payload
            };
        case "GET_ETH_TOKEN_IDS":
            return {
                ...state,
                ethTokenIds: action.payload
            };
        case "GET_ETH_TOKENS":
            return {
                ...state,
                ethTokens: action.payload
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
    function getEthTokenIds(data) {
        dispatch({
            type: "GET_ETH_TOKEN_IDS",
            payload: data
        });
    }
    function getEthTokens(data) {
        dispatch({
            type: "GET_ETH_TOKENS",
            payload: data
        });
    }
    return (
        <EthContext.Provider
            value={{
                ethAccount: state.ethAccount,
                ethTokenIds: state.ethTokenIds,
                ethTokens: state.ethTokens,
                getEthAccount,
                getEthTokenIds,
                getEthTokens,
            }}>
            {children}
        </EthContext.Provider>
    );
};