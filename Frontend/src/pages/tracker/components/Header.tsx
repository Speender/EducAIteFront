import React from 'react'


interface Props {
    name: string,
    semester: string
}


const Header = ({ name, semester }: Props) => {
    return (
        <div>
            <h1>Hey, {name}</h1>
            <h2>Here's your current grade in {semester}</h2>
        </div>
    )
}

export default Header