import React from 'react'


interface Props {
    name: string
}


const Header = ({name}: Props) => (
    <div>
        <h1>Welcome back, {name}</h1>
        <h3>Your personalized AI dashboard - track your growth, progress, and insights.</h3>
    </div>
)


export default Header
