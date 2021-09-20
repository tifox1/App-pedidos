import React, { useState, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import Cookies from 'universal-cookie';
import * as yup from 'yup'
import Grid from '@material-ui/core/Grid'
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import { Button, Table, TableBody, TableCell, TableHead, TableContainer, Typography } from '@material-ui/core'
import Autocompletado from './Templates/Autocompletado'
import { FormHelperText } from '@material-ui/core'
import Caja from './Templates/Caja'
import NavBar from './AppBar'
import AddIcon from '@material-ui/icons/Add'
import LineaPedido from './LineasPedido'
import { useHistory } from "react-router";
import Tarifa from './seleccion_pedido_components/Tarifa';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Seleccion = () => {
    const history = useHistory()
    const cookies = new Cookies()
    const [productos, setProductos] = useState([])
    const [resultado, setResultado] = useState([])
    const valido = useRef(false)
    const id_tarifa = useRef(null)
    const precio_total = useRef(0)


    useEffect(() => {
        if (!cookies.get('usuario')) {
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
    }, [])


    const formik = useFormik({
        initialValues: {
            cantidad: '',
            producto: '',
            id_producto: ''
        },
        onSubmit: (value, { resetForm }) => {
            if (id_tarifa.current != null) {
                resetForm()
                let d = new Date()
                value.date = d.toUTCString()

                fetch('/api/producto_precio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        product_id: value.id_producto.id,
                        tarifa_id: id_tarifa.current,
                    })
                }).then(
                    response => { return response.json() }
                ).then(
                    data => {
                        precio_total.current = precio_total.current + (parseFloat(data.fixed_price) * parseFloat(value.cantidad))
                        value.price = data.fixed_price
                        value.total_price = (parseFloat(data.fixed_price) * parseFloat(value.cantidad))
                        setResultado([...resultado, value])
                        console.log(resultado)
                    }
                )
                if (resultado.length + 1 > 0) {
                    valido.current = true
                }
            } else {
                alert('Debe seleccionar la tarifa')
            }
        },
        validationSchema: yup.object({
            cantidad: yup.number().required("Este campo es obligatorio"),
            producto: yup.string().required("Este campo es obligatorio"),
        })
    })
    const handleDelete = (deleteItem) => {
        console.log(deleteItem)
        precio_total.current = precio_total.current - deleteItem.total_price
        const newResultado = resultado.filter(res => res.date !== deleteItem.date)
        setResultado(newResultado)
        if (resultado.length > 0) {
            valido.current = true
        } else {
            valido.current = false
        }
        console.log(precio_total.current)
    }

    return (
        <>
            <NavBar />
            <Grid container>
                <Caja title="Nuevo pedido" padding={2}>
                    <Grid container alignItems="stretch" spacing={2}>
                        <Tarifa
                            valido={valido}
                            id_tarifa={id_tarifa}
                            resultado={resultado}
                            setResultado={setResultado}
                            precio_total={precio_total}
                        />
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
                                            value={formik.values.id_producto}
                                            error={formik.errors.producto}
                                            name="id_producto"
                                            options={productos}
                                            title="Descripción"
                                            inputValue={formik.values.producto}
                                            disableClearable
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue(
                                                    'id_producto',
                                                    newValue
                                                )
                                            }}
                                            onInputChange={(event, newInputValue) => {
                                                formik.setFieldValue(
                                                    'producto',
                                                    newInputValue
                                                )
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
                            <TableContainer>
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
                            </TableContainer>
                        </Caja>
                    </Grid>
                </Caja>
                <Grid item>
                    <Typography>
                        Precio Total: {precio_total.current}
                    </Typography>
                </Grid>
            </Grid>

        </>

    )
}
export default Seleccion