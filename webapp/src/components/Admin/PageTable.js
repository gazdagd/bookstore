import React from 'react';
import {Paper} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import TableContainer from "@material-ui/core/TableContainer";
import {makeStyles, withStyles, useTheme} from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    iconRoot: {
        padding: '0'
    },
    table: {
        minWidth: 650,
    }
}));

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

const PageTable = (props) => {
    const classes = useStyles();
    const {data, labels, columns, id} = props;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log('PAGEING');
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        console.log('ROWS PER PAGE CHANGED');
    };

    const empty = []

    for (let i=0; i<emptyRows; i++) {
        empty.push(<StyledTableRow key={i}><StyledTableCell component="th" scope="row">{''}</StyledTableCell></StyledTableRow>);
    }


    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow key="header">
                        <StyledTableCell>{labels[0]}</StyledTableCell>
                        {labels.slice(1).map(label =>  <StyledTableCell key={label} align="right">{label}</StyledTableCell>)}
                        <StyledTableCell align="right"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : data
                    ).map((row) => (
                        <StyledTableRow key={row[id]}>
                            <StyledTableCell component="th" scope="row">
                                {row[columns[0]]}
                            </StyledTableCell>
                            {columns.slice(1).map(col =>
                                <StyledTableCell key={row[id] + '_' + col} align="right">
                                        {row[col]}
                                </StyledTableCell>)}
                            <StyledTableCell align="right">
                                <IconButton onClick={() => props.onEdit(row[id])} color="primary" aria-label="edit"
                                            component="span" classes={{
                                    root: classes.iconRoot
                                }}
                                            style={{marginRight: '5px'}}
                                >
                                    <EditIcon/>
                                </IconButton>
                                <IconButton onClick={() => props.onDelete(row[id])} color="primary" aria-label="delete"
                                            component="span" classes={{
                                    root: classes.iconRoot
                                }}>
                                    <DeleteIcon/>
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 36 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}

                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={4}
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

export default PageTable;