import * as actionTypes from './actionTypes';

export const fetchBooks = (wished) => {
    return {
        type: actionTypes.FETCH_BOOKS,
        wished
    }
}

export const fetchBooksSuccess = (books) => {
    return {
        type: actionTypes.FETCH_BOOKS_SUCCESS,
        books
    };
};

export const fetchBooksFail = (error) => {
    return {
        type: actionTypes.FETCH_BOOKS_FAIL,
        error
    };
};

export const fetchBooksStart = () => {
    return {
        type: actionTypes.FETCH_BOOKS_START
    }
}

export const fetchBook = (olid) => {
    console.log('Fetch book');
    return {
        type: actionTypes.FETCH_BOOK,
        olid
    }
}

export const fetchBookSuccess = (book) => {
    return {
        type: actionTypes.FETCH_BOOK_SUCCESS,
        book
    };
};

export const fetchBookFail = (error) => {
    return {
        type: actionTypes.FETCH_BOOK_FAIL,
        error
    };
};

export const fetchBookStart = () => {
    return {
        type: actionTypes.FETCH_BOOK_START
    }
}

export const toggleWish = (olid) => {
    return {
        type: actionTypes.TOGGLE_WISH,
        olid
    }
}

export const addToWishlist = (olid) => {
    return {
        type: actionTypes.ADD_TO_WISHLIST,
        olid
    }
}

export const removeFromWishlist = (olid) => {
    return {
        type: actionTypes.REMOVE_FROM_WISHLIST,
        olid
    }
}

export const setSearchString = (searchString) => {
    return {
        type: actionTypes.SET_SEARCH_STRING,
        searchString
    }
}

export const saveBook = (book) => {
    return {
        type: actionTypes.SAVE_BOOK,
        book
    }
}

export const saveBookSuccess = (book) => {
    return {
        type: actionTypes.SAVE_BOOK_SUCCESS,
        book
    };
};

export const saveBookFail = (error) => {
    return {
        type: actionTypes.SAVE_BOOK_FAIL,
        error
    };
};

export const saveBookStart = () => {
    return {
        type: actionTypes.SAVE_BOOK_START
    }
}

export const deleteBook = (olid) => {
    return {
        type: actionTypes.DELETE_BOOK,
        olid
    }
}

export const deleteBookSuccess = (olid) => {
    return {
        type: actionTypes.DELETE_BOOK_SUCCESS,
        olid
    };
};

export const deleteBookFail = (error) => {
    return {
        type: actionTypes.DELETE_BOOK_FAIL,
        error
    };
};

export const deleteBookStart = () => {
    return {
        type: actionTypes.DELETE_BOOK_START
    }
}

export const clearMessage = () => {
    return {
        type: actionTypes.CLEAR_MESSAGE
    }
};