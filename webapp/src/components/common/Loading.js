import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Loading = (props) => {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={props.open}>
            <CircularProgress style={{
                position: 'fixed',
                top: '50%',
                left: '50%'
            }} color="primary"/>
        </Backdrop>
    );
}

export default Loading;