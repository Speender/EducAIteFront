import React from 'react';

interface Props {
    data: any[]
}

const Table = ({ data }: Props) => {
    const totalUnits = (data.reduce((accumulator, item) => accumulator + item.units, 0)).toFixed(0)
    const midtermAvg = (data.reduce((accumulator, item) => accumulator + item.midtermGrade, 0) / data.length).toFixed(1)
    const finalAvg = (data.reduce((accumulator, item) => accumulator + item.finalGrade, 0) / data.length).toFixed(1)
    const gwaAvg = (data.reduce((accumulator, item) => accumulator + ((item.midtermGrade + item.finalGrade) * 0.5), 0) / data.length).toFixed(1)
    let potentialHonor
    if(parseFloat(gwaAvg) <= 1.1) {
        potentialHonor = "SUMMA CUM LAUDE"
    }
    else if(parseFloat(gwaAvg) <= 1.25) {
        potentialHonor = "MAGNA CUM LAUDE"
    }
    else if(parseFloat(gwaAvg) <= 1.35) {
        potentialHonor = "CUM LAUDE"
    }
    else {
        potentialHonor = ""
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-white">
                        <th className="px-4 py-2 text-left text-white">Course</th>
                        <th className="px-4 py-2 text-left text-white">Units</th>
                        <th className="px-4 py-2 text-left text-white">Midterm Grade</th>
                        <th className="px-4 py-2 text-left text-white">Final Grade</th>
                        <th className="px-4 py-2 text-left text-white">GWA</th>
                        <th className="px-4 py-2 text-left text-white">Final Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="px-4 py-2">{item.course}</td>
                            <td className="px-4 py-2">{item.units}</td>
                            <td className="px-4 py-2">{item.midtermGrade}</td>
                            <td className="px-4 py-2">{item.finalGrade}</td>
                            <td className="px-4 py-2">{((item.midtermGrade + item.finalGrade) * 0.5).toFixed(1)}</td>
                            <td className="px-4 py-2">{item.finalRemarks}</td>
                        </tr>
                    ))}
                    <tr key={"total"}>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2">{totalUnits}</td>
                        <td className="px-4 py-2">{midtermAvg}</td>
                        <td className="px-4 py-2">{finalAvg}</td>
                        <td className="px-4 py-2">{gwaAvg}</td>
                        <td className="px-4 py-2">{potentialHonor}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


export default Table;