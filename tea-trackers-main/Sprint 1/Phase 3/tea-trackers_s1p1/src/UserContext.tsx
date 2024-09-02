import React from "react"
import { IUser } from "./dto/IUser"

export interface UserContextProps {
    user:IUser|null
    setUser: (user:IUser|null) => void
    // username: string|null
    // setUsername: (username:string|null) => void
}

export const UserContext = React.createContext<UserContextProps>({user: null, setUser:(u) => {}})