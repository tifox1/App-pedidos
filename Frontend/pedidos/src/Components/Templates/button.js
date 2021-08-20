import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { Button } from '@material-ui/core';


const theme = createTheme({
    palette: {
        primary: green,
    },
});

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));
const Enviar = (props) => {
    const classes = useStyles()
    return (
        <ThemeProvider theme={theme}>
            <Button variant="contained" color="primary" className={classes.margin} onClick={props.onClick}>
                Hacer pedido
            </Button>
        </ThemeProvider>
    )
}
export default Enviar