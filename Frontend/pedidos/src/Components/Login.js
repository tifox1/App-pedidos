import { useHistory } from "react-router";
import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'universal-cookie';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Caja from './Templates/Caja';
import { FormHelperText, Snackbar } from '@material-ui/core';
import { Collapse } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        background: '#000',
    },

    title: {
        flexGrow: 1,
    },

    divs: {
        margin: "auto",
    }

}));

const Login = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const cookies = new Cookies()
    const [logged, setLogged] = useState(false)
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severity] = useState('error')
    const [backdrop, setBackdrop] = useState(false)

    useEffect(
        ()=>{
            if(cookies.get('usuario')){
                history.push('/')
            }
        },[])

    const handleClose = (e, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }

    const formik = useFormik({
        initialValues: {
            usuario: '',
            contrasenia: '',
        },
        onSubmit: value => {
            setBackdrop(true)
            fetch('/api/usuario_validacion/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: value.usuario,
                    contrasenia: value.contrasenia,
                })
            }).then(response => {
                setBackdrop(false)
                // console.log(response)
                if (response.ok){
                    return response.json()
                } else if (response.status === 400) {
                    setMessage('Contraseña o usuario incorrectos')
                    setOpen(true)
                    return false
                } else {
                    setMessage('No se ha podido conectar con el servidor')
                    return false
                }
            }).then(data => {
                console.log(data)
                if (data) {
                    cookies.set('usuario', data, {path: '/'})
                    history.push('/')
                }
            }).catch(e => {
                if (e.name === 'TypeError') {
                    setBackdrop(false)
                    setMessage('No se pudo contactar con el servidor para validar el inicio de sesión')
                    setOpen(true)
                }
            })
        },
        validationSchema: Yup.object({
            usuario: Yup.string().required('Ingrese usuario'),
            contrasenia: Yup.string().required('Ingrese contraseña')
        })
    })

    return (<>
        <AppBar className={classes.root} position="static">
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                    Contacto Clientes
                </Typography>
            </Toolbar>
        </AppBar>
        <Backdrop
            open={backdrop}
            style={{zIndex: 200}}
            transitionDuration={{enter: 1500}}>
            <CircularProgress color="primary" />
        </Backdrop>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <MuiAlert elevation={6} variant="filled" severity={severity}>
                {message}
            </MuiAlert>
        </Snackbar>
        <form onSubmit={formik.handleSubmit}>
            <Grid container component={Box} padding={1}>
                <Caja title="Iniciar sesión">
                    <Grid
                        container
                        component={FormControl}
                        spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="usuario"
                                variant="outlined"
                                label="Usuario"
                                error={logged && formik.errors.usuario}
                                fullWidth
                                onChange={formik.handleChange}
                            />
                            <Collapse in={logged && formik.errors.usuario}>
                                <FormHelperText error>{formik.errors.usuario}</FormHelperText>
                            </Collapse>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="contrasenia"
                                variant="outlined"
                                label="Contraseña"
                                type="password"
                                error={logged && formik.errors.contrasenia}
                                fullWidth
                                onChange={formik.handleChange}
                            />
                            <Collapse in={logged && formik.errors.contrasenia}>
                                <FormHelperText error>{formik.errors.contrasenia}</FormHelperText>
                            </Collapse>
                        </Grid>
                        <Grid item
                            alignItems="center"
                            justify="center"
                            xs={12}>
                                <Button variant="contained"
                                        type="submit"
                                        color="primary"
                                        className={classes.margin}
                                        onClick={() => {setLogged(true)}}>
                                    Acceder
                                </Button>
                        </Grid>
                    </Grid>
                </Caja>
            </Grid>
        </form>
    </>)
}
export default Login
