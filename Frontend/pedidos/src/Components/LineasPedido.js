import { IconButton, TableCell, TableRow } from '@material-ui/core'
import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import NumForm from './NumForm'

const LineaPedido = (props) => {
    return (<>
        <TableRow key={props.key}>
            <TableCell>{props.item.producto}</TableCell>
            <TableCell align="right">
                <NumForm>{props.item.cantidad}</NumForm>
            </TableCell>
            <TableCell align="right">
                <NumForm>{props.item.price}</NumForm>
            </TableCell>
            <TableCell align="right">
                <NumForm>{props.item.total_price}</NumForm>
            </TableCell>
            <TableCell align="right">
                <IconButton  onClick={props.handleDelete} key={props.key}>
                    <DeleteIcon/>
                </IconButton>
            </TableCell>
        </TableRow>
    </>)
}

export default LineaPedido