import React from 'react'
import { UserEntify } from '../model'

type Props = {
    user: UserEntify;
    showId: (id:Number) => void;
}


const url = 'https://jsonplaceholder.typicode.com/users';

export default function AxiosDemoRow({ user,showId }: Props) {
    const { id, name, username, email } = user;
    return (
        <li onClick={()=>{showId(id)}}>{`${id}-${name}-${username}-${email}`}</li>
    )
}