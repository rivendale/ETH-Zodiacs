import React, { Fragment, useCallback, useContext, useState } from 'react';
import {
    makeStyles, Button, Container, Grid,
    FormControl, TextField, Avatar, CircularProgress
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { SimpleBackdrop, SnackBar } from '../common/Loaders'
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { ImageCrop } from '../common/ImageCrop';
import { cloudinaryImageUpload } from '../common/ImageUpload';
import moment from 'moment';
import MomentUtils from "@date-io/moment";
import { EthContext } from '../../context/EthContext';
import { updateProfile } from '../eth/identity';




const useStyles = makeStyles((theme) => ({
    root: {
        // margin: theme.spacing(1.5, "auto", 0, "auto"),
        // paddingTop: theme.spacing(),
        minHeight: '75vh',
        marginTop: 0,
        backgroundImage: "url(/dist/images/profile-bg.svg)",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        // width: "100vw",
        // minHeight: "68vh",
        // backgroundPosition: 'center',
        // backgroundSize: '100% 10%',
        // minHeight: '40vh !important',
        backgroundSize: '100vw',
        "@media (max-width: 767px)": {
            backgroundImage: "none !important"
        },
        padding: 0
    },
    main: {
        margin: theme.spacing(3, 0, 8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3, 25),
        background: "#FFFFFF",
        border: "1px solid #F6FAFF",
        boxSizing: "border-box",
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        [theme.breakpoints.down("md")]: {
            padding: theme.spacing(3, 10),
        },
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(3, 3),
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.12)',
            }
        },
    },
    header: {
        display: "flex",
        flexDirection: "row",
        padding: theme.spacing(4, 3, 3),
    },
    profileTitle: {
        fontWeight: "800",
        marginLeft: "38%",
        "@media (min-width: 1280px)": {
            marginLeft: "35%",
        },
        [theme.breakpoints.down("md")]: {
            marginLeft: "30%",
        },
        [theme.breakpoints.down("sm")]: {
            marginLeft: "10%",
            "@media screen and (min-width:700px) and (max-width:840px)": {
                marginLeft: "20%",
            },
        },
        [theme.breakpoints.down("xs")]: {
            margin: "auto",
        },
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        textTransform: "none",
        borderRadius: ".7em",
        whiteSpace: "nowrap",
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
        width: "30%",
        // margin: "auto",
        margin: theme.spacing(0, "auto", 6),
        // "@media (max-width: 1047px)": {
        // },
        [theme.breakpoints.down("sm")]: {
            width: "50%",
        },

    },
    formControl: {
        width: '100%', // Fix IE 11 issue.
    },
    descriptionError: {
        color: "red",
        fontSize: "12px",
        marginLeft: theme.spacing(2),
    },
    avatar: {
        marginRight: theme.spacing(1)
    },
    input: {
        display: 'none'
    },
    editButton: {
        textTransform: "none",
        borderRadius: ".7em",
        whiteSpace: "nowrap",
        border: '1px solid #018AF2',
        color: "#312E58",
    },
    cancelIcon: {
        marginLeft: theme.spacing(4),
        height: theme.spacing(2.8),
        width: theme.spacing(2.8),
        [theme.breakpoints.down("xs")]: {
            marginLeft: theme.spacing(2),
        },
    },
    large: {
        width: theme.spacing(17),
        height: theme.spacing(17),
        border: '3px solid #018AF2',
        margin: theme.spacing(1)
    },
    minimalDetails: {
        display: 'flex',
        // padding: theme.spacing(1),
        // margin: theme.spacing(2, 0.1, 2, 0.1),
        flexDirection: 'column',
        // alignItems: 'center',
    },
    boldText: {
        fontSize: ".9em",
        fontWeight: "800"
    },
    centerDetails: {
        display: 'flex',
        flexDirection: 'row',
        margin: "auto",
        width: theme.spacing(38),

    },
    detailsSpacing: {
        margin: theme.spacing(2, 5, 1, 0)
    },
    minimalInput: {
        // backgroundColor: "red",
        width: theme.spacing(29),
        margin: "auto",
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                height: theme.spacing(6),
                margin: "auto",
            }
        },
        '& input.MuiInputBase-input.MuiOutlinedInput-input': {

            height: theme.spacing(0.5),
            margin: theme.spacing(1, "auto"),
        },
    },
}));

export const EditProfile = (props) => {
    const history = useHistory()

    const classes = useStyles();
    const { identityProfile, ethAccount, setThreeIdProfile } = useContext(EthContext)

    const [updatingProfile, setUpdatingProfile] = useState(false)


    const [successMessage, setSuccessMessage] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imageFile, setImageFile] = useState()
    const [values, setValues] = useState({
        profileFetched: false,
        updated: false,
        name: "",
        description: "",
        avatar: "",
        birthDate: moment().format("MM-DD-YYYY"),
    })

    const handleCloseSnackbar = () => {
        setSuccessMessage(false);
    };
    const dateFormatter = str => {
        return str;
    };


    const handleChange = useCallback((name, value) => {

        setValues({ ...values, [name]: value })
    }, [values])

    const handleImageUpload = async (imageRef, completedCrop, previewCanvasRef, ethAccount) => {
        await cloudinaryImageUpload(imageRef, completedCrop, previewCanvasRef, ethAccount)
            .then(res => res.json())
            .then(data => {
                setImageFile(null);
                setValues({ ...values, avatar: data.secure_url });
                setUploading(false)
            })
            .catch(error => {
                console.log(error);
                setImageFile(null);
                setUploading(false)
            })
    }
    if (identityProfile && !values.profileFetched) {
        setValues({
            ...values, ...identityProfile,
            name: identityProfile.name ? identityProfile.name : "",
            description: identityProfile.description ? identityProfile.description : "",
            avatar: identityProfile.avatar ? identityProfile.avatar : "",
            birthDate: identityProfile.birthDate ? moment(identityProfile.birthDate).format("MM-DD-YYYY") : "",
            profileFetched: true
        })

    }

    const onSelectFile = ({ target }) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(target.files[0]);
        fileReader.onload = (e) => {
            setImageFile(e.target.result);
        };
    };
    const handleSubmit = (e) => {
        e.preventDefault()
        const profile = {
            name: values.name,
            description: values.description,
            avatar: values.avatar,
        }
        if (values.birthDate) {
            profile.birthDate = moment(values.birthDate).format("YYYY-MM-DD")
        }
        setUpdatingProfile(true)
        updateProfile(ethAccount, profile).then((data) => {
            setUpdatingProfile(false)
            if (data) { }
            setThreeIdProfile(data)
            history.push("/profile")
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });

        })
        // if (!validationErrors.errors.length) { updateProfile() }
    }
    return (
        <Fragment>
            {/* {values.user ? */}
            <Fragment>
                <SimpleBackdrop open={updatingProfile} />
                <Container maxWidth={false} className={classes.root}>
                    {/* <Box className={classes.header}>
                        <Box display={{ xs: 'none', sm: 'block', md: 'block' }}>
                            <Button onClick={() => { history.push("/manage") }} style={{ textTransform: "none" }} startIcon={<ArrowBackIcon />}>
                                Back to My Profile
                            </Button>
                        </Box>
                        <Typography variant="h5" className={classes.profileTitle} align="center">Edit Profile</Typography>
                    </Box> */}
                    <Container component="main" maxWidth="lg">
                        <div className={classes.main}>
                            <Avatar alt={values?.name} src={values?.avatar ? values?.avatar : "."} className={classes.large} />
                            {imageFile && <div style={{ width: "40%" }}>
                                <ImageCrop imageData={imageFile} handleImageUpload={handleImageUpload} uploading={uploading} />
                            </div>}
                            <div>
                                {!imageFile && <Fragment>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        id="icon-button-photo"
                                        onChange={onSelectFile}
                                        type="file"
                                        name="imageData"
                                    />
                                    <label htmlFor={uploading ? "" : "icon-button-photo"}>
                                        <IconButton color="primary" component="span">
                                            {/* <PhotoCamera /> */}
                                            <Button component="span" startIcon={uploading ? "" : <EditIcon color="primary" />} variant="outlined" className={classes.editButton}>
                                                {uploading ? <CircularProgress color="primary" size={20} /> : "Change Photo"}
                                            </Button>
                                        </IconButton>
                                    </label>


                                </Fragment>}
                                {imageFile && !uploading && <label htmlFor="cancel-upload-image">
                                    <IconButton style={{ color: "red", fontSize: "1.2em" }} component="span" onClick={() => { setImageFile(null) }}>
                                        Cancel
                                    </IconButton>
                                </label>}
                            </div>
                            <form className={classes.form} noValidate>
                                <Grid container spacing={5}>

                                    <Grid item xs={12} sm={6} md={6}>

                                        <FormControl className={classes.formControl}>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                id="name"
                                                label="Name"
                                                name="name"
                                                value={values.name}
                                                autoComplete="given-name"
                                                onChange={(e) => { handleChange("name", e.target.value) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>

                                        <FormControl className={classes.formControl}>
                                            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                                                <Grid container >
                                                    <KeyboardDatePicker
                                                        margin="normal"
                                                        autoOk
                                                        animateYearScrolling
                                                        label="Date of Birth"
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        value={values.birthDate}
                                                        format="MM-DD-YYYY"
                                                        placeholder="MM-DD-YYYY"
                                                        inputValue={values.birthDate || moment().format("MM-DD-YYYY")}
                                                        onChange={(date) => { handleChange("birthDate", moment(date).format("MM-DD-YYYY")) }}
                                                        rifmFormatter={dateFormatter}
                                                        disableFuture
                                                    />
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <FormControl className={classes.formControl} variant="outlined">
                                            {/* <TextareaAutosize
                                                variant="outlined"
                                                name="bio"
                                                onChange={handleChange}
                                                aria-label="bio"
                                                value={values.bio}
                                                rowsMin={3}
                                                placeholder="About me..."
                                            /> */}
                                            <TextField
                                                id="outlined-multiline-static"
                                                onChange={(e) => { handleChange("description", e.target.value) }}
                                                multiline
                                                fullWidth
                                                value={values.description}
                                                rows={4}
                                                placeholder="About me..."
                                                variant="outlined"
                                                className={classes.textField}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>

                            </form>
                        </div>
                    </Container>
                    <Button
                        type="submit"
                        // fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        Update Profile
                    </Button>
                    {/* <SimpleBackdrop open={loading} /> */}
                    <SnackBar
                        handleCloseSnackbar={handleCloseSnackbar}
                        snackBarOpen={successMessage}
                        successMessage={"Profile Updated successfully!"}
                    />
                </Container>
            </Fragment>
            {/* : */}
            {/* <SimpleBackdrop open={true} />} */}

        </Fragment>);
}

