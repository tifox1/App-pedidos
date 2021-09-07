import { IconButton, TableCell, TableRow } from '@material-ui/core'
import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';

const LineaPedido = (props) => {
    return (<>
        <TableRow key={props.key}>
            <TableCell>{props.item.producto}</TableCell>
            <TableCell align="right">{props.item.cantidad}</TableCell>
            <TableCell align="right">{props.item.price}</TableCell>
            <TableCell align="right">{props.item.total_price}</TableCell>
            <TableCell align="right">
                <IconButton  onClick={props.handleDelete} key={props.key}>
                    <DeleteIcon/>
                </IconButton>
            </TableCell>
        </TableRow>
    </>)
}

export default LineaPedido