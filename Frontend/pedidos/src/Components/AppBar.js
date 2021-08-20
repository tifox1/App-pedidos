import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core'
import React from 'react'

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
    const classes = usoStyles()
    return (<>
        <AppBar className={classes.root} position="static">
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                    Pedidos
                </Typography>
            </Toolbar>
        </AppBar>
    </>)
}

export default NavBar
