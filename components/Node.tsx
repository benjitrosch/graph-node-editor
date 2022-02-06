/* eslint-disable react-hooks/exhaustive-deps */
import {
    CSSProperties,
    forwardRef,
    ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
} from "react"
import clsx from 'clsx'

import { Position, Size } from "../types/bounds"
import { NodeDataConnectionTypes, NodeMeta } from "../types/nodes"
import useDrag, { DragState } from "../hooks/useDrag"

export type NodeRef = {
    id: number,
    meta: NodeMeta,
    resize: () => Size
}

type Props = {
    data: NodeMeta
    offset: Position
    zoom: number,
    isActive: boolean
    children: ReactNode
    className?: string,
    style?: CSSProperties
    selectNode: () => void
    deselectNode: () => void
    updateNodeMeta: (data: NodeMeta) => void
}

const Node = forwardRef(({
    data,
    offset,
    zoom,
    isActive,
    children,
    className,
    style,
    selectNode,
    deselectNode,
    updateNodeMeta,
}: Props, ref) => {
    const { position } = data
    const { state, position: elementPosition, ref: dragRef } = useDrag(position.x, position.y, -offset.x, -offset.y)

    const [expanded, toggleExpanded] = useState<boolean>(true)

    const classes = clsx(
        "absolute w-fit h-fit bg-[#323232] border-l-4 border-[#47a5d3] rounded select-none",
        state === DragState.MOVE || state === DragState.ACTIVE ? 'cursor-grabbing' : 'cursor-grab',
        className,
        {
            "move": state === DragState.MOVE || state === DragState.ACTIVE,
            "active": isActive
        }
    )

    useImperativeHandle(ref, () => ({
        id: data.id,
        meta: data,
        resize: () => {
            const element = dragRef.current
            if (element != null) {
                return {
                    width: element.offsetWidth,
                    height: element.offsetHeight,
                }
            } else {
                return data.size
            }
        }
    }), [dragRef.current])

    useEffect(() => {
        if (state === DragState.ACTIVE) {
            selectNode()
            toggleExpanded(true)
        }
    }, [state])

    useEffect(() => {
        updateNodeMeta({
            ...data,
            position: {
                x: elementPosition.x,
                y: elementPosition.y,
            }
        })    
    }, [elementPosition, dragRef.current])

    const addDataRow = useCallback(() => {
        const node = {...data}
        const dataRows = [...(node.data ?? [])]
        
        dataRows.push({
            id: dataRows.length,
            title: `data_#${dataRows.length}`,
            value: 0,
        })
        node.data = dataRows
        updateNodeMeta(node)
    }, [data, updateNodeMeta])

    const nodeTypeToString = (type: NodeDataConnectionTypes) => {
        switch (type) {
            case NodeDataConnectionTypes.RECEIVER:
                return 'RECEIVER'

            case NodeDataConnectionTypes.CHANNEL:
                return 'CHANNEL'

            case NodeDataConnectionTypes.SENDER:
                return 'SENDER'
        }
    }

    return (
        <div
            ref={dragRef}
            className={classes}
            style={{
                ...style,
                marginLeft: zoom * elementPosition.x + offset.x,
                marginTop: zoom * elementPosition.y + offset.y,
            }}
        >
            <span className="absolute top-[-18px] right-0 text-[#999999] text-xs">
                ({position.x}, {position.y})
            </span>

            <div className="flex items-center justify-between gap-8 p-2">
                <div className="flex flex-col">
                    <span
                        className="font-light text-xs text-[#999999]"
                    >
                        {nodeTypeToString(data.type)}
                    </span>

                    <span
                        className="font-semibold text-[#f3f3f3]"
                    >
                        {data.title}
                    </span>
                </div>
                
                <svg
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    onClick={() => toggleExpanded(!expanded)}
                    className="bg-transparent cursor-pointer"
                    style={{
                        transform: `rotate(${expanded ? 90 : 0}deg)`,
                        transformOrigin: 'left',
                    }}
                >
                    <path
                        fill="none"
                        stroke="#999999"
                        strokeWidth="2"
                        d="M0 0 L8 8 L0 16"
                    />
                </svg>
            </div>

            {expanded && children}

            {expanded && (
                <div
                    className="flex items-center justify-center w-full"
                >
                    <button
                        className="w-8 hover:text-white"
                        onClick={addDataRow}
                    >
                        +
                    </button>
                </div>
            )}

            <style jsx>{`
                .move {
                    box-shadow: 0 0 0 0.1px rgba(0, 0, 0), 0 4px 8px -2px rgba(0, 0, 0, 0.2)
                }

                .active {
                    box-shadow: 0 0 0 1px #47a5d3
                }
            `}</style>
        </div>
    )
})

Node.displayName = "Node"

export default Node