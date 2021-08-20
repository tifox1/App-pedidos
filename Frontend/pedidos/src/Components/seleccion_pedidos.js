import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Cookies from 'universal-cookie'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button } from '@material-ui/core';
import Tabla from './seleccion_pedido_components/tabla';
import Autocompletado from './Templates/Autocompletado'
import { FormHelperText } from '@material-ui/core';
import Enviar from './Templates/button';

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

// const theme = createTheme({
//     palette: {
//         primary: green,
//     }
// })
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const columnas = [
    {
        title: 'Cantidad',
        field: 'cantidad'
    },
    {
        title: 'Producto',
        field: 'producto',
    },
    {
        title: 'Tarifa',
        field: 'tarifa'
    }
]


const Seleccion = () => {
    const cookies = new Cookies();
    const classes = usoStyles();
    const [message, setMessage] = useState(false)
    const [productos, setProductos] = useState([])
    const [resultado, setResultado] = useState([])
    const [valido, setValido] = useState(false)

    const handleClick = (event) => {
        setMessage()
        fetch('/api/pedidos_create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;',
            },
            body: JSON.stringify({
                tarifa: 1,
                usuario:[{id_usuario: 2}], //lugar donde ira la id del cliente
                formulario:resultado,
            })
        }).then(
            response => { return response.json() }
        ).then(
            data => {
                console.log(data.resultado)
                setProductos(data.resultado)

            }
        )
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage(false)
    }


    useEffect(() => {
        fetch('/api/producto_listado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;',
            },
            body: JSON.stringify({

            })
        }).then(
            response => { return response.json() }
        ).then(
            data => {
                console.log(data.resultado)
                setProductos(data.resultado)

            }
        )
        // console.log(productos)
    }, [valido])


    const formik = useFormik({
        initialValues: {
            cantidad: '',
            producto: '',
            id_producto: ''
        },
        onSubmit: (value, { resetForm }) => {
            console.log(value)
            setResultado(resultado.concat({
                cantidad: value.cantidad,
                id_producto: value.id_producto,
                producto: value.producto,
            }))
            console.log(productos)
            if (resultado.length + 1 > 0) {
                setValido(true)
            }else{
                setValido(false)
            }
            // resetForm()

        },
        validationSchema: yup.object({
            cantidad: yup.number().required("Este campo es obligatorio"),
            producto: yup.string().required("Este campo es obligatorio"),
            // tarifa: yup.string().required("Este campo es obligatorio")
        })
    })

    return (
        <>
            <AppBar className={classes.root} position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Pedidos
                    </Typography>
                </Toolbar>
            </AppBar>

            <Paper>
                <form onSubmit={formik.handleSubmit}>
                    <Grid 
                        container
                    >
                        <Grid item xs={12} md={6} component={Box} padding={2}>
                            <Grid
                                container
                                spacing={2}>
                                <Grid item xs={6} >
  
                                    <Typography className={classes.title} variant="h6" noWrap>
                                        Productos
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                container spacing={2}>

                                <Grid item xs={4} md={2}>
                                    <TextField
                                        error={formik.errors.cantidad}
                                        id="outlined-basic"
                                        label="Cantidad"
                                        variant="outlined"
                                        name="cantidad"
                                        onChange={formik.handleChange}
                                        value={formik.values.cantidad}
                                        fullWidth />
                                    {/* <FormHelperText error>{formik.errors.cantidad}</FormHelperText> */}

                                </Grid>
                                <Grid item xs={4}>
                                    <Autocompletado
                                        error={formik.errors.producto}
                                        name="producto"
                                        options={productos}
                                        title="Producto"
                                        inputValue={formik.values.producto}
                                        disableClearable
                                        onInputChange={(event, newValue) => {
                                            formik.setFieldValue('producto', newValue)
                                        }}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('id_producto', newValue.id)
                                            // console.log(newValue)
                                            // formik.setFieldValue('producto', newValue)
                                            // formik.setFieldValue('id_producto', newValue.id)
                                        }}
                                    />

                                </Grid>
                                <Grid item xs={4}>
                                    {/* <TextField
                                        error={formik.errors.tarifa}
                                        id="outlined-basic"
                                        variant="outlined"
                                        label="Tarifa"
                                        name="tarifa"
                                        onChange={formik.handleChange}
                                        value={formik.values.tarifa}
                                        fullWidth />
                                    <FormHelperText error>{formik.error.tarifa}</FormHelperText> */}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} component={Box} padding={2} alignItems='flex-end'>

                            <Grid
                                container spacing={2}>
                                <Grid item xs={3} md={6}>
                                </Grid>
                            </Grid>

                            <Grid
                                container 
                                spacing={2}
                            >
                                <Grid item xs={3} md={6}>
                                    {valido ? <Enviar onClick={handleClick}/> : null}
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Button type="submit"></Button>
                </form>
            </Paper>
            <Box m={2}>
            <Grid
                container
                spacing={2}
                alignItems="center"
                justify="center"
            >
                <Grid item xs={12} md={10} sm={12} padding={2}>

                </Grid>
            </Grid>
        </Box>
            {/* <Tabla resultado={resultado} setResultado={setResultado} valido={valido} setValido={setValido} /> */}
            <Snackbar open={message} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Tu formulario ha sido enviado!
                </Alert>  
            </Snackbar>
        </>

    )
}
export default Seleccion