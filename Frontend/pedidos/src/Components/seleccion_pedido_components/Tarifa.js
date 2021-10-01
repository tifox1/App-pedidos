import React, { useState, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import Cookies from 'universal-cookie';
import * as yup from 'yup'
import Grid from '@material-ui/core/Grid'
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import { Button, Paper } from '@material-ui/core'
import Autocompletado from '../Templates/Autocompletado';
import CheckIcon from '@material-ui/icons/Check'
import { useHistory } from "react-router";
import Caja from '../Templates/Caja';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import { FormHelperText } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Tarifa = (props) => {
    const classes = useStyles()
    const history = useHistory()
    const cookies = new Cookies()
    const [message, setMessage] = useState(false)
    const tarifa_listado = useRef([])
    const [tarifa, setTarifa] = useState([])
    const [open, setOpen] = useState(false)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setMessage(false)
    }


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
                // tarifa_listado.current = data.resultado
                // tarifa_listado.current = data.resultado
                // console.log(tarifa_listado.current)
            }
        )

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const formik = useFormik({
        initialValues: {
            tarifa: '',
            id_tarifa: '',
        },
        onSubmit: (value, { resetForm }) => {
            let d = new Date()
            value.date = d.toUTCString()
            setMessage(true)
            fetch('/api/pedidos_create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': cookies.get('usuario')['usuario']['token']
                },
                body: JSON.stringify({
                    tarifa: props.id_tarifa.current,
                    usuario: [{ id_usuario: cookies.get('usuario') }], //lugar donde ira la id del cliente
                    formulario: props.resultado,
                })
            }).then(
                response => { return response.json() }
            ).then(
                data => {
                }
            )
            resetForm()
            props.setResultado([])
            history.push('/')
        },
        validationSchema: yup.object({
            // tarifa: yup.string().required("Este campo es obligatorio"),
        })
    })

    return (
        <>
            <Backdrop className={classes.backdrop} open={open} >

                <CircularProgress color="inherit" />
            </Backdrop>
            <Caja>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Autocompletado
                                        error={formik.errors.tarifa}
                                        name="Tarifa"
                                        options={tarifa}
                                        title="Tarifa"
                                        inputValue={formik.values.tarifa}
                                        disableClearable
                                        onInputChange={(event, newValue) => {
                                            formik.setFieldValue('tarifa', newValue)
                                            // console.log(newValue)
                                        }}
                                        onChange={(event, newValue) => {
                                            setOpen(true)
                                            formik.setFieldValue('id_tarifa', newValue.id)
                                            props.id_tarifa.current = newValue.id
                                            console.log(newValue)

                                            fetch('/api/producto_listado', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'x-access-token': cookies.get('usuario')['usuario']['token']
                                                },
                                                body: JSON.stringify({
                                                    tarifa_id: newValue.id,
                                                })
                                            }).then(
                                                response => {
                                                    return response.json()
                                                }
                                            ).then(
                                                data => {
                                                    console.log(data.resultado)
                                                    props.setProductos(data.resultado)
                                                }
                                            ).then(
                                                e => {
                                                    setOpen(false)
                                                }
                                            )
                                        }}
                                    />
                                    <FormHelperText>Seleccione primero la tarifa</FormHelperText>

                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        endIcon={<CheckIcon />}
                                        disabled={!props.valido}
                                    >
                                        Confirmar
                                    </Button>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>

                </form>
            </Caja>

            <Snackbar open={message} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Tu formulario ha sido enviado!
                </Alert>
            </Snackbar>
        </>
    )
};
export default Tarifa;