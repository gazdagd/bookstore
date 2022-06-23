import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { unstable_createMuiStrictModeTheme, ThemeProvider } from '@material-ui/core/styles';
import font from './fonts/GoudyBookletter1911-Regular.ttf';

import keycloak from './keycloak'
import Menu from './components/Menu/Menu';
import Books from './components/Books';
import Admin from "./components/Admin";
import Container from "@material-ui/core/Container";
import ProtectedRoute from "./ProtectedRoute";
import brown from '@material-ui/core/colors/brown';
import CssBaseline from "@material-ui/core/CssBaseline";
import BookDetail from "./components/Books/BookDetail";
import * as actions from './store/actions';
import { useDispatch } from 'react-redux';
import CircularProgress from "@material-ui/core/CircularProgress";

const gloudyFont = {
    fontFamily: 'Gloudy',
    fontStyle: 'normal',
    fontWeight: 400,
    src: `url(${font})`
}

function App() {
    console.log('RENDERING APP');
    const theme = unstable_createMuiStrictModeTheme({
        palette: {
            primary: {
                main: brown[800],
                light: brown[50]
            },
        },
        typography: {
            fontFamily: 'Gloudy',
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    '@font-face': [gloudyFont],
                },
            },
        },
    });

    const dispatch = useDispatch();

    const onKeycloakEvent = (event, error) => {
        dispatch(actions.keycloakEvent(event));
    }

    const onKeycloakTokens = (tokens) => {
        dispatch(actions.tokenChanged(tokens.token));
    }

    const keycloakProviderInitConfig = {
        onLoad: 'check-sso'
    }

    let routes = (
        <Switch>
            <Redirect exact from="/" to="/books" />
            <Route path={"/books/:olid"} component={BookDetail} />
            <Route path="/books" render={(props) => <Books {...props} wished={false} />} />
            <ProtectedRoute path="/wishlist" component={Books} wished={true} />
            <ProtectedRoute path="/admin" component={Admin} role="admin" />
            <Route render={() => <div><h3>404 - Not found</h3></div>} />
        </Switch>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ReactKeycloakProvider
                authClient={keycloak}
                initOptions={keycloakProviderInitConfig}
                onEvent={onKeycloakEvent}
                onTokens={onKeycloakTokens}
                LoadingComponent={<CircularProgress style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%'
                }} color="primary" />}
            >
                <React.Fragment>
                    <Menu />
                    <Container>
                        {routes}
                    </Container>

                </React.Fragment>
            </ReactKeycloakProvider>
        </ThemeProvider>
    )
        ;
}

export default App;
