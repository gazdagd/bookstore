import { put } from 'redux-saga/effects';

import keycloak from "../../keycloak";
import * as actions from '../actions/index';

export function* keycloakEventSaga(action) {
    switch (action.keycloakEvent) {
        case('onAuthRefreshSuccess'):
        case('onAuthSuccess'): {
            try{
                const profile = yield keycloak.loadUserProfile();
                yield put(actions.userNameChanged(profile.username));
            } catch(error) {
                yield put(actions.userNameChanged(null));
            }
            break;
        }
        case('onAuthLogout'):
        case('onTokenExpired'): {
            yield put(actions.userNameChanged(null));
            break;
        }
        default:
            break;
    }
}

export function* loginSaga(action) {
    yield keycloak.login();
}