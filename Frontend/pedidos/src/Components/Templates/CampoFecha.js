import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    DatePicker,
  } from '@material-ui/pickers'
import { FormHelperText, Zoom } from '@material-ui/core'

const CampoFecha = (props) => {
    return (<>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                inputVariant="outlined"
                label={props.title}
                format="dd/MM/yyyy"
                {...props}
            />
            <Zoom in={props.error}>
                <FormHelperText error>{props.error}</FormHelperText>
            </Zoom>
        </MuiPickersUtilsProvider>
    </>)
}

export default CampoFecha