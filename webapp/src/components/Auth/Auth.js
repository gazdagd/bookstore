import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import classes from './Auth.module.css';
import axios from '../../authAxios';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Auth = () => {

    const backDropClasses = useStyles();

    const [showPassword, setShowPassword] = useState(false);
    const [register, setRegister] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        userName: '',
        password: '',
        rePassword: ''
    });

    const calcEnabled = (values, register) => {
        let enabled = true;
        if (values.userName.length < 3 || values.password.length < 6) {
            enabled = false;
        }
        if (register && (values.password !== values.rePassword)) {
            enabled = false;
        }
        setEnabled(enabled);
    }

    const handleChange = (prop) => (event) => {
        const newValues = {...values, [prop]: event.target.value};
        setValues(newValues);
        calcEnabled(newValues, register);
    };

    const handleClickShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = () => {
        setLoading(true);
        axios.get('/token')
            .then(response => {
                setLoading(false);
                console.log('response data: ' + response);
            })
            .catch(error => {
                setLoading(false);
                setErrorMessage(error.message);
            });
    }

    let rePassword = null;
    if (register) {
        rePassword = (<div className={classes.Control}>
            <FormControl className={classes.TextField}>
                <InputLabel htmlFor="standard-adornment-password">Password Again</InputLabel>
                <Input
                    id="standard-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.rePassword}
                    onChange={handleChange('rePassword')}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </div>);
    }

    let error = null;
    if(errorMessage) {
        error = <Alert severity="error">{errorMessage}</Alert>;
    }
    return (
        <form className={classes.Form} noValidate autoComplete="off">
            <Backdrop className={backDropClasses.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {error}
            <div className={classes.Control}>
                <TextField
                    className={classes.TextField}
                    id="standard-basic"
                    label="User name"
                    value={values.userName}
                    onChange={handleChange('userName')}/>
            </div>
            <div className={classes.Control}>
                <FormControl className={classes.TextField}>
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
            {rePassword}
            <div className={classes.Control}>
                <Button color="secondary" onClick={() => {
                    setRegister(prevState => {
                            calcEnabled(values, !prevState);
                            return !prevState
                        }
                    );
                }}>
                    {register ? 'Login' : 'Register'}
                </Button>
                <Button onClick={handleSubmit} disabled={!enabled} color="primary">{register ? 'Register' : 'Login'}</Button>
            </div>
        </form>
    );
}

export default Auth;