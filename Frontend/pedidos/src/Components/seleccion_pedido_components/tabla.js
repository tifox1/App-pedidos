import React, { useState, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import Cookies from 'universal-cookie';
import * as yup from 'yup'
import Grid from '@material-ui/core/Grid'
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import { Button, Table, TableBody, TableCell, TableHead } from '@material-ui/core'
import Autocompletado from './Templates/Autocompletado'
import { FormHelperText } from '@material-ui/core'
import NavBar from './AppBar'
import Caja from './Templates/Caja'
import LineaPedido from './LineasPedido'
import { useHistory } from "react-router";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Seleccion = () => {
    const history = useHistory()
    const cookies = new Cookies()
    const [message, setMessage] = useState(false)
    const [productos, setProductos] = useState([])
    const [resultado, setResultado] = useState([])
    const [valido, setValido] = useState(false)
    const tarifa = useRef([])
    const result = useRef([])


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setMessage(false)
    }


    useEffect(() => {
        if(!cookies.get('usuario')){
            history.push('/login')
        }
        fetch('/api/producto_listado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                odoo_field: cookies.get('usuario').usuario.odoo_field
            })
        }).then(
            response => { return response.json() }
        ).then(
            data => {
                setProductos(data.resultado)

            }
        )



    const formik = useFormik({
        initialValues: {
            cantidad: '',
            producto: '',
            id_producto: ''
        },
        onSubmit: (value, { resetForm }) => {
            let d = new Date()
            value.date = d.toUTCString()
            setResultado([...resultado, value])
            result.current.splice(result.current.value, 0, value)
            
            if (resultado.length + 1 > 0) {
                setValido(true)
            } else {
                setValido(false)
            }
            resetForm()
            console.log(result.current)
            fetch('/api/producto_precio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: result.current[result.current.length - 1].id_producto,
                    tarifa_id: 26,
                })
            }).then(
                response => { return response.json() }
            ).then(
                data => {
                    console.log(data)
                    // setTarifa(data.resultado)
                }
            )
        },
        validationSchema: yup.object({
            cantidad: yup.number().required("Este campo es obligatorio"),
            producto: yup.string().required("Este campo es obligatorio"),
        })
    })
    const handleDelete = (deleteItem) => {
        const newResultado = resultado.filter(res => res.date !== deleteItem.date)
        setResultado(newResultado)
        // console.log(resultado)
     }

    return (
        <>
            <NavBar />
            <Grid container>
                <Caja title="Nuevo pedido" padding={2}>
                    <Grid container alignItems="stretch" spacing={2}>
                        <Caja title="Nuevo Producto">
                            <form onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2}>
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
                                        <FormHelperText error>{formik.errors.cantidad}</FormHelperText>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Autocompletado
                                            error={formik.errors.producto}
                                            name="producto"
                                            options={productos}
                                            title="Descripción"
                                            inputValue={formik.values.producto}
                                            disableClearable
                                            onInputChange={(event, newValue) => {
                                                formik.setFieldValue('producto', newValue)
                                            }}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue('id_producto', newValue.id)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            endIcon={<AddIcon />}
                                        >
                                            Agregar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Caja>
                        <Caja title="Productos">
                            <Table>
                                <TableHead>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell align="right">
                                        Cantidad
                                    </TableCell>
                                    <TableCell align="right">
                                        Precio Unitario
                                    </TableCell>
                                    <TableCell align="right">
                                        Total
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableHead>
                                <TableBody>
                                    {resultado.map(res => {
                                        return (
                                            <LineaPedido
                                                key={res.product_id}
                                                item={res}
                                                handleDelete={
                                                    () => handleDelete(res)
                                                }
                                            />
                                        )
                                    }
                                    )}
                                </TableBody>
                            </Table>
                        </Caja>
                    </Grid>
                </Caja>
            </Grid>
            <Snackbar open={message} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Tu formulario ha sido enviado!
                </Alert>
            </Snackbar>
        </>

    )
}
export default Seleccion 