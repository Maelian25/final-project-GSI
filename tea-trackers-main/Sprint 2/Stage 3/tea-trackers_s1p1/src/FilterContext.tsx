import React from "react"
import { IFilter } from "./dto/IFilter"

export interface FilterContextProps {
    filter:IFilter|null
    setFilter: (filter:IFilter|null) => void
}

export const FilterContext = React.createContext<FilterContextProps>({filter: null, setFilter:(u) => {}})