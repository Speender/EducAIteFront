import React from 'react'


interface Props {
    name: string
}


const Header = ({ name }: Props) => (
    <div className="flex flex-col min-w-0">
        <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome back, <span className="text-[#00CEC8]">{name}</span>
        </h1>
        <h3 className="text-white/40 text-lg mt-1 leading-relaxed">
            Your personalized AI dashboard — track your growth, progress, and insights.
        </h3>
    </div>
)


export default Header
