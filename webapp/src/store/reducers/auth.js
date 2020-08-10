import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../util/utility';

const initialState = {
    userName: '',
    token: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (actionTypes.USERNAME_CHANGED): return updateObject(state, {userName: action.userName});
        case (actionTypes.TOKEN_CHANGED): return updateObject(state, {token: action.token});
        default: return state;
    }
};

export default reducer;