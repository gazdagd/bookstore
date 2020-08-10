import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const DeleteConfirm = (props) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Delete book?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete book {props.title}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => props.onConfirm(props.olid)} variant="contained" color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteConfirm;