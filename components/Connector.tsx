import { FC, useEffect } from "react"

import { Position } from "../types/bounds"
import useDrag, { DragState } from "../hooks/useDrag"

type Props = {
    nodeId: number
    dataId: number
    position: Position
    offset: Position
    radius: number
    setConnectorPoints: (mouse: Position) => void
    deselectConnector: () => void
    connectNodeDataRows: (nodeId: number, dataId: number) => void
}

const Connector: FC<Props> = ({
    nodeId,
    dataId,
    position,
    offset,
    radius,
    setConnectorPoints,
    deselectConnector,
    connectNodeDataRows,
}) => {
    const { x, y } = position
    const { elementBelow, state, mouse, ref } = useDrag(x, y, offset.x, offset.y)

    useEffect(() => {
        if (state === DragState.MOVE) {
            setConnectorPoints(mouse)
        }

        if (state === DragState.IDLE) {
            deselectConnector()

            if (elementBelow != null) { 
                const [nodeId, dataId] = parseConnectorId(elementBelow)
                connectNodeDataRows(nodeId, dataId)
            }
        }
    }, [state, mouse])

    const parseConnectorId = (id: string): [number, number] => {
        // FIXME: I do not enjoy the idea of parsing a string (w a temp naming convention that I don't want to be tied down to)
        const nodeId = Number(id.split('_')[2])
        const dataId = Number(id.split('_')[4])

        console.log(id)
        console.log(nodeId, dataId)

        return [nodeId, dataId]
    }

    return (
        <div
            id={`connector_node_${nodeId}_data_${dataId}`}
            ref={ref}
            className="absolute z-30 bg-red-500 rounded-full border border-black cursor-crosshair"
            style={{
                width: radius,
                height: radius,
                marginLeft: x + offset.x,
                marginTop: y + offset.y,
            }}
        />
    )
}

export default Connector