import React, { useEffect, useState } from 'react'
import {Grid, Table, TableBody, TableCell, TableHead, Paper, Container, Box, Button} from '@material-ui/core'
import Cookies from 'universal-cookie'
import NavBar from "./AppBar"
import LineaHistorial from './Templates/LineasHistorial'
import { useHistory } from "react-router-dom";
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import SubMenu from './SubMenu'
import { Skeleton } from '@material-ui/lab'
import CampoFecha from './Templates/CampoFecha'
import { useFormik } from 'formik';
import * as yup from 'yup'

const Menu = () => {
    const cookies = new Cookies()
    const history = useHistory()
    const [cabecera, setCabecera] = useState([])
    const [open, setOpen] = useState([])

    const handleRedirect = () => {
        history.push('/pedidos')
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
            }).then(
                response => { return response.json() }
            ).then(
                data => {
                    setCabecera(data.resultado)
                }
            ).then(
                e => {
                    setOpen(false)
                }
            )
        }
    })

    useEffect(() => {
        fetch('/api/pedidos_historial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': cookies.get('usuario')['usuario']['token']
            },
            body: JSON.stringify({
                id_usuario: cookies.get('usuario').usuario.id
            })
        }).then(
            response => { return response.json() }
        ).then(
            data => {
                setCabecera(data.resultado)
            }
        ).then(
            e => {
                setOpen(false)
            }
        )

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
                                    <TableCell align="right">Precio Total</TableCell>
                                    <TableCell align="right">Tipo de tarifa</TableCell>
                                    <TableCell align="right">Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {open ?
                                    <TableRow>
                                        <TableCell />
                                        <TableCell><Skeleton animation="wave"/></TableCell>
                                        <TableCell><Skeleton animation="wave"/></TableCell>
                                        <TableCell align="right"><Skeleton animation="wave"/></TableCell>
                                        <TableCell align="right"><Skeleton animation="wave"/></TableCell>
                                        <TableCell align="right"><Skeleton animation="wave"/></TableCell>
                                    </TableRow> : cabecera.map(res => {
                                    return (
                                        <LineaHistorial
                                            key={res.id}
                                            cabecera={res}
                                            loaded={open}
                                        />
                                    )
                                }
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    </>)
}
export default Menu