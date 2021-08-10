import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
// import Cookies from 'universal-cookie'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button } from '@material-ui/core';
import Tabla from './seleccion_pedido_components/tabla';



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

const Seleccion = () => {
    const classes = usoStyles();
    const formik = useFormik({
        initialValues:{
            cantidad: '',
            producto: '',
            tarifa: ''
        },
        onSubmit: value =>{
            alert('enviado')
        },
        validationSchema:yup.object({
            cantidad: yup.string().required("Este campo es obligatorio"),
            producto : yup.string().required("este campo es obligatorio"),
            tarifa: yup.string().required("Este campo es obligatorio")
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
                    <Grid container>
                        <Grid item xs={12} md={6} component={Box} padding={2}>
                            <Grid
                                container
                                spacing={2}>
                                <Grid item xs={6} >
                                    <Typography className={classes.title} variant="h6"  noWrap>
                                        Productos
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                container spacing={2}>
                                <Grid item xs={4} md={2}>
                                    <TextField id="outlined-basic" label="Cantidad" variant="outlined" name="cantidad" onChange={formik.handleChange} value={formik.values.cantidad} fullWidth />
                                </Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        freeSolo
                                        fullWidth
                                        options={[].map((option) => option.title)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Producto" variant="outlined" name="producto" onChange={formik.handleChange} value={formik.values.producto} />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField id="outlined-basic" variant="outlined" label="Tarifa" name="tarifa" onChange={formik.handleChange} value={formik.values.tarifa} fullWidth/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button type="submit"></Button>
                </form>
            </Paper>
            <Tabla/>

        </>

    )
}
export default Seleccion