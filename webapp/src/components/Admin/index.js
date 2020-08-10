import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles, fade} from "@material-ui/core/styles";
import * as actions from "../../store/actions";
import Box from "@material-ui/core/Box";
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from "@material-ui/core/InputBase";
import PageTable from "./PageTable";
import BookForm from "./BookForm";
import Dialog from "@material-ui/core/Dialog";
import DeleteConfirm from "./DeleteConfirm";
import {saveBook} from "../../store/actions";
import Loading from "../common/Loading";
import withNotification from "../common/withNotification";

const useStyles = makeStyles((theme) => ({
    root: {},
    controls: {
        display: 'flex',
        marginBottom: '12px',
        padding: theme.spacing(0, 2)
    },
    search: {
        position: 'relative',
        borderRadius: '30px',
        backgroundColor: fade(theme.palette.primary.main, 0.25),
        '&:hover': {
            backgroundColor: fade(theme.palette.primary.main, 0.15),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
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
        height: '100%',

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
    iconRoot: {
        padding: '0'
    },
    grow: {
        flexGrow: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const Admin = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const books = useSelector(state => {
        return state.book.books;
    });
    const loading = useSelector(state => {
        return state.book.loading;
    });
    useEffect(() => {
        dispatch(actions.fetchBooks(false));
    }, [dispatch]);
    useEffect(() => {
        setFilteredBooks(books);
    }, [books]);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [aboutToDeleteTitle, setAboutToDeleteTitle] = useState(null);
    const [aboutToDeleteOlid, setAboutToDeleteOlid] = useState(null);
    const [filteredBooks, setFilteredBooks] = useState(books);

    const [form, setForm] = React.useState({
        book: null,
        open: false
    });

    const handleAdd = () => {
        setForm({
            book: null,
            open: true
        });
    };

    const handleClose = () => {
        setForm({
            book: null,
            open: false
        });
    };

    const handleEdit = (olid) => {
        setForm({
            book: books.filter(book => book.olid === olid)[0],
            open: true
        });
    };

    const saveHandler = (book) => {
        dispatch(saveBook(book));
        setForm({
            book: null,
            open: false
        });
    }

    const deleteHandler = (olid) => {
        setAboutToDeleteTitle(books.filter(book => book.olid === olid)[0].title);
        setAboutToDeleteOlid(olid);
        setDeleteConfirmOpen(true);
    };

    const deleteCancelHandler = () => {
        setDeleteConfirmOpen(false);
    };

    const deleteConfirmHandler = (olid) => {
        setDeleteConfirmOpen(false);
        console.log('DELETE pressed on ' + olid);
        dispatch(actions.deleteBook(olid));
    };

    const filterHandler = (filter) => {
        setFilteredBooks(books.filter(book => {
            return book.title.toLowerCase().includes(filter.toLowerCase()) ||
                book.isbn.toLowerCase().includes(filter.toLowerCase()) ||
                book.olid.toLowerCase().includes(filter.toLowerCase())
            }
        ));
    }

    return (
        <Box className={classes.root}>
            <Loading open={loading}/>
            <div className={classes.controls}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <InputBase
                        placeholder="Filter…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{'aria-label': 'search'}}
                        onChange={(event) => {
                            filterHandler(event.target.value);
                        }}
                    />
                </div>
                <div className={classes.grow}></div>
                <Dialog open={form.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <BookForm onClose={handleClose} onSubmit={saveHandler} book={form.book}/>
                </Dialog>
                <DeleteConfirm
                    open={deleteConfirmOpen}
                    title={aboutToDeleteTitle}
                    olid={aboutToDeleteOlid}
                    onClose={deleteCancelHandler}
                    onConfirm={deleteConfirmHandler}/>
                <IconButton onClick={handleAdd} color="primary" component="span"
                            classes={{
                                root: classes.iconRoot
                            }}>
                    <AddBoxIcon/>
                </IconButton>
            </div>

            <PageTable
                data={filteredBooks}
                onEdit={handleEdit}
                onDelete={deleteHandler}
                id="olid"
                columns={["title", "isbn", "olid"]}
                labels={["Title", "ISBN", "OLID"]}
            />
        </Box>
    );
}

export default withNotification(Admin);