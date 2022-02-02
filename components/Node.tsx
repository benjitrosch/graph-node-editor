/* eslint-disable react-hooks/exhaustive-deps */
import { CSSProperties, FC, ReactNode, useEffect } from "react"
import clsx from 'clsx'

import { Position } from "../types/bounds"
import { NodeData } from "../types/nodes"
import useDrag, { DragState } from "../hooks/useDrag"

type Props = {
    data: NodeData
    offset: Position
    children: ReactNode
    className?: string,
    style?: CSSProperties
    selectNode: () => void
    deselectNode: () => void
    updateNodeData: (data: NodeData) => void
}

const Node: FC<Props> = ({
    data,
    offset,
    children,
    className,
    style,
    selectNode,
    deselectNode,
    updateNodeData
}) => {
    const { position } = data
    const { state, position: elementPosition, ref } = useDrag(position.x, position.y, -offset.x, -offset.y)

    const classes = clsx(
        "node absolute w-fit h-fit z-30 px-4 py-2 bg-white border border-black rounded cursor-pointer select-none pointer-events-auto",
        className,
        {
            "active": state === DragState.MOVE || state === DragState.ACTIVE,
        }
    )

    useEffect(() => {
        if (state === DragState.ACTIVE) {
            selectNode()
        }

        if (state === DragState.IDLE) {
            deselectNode()
        }
    }, [state])

    useEffect(() => {
        const element = ref.current
        if (element != null) {
            updateNodeData({
                ...data,
                position: {
                    x: elementPosition.x,
                    y: elementPosition.y,
                },
                size: {
                    width: element.offsetWidth,
                    height: element.offsetHeight,
                }
            })  
        }      
    }, [elementPosition, ref.current])

    return (
        <div
            ref={ref}
            style={{
                ...style,
                marginLeft: elementPosition.x + offset.x,
                marginTop: elementPosition.y + offset.y,
            }}
            className={classes}
        >
            {children}

            <style jsx>{`
                .active {
                    box-shadow: 0 0 0 0.1px rgba(0, 0, 0), 0 4px 8px -2px rgba(0, 0, 0, 0.2)
                }
            `}</style>
        </div>
    )
}

export default Node