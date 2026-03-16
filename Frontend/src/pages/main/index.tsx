import React from 'react'
import LandingLoggedIn from './components/LandingLoggedIn'
import Landing from './components/Landing'


const loggedIn: Boolean = true


const Main = () => {
    return (
        <>
            {loggedIn ?
                <LandingLoggedIn /> :
                <Landing />
            }
        </>
    )
}

export default Main