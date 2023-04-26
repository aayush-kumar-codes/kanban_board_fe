import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({ children }) => {
    const token = localStorage.getItem('token')
    if (!token)
        Navigate({ to: "/" })
    return children
}

export default PrivateRoutes
