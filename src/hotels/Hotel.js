import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ky from "ky";

export function Hotel() {
    const params = useParams()
    const [hotel, setHotel] = useState(null)

    useEffect(() => {
        const a = async () => {
            const response = await ky.get(`http://localhost:8080/hotels/${params.hotelId}`, {throwHttpErrors: false})
            if (response.ok) {
                const fetchedHotel = await response.json()
                setHotel(fetchedHotel)
            }
        }
        a()
    }, [])

    return (
        <>
            {params.hotelId}
            <br/>
            {hotel && hotel.name}
        </>
    )
}