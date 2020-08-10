import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme, makeStyles} from '@material-ui/core/styles';

import * as actions from '../../store/actions';
import BookItem from "./BookItem";
import CircularProgress from "@material-ui/core/CircularProgress";

function useWidth() {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
        keys.reduce((output, key) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, null) || 'xs'
    );
}

const useStyles = makeStyles(() => ({
    tile: {
        padding: '5px'
    }
}));

const Books = (props) => {
    console.log('BOOKS RENDER');
    const width = useWidth();
    const classes = useStyles();
    const dispatch = useDispatch();
    const books = useSelector(state => {
        return state.book.books;
    });
    const loading = useSelector(state => {
        return state.book.loading;
    });
    const getSearch = () => {
        if (props.location) {
            const params = new URLSearchParams(props.location.search);
            return params.get('search');
        } else return null;
    }
    const searchString = getSearch();

    const wished = props.wished;
    useEffect(() => {
        dispatch(actions.fetchBooks(wished));
    }, [dispatch, wished]);

    const getGridListCols = () => {
        if (width === 'xl' || width === 'lg') {
            return 4;
        }

        if (width === 'md') {
            return 3;
        }

        if (width === 'sm') {
            return 2;
        }

        return 1;
    }

    const toggleWished = (olid) => {
        dispatch(actions.toggleWish(olid));
    }
    let content = <CircularProgress style={{
        position: 'fixed',
        top: '50%',
        left: '50%'
    }} color="primary"/>
    if (!loading) {
        content = (
            <GridList
                cellHeight={"auto"}
                cols={getGridListCols()}
                spacing={40}
            >
                {books.filter(book => {
                    if (searchString) {
                        return book.title.toLowerCase().includes(searchString.toLowerCase());
                    } else return true;
                }).map((book, index) => (
                    <GridListTile key={book.olid}
                                  classes={{tile: classes.tile}}>
                        <BookItem book={book} delay={index} toggleWished={toggleWished}/>
                    </GridListTile>
                ))}
            </GridList>
        );
    }

    return (
        <div>
            {content}
        </div>
    );
}

export default Books;