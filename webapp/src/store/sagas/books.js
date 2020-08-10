import {put, select} from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions/index';


export function* fetchBooksSaga(action) {
    yield put(actions.fetchBooksStart());
    try {
        const getToken = (state) => state.auth.token;
        const token = yield select(getToken);

        const response = yield axios.get('/api/books', getConfig(token));

        //TODO wished should be query parameter
        let result = action.wished ? response.data._embedded.books.filter(book => book.wished === true) : response.data._embedded.books;
        yield put(actions.fetchBooksSuccess(result));
    } catch (error) {
        yield put(actions.fetchBooksFail(error));
    }
}

export function* fetchBookSaga(action) {
    yield put(actions.fetchBookStart());
    try {
        const getToken = (state) => state.auth.token;
        const token = yield select(getToken);

        const response = yield axios.get('/api/books/' + action.olid + '?projection=withWished', getConfig(token));
        yield put(actions.fetchBookSuccess(response.data));
    } catch (error) {
        yield put(actions.fetchBookFail(error));
    }
}

export function* toggleWishSaga(action) {
    const getBooks = (state) => state.book.books;
    const books = yield select(getBooks);
    const book = books.filter(b => b.olid === action.olid)[0];
    try {
        if (book.wished) {
            yield axios.delete('/api/wishlist/' + action.olid);
            yield put(actions.removeFromWishlist(action.olid));
        } else {
            yield axios.put('/api/wishlist/' + action.olid);
            yield put(actions.addToWishlist(action.olid));

        }
    } catch (error) {
        // TODO error handling
    }

}

export function* saveBookSaga(action) {
    yield put(actions.saveBookStart());
    try {
        const response = yield axios.put('/api/books/' + action.book.olid, JSON.stringify(action.book), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        yield put(actions.saveBookSuccess(response.data));
    } catch (error) {
        yield put(actions.saveBookFail(error));
    }
}

export function* deleteBookSaga(action) {
    yield put(actions.deleteBookStart());
    try {
        yield axios.delete('/api/books/' + action.olid);
        yield put(actions.deleteBookSuccess(action.olid));
    } catch (error) {
        yield put(actions.deleteBookFail(error));
    }
}

function getConfig(token) {
    if (token) {
        return {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
    }
    return null;
}