import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Image from 'material-ui-image';

import * as actions from '../../store/actions';
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const BookDetail = (props) => {
    const dispatch = useDispatch();
    const olid = props.match.params.olid;

    const book = useSelector(state => {
        return state.book.loadedBook;
    });
    const loading = useSelector(state => {
        return state.book.loading;
    });

    useEffect(() => {
        dispatch(actions.fetchBook(olid));
    }, [dispatch, olid]);

    const toggleWished = () => {
        dispatch(actions.toggleWish(book.olid));
    }

    let content = <CircularProgress style={{
        position: 'fixed',
        top: '50%',
        left: '50%'
    }} color="primary"/>
    if(!loading) {
        content = <div><h3>404 - Not found</h3></div>;
    }
    if (!loading && book) {
        content =
            (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h5" style={{textAlign: 'center'}}>{book.title}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Image
                            disableSpinner
                            src={`http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                            imageStyle={{
                                width: 'auto',
                                height: '100%',
                                borderRadius: '5px',
                                right: '5px',
                                left: 'auto'
                            }}
                            style={{
                                backgroundColor: 'inherit',
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>Author: {book.authors}</Typography>
                        <Typography>Publisher: {book.publisher}</Typography>
                        <Typography>ISBN: {book.isbn}</Typography>
                        <Typography>Genre: {book.genres.join(', ')}</Typography>
                        <Typography>Number of pages: {book.numberOfPages}</Typography>
                        <div style={{
                            marginTop: '20px'
                        }}></div>
                        <Typography>{book.description}</Typography>
                        <div style={{
                            textAlign: 'right',
                            marginTop: '30px',
                        }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={toggleWished}
                            >{book.wished ? 'Unwish' : 'Wish'}</Button>

                        </div>
                    </Grid>

                    <Grid item xs={12}>
                    </Grid>

                </Grid>
            );
    }

    return (
        <div>{content}</div>
    );
}

export default BookDetail;