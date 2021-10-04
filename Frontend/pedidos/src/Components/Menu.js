import React, { useEffect, useState } from 'react'
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    Paper,
    Container,
    Box,
    Button,
    Typography,
    Snackbar
} from '@material-ui/core'
import Cookies from 'universal-cookie'
import NavBar from "./AppBar"
import LineaHistorial from './Templates/LineasHistorial'
import { useHistory, useLocation } from "react-router-dom"
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import AddIcon from '@material-ui/icons/Add'
import SubMenu from './SubMenu'
import { Alert, Skeleton } from '@material-ui/lab'
import CampoFecha from './Templates/CampoFecha'
import { useFormik } from 'formik'
import * as yup from 'yup'

const Menu = () => {
    const cookies = new Cookies()
    const location = useLocation()
    const history = useHistory()
    const [cabecera, setCabecera] = useState([])
    const [msg, setMsg] = useState('')
    const [openSnack, setOpenSnack] = useState(false)
    const [open, setOpen] = useState([])

    const handleRedirect = () => {
        history.push('/pedidos')
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSnack(false)
    }

    const formik = useFormik({
        initialValues: {
            'start': new Date(),
            'end': new Date()
        },
        validationSchema: yup.object({
            start: yup.date().required('Ingrese fecha desde'),
            end: yup.date().required('Ingrese fecha hasta')
        }),
        onSubmit: (values) => {
            setOpen(true)
            fetch('/api/pedidos_historial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': cookies.get('usuario')['usuario']['token']
                },
                body: JSON.stringify({
                    id_usuario: cookies.get('usuario').usuario.id,
                    start: values.start.toUTCString(),
                    end: values.end.toUTCString(),
                })
            }).then(response => {
                setOpen(false)
                if (response.ok) {
                    return response.json()
                }

                throw response
            }
            ).then(data => {
                setCabecera(data.resultado)
            }).catch(error => {
                if (error.status === 400) {
                    setCabecera([])
                }
            })
        }
    })

    useEffect(() => {
        if (location.state) {
            if (location.state.snackbar) {
                setOpenSnack(true)
                setMsg(location.state.snackbar)
            }
        }
        fetch('/api/pedidos_historial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': cookies.get('usuario')['usuario']['token']
            },
            body: JSON.stringify({
                id_usuario: cookies.get('usuario').usuario.id
            })
        }).then(response => {
            if (response.ok) {
                if (response.status === 200) {
                    console.log('resultados')
                    return response.json()
                }
            }

            throw response
        }
        ).then(data => {
            setCabecera(data.resultado)
            setOpen(false)
        }).catch(error => console.log(error))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (<>
        <NavBar />
        <SubMenu
            buttons={[
                [<AddIcon/>, 'Nuevo pedido', handleRedirect]
            ]}
            breadCrumbs={[
                ['Pedidos realizados']
            ]}/>
        <Container maxWidth="xl" component={Box} marginBottom={10}>
            <Grid container component={Paper} variant="outlined">
                <Grid item xs={12}>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid
                                container spacing={2}
                                alignItems="center"
                                component={Box} padding={2}
                            >
                                <Grid item xs={6} md={3}>
                                    <CampoFecha
                                        title="Desde"
                                        fullWidth
                                        name="start"
                                        value={formik.values.start}
                                        disableFuture
                                        onChange={date =>{
                                                formik.setFieldValue('start', date)
                                            }
                                        }
                                        error={formik.errors.start}
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <CampoFecha
                                        title="Hasta"
                                        fullWidth
                                        name="end"
                                        value={formik.values.end}
                                        disableFuture
                                        onChange={date =>{
                                                formik.setFieldValue('end', date)
                                            }
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                    >Filtrar</Button>
                                </Grid>
                            </Grid>
                        </form>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell align="right">
                                        Precio Total
                                    </TableCell>
                                    <TableCell align="right">
                                        Tipo de tarifa
                                    </TableCell>
                                    <TableCell align="right">Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{
                                open ?
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>
                                            <Skeleton animation="wave"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton animation="wave"/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Skeleton animation="wave"/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Skeleton animation="wave"/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Skeleton animation="wave"/>
                                        </TableCell>
                                    </TableRow> :
                                        cabecera.length === 0 ?
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    align="center"
                                                >
                                                    <Typography variant="h6">
                                                        No existen registros
                                                    </Typography>
                                                </TableCell>
                                            </TableRow> :
                                            cabecera.map(res => {
                                                return (
                                                    <LineaHistorial
                                                        key={res.id}
                                                        cabecera={res}
                                                        loaded={open}
                                                    />
                                                )
                                            })
                            }</TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
        <Snackbar
            open={openSnack}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{vertical:'top', horizontal:'center'}}
        >
            <Alert onClose={handleClose} severity="success">{msg}</Alert>
        </Snackbar>
    </>)
}
export default Menu