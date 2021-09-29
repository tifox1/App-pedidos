import React, { useEffect, useState, useRef } from 'react'
import { Button, Grid, Table, TableBody, TableCell, TableHead, Typography } from '@material-ui/core'
import Cookies from 'universal-cookie'
import NavBar from "./AppBar"
import LineaHistorial from './Templates/LineasHistorial'
import Caja from "./Templates/Caja"
import { useHistory } from "react-router";
import { Paper } from '@material-ui/core'
import {
    Link
} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));


const Menu = () => {
    const classes = useStyles()
    const cookies = new Cookies()
    const history = useHistory()
    const [cabecera, setCabecera] = useState([])
    const [open, setOpen] = useState([])

    useEffect(() => {
        if (!cookies.get('usuario')) {
            history.push('/login')
        }
        fetch('/api/pedidos_historial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

    }, [])

    return (
        <>
            <Backdrop className={classes.backdrop} open={open} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <NavBar />
            <Grid container spacing={3}>

                <Grid item
                    xs={12}
                    align="center"
                >
                    <Button color="primary" variant="contained" component={Link} to="/pedidos">
                        <i class="material-icons right">add</i>nuevo pedido
                    </Button>

                </Grid>
            </Grid>

            <TableContainer>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Nombre</TableCell>
                            <TableCell align="right">Precio Total</TableCell>
                            <TableCell align="right">Tipo de tarifa</TableCell>
                            <TableCell align="right">Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cabecera.map(res => {
                            return (
                                <LineaHistorial
                                    key={res.id}
                                    cabecera={res}
                                />
                            )
                        }
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* </Caja> */}



            {/* ---------------------------------------------------------------------------------------------- */}
            {/* <Grid container spacing={2}>
                <Grid item
                    xs={12}
                    align="center"
                >
                    <Typography variant="h3" style={{ fontWeight: 500 }}>Haga su pedido</Typography>
                </Grid>
                <Grid item
                    xs={12}
                    align="center"
                >
                    <Button color="primary" variant="contained" to="/nuevo">
                        <i class="material-icons right">add</i>nuevo pedido
                    </Button>

                </Grid>
            </Grid> */}

            {/* <Caja title='Historial'>
                <Table>
                    <TableHead>
                        <TableCell>
                            Nombre
                        </TableCell>
                        <TableCell>
                            Precio Total
                        </TableCell>
                        <TableCell>
                            Tipo de Tarifa
                        </TableCell>
                        <TableCell>
                            Estado
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        {historial.map(res => {
                            return (
                                <LineaHistorial
                                    key={res.id}
                                    item={res}
                                />
                            )
                        }
                        )}
                    </TableBody>
                </Table>
            </Caja> */}
        </>
    )
}
export default Menu