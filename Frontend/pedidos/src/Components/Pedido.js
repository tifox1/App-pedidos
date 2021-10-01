import {
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    Fab,
    FormHelperText,
    Grid,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TextField,
    Toolbar,
    Typography,
    useTheme,
    Zoom
} from '@material-ui/core'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import Caja from './Templates/Caja'
import AddIcon from '@material-ui/icons/Add'
import Autocompletado from './Templates/Autocompletado'
import LineaPedido from './LineasPedido'
import Cookies from 'universal-cookie'
import * as yup from 'yup'
import NumberFormat from "react-number-format"
import CheckIcon from '@material-ui/icons/Check'
import NavBar from './AppBar'
import SubMenu from './SubMenu'
import { useHistory } from 'react-router'
import { Alert, Skeleton } from '@material-ui/lab'

const Pedido = (props) => {
    const history = useHistory()
    const theme = useTheme()
    const cookies = new Cookies()
    const [tarifa, setTarifa] = useState([])
    const [open, setOpen] = useState(false)
    const [productos, setProductos] = useState([])
    const [valido, setValido] = useState(false)
    const [precioTotal, setPrecioTotal] = useState(0)
    const [message, setMessage] = useState(false)

    const handleDelete = (deleteItem) => {
        setPrecioTotal(precioTotal - deleteItem.total_price)
        const newResultado = cabForm.values.products.filter(
            res => res.date !== deleteItem.date
        )
        cabForm.setFieldValue('products', newResultado)
        if (cabForm.values.products.length - 1 > 0) {
            setValido(true)
        } else {
            setValido(false)
        }
        console.log(precioTotal)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setMessage(false)
    }

    const cabForm = useFormik({
        initialValues: {
            'obs': '',
            'tarifa': '',
            'id_tarifa': '',
            'products': []
        },
        onSubmit: (value, { resetForm }) => {
            let d = new Date()
            value.date = d.toUTCString()

            fetch('/api/pedidos_create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': cookies.get('usuario')['usuario']['token']
                },
                body: JSON.stringify({
                    tarifa: value.id_tarifa,
                    usuario: [{ id_usuario: cookies.get('usuario') }], //lugar donde ira la id del cliente
                    formulario: value.products,
                    'comentario': value.obs
                })
            }).then(response => {
                if (response.ok) {
                    console.log(valido)
                    setValido(false)
                    setMessage(true)
                    console.log(valido)
                    resetForm()
                    history.push('/')
                }
            }
            )
        },
        validationSchema: yup.object({
            // tarifa: yup.string().required("Este campo es obligatorio"),
        })
    })

    const productForm = useFormik({
        initialValues: {
            cantidad: '',
            producto: '',
            id_producto: '',
            price: '',
        },
        onSubmit: (value, { resetForm }) => {
            setPrecioTotal(precioTotal + (value.price * value.cantidad))
            let d = new Date()
            value.date = d.toUTCString()
            value.total_price = parseFloat(
                value.cantidad
            ).toFixed(3) * parseFloat(value.price).toFixed(3)
            cabForm.setFieldValue(
                'products', [...cabForm.values.products, value]
            )

            resetForm()
            if (cabForm.values.products.length + 1 > 0) {
                setValido(true)
            }
        },
        validationSchema: yup.object({
            cantidad: yup.number().required("Este campo es obligatorio"),
            producto: yup.string().required("Este campo es obligatorio"),
        })
    })

    useEffect(() => {
        fetch('/api/tarifa_listado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': cookies.get('usuario')['usuario']['token']
            },
            body: JSON.stringify({
                user_id: cookies.get('usuario').usuario.id,
            })
        }).then(
            response => { return response.json() }
        ).then(
            data => {
                console.log(data.resultado)
                setTarifa(data.resultado)
            }
        )

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (<>
        <NavBar />
            <SubMenu breadCrumbs={[
                ['Pedidos realizados', '/'],
                ['Nuevo']
            ]}>
                <Fab
                    size="small"
                    variant="extended"
                    color="primary"
                    disabled={!valido}
                    onClick={cabForm.submitForm}
                >
                    <CheckIcon/> Confirmar
                </Fab>
                <Button style={{left: theme.spacing(1)}}>
                    cancelar
                </Button>
            </SubMenu>
        <Container maxWidth="xl">
            <Caja title="Nuevo pedido">
                <form onSubmit={cabForm.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Autocompletado
                                error={cabForm.errors.tarifa}
                                name="tarifa"
                                options={tarifa}
                                title="Tarifa"
                                inputValue={cabForm.values.tarifa}
                                disableClearable
                                onInputChange={(event, newValue) => {
                                    cabForm.setFieldValue('tarifa', newValue)
                                }}
                                onChange={(event, newValue) => {
                                    setOpen(true)
                                    cabForm.setFieldValue(
                                        'id_tarifa', newValue.id
                                    )

                                    fetch('/api/producto_listado', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'x-access-token': cookies.get(
                                                'usuario'
                                            )['usuario']['token']
                                        },
                                        body: JSON.stringify({
                                            tarifa_id: newValue.id,
                                        })
                                    }).then(
                                        response => {
                                            return response.json()
                                        }
                                    ).then(data => {
                                        console.log(data.resultado)
                                        setProductos(data.resultado)
                                    }).then(e => {
                                        setOpen(false)
                                    })
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                error={cabForm.errors.obs}
                                label="Observación"
                                variant="outlined"
                                name="cantidad"
                                onChange={cabForm.handleChange}
                                value={cabForm.values.obs}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs>
                            <Divider/>
                        </Grid>
                        <Zoom in={!(cabForm.values.tarifa === '')}>
                            <Caja
                                title="Nuevo Producto"
                                hidden={cabForm.values.tarifa === ''}
                            >
                                <form onSubmit={productForm.handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={2}>
                                            <TextField
                                                error={productForm.errors.cantidad}
                                                id="outlined-basic"
                                                label="Cantidad"
                                                variant="outlined"
                                                name="cantidad"
                                                onChange={productForm.handleChange}
                                                value={productForm.values.cantidad}
                                                fullWidth />
                                            <FormHelperText error>{
                                                productForm.errors.cantidad
                                            }</FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {open ?
                                                <Skeleton height={55} animation="wave"/>
                                                :
                                                <Autocompletado
                                                    value={
                                                        productForm.values.id_producto
                                                    }
                                                    error={productForm.errors.producto}
                                                    name="id_producto"
                                                    options={productos}
                                                    title="Descripción"
                                                    inputValue={
                                                        productForm.values.producto
                                                    }
                                                    disableClearable
                                                    onChange={(event, newValue) => {
                                                        productForm.setFieldValue(
                                                            'id_producto',
                                                            newValue
                                                        )
                                                        productForm.setFieldValue(
                                                            'price',
                                                            newValue.fixed_price
                                                        )
                                                        console.log(newValue)
                                                    }}
                                                    onInputChange={(
                                                        event, newInputValue) => {
                                                            productForm.setFieldValue(
                                                                'producto',
                                                                newInputValue
                                                            )
                                                        }
                                                    }
                                                />
                                            }
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                endIcon={<AddIcon />}
                                                onClick={
                                                    () => productForm.submitForm()
                                                }
                                            >
                                                Agregar
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Caja>
                        </Zoom>
                        <Zoom in={!(cabForm.values.tarifa === '')}>
                            <Caja
                                title="Productos"
                                hidden={cabForm.values.tarifa === ''}
                            >
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
                                            {cabForm.values.products.map(res => {
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
                        </Zoom>
                    </Grid>
                </form>
            </Caja>
        </Container>
        <Box marginTop={10}>
            <AppBar position="fixed" style={{
                top: 'auto',
                bottom: 0,
                background: theme.palette.grey[900]
            }}>
                <Toolbar>
                    <Typography style={{flexGrow: 1}} variant="button">Total:</Typography>
                    <Typography variant="h6">
                        $ <NumberFormat
                            value={precioTotal}
                            displayType="text"
                            thousandSeparator="."
                            decimalSeparator=","
                            fixedDecimalScale={true}
                            decimalScale={2}/>
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
        <Snackbar open={message} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical:'top', horizontal:'center'}}>
            <Alert onClose={handleClose} severity="success">
                Tu formulario ha sido enviado!
            </Alert>
        </Snackbar>
    </>)
}

export default Pedido