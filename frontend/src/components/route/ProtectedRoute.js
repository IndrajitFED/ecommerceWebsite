import React, { Fragment } from 'react'
import { Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ component: Component, ...rest }) => {

    const { isAuthenticated, loading, user } = useSelector(state => state.auth)

    if (loading === false && isAuthenticated === false) {
        return <Navigate to='/login' />
    }

    return (
        <Fragment>
            {loading === false ?
                <Component {...rest} /> : null
            }
        </Fragment>
    )
}

export default ProtectedRoute