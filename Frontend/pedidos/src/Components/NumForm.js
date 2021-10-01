import NumberFormat from "react-number-format";
import React from 'react'

const NumForm = ({children}) => {
    return (
        <NumberFormat
            value={children}
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
            fixedDecimalScale={true}
            decimalScale={2}
        />
    )
}

export default NumForm
