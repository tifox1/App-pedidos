import React, { useEffect, useState } from 'react'
import {Grid, Table, TableBody, TableCell, TableHead, Paper, Container, Box} from '@material-ui/core'
import Cookies from 'universal-cookie'
import NavBar from "./AppBar"
import LineaHistorial from './Templates/LineasHistorial'
import { useHistory } from "react-router-dom";
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import SubMenu from './SubMenu'
import { Skeleton } from '@material-ui/lab'

const Menu = () => {
    const cookies = new Cookies()
    const history = useHistory()
    const [cabecera, setCabecera] = useState([])
    const [open, setOpen] = useState([])

    const handleRedirect = () => {
        history.push('/pedidos')
    }

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
                console.log(data)
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
            <Grid container>
                <TableContainer component={Paper} variant="outlined">
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
        </Container>
    </>)
}
export default Menu