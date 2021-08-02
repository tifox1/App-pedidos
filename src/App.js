import Seleccion from './Components/seleccion_pedidos'
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { CssBaseline } from '@material-ui/core';

const theme = createTheme({
  palette: {
    type: 'dark',
    secondary: red
  }
});
function App() {
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Seleccion />
      </CssBaseline>
    </ThemeProvider>

  );
}

export default App;
