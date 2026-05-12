
interface Props {
    name: string,
    semester: string
}

const Header = ({ name, semester }: Props) => {
    return (
        <div className="flex flex-col min-w-0">
            <h1 className="text-4xl md:text-[2.75rem] font-bold text-white mb-2">
                Hey, <span className="text-[#00CEC8]">{name}</span> 👋
            </h1>
            <h2 className="text-white/50 text-lg font-medium">
                Here's your current grade in <span className="text-white font-semibold">{semester}</span>
            </h2>
        </div>
    )
}

export default Header
