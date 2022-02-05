import {
    CSSProperties,
    FC,
    RefObject,
    useEffect,
    useRef
} from "react"
import clsx from 'clsx'

import { Position } from "../types/bounds"
import useDrag, { DragState } from "../hooks/useDrag"

type Props = {
    nodeId: number
    dataId: number
    graphRef: RefObject<HTMLDivElement>
    hasConnection: boolean
    className?: string,
    style?: CSSProperties
    setConnectorPoints: (mouse: Position) => void
    deselectConnector: () => void
    connectNodeDataRows: (nodeId: number, dataId: number) => void
}

const Connector: FC<Props> = ({
    nodeId,
    dataId,
    graphRef,
    hasConnection,
    className,
    style,
    setConnectorPoints,
    deselectConnector,
    connectNodeDataRows,
}) => {
    const { elementBelow, state, mouse, ref } = useDrag(0, 0, 0, 0, graphRef.current)
    const prevState = useRef<DragState>(DragState.IDLE)

    const classes = clsx(
        `w-2 h-2 rounded-full bg-[${hasConnection ? '#c9bb82' : '#38362f'}] border border-[#f7d964] cursor-crosshair`,
        className,
    )

    useEffect(() => {
        if (state === DragState.MOVE) {
            setConnectorPoints(mouse)
        }

        if (state === DragState.IDLE) {
            deselectConnector()

            if (elementBelow != null && prevState.current === DragState.MOVE) { 
                const [nodeId, dataId] = parseConnectorId(elementBelow)
                connectNodeDataRows(nodeId, dataId)
            }
        }

        prevState.current = state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, mouse, elementBelow])

    const parseConnectorId = (id: string): [number, number] => {
        // FIXME: I do not enjoy the idea of parsing a string (w a temp naming convention that I don't want to be tied down to)
        const nodeId = Number(id.split('_')[2])
        const dataId = Number(id.split('_')[4])

        return [nodeId, dataId]
    }

    return (
        <div
            id={`connector_node_${nodeId}_data_${dataId}`}
            ref={ref}
            className={classes}
            style={{
                ...style
            }}
        />
    )
}

export default Connector