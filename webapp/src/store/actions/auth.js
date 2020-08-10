import * as actionTypes from './actionTypes';

export const keycloakEvent = (keycloakEvent) => {
    return {
        type: actionTypes.KEYCLOAK_EVENT,
        keycloakEvent
    }
}

export const userNameChanged = (userName) => {
    return {
        type: actionTypes.USERNAME_CHANGED,
        userName
    }
}

export const tokenChanged = (token) => {
    return {
        type: actionTypes.TOKEN_CHANGED,
        token
    }
}