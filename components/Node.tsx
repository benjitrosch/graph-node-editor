/* eslint-disable react-hooks/exhaustive-deps */
import {
    CSSProperties,
    FC,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react"
import clsx from 'clsx'

import { NodeDataConnectionTypes, NodeGroupData, NodeMeta } from "../types/nodes"
import { Position } from "../types/bounds"
import useContextMenu from "../hooks/useContextMenu"
import useDrag, { DragState } from "../hooks/useDrag"

import Chevron from "./icons/Chevron"
import NodeContextMenu from "./NodeContextMenu"

type Props = {
    data: NodeMeta
    offset: Position
    zoom: number,
    color: string,
    isActive: boolean
    groups: NodeGroupData[]
    children: ReactNode
    className?: string,
    style?: CSSProperties
    selectNode: () => void
    deselectNode: () => void
    updateNodeMeta: (data: NodeMeta) => void
    cloneNode: () => void
    removeNode: () => void
}

const Node: FC<Props> = ({
    data,
    offset,
    zoom,
    color,
    isActive,
    groups,
    children,
    className,
    style,
    selectNode,
    deselectNode,
    updateNodeMeta,
    cloneNode,
    removeNode,
}) => {
    const { position } = data
    const { state, position: elementPosition, ref } = useDrag(position.x, position.y, -offset.x, -offset.y, zoom)
    const { anchorPoint: nodeAnchorPoint, showMenu: showNodeMenu } = useContextMenu(ref)

    const [expanded, toggleExpanded] = useState<boolean>(true)

    const classes = clsx(
        `absolute w-fit h-fit bg-base-400 border-l-4 rounded select-none`,
        state === DragState.MOVE || state === DragState.ACTIVE ? 'cursor-grabbing' : 'cursor-grab',
        className,
        {
            "move": state === DragState.MOVE || state === DragState.ACTIVE,
            "active": isActive
        }
    )

    useEffect(() => {
        if (state === DragState.ACTIVE) {
            selectNode()
            // toggleExpanded(true)
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
    }, [elementPosition, ref.current])

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
        <>
            <div
                ref={ref}
                className={classes}
                style={{
                    ...style,
                    borderLeftColor: color,
                    marginLeft: zoom * position.x + offset.x,
                    marginTop: zoom * position.y + offset.y,
                    transformOrigin: '0 0',
                }}
            >
                <span className="absolute top-[-18px] right-0 text-base-100 text-xs">
                    ({position.x.toFixed(0)}, {position.y.toFixed(0)})
                </span>

                <div className="flex items-center justify-between gap-8 p-2">
                    <div className="flex flex-col">
                        <span
                            className="font-base-100 text-xs text-base-100"
                        >
                            {nodeTypeToString(data.type)}
                        </span>

                        <span
                            className="font-semibold text-[#f3f3f3]"
                        >
                            {data.title}
                        </span>
                    </div>
                    
                    <Chevron
                        onClick={() => toggleExpanded(!expanded)}
                        style={{
                            transform: `rotate(${expanded ? 90 : 0}deg)`,
                        }}
                    />
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
                        box-shadow: 0 0 0 1px ${color}
                    }
                `}</style>
            </div>

            {showNodeMenu && (
                <NodeContextMenu
                    position={nodeAnchorPoint}
                    groups={groups}
                    expanded={expanded}
                    toggleExpanded={() => toggleExpanded(!expanded)}
                    cloneNode={cloneNode}
                    removeNode={removeNode}
                    setGroup={(group: number) => updateNodeMeta({ ...data, group })}
                />
            )}
        </>
    )
}

export default Node