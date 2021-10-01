import Seleccion from './Components/seleccion_pedidos'
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { CssBaseline } from '@material-ui/core';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import Login from './Components/Login';
import Menu from './Components/Menu';
import LoginRequired from './Components/LoginRequired';

const theme = createTheme({
    palette: {
        type: 'dark',
        secondary: red
    }
});

function App() {
    return (<>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/pedidos">
                        <LoginRequired>
                            <Seleccion />
                        </LoginRequired>
                    </Route>
                    <Route exact path="/">
                        <LoginRequired>
                            <Menu />
                        </LoginRequired>
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    </>);
}

export default App;
