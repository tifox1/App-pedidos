import { IconButton, TableCell, TableRow } from '@material-ui/core'
import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import NumberFormat from "react-number-format";

const LineaPedido = (props) => {
    return (<>
        <TableRow key={props.key}>
            <TableCell>{props.item.producto}</TableCell>
            <TableCell align="right"><NumberFormat value={props.item.cantidad} displayType="text" thousandSeparator="." decimalSeparator="," fixedDecimalScale={true} decimalScale={2}/></TableCell>
            <TableCell align="right"><NumberFormat value={props.item.price} displayType="text" thousandSeparator="." decimalSeparator="," fixedDecimalScale={true} decimalScale={2}/></TableCell>
            <TableCell align="right"><NumberFormat value={props.item.total_price} displayType="text" thousandSeparator="." decimalSeparator="," fixedDecimalScale={true} decimalScale={2}/></TableCell>
            <TableCell align="right">
                <IconButton  onClick={props.handleDelete} key={props.key}>
                    <DeleteIcon/>
                </IconButton>
            </TableCell>
        </TableRow>
    </>)
}

export default LineaPedido