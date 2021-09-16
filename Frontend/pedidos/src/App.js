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

const theme = createTheme({
  palette: {
    type: 'dark',
    secondary: red
  }
});
function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/pedidos">
              <Seleccion />
            </Route>
            <Route path="/menu">
              <Menu/>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
