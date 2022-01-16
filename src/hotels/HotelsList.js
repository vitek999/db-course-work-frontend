import {useEffect, useState} from "react";
import ky from "ky";

export function HotelsList() {
    const [hotels, setHotels] = useState([])

    useEffect(() => {
        const a = async() => {
            const response = await (await ky.get('http://localhost:8080/hotels')).json()
            console.log(response)
            setHotels(response)
        }
        a()
    }, [])

    return(
        <ul>
            {hotels.map(value => <li key={value._id}>{value.name}</li>)}
        </ul>
    )
}