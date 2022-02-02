import { FC } from "react"
import { Position } from "../types/bounds"

type Props = {
    position: Position
    radius: number
}

const Connector: FC<Props> = ({
    position,
    radius,
}) => {
    const { x, y } = position

    return (
        <div
            className="absolute z-50 bg-red-500 rounded-full border border-black cursor-crosshair pointer-events-auto"
            style={{
                width: radius,
                height: radius,
                marginLeft: x,
                marginTop: y,
            }}
        />
    )
}

export default Connector