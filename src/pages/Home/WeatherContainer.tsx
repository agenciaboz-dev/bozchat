import React from "react"
import { ContainerWrapper } from "./ContainerWrapper"

import { WeatherComponent } from "./WeatherComponent"

interface WeatherContainerProps {}

export const WeatherContainer: React.FC<WeatherContainerProps> = ({}) => {
    return <WeatherComponent />
}
