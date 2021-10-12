import React, { useCallback, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import FilterListIcon from '@material-ui/icons/FilterList';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Box, Button, Fab, Link, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { TransferNFT } from './TransferNFT';
import { transferToken, validateEthAccount } from './EthAccount';
import { EthContext } from '../../context/EthContext';
import Config from '../../config';
import Avatar from '@material-ui/core/Avatar';


// function createData(token_id, nftURI, nftGatewayURL) {
//     return { token_id, nftURI, nftGatewayURL };
// }
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'token_id', numeric: false, disablePadding: true, label: 'Token Id' },
    { id: 'image_url', numeric: true, disablePadding: false, label: 'Token Image' },
    { id: 'token_url', numeric: true, disablePadding: false, label: 'Token URI' },
    { id: 'gateway_token_url', numeric: true, disablePadding: false, label: 'NFT Gateway URI' },
];

function EnhancedTableHead(props) {
    const { classes,
        // onSelectAllClick,
        order, orderBy,
        // numSelected, rowCount,
        onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell> */}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'desc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, handleTransfer } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    NFTs
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="transfer">
                    {/* <IconButton aria-label="Transfer"> */}
                    <Fab onClick={handleTransfer} variant="extended" style={{ width: "70vh", textTransform: "none" }}>
                        <ShareOutlinedIcon className={classes.extendedIcon} />
                        Transfer NFT(s)
                    </Fab>
                    {/* </IconButton> */}
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    handleTransfer: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    listRoot: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    smallAvatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

export const NFTTable = ({ tokens }) => {
    const classes = useStyles();
    const { ethAccount } = useContext(EthContext);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('token_id');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [openTransfer, setOpenTransfer] = React.useState(false);
    const [tokenRows, setTokenRows] = React.useState([]);
    // const [tokensFetched, setTokensFetched] = React.useState(false);
    const [address, setAddress] = React.useState(null);
    const [addressError, setAddressError] = React.useState("");
    const [transactionHashes, setTransactionHashes] = React.useState(null);
    const [transferError, setTransferError] = React.useState(null);
    const [transferLoading, setTransferLoading] = React.useState(false);
    const history = useHistory()
    // var rows = []
    // for (const [key, value] of Object.entries(tokens)) {
    //     rows.push(createData(key, value, value))
    // }
    // useEffect(() => {
    //     if (!tokensFetched) {
    //         for (const [key, value] of Object.entries(tokens)) {
    //             // setTokenRows(tokenRows => [...tokenRows, createData(key, value, value)])
    //         }
    //         setTokensFetched(true)
    //     }
    // }, [tokens, tokenRows, tokensFetched])
    const resetRows = useCallback(() => {
        let rows = tokenRows.filter(function (obj) {
            return !selected.includes(obj.token_id)
        });
        setTokenRows(rows)
        setSelected([0])
    }, [selected, tokenRows])

    const handleTransfer = () => {
        setOpenTransfer(!openTransfer);
    };

    const handleConfirm = (e) => {
        e.preventDefault()
        if (!address) { setAddressError("Address is required") }
        else {
            setAddress("")
            setTransferLoading(true)
            transferToken(selected, address).then(({ transactionHashes: data, errorMessage }) => {
                if (errorMessage) { setTransferError(errorMessage) }
                if (!!data.length) {
                    setTransactionHashes(data)
                    resetRows()
                }
                setTransferLoading(false)
                handleTransfer()
            })
        }
    };

    const handleChange = ({ target }) => {
        setAddress(target.value)
    };
    useEffect(() => {
        if (address) {
            validateEthAccount(address).then(status => {
                setAddressError(status ? "Enter a valid address" : !status && ethAccount === address ? "You  cannot transfer tokens to yourself" : "")
            })
        }
        else setAddressError("")
    }, [address, ethAccount])
    const handleRequestSort = (event, property) => {
        event.preventDefault()
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelectedItems = tokenRows.map((n) => n.token_id);
            setSelected(newSelectedItems);
            return;
        }
        setSelected([]);
    };

    // const handleClick = (event, name) => {
    //     const selectedIndex = selected.indexOf(name);
    //     let newSelected = [];

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, name);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1),
    //         );
    //     }

    //     setSelected(newSelected);
    // };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRedirect = (url) => {
        window.open(url, '_blank')
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    return (
        <div className={classes.root}>
            <TransferNFT
                open={openTransfer}
                handleClose={handleTransfer}
                error={addressError}
                selected={selected}
                transferring={transferLoading}
                handleConfirm={handleConfirm}
                handleChange={handleChange} />
            <Paper className={classes.paper}>
                {transferError &&
                    <Typography component="h5" variant="h5" align="center" color="textPrimary" gutterBottom>
                        {transferError}
                    </Typography>}
                {transactionHashes && !!transactionHashes.length && <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            NFT Transfer in progress. You can view the transaction(s) details on EthScan by clicking the link(s) below
                        </ListSubheader>
                    }
                    className={classes.listRoot}
                >
                    {transactionHashes.map(tx => (
                        <ListItem button key={tx}>
                            <ListItemIcon>
                                <SendIcon />
                            </ListItemIcon>
                            <ListItemText>
                                <Link target="_blank" display="block" variant="body1" href={`${Config.TX_EXPLORER}/${tx}`}>
                                    {tx.substr(0, 20) + '...' + tx.substr(tx.length - 20, tx.length)}
                                </Link>
                            </ListItemText>
                        </ListItem>))}
                </List>}
                <EnhancedTableToolbar
                    handleTransfer={handleTransfer}
                    numSelected={selected.length} />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'small'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={tokenRows.length}
                        />
                        <TableBody>
                            {stableSort(tokens, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    const isItemSelected = isSelected(row.token_id);
                                    const labelId = `enhanced-table-checkbox-${row.token_id}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.token_id}
                                            selected={isItemSelected}
                                        >
                                            {/* <TableCell padding="checkbox">
                                                <Checkbox
                                                    onClick={(event) => handleClick(event, row.token_id)}
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell> */}
                                            <TableCell align="left" scope="integer" component="th" id={labelId} padding="none">
                                                <Button style={{ textTransform: "none" }} endIcon={<OpenInNewIcon />} onClick={() => { history.push(`/nft/${row.token_id}`) }}>
                                                    {row.token_id}
                                                </Button>
                                            </TableCell>
                                            <TableCell sortDirection={false} align="left" scope="integer" component="th" id={labelId} padding="none">

                                                <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <Box style={{ margin: "auto" }}>
                                                        <Avatar alt={row.image_url.split('.').pop()} src={`${row.image_url}`} className={classes.smallAvatar} />
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sortDirection={false} align="right">
                                                {row.token_url.substr(7, 11) + '...' + row.token_url.substr(row.token_url.length - 6, row.token_url.length)}
                                                <OpenInNewIcon style={{ cursor: "pointer" }} onClick={() => handleRedirect(row.token_url)} />
                                            </TableCell>
                                            <TableCell sortDirection={false} align="right">
                                                {row.gateway_token_url.substr(7, 11) + '...' + row.gateway_token_url.substr(row.gateway_token_url.length - 6, row.gateway_token_url.length)}
                                                <OpenInNewIcon style={{ cursor: "pointer" }} onClick={() => handleRedirect(row.gateway_token_url)} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            <TableRow style={{ height: (53) * 1 }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100, { label: 'All', value: 1000 }]}
                    component="div"
                    count={tokens?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
