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
import Pedido from './Components/Pedido';

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
                    <Route path="/pedidos">
                        <LoginRequired>
                            <Pedido />
                        </LoginRequired>
                    </Route>
                    <Route path="/login">
                        <Login />
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
