import { IconButton, TableCell, TableRow } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CollapseLine from './Collapse';
import NumberFormat from "react-number-format";

const LineaHistorial = (props) => {
    const [open, setOpen] = useState(false)
    // console.log(props.lineas)
    // useEffect(
    //     () = {

    //     }
    // ,[])
    return (<>

        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
                {props.cabecera.name}
            </TableCell>
            <TableCell align="right">{props.cabecera.amount_total}</TableCell>
            <TableCell align="right">{props.cabecera.currency_id}</TableCell>
            <TableCell align="right">{props.cabecera.state}</TableCell>
        </TableRow>
        <CollapseLine
            rows={props.cabecera.lines}
            open={open}
        />

    </>)
}

export default LineaHistorial