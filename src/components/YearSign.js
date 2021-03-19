import React from 'react';

import { Typography, Container, Grid, makeStyles } from '@material-ui/core';
import SignHeader from './SignHeader';
import Compatibility from './Compatibility.js';
import Main from './Report';
import Sidebar from './Sidebar';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  compatibility: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));


const mainFeaturedPost = {
  title: 'Rat',
  description:
    "2021 is a year of the Ox, and the overall fortunes of Rat people (those born in a year of the Rat) are very good. Since the zodiac Rat and the zodiac Ox have a good relationship, the fortunes of Rat people will be exceptionally smooth.",
  image: 'https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/rat_rlchaa.png',
};

const bestCompatibility = [
  {
    title: 'Dragon',
    id: 5,
    description:
      'Usually energetic, strong and healthy you are also a very lucky person. When you walk into a room, heads turn; people whisper and eyes follow your every move. Competition thrills you, and you are often driven by your strong will to win. Tenacious and captivating, you like to stay in motion, stay preoccupied, and stay busy. The Dragon symbolizes life and growth, as reflected in their generous and scrupulous nature. You have the power to influence, to lead and impress. You are self confident and do not require nor your seek any reassurance. Confident, ambitious, and brave, a Dragon will work, sometimes from morning until night, in an effort to keep things running properly. You are capable of taking aggressive action if necessary.',
    image: 'https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/dragon_icj3pt.png',
  },
  {
    title: 'Monkey',
    id: 9,
    description:
      'You are clever, mentally quick, and exceedingly resourceful. You are always hungry for knowledge and can excel at school. Your talents shine through your childhood. You have prodigious memories, a natural affinity to learn languages, and the ability to unravel the knottiest problems. You’re endlessly inventive and lucky with money. You are not only smart, but also have a good sense of humor. No wonder you are',
    image: 'https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/monkey_zf2im5.png',
  },
];
const worstCompatibility = [
  {
    title: 'Sheep/Goat',
    id: 6,
    description:
      'Sheep are gentle and reflective, constructively applying their intelligence to the prevention of harm. You cannot live without beauty, and you strive for tranquility. Peace-loving, ardent, and easygoing, you can get along with nearly everyone. Sheep are the most sensitive of all the signs. This gentle soul is compassionate and loving, but tends toward moodiness and finds it difficult to work under pressure',
    image: 'https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/goat_nibmxx.png',
  },
  {
    title: 'Horse',
    id: 7,
    description:
      'Enthusiastic and frank, you are quite lovable and easy to get along with. Charming and cheerful, you are very likable. Your vivacity and enthusiasm make you popular. Extroverted, energetic, and defiant against injustice, th',
    image: 'https://res.cloudinary.com/dsw3onksq/image/upload/v1615559951/horse_flupw4.png',
  },
  {
    title: 'Rabbit',
    id: 5,
    description:
      'You have a very good judgement and refined creativity. You are a kind and helpful friend. The virtuous you possesses a highly developed sense of justice and fairness. Peace at all costs is essential for your creative flow. All the life the lesson to be learned is “detachment” . A Rabbit’s home is always beautiful because you are famous for your artistic sense and good taste. You are also well dressed.',
    image: 'https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/rabbit_sjt1gi.png',
  },
  {
    title: 'Rooster',
    id: 10,
    description:
      'You are the thinker, the philosopher, and observant. You are smart, charming, witty, honest, blunt, capable, talented, brave, and self-reliant. You are hardworking, cautious, and critical too. Appearance is really important to you, and you certainly know how to dress up. However, because you are never satisfied, you are constantly improving yourself.  The personality of those born ',
    image: 'https://res.cloudinary.com/dsw3onksq/image/upload/v1615559952/rooster_ignojl.png',
  },
];

const report = [
  "First position in zodiac makes you charming and creative. Well, you are one analytical soul who loves to dig down deeper in everything you take up. A curious mind that always searching for something. Highly intelligent and one your own kind. Born optimistic, you seem to have a solution for everything. Sense of humor comes naturally to you so is your energetic attitude towards life. ",
  "You have the ability to adapt easily to most of the circumstances. It is very unlikely to find a Rat sitting quietly doing nothing.  Even when you have time to sit down and enjoy a short break, your mind will still be running nonstop, planning your next grand scheme. Since you are on your toes always, you seem to be nervous at times.",
  "You are very expressive and talkative. You have a long list of phone numbers in your phone list, yet this does not make you too much social either. You are much of a private person and have a small list of friends. A perfect devotional and faithful friend always help someone in need. You are self-contained and often keep problems and secrets to yourself. You are extremely private and discreet when it comes to your personal life. You are natural teachers, and enjoy imparting life’s knowledge to all who care to listen.",
  "Rats are resourceful and ambitious that they are often very financially successful. You are natural explorers and voyagers and adore all things different and unusual. Rats also make excellent managers and business owners. Sometimes, its difficult to understand you. Although, you are sharp critics, you usually maintain propriety and diplomacy. You enjoy every comfort of life- food and housing. Sometimes, you believe that you are better than others are, so you love to compete and conquer and always try to be the pioneer and the first in action. Although you are a great critic you generally tend to be diplomatic at times."
];

const positiveTraits = 'Authoritative, Capable, Careful, Clear-thinking'
const negativeTraits = "Biased, Chauvinistic, Cold, Complacent"

export const YearSign = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <main>
          <SignHeader post={mainFeaturedPost} />
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="Rat Description" report={report} />
            <Sidebar
              positiveTraits={positiveTraits}
              negativeTraits={negativeTraits}
            />
          </Grid>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            paragraph={true}
          >
            Best Compatibility
        </Typography>
          <Grid container spacing={4} className={classes.compatibility}>
            {bestCompatibility.map((post) => (
              <Compatibility key={post.title} post={post} />
            ))}
          </Grid>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            paragraph={true}
          >
            Worst Compatibility
        </Typography>
          <Grid container spacing={4} className={classes.compatibility}>
            {worstCompatibility.map((post) => (
              <Compatibility key={post.title} post={post} />
            ))}
          </Grid>
        </main>
      </Container>
    </React.Fragment>
  );
}
