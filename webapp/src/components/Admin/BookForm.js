import React, {useState} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {useSelector} from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Input from '@material-ui/core/Input';
import Grid from "@material-ui/core/Grid";
import {useForm, Controller} from "react-hook-form";


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
    },
    formControl: {
        width: '100%'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const BookForm = (props) => {
    const classes = useStyles();

    const allGenres = useSelector(state => {
        return state.book.genres;
    });

    const book = props.book ? props.book : {
        title: '',
        isbn: '',
        olid: '',
        numberOfPages: 0,
        publisher: '',
        authors: [],
        genres: [],
        description: ''
    };

    const {register, handleSubmit, errors, formState, control} = useForm({
        mode: "onBlur",
        defaultValues: book
    });

    const onSubmit = data => props.onSubmit({...data, authors});
    const isEdit = Boolean(props.book);
    const [author, setAuthor] = useState('');
    const [authors, setAuthors] = useState(book.authors);

    const addAuthor = () => {
        if (author) {
            setAuthors(prevState => [...prevState, author]);
            setAuthor('');
        }
    }

    const removeAuthor = (index) => {
        setAuthors(prevState => {
            const newState = [...prevState];
            newState.splice(index, 1);
            return newState;
        });
    }

    return (
        <React.Fragment>
            <DialogTitle id="form-dialog-title">{isEdit ? "Modify book" : "Add book"}</DialogTitle>
            <DialogContent className={classes.root}>
                <Grid container spacing={1}>
                    <Grid container spacing={1} item xs={6} >
                        <Grid item xs={12} >
                            <TextField
                                id="title"
                                label="Title"
                                fullWidth
                                inputRef={register(
                                    {
                                        required: 'required',
                                        minLength: {
                                            value: 5,
                                            message: "minimum 5 characters"
                                        }
                                    })}
                                name="title"
                                error={Boolean(errors.title)}
                                helperText={Boolean(errors.title) ? errors.title.message : ""}
                                required
                            />
                        </Grid>

                        <Grid item xs={6} >
                            <TextField
                                id="isbn"
                                label="ISBN"
                                name="isbn"
                                inputRef={register({
                                    required: 'required'
                                })}
                                error={Boolean(errors.isbn)}
                                helperText={Boolean(errors.isbn) ? errors.isbn.message : ""}
                                required
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                id="olid"
                                label="OLID"
                                name="olid"
                                inputRef={register({
                                    required: 'required'
                                })}
                                error={Boolean(errors.olid)}
                                helperText={Boolean(errors.olid) ? errors.olid.message : ""}
                                required
                                disabled={Boolean(book.olid)}
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                id="numberOfPages"
                                name="numberOfPages"
                                inputRef={register({
                                    min: {
                                        value: 0,
                                        message: "must be positive"
                                    }
                                })}
                                error={Boolean(errors.numberOfPages)}
                                helperText={Boolean(errors.numberOfPages) ? errors.numberOfPages.message : ""}
                                label="Number of pages"
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                id="publisher"
                                name="publisher"
                                inputRef={register}
                                label="Publisher"
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-mutiple-chip-label">Genre</InputLabel>
                                <Controller
                                    as={
                                        <Select
                                            labelId="demo-mutiple-chip-label"
                                            id="genre"
                                            multiple
                                            input={<Input id="select-multiple-chip" />}
                                            renderValue={(selected) => (
                                                <div className={classes.chips}>
                                                    {selected.map((value) => (
                                                        <Chip color="primary" key={value} label={value} className={classes.chip}/>
                                                    ))}
                                                </div>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {allGenres.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    }
                                    name="genre"
                                    control={control}
                                    defaultValue={book.genres}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                            <TextField
                                id="author"
                                label="Author"
                                fullWidth
                                value={author}
                                onChange={(event) => setAuthor(event.target.value)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">
                                        <IconButton
                                            color="primary"
                                            onClick={addAuthor}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </InputAdornment>,
                                }}
                            />
                            <List dense={true}>
                                {authors.map((author, index) =>
                                    (<ListItem key={index}>
                                        <ListItemText
                                            primary={author}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete"
                                                        onClick={() => removeAuthor(index)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>)
                                )}
                            </List>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                name="description"
                                inputRef={register}
                                multiline
                                fullWidth
                                rowsMax={15}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    Cancel
                </Button>
                <Button variant="contained"
                        color="primary"
                        disabled={!formState.isValid}
                        onClick={handleSubmit(onSubmit)}
                >
                    Submit
                </Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default BookForm;