import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../util/utility';

const initialState = {
    books: [],
    loadedBook: null,
    loading: false,
    searchString: '',
    genres: ['Action', 'Fantasy', 'Adventure', 'Crime', 'Horror', 'Sci-fi'],
    message: null,
    messageSeverity: null
}

const fetchBooksStart = state => {
    return updateObject(state, {loading: true});
}

const fetchBooksSuccess = (state, action) => {
    return updateObject(state, {
        books: action.books,
        loading: false
    });
}

const fetchBooksFail = state => {
    return updateObject(state, {loading: false});
}

const fetchBookStart = state => {
    return updateObject(state, {loading: true});
}

const fetchBookSuccess = (state, action) => {
    return updateObject(state, {
        loadedBook: action.book,
        loading: false
    });
}

const fetchBookFail = state => {
    return updateObject(state, {loading: false});
}

const toggleWishlist = (state, action, add) => {
    const newBooks = state.books.map(book => {
        if (book.olid === action.olid) {
            return {...book, wished: add}
        } else return book;
    });
    let newLoadedBook = state.loadedBook;
    if (Boolean(state.loadedBook) && state.loadedBook.olid === action.olid) {
        newLoadedBook = {...state.loadedBook, wished: add}
    }
    return updateObject(state, {books: newBooks, loadedBook: newLoadedBook});
};

const setSearchString = (state, action) => {
    return updateObject(state, {searchString: action.searchString});
}

const saveBookStart = state => {
    return updateObject(state, {loading: true});
}

const saveBookSuccess = (state, action) => {
    let newBooks;
    if (!Boolean(state.books.find(book => book.olid === action.book.olid))) {
        console.log('totally new book');
        newBooks = [...state.books, action.book];
    } else {
        newBooks = state.books.map(book => {
            if (book.olid === action.book.olid) {
                return action.book;
            } else return book;
        });
    }
    return updateObject(state, {
        books: newBooks,
        loading: false,
        message: 'Save book was successful!',
        messageSeverity: 'success'
    });
}

const saveBookFail = (state, action) => {
    return updateObject(state, {loading: false, message: action.error.message, messageSeverity: 'error'});
}

const deleteBookStart = state => {
    return updateObject(state, {loading: true});
}

const deleteBookSuccess = (state, action) => {
    const newBooks = [...state.books];
    newBooks.splice(state.books.findIndex(book => book.olid === action.olid), 1);
    return updateObject(state, {
        books: newBooks,
        loading: false,
        message: 'Delete book was successful!',
        messageSeverity: 'success'
    });
}

const deleteBookFail = (state, action) => {
    return updateObject(state, {loading: false, message: action.error.message, messageSeverity: 'error'});
}

const clearMessage = state => {
    return updateObject(state, {message: null, messageSeverity: 'error'});
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (actionTypes.FETCH_BOOKS_START):
            return fetchBooksStart(state);
        case (actionTypes.FETCH_BOOKS_SUCCESS):
            return fetchBooksSuccess(state, action);
        case (actionTypes.FETCH_BOOKS_FAIL):
            return fetchBooksFail(state);
        case (actionTypes.FETCH_BOOK_START):
            return fetchBookStart(state);
        case (actionTypes.FETCH_BOOK_SUCCESS):
            return fetchBookSuccess(state, action);
        case (actionTypes.FETCH_BOOK_FAIL):
            return fetchBookFail(state);
        case (actionTypes.ADD_TO_WISHLIST):
            return toggleWishlist(state, action, true);
        case (actionTypes.REMOVE_FROM_WISHLIST):
            return toggleWishlist(state, action, false);
        case (actionTypes.SET_SEARCH_STRING):
            return setSearchString(state, action);
        case (actionTypes.SAVE_BOOK_START):
            return saveBookStart(state);
        case (actionTypes.SAVE_BOOK_SUCCESS):
            return saveBookSuccess(state, action);
        case (actionTypes.SAVE_BOOK_FAIL):
            return saveBookFail(state, action);
        case (actionTypes.DELETE_BOOK_START):
            return deleteBookStart(state);
        case (actionTypes.DELETE_BOOK_SUCCESS):
            return deleteBookSuccess(state, action);
        case (actionTypes.DELETE_BOOK_FAIL):
            return deleteBookFail(state, action);
        case (actionTypes.CLEAR_MESSAGE):
            return clearMessage(state);
        default:
            return state;
    }
};

export default reducer;