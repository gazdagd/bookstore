import React, {Fragment} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import * as actions from '../../store/actions';

const withNotification = (WrappedComponent) => {
    return props => {
        const message = useSelector(state => {
            return state.book.message
        });
        const severity = useSelector(state => {
            return state.book.messageSeverity
        });
        const dispatch = useDispatch();

        const clear = () => {
            dispatch(actions.clearMessage());
        }

        return (
            <Fragment>
                <Snackbar open={Boolean(message)} autoHideDuration={6000} onClose={clear}>
                    <Alert onClose={clear} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
                <WrappedComponent {...props} />
            </Fragment>
        );

    }
}

export default withNotification;