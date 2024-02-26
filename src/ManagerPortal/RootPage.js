import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function RootPage() {

    const [data, setData] = useState();
    const [error, setError] = useState()

    const quarters = ["Quarter1", "Quarter2", "Quarter3"]
    const res = data.response
   console.log(res, '11');
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://172.17.15.150:4000/api/getEmployee/1001');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const responseData = await response.json();
                setData(responseData);

            } catch (error) {
                setError(error);

            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <ul>
                {quarters.map((list, index) => (
                    <li key={index}>{list}</li>
                ))}
            </ul>
        </div>
    )
}
