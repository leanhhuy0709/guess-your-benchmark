import React from 'react';



const DashboardPage: React.FC = () => {
    const [benchmark, setBenchmark] = React.useState<Array<Array<number>>>([]);
    const [schoolName, setSchoolName] = React.useState<Array<string>>([]);
    React.useEffect(() => {
        import("../Data/benchmark.json").then((res: any) => {
            const array = []
            const sN = []
            for (var key in res.default)
            {
                const tmp = []
                for (var i = 2020; i <= 2024; i++)
                {
                    tmp.push(res[key][i.toString()])
                }
                array.push(tmp)
                sN.push(key)
            }
            
            setBenchmark(array);
            setSchoolName(sN);
        })
    }, [])
    if (benchmark.length === 0 || schoolName.length === 0) return (<h1>Loading...</h1>)
    return (
        <div>
            <h1>Your score in <select>
            {
                benchmark[0].map((_e, index) => (
                    <option key={index}>{2020 + index}</option>
                ))
            }
            </select>:</h1>
            <p>Math: <input/></p>
            <p>Physics: <input/></p>
            <p>Chemistry: <input/></p>
            <p>English: <input /></p>
            <button>Check your score</button>

            <h1>Your score in <select>
            {
                benchmark[0].map((_e, index) => (
                    <option key={index}>{2020 + index}</option>
                ))
            }
            </select>:</h1>
            <p>Math: {10}</p>
            <p>Physics: {10}</p>
            <p>Chemistry: {10}</p>
            <p>English: {10}</p>
            <p>A00: {30}</p>
            <p>A01: {30}</p>

            <h1>Benchmark scores at top schools</h1>
            <table>
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            {
                                benchmark[0].map((_e, index) => (
                                    <th key={index}>{2020 + index}</th>
                                ))
                            }
                        </tr>
                    </thead>


                    <tbody>
                        {
                            benchmark.map((e, index) => (
                                <tr>
                                    <td>{schoolName[index]}</td>
                                    {e.map((e2, index) => (
                                        <td>{e2===0?"NA":e2}</td>
                                    ))}
                                </tr>
                                ))
                        }
                    </tbody>
                </table>
            </table>
        </div>
    );
};

export default DashboardPage;