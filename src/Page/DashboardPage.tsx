import React, { InputHTMLAttributes } from 'react';

const round: Function = (num: number, digit: number) => {
    return Math.round(num * Math.pow(10, digit))/ Math.pow(10, digit)
}

const DashboardPage: React.FC = () => {
    const [benchmark, setBenchmark] = React.useState<number[][]>([]);
    const [schoolName, setSchoolName] = React.useState<string[]>([]);
    const [yourScore, setYourScore] = React.useState<{
        math: number[],
        physics: number[],
        chemistry: number[],
        english: number[]
    }>({
        math: [0, 0],
        physics: [0, 0],
        chemistry: [0, 0],
        english: [0, 0]
    });
    const [scoreSpectrum, setScoreSpectrum] = React.useState<{
        [year: string]: {
            [subject: string]: number[]
        }
    }>({});
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

        import("../Data/score_spectrum.json").then((res: any) => {
            setScoreSpectrum(res.default)
        })
        
    }, [])

    const getScoreFromPercent: Function = (percent: number, subject: string, year: string) => {
        let count = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (var _tmp in scoreSpectrum)
        {
            count++;
        }
        if (count === 0)
        {
            return 0
        }
        const subjectData: number[] = scoreSpectrum[year][subject];
        if (subjectData.length === 0) return 0;
        let subjectCoff = 0;
        switch (subject)
        {
            case "math":
                subjectCoff = 0.2;
                break;
            case "physics":
                subjectCoff = 0.25;
                break;
            case "chemistry":
                subjectCoff = 0.25;
                break;
            case "english":
                subjectCoff = 0.2;
                break;
            default:
                subjectCoff = 0.2;
                break;
        }
        let valueOfPercent = subjectData.reduce((sum, value) => sum + value, 0) * percent;
        var i = 0;
        for (i = subjectData.length - 1; i >= 0; i--)
        {
            valueOfPercent -= subjectData[i];
            if (valueOfPercent <= 0)
                break;
        }
        const score = round(i * subjectCoff, 2); 
        return score
    }

    const getPercentFromScore: Function = (score: number, subject: string, year: string) => {
        let count = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (var _tmp in scoreSpectrum)
        {
            count++;
        }
        if (count === 0)
        {
            return [1, 1]
        }
        const subjectData: number[] = scoreSpectrum[year][subject]
        if (subjectData.length === 0) return [1, 1];
        let subjectCoff = 0;
        switch (subject)
        {
            case "math":
                subjectCoff = 0.2;
                break;
            case "physics":
                subjectCoff = 0.25;
                break;
            case "chemistry":
                subjectCoff = 0.25;
                break;
            case "english":
                subjectCoff = 0.2;
                break;
            default:
                subjectCoff = 0.2;
                break;
        }
        const index = score / subjectCoff;

        let sumAll = subjectData.reduce((sum, value) => sum + value, 0);
        let sum1 =  subjectData.reduce((sum, value, i) => i >= index ? sum + value : sum, 0);
        let sum2 = subjectData.reduce((sum, value, i) => i >= index + 1 ? sum + value : sum, 0);
        

        return [round(sum1/sumAll, 4) - 0.0001, round(sum2/sumAll, 4) + 0.0001]
    }

    (window as any).getScoreFromPercent = getScoreFromPercent;
    (window as any).getPersonFromScore = getPercentFromScore;

    const handleCheckYourScore: Function = () => {
        const subjects = ['math', 'physics', 'chemistry', 'english']

        const yStart = Number((document.getElementById("your_year") as HTMLSelectElement).value)
        const yEnd = Number((document.getElementById("result_year") as HTMLSelectElement).value)

        const prevMathScore = Number(((document.getElementById('math_score')) as HTMLInputElement).value)
        const prevPhysicsScore = Number((document.getElementById('physics_score') as HTMLInputElement).value)
        const prevChemistryScore = Number((document.getElementById('chemistry_score') as HTMLInputElement).value)
        const prevEnglishScore = Number((document.getElementById('english_score') as HTMLInputElement).value)

        const prevScores = [prevMathScore, prevPhysicsScore, prevChemistryScore, prevEnglishScore]

        let results: number[][] = []
        
        for (var i = 0; i < subjects.length; i++)
        {
            const percents = getPercentFromScore(prevScores[i], subjects[i], yStart.toString()) 
            
            results.push([getScoreFromPercent(percents[0], subjects[i], yEnd.toString() ), getScoreFromPercent(percents[1], subjects[i], yEnd.toString())])
        }

        const newScore = {
            math: results[0],
            physics: results[1],
            chemistry: results[2],
            english: results[3]
        }
        setYourScore(newScore);
    }

    if (benchmark.length === 0 || schoolName.length === 0) return (<h1>Loading...</h1>)
    return (
        <div>
            <h1>Your score in <select id="your_year">
            {
                benchmark[0].map((_e, index) => (
                    <option key={"s1" + index}>{2020 + index}</option>
                ))
            }
            </select>:</h1>
            <p>Math: <input id='math_score'/></p>
            <p>Physics: <input id='physics_score'/></p>
            <p>Chemistry: <input id='chemistry_score'/></p>
            <p>English: <input id='english_score'/></p>
            <button onClick={()=>handleCheckYourScore()}>Check your score</button>

            <h1>Your score in <select id="result_year">
            {
                benchmark[0].map((_e, index) => (
                    <option key={"s2" + index}>{2020 + index}</option>
                ))
            }
            </select>:</h1>
            <p>Math: {yourScore.math[0]} {' -'} {yourScore.math[1]} 
                {' ~'} {round((yourScore.math[0] + yourScore.math[1]) / 2, 2)}</p>
            <p>Physics: {yourScore.physics[0]} {' -'} {yourScore.physics[1]}
               {' ~'} {round((yourScore.physics[0] + yourScore.physics[1]) / 2, 2)}
            </p>
            <p>Chemistry: {yourScore.chemistry[0]} {' -'} {yourScore.chemistry[1]} 
                {' ~'} {round((yourScore.chemistry[0] + yourScore.chemistry[1]) / 2, 2)}
            </p>
            <p>English: {yourScore.english[0]} {' -'} {yourScore.english[1]} 
                {' ~'} {round((yourScore.english[0] + yourScore.english[1]) / 2, 2)}
            </p>
            <p>A00: {round(yourScore.math[0] + yourScore.physics[0] + yourScore.chemistry[0], 2)}
                {' -'} {round(yourScore.math[1] + yourScore.physics[1] + yourScore.chemistry[1], 2)} 
                {' ~'} {round((yourScore.math[0] + yourScore.physics[0] +
                    yourScore.chemistry[0] + yourScore.math[1] + yourScore.physics[1] + yourScore.chemistry[1]) / 2, 2)}
            </p>
            <p>A01: {round(yourScore.math[0] + yourScore.physics[0] + yourScore.english[0], 2)}
                {' -'} {round(yourScore.math[1] + yourScore.physics[1] + yourScore.english[1], 2)} 
                {' ~'} {round((yourScore.math[0] + yourScore.physics[0] +
                    yourScore.english[0] + yourScore.math[1] + yourScore.physics[1] + yourScore.english[1]) / 2, 2)}
            </p>

            <h1>Benchmark scores at top schools</h1>
            
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        {
                            benchmark[0].map((_e, index) => (
                                <th key={2020 + index}>{2020 + index}</th>
                            ))
                        }
                    </tr>
                </thead>


                <tbody>
                    {
                        benchmark.map((e, index) => (
                            <tr key = {"a" + index}>
                                <td key={"b" + index}>{schoolName[index]}</td>
                                {e.map((e2, index) => (
                                    <td key={"c" + index}>{e2===0?"NA":e2}</td>
                                ))}
                            </tr>
                            ))
                    }
                </tbody>
            </table>
            
        </div>
    );
};

export default DashboardPage;