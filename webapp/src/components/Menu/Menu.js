import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import {fade, makeStyles} from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {AccountCircle} from "@material-ui/icons";
import MenuItem from "@material-ui/core/MenuItem";
import MuiMenu from '@material-ui/core/Menu';
import {Link as RouterLink} from 'react-router-dom';
import PrivateButton from "../../ProtectedButton";
import { useSelector} from "react-redux";
import {useKeycloak} from "@react-keycloak/web";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from "@material-ui/core/InputBase";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    appBar: {
        marginBottom: "20px"
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },

    menuButton: {
        marginRight: theme.spacing(2),
    },
    grow: {
        flexGrow: 1,
    }
}));

const Menu = () => {
    console.log('RENDERING MENU');
    const history = useHistory();

    const userName = useSelector(state => {
        return state.auth.userName
    });
    const [keycloak] = useKeycloak();
    const classes = useStyles();

    const getSearch = () => {
        if (history.location) {
            const params = new URLSearchParams(history.location.search);
            return params.get('search') ? params.get('search') : '';
        } else return '';
    }

    const [searchString, setSearchString] = useState(getSearch());
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    history.listen((action, location) => {
        setSearchString(getSearch());
        console.log('Action: ' + action);
        console.log('location: ' + location);

    });

    const renderMenu = (
        <MuiMenu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id="primary-search-account-menu"
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem>Profile ({userName})</MenuItem>
            <MenuItem onClick={() => keycloak.logout({redirectUri: window.location.origin + '/books'})}>Logout</MenuItem>
        </MuiMenu>
    );

    let authControl = <Button color="inherit" onClick={keycloak.login}>Login</Button>;
    if (userName) {
        authControl = (
            <React.Fragment>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
                {renderMenu}
            </React.Fragment>
        );
    }

    return (
        <header>
            <AppBar className={classes.appBar} position="static">
                <Toolbar>
                    <Button color="inherit" to="/" component={RouterLink} className={classes.menuButton}>Books</Button>
                    <PrivateButton to="/wishlist" component={RouterLink} color="inherit" className={classes.menuButton}
                                   >Wishlist</PrivateButton>
                    <PrivateButton to="/admin" component={RouterLink} color="inherit" className={classes.menuButton}
                                   role="admin">Admin</PrivateButton>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <InputBase
                            onKeyDown={(event) => {
                                if (event.keyCode === 13) {
                                    if (event.target.value) {
                                        if (history.location.pathname === '/wishlist') {
                                            history.push('/wishlist?search=' + event.target.value);
                                        } else {
                                            history.push('/books?search=' + event.target.value);
                                        }
                                    } else {
                                        history.push(history.location.pathname);
                                    }
                                }
                            }}
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{'aria-label': 'search'}}
                            value={searchString}
                            onChange={(event) => {
                                setSearchString(event.target.value);
                            }}
                        />
                    </div>
                    <div className={classes.grow}/>
                    {authControl}
                </Toolbar>
            </AppBar>
        </header>
    );
};

export default React.memo(Menu);