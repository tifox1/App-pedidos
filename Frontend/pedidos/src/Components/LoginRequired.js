import React from 'react'
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'

const LoginRequired = (props) => {
    const cookies = new Cookies()
    if (cookies.get('usuario')) {
        return (props.children)
    } else {
        return <Redirect to="/login" />
    }
}

export default LoginRequired
