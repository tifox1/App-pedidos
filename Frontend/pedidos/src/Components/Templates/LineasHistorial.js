import { IconButton, TableCell, TableRow } from '@material-ui/core'
import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';

const LineaHistorial = (props) => {
    console.log(props.item.producto)
    return (<>
        <TableRow key={props.key}>
            <TableCell>{props.item.name}</TableCell>
            <TableCell>{props.item.amount_total}</TableCell>
            <TableCell>{props.item.currency_id}</TableCell>
            <TableCell>{props.item.state}</TableCell>
        </TableRow>
    </>)
}

export default LineaHistorial