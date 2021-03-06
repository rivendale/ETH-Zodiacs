import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  sidebarAboutBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
    marginBottom: theme.spacing(1),
  },
  // sidebarSection: {
  //   marginTop: theme.spacing(3),
  // },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  const { positiveTraits, negativeTraits, monthAnimal, dayAnimal, element, force } = props;
  return (
    <Grid item xs={12} md={4}>
      <Paper elevation={0} className={classes.sidebarAboutBox}>
        <Typography><b>Element:</b> {element}</Typography>
        <Typography><b>Force:</b> {force}</Typography>
      </Paper>
      <Paper elevation={0} className={classes.sidebarAboutBox}>
        <Typography variant="h6" gutterBottom>
          Positive Traits
        </Typography>
        <Typography>{positiveTraits}</Typography>
      </Paper>
      <Paper elevation={0} className={classes.sidebarAboutBox}>
        <Typography variant="h6" gutterBottom>
          Negative Traits
        </Typography>
        <Typography>{negativeTraits}</Typography>
      </Paper>
      {monthAnimal && <Paper elevation={0} className={classes.sidebarAboutBox}>
        <Typography variant="h6" gutterBottom>
          Month Animal(s)
        </Typography>
        <Typography>{monthAnimal.animal}</Typography>
      </Paper>}
      {dayAnimal && <Paper elevation={0} className={classes.sidebarAboutBox}>
        <Typography variant="h6" gutterBottom>
          Day Animal(s)
        </Typography>
        <Typography>{dayAnimal.animal}</Typography>
      </Paper>}
      {/* <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
        Archives
      </Typography>
      {archives.map((archive) => (
        <Link display="block" variant="body1" href={archive.url} key={archive.title}>
          {archive.title}
        </Link>
      ))}
      <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
        Social
      </Typography>
      {social.map((network) => (
        <Link display="block" variant="body1" href="#" key={network}>
          <Grid container direction="row" spacing={1} alignItems="center">
            <Grid item>
              <network.icon />
            </Grid>
            <Grid item>{network.name}</Grid>
          </Grid>
        </Link>
      ))} */}
    </Grid>
  );
}

Sidebar.propTypes = {
  archives: PropTypes.array,
  description: PropTypes.string,
  social: PropTypes.array,
  title: PropTypes.string,
};
