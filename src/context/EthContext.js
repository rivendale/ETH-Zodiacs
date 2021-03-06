import React, { createContext, useReducer } from "react";

const initialState = {
    ethAccount: null,
    ethTokenIds: null,
    ethTokens: null,
    accountStats: null,
    chainId: null,
    identityProfile: null,
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
        case "GET_ETH_ACCOUNT_STATS":
            return {
                ...state,
                accountStats: action.payload
            };
        case "GET_ETH_CHAIN_ID":
            return {
                ...state,
                chainId: action.payload
            };
        case "GET_THREE_ID_PROFILE":
            return {
                ...state,
                identityProfile: action.payload
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
    function getAccountStats(data) {
        dispatch({
            type: "GET_ETH_ACCOUNT_STATS",
            payload: data
        });
    }
    function getEthChainId(data) {
        dispatch({
            type: "GET_ETH_CHAIN_ID",
            payload: data
        });
    }
    function setThreeIdProfile(data) {
        dispatch({
            type: "GET_THREE_ID_PROFILE",
            payload: data
        });
    }
    return (
        <EthContext.Provider
            value={{
                ethAccount: state.ethAccount,
                ethTokenIds: state.ethTokenIds,
                ethTokens: state.ethTokens,
                accountStats: state.accountStats,
                chainId: state.chainId,
                identityProfile: state.identityProfile,
                getEthAccount,
                getEthTokenIds,
                getEthTokens,
                getAccountStats,
                getEthChainId,
                setThreeIdProfile
            }}>
            {children}
        </EthContext.Provider>
    );
};