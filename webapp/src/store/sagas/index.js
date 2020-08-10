import {takeEvery} from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import {fetchBooksSaga, fetchBookSaga, toggleWishSaga, saveBookSaga, deleteBookSaga} from './books';
import {keycloakEventSaga} from "./auth";

export function* watchBooks() {
    yield takeEvery(actionTypes.FETCH_BOOKS, fetchBooksSaga);
    yield takeEvery(actionTypes.FETCH_BOOK, fetchBookSaga);
    yield takeEvery(actionTypes.TOGGLE_WISH, toggleWishSaga);
    yield takeEvery(actionTypes.SAVE_BOOK, saveBookSaga);
    yield takeEvery(actionTypes.DELETE_BOOK, deleteBookSaga);

}

export function* watchAuth() {
    yield takeEvery(actionTypes.KEYCLOAK_EVENT, keycloakEventSaga);

}