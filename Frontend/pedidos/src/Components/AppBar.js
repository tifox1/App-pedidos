import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core'
import ExitToApp from '@material-ui/icons/ExitToApp';
import React from 'react'
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router';
const usoStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        background: '#000',
    },

    title: {
        flexGrow: 1,
    },

    divs: {
        padding: theme.spacing(2),
        margin: "auto",
    },
    search: {
        width: 300,
        height: 100,
        marginRight: 10

    }

}));

const NavBar = (props) => {
    const history = useHistory()
    const cookies = new Cookies()
    const classes = usoStyles()
    const handleClick = () => {
        cookies.remove('usuario')
        history.push('/login')
    }
    return (<>
        <AppBar className={classes.root} position="static">
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                    Pedidos
                </Typography>
                <button onClick={handleClick}>
                    <ExitToApp />
                </button>
            </Toolbar>
        </AppBar>
    </>)
}

export default NavBar
