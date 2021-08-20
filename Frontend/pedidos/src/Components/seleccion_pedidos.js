import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Cookies from 'universal-cookie'
import Grid from '@material-ui/core/Grid'
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import { Button, Table, TableBody, TableCell, TableHead} from '@material-ui/core'
import Autocompletado from './Templates/Autocompletado'
import { FormHelperText } from '@material-ui/core'
import NavBar from './AppBar'
import Caja from './Templates/Caja'
import CheckIcon from '@material-ui/icons/Check'
import AddIcon from '@material-ui/icons/Add'
import LineaPedido from './LineasPedido'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Seleccion = () => {
    const cookies = new Cookies()
    const [message, setMessage] = useState(false)
    const [productos, setProductos] = useState([])
    const [resultado, setResultado] = useState([])
    const [valido, setValido] = useState(false)
    const [totalProds, setTotalProds] = useState(0)

    const handleClick = (event) => {
        setMessage()
        fetch('/api/pedidos_create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            return
        }
        setMessage(false)
    }


    useEffect(() => {
        fetch('/api/producto_listado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            let d = new Date()
            value.date = d.toUTCString()
            setResultado([...resultado, value])
            if (resultado.length + 1 > 0) {
                setValido(true)
            }else{
                setValido(false)
            }
            resetForm()

        },
        validationSchema: yup.object({
            cantidad: yup.number().required("Este campo es obligatorio"),
            producto: yup.string().required("Este campo es obligatorio"),
            // tarifa: yup.string().required("Este campo es obligatorio")
        })
    })
    const handleDelete = (deleteItem) => {
        const newResultado = resultado.filter(res => res.date !== deleteItem.date)
        console.log(newResultado)
        setResultado(newResultado)
    }
    return (
        <>
            <NavBar />
            <Grid container>
                <Caja title="Nuevo pedido" padding={2}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button
                                color="primary"
                                variant="contained"
                                endIcon={<CheckIcon />}
                                disabled={!valido}
                                onClick={handleClick}
                            >
                                Confirmar
                            </Button>
                        </Grid>
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
                                                // console.log(newValue)
                                                // formik.setFieldValue('producto', newValue)
                                                // formik.setFieldValue('id_producto', newValue.id)
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
                                    <TableCell align="right">Cantidad</TableCell>
                                    <TableCell align="right">Precio Unitario</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell></TableCell>
                                </TableHead>
                                <TableBody>
                                    {resultado.map(res => {
                                        return (
                                            <LineaPedido key={res.product_id} item={res} handleDelete={ () => handleDelete(res)}/>
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