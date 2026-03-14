import React from 'react'


interface Props {
    selections: string[],
    onSelectChange: (value: string) => void
}


const DropdownSemester = ({ selections, onSelectChange }: Props) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelectChange(event.target.value)
    }

    return (
        <>
            <select
                onChange={handleChange}
                className="bg-black text-white border border-white p-2 rounded"
            >
                {selections.map((item, i) => <option key={i} value={item}>{item}</option>)}
            </select>
        </>
    )
}

export default DropdownSemester