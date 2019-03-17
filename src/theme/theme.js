import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

export default createMuiTheme({
  palette: {
    type: 'dark',

    primary: { main: '#00BCF2', light: '#00BCF2', dark: '#00BCF2' },
    secondary: { light: '#59345F', main: '#5B295E', dark: '#511E69' },
    error: { main: '#ED4837' },
    background: {
      default: '#212C3D',
      light1: '#29374A',
      light2: '#43526D',
      paper: '#43526D',
      paperLight: '#56698c'
    },
    common: {
      gray: '#B0B0B0'
    },

    contrastThreshold: 3,
    tonalOffset: 0.2
  },
  typography: {
    useNextVariants: true
  },
  customs: {
    paper: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 4,
      marginTop: theme.spacing.unit * 4,
      paddingBottom: theme.spacing.unit * 4,
      marginBottom: theme.spacing.unit * 4
    }
  }
});
