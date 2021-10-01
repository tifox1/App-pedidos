import { IconButton, TableCell, TableRow } from '@material-ui/core'
import React, { useState} from 'react'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CollapseLine from './Collapse';
import NumForm from '../NumForm'

const LineaHistorial = (props) => {
    const [open, setOpen] = useState(false)
    console.log(props);
    return (<>

        <TableRow>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >{
                    open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                }</IconButton>
            </TableCell>
            <TableCell>{props.cabecera.date}</TableCell>
            <TableCell>{props.cabecera.name}</TableCell>
            <TableCell align="right">
                <NumForm>{props.cabecera.amount_total}</NumForm></TableCell>
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