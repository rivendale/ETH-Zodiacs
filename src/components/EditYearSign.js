import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Chip, Container, Input } from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ChipInput from 'material-ui-chip-input'
import api from '../api';
import { GlobalContext } from "../context/GlobalState";
import { SimpleBackdrop } from './common/Loaders';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    formControl: {
        width: '100%', // Fix IE 11 issue.
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
}));

const signNames = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Dog", "Pig"]
const signElements = ["Wood", "Fire", "Earth", "Metal", "Water"]
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


export const EditYearSign = (props) => {
    const classes = useStyles();
    const { getSign, sign } = useContext(GlobalContext);
    const [reportCount, setReportCount] = useState([0]);
    const [report, setReport] = useState({});
    const [dataFetched, setDataFetched] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stateUpdated, setStateUpdated] = useState(false);
    const [values, setValues] = useState({});

    const signId = props.match.params.signId

    const fetchSign = useCallback(async () => {
        // use the await keyword to grab the resolved promise value
        // remember: await can only be used within async functions!
        await api({
            method: "GET",
            url: `/year/${signId}`
        }).then(data => {
            // update local state with the retrieved data
            getSign(data.data.sign)
            // setValues(data.data.sign)
            setValues({
                ...values, positive_traits: data.data.sign.positive_traits,
                negative_traits: data.data.sign.negative_traits,
                best_compatibility: data.data.sign.best_compatibility,
                worst_compatibility: data.data.sign.worst_compatibility
            })
            setLoading(false)
            // history.push({
            //     pathname: `/zodiac-sign/${data.data.sign.id}`,
            //     state: { userSign: data.data.sign }
            // })
            // setOpen(true);
        })
            .catch(err => {
                setLoading(false)
                if (err.response) {
                    console.log(err.response)

                } else if (err.request) {
                    console.log(err.request)
                }
            })
    }, [getSign, signId, values])

    const updateSign = useCallback(async () => {
        // use the await keyword to grab the resolved promise value
        // remember: await can only be used within async functions!
        setLoading(true)
        await api({
            method: "PATCH",
            url: `/year/${signId}/`,
            data: values
        }).then(data => {
            // update local state with the retrieved data
            getSign(data.data.sign)
            setLoading(false)
            props.history.push({
                pathname: `/zodiac-sign/${data.data.sign.id}`,
                state: { userSign: data.data.sign }
            })
        })
            .catch(err => {
                setLoading(false)
                if (err.response) {
                    console.log(err.response)

                } else if (err.request) {
                    console.log(err.request)
                }
            })
    }, [getSign, props.history, signId, values])

    useEffect(() => {
        if (sign) {
            setReport(Object.assign({}, sign.report))
            setReportCount([...Array(sign.report.length).keys()])
        }
    }, [sign])

    useEffect(() => {
        if (!dataFetched) {
            fetchSign()
            setDataFetched(true)
        }
    }, [dataFetched, fetchSign])

    const handleChange = useCallback((event) => {
        if (event.target.value !== "") {
            setValues({ ...values, [event.target.name]: event.target.value })
            setStateUpdated(true)
        }
    }, [values])
    const handleAddReport = useCallback((e) => {
        e.preventDefault();
        if (reportCount.length) {
            setReportCount([...reportCount, reportCount[reportCount.length - 1] + 1])
        }
        else { setReportCount([1]) }
    }, [reportCount])

    const handleRemoveReport = useCallback((id) => {
        const index = reportCount.indexOf(+id);
        reportCount.splice(index, 1);

        if (Object.keys(report).length > 0) {
            delete report[+id]
        }
        setStateUpdated(true)

    }, [report, reportCount])

    const handleAddPositiveTraits = useCallback((value) => {
        setValues({ ...values, positive_traits: [...values.positive_traits, value] })
        setStateUpdated(true)
    }, [values])

    const handleDeletePositiveTraits = useCallback((value) => {
        const newTraits = values.positive_traits.filter(item => { return item !== value })
        setValues({ ...values, positive_traits: newTraits })
        setStateUpdated(true)

    }, [values])
    const handleAddNegativeTraits = useCallback((value) => {
        setValues({ ...values, negative_traits: [...values.negative_traits, value] })
        setStateUpdated(true)
    }, [values])

    const handleDeleteNegativeTraits = useCallback((value) => {
        const newTraits = values.negative_traits.filter(item => { return item !== value })
        setValues({ ...values, negative_traits: newTraits })
        setStateUpdated(true)

    }, [values])

    const handleReportChange = useCallback((e) => {
        e.preventDefault()
        let key = e.target.id
        let value = e.target.value

        if (Object.keys(report).length > 0) {
            setReport(prevAddBen => ({ ...prevAddBen, [key]: value }));
        }
        else {
            let newVal = { ...report, [key]: value }
            setReport(newVal)
        }
        setStateUpdated(true)


    }, [report])

    useEffect(() => {
        if (stateUpdated) {
            setValues({
                ...values,
                report: Object.values(report)
            })
            setStateUpdated(false)
        }
    }, [report, stateUpdated, values])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        updateSign()
    }, [updateSign])

    return (
        <Fragment>

            {loading ? <SimpleBackdrop open={loading} /> :
                <Container component="main" maxWidth="md">
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Edit Sign
                    </Typography>
                        <form className={classes.form} noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel id="name-select">Name</InputLabel>
                                        <Select
                                            labelId="name-select"
                                            required
                                            id="name-select-label"
                                            value={sign.name}
                                            onChange={handleChange}
                                            label="name"
                                            name="name"
                                            disabled
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {signNames.map(item => (<MenuItem key={item} value={item}>{item}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>

                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel id="element-select">Element</InputLabel>
                                        <Select
                                            labelId="element-select"
                                            required
                                            id="element-select-label"
                                            value={sign.element}
                                            onChange={handleChange}
                                            label="Element"
                                            name="element"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {signElements.map(item => (<MenuItem key={item} value={item}>{item}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>

                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel id="force-select">Force</InputLabel>
                                        <Select
                                            labelId="force-select"
                                            id="force-select-label"
                                            required
                                            value={sign.force}
                                            onChange={handleChange}
                                            label="Force"
                                            name="force"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Yin">Yin</MenuItem>
                                            <MenuItem value="Yang">Yang</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>

                                    <FormControl className={classes.formControl} variant="outlined">
                                        <InputLabel id="best-compatibility-">Best Compatibility</InputLabel>
                                        <Select
                                            labelId="best-compatibility-"
                                            id="best-compatibility"
                                            multiple
                                            name="best_compatibility"
                                            value={values.best_compatibility}
                                            onChange={handleChange}
                                            input={<Input id="select-multiple-chip" />}
                                            renderValue={(selected) => (
                                                <div className={classes.chips}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} className={classes.chip} />
                                                    ))}
                                                </div>
                                            )}
                                            MenuProps={MenuProps}>
                                            {signNames.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl className={classes.formControl} variant="outlined">
                                        <InputLabel id="worst-compatibility-">Worst Compatibility</InputLabel>
                                        <Select
                                            labelId="worst-compatibility-"
                                            id="worst-compatibility"
                                            multiple
                                            name="worst_compatibility"
                                            value={values.worst_compatibility}
                                            onChange={handleChange}
                                            input={<Input id="select-multiple-chip" />}
                                            renderValue={(selected) => (
                                                <div className={classes.chips}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} className={classes.chip} />
                                                    ))}
                                                </div>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {signNames.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <ChipInput
                                        value={values.positive_traits}
                                        label="Positive Traits"
                                        fullWidth
                                        onAdd={(chip) => handleAddPositiveTraits(chip)}
                                        onDelete={(chip, index) => handleDeletePositiveTraits(chip, index)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <ChipInput
                                        value={values.negative_traits}
                                        label="Negative Traits"
                                        fullWidth
                                        onAdd={(chip) => handleAddNegativeTraits(chip)}
                                        onDelete={(chip, index) => handleDeleteNegativeTraits(chip, index)}
                                    />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Typography component="h6" variant="h6">
                                        Description
                                </Typography>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <FormControl className={classes.formControl} variant="outlined">
                                        <TextareaAutosize name="description" value={sign.description} onChange={handleChange} aria-label="minimum height" rowsMin={3} placeholder="Sign Description..." />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography component="h6" variant="h6">
                                        Sign Report
                                </Typography>
                                </Grid>
                                {reportCount.map(key => (
                                    <Fragment key={key}>

                                        <Grid item xs={reportCount.length > 1 ? 10 : 12} md={reportCount.length > 1 ? 10 : 12}>
                                            <FormControl className={classes.formControl} variant="outlined">
                                                <TextareaAutosize value={report[key]} onChange={handleReportChange} id={key} aria-label="minimum height" rowsMin={3} placeholder="Sign Report..." />
                                            </FormControl>

                                        </Grid>
                                        <Grid item xs={2} md={2}>
                                            <Grid container direction="row" justify="flex-end">
                                                {reportCount.length > 1 &&
                                                    <Fab id={key} key={key} onClick={() => (handleRemoveReport(key))} color="inherit" size="small" aria-label="add">
                                                        <DeleteIcon />
                                                    </Fab>}
                                            </Grid>
                                        </Grid>
                                    </Fragment>))}
                                <Grid item xs={12} md={12}>
                                    <Grid container direction="row" justify="flex-end">
                                        <Fab onClick={handleAddReport} color="primary" size="small" aria-label="add">
                                            <AddIcon />
                                        </Fab>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                // fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Update Sign
                        </Button>
                        </form>
                    </div>
                </Container>
            }
        </Fragment>
    );
}
