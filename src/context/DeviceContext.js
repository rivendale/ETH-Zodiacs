import React, { useReducer, createContext } from 'react'

const initialState = {
    smDeviceView: false,
    mobileView: false,
    detailsMobileView: false,
}

const DeviceContext = createContext({
    smDeviceView: false,
    mobileView: false,
    detailsMobileView: false,
})

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'MOBILE_DEVICE':
            return {
                ...state,
                mobileView: action.payload
            }
        case 'DETAILS_MOBILE_DEVICE':
            return {
                ...state,
                detailsMobileView: action.payload
            }
        case 'SMALL_DEVICE':
            return {
                ...state,
                smDeviceView: action.payload
            }
        default:
            return state
    }
}

const DeviceProvider = (props) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);


    const setMobileDevice = (data) => {
        dispatch({ type: "MOBILE_DEVICE", payload: data })
    }
    const setDetailsMobileDevice = (data) => {
        dispatch({ type: "DETAILS_MOBILE_DEVICE", payload: data })
    }
    const setSmallDevice = (data) => {
        dispatch({ type: "SMALL_DEVICE", payload: data })
    }
    return (
        <DeviceContext.Provider
            value={{
                mobileView: state.mobileView,
                smDeviceView: state.smDeviceView,
                gameInstance: state.gameInstance,
                detailsMobileView: state.detailsMobileView,
                setMobileDevice, setSmallDevice,
                setDetailsMobileDevice,
            }}
            {...props}
        />
    )
}

export { DeviceProvider, DeviceContext }