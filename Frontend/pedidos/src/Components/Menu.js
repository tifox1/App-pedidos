import React, { useEffect, useState, useRef } from 'react'
import { Button, Table, TableBody, TableCell, TableHead, Typography } from '@material-ui/core'
import Cookies from 'universal-cookie'
import NavBar from "./AppBar"
import LineaHistorial from './Templates/LineasHistorial'
import Caja from "./Templates/Caja"
import { useHistory } from "react-router";


const Menu = () => {
    const cookies = new Cookies()
    const history = useHistory()
    const [historial, setHistorial] = useState([])

    useEffect(() => {
        if(!cookies.get('usuario')){
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
                setHistorial(data)
            }
        )
    }, [])

    return (
        <>
            <NavBar />
            <Caja title='Historial'>
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
            </Caja>
        </>
    )
}
export default Menu