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


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Tarifa = (props) => {

    const history = useHistory()
    const cookies = new Cookies()
    const [message, setMessage] = useState(false)
    const tarifa_listado = useRef([])
    const [tarifa, setTarifa] = useState([])
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setMessage(false)
    }


    useEffect(() => {
        if (!cookies.get('usuario')) {
            history.push('/login')
        }
        fetch('/api/tarifa_listado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    },[])

    const formik = useFormik({
        initialValues: {
            tarifa: '',
            id_tarifa: '',
        },
        onSubmit: (value, { resetForm }) => {
            let d = new Date()
            value.date = d.toUTCString()
            fetch('/api/pedidos_create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            setMessage(true)
            props.setResultado([])
            history.push('/menu')
        },
        validationSchema: yup.object({
            // tarifa: yup.string().required("Este campo es obligatorio"),
        })
    })

    return (
        <>
            <Caja>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
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
                                            formik.setFieldValue('id_tarifa', newValue.id)
                                            props.id_tarifa.current = newValue.id
                                            console.log(newValue)

                                            fetch('/api/producto_listado', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    tarifa_id: newValue.id,
                                                })
                                            }).then(
                                                response => { return response.json() }
                                            ).then(
                                                data => {
                                                    console.log(data.resultado)
                                                    props.setProductos(data.resultado)
                                                }
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        endIcon={<CheckIcon />}
                                        disabled={!props.valido.current}
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