import { FC, useEffect, useState } from "react"

import { Position } from "../types/bounds"
import { NodeData } from "../types/nodes"
import useDrag from "../hooks/useDrag"

import Node from '../components/Node'

type Props = {
    data?: NodeData[]
    width?: number
    height?: number
}

const Graph: FC<Props> = ({
    data = [],
    width = 1920,
    height = 1080,
}) => {
    const [nodes, setNodes] = useState<NodeData[]>(data)
    const [activeNode, setActiveNode] = useState<number>(-1)

    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 })

    const { state, position, ref } = useDrag(0, 0, offset.x, offset.y)

    useEffect(() => {
        setOffset(position)  
    }, [position, state])

    const selectNode = (id: number) => {
        const index = nodes.findIndex((node) => node.id === id)
        const node = nodes[index]

        const newNodes = [...nodes]

        newNodes.splice(index, 1)
        newNodes.push(node)

        setNodes(newNodes)
    }

    const deselectNode = () => {
        setActiveNode(-1)
    }

    const updateNodeData = (id: number, data: NodeData) => {
        const index = nodes.findIndex((node) => node.id === id)
        const newNodes = [...nodes]

        newNodes.splice(index, 1, data)

        setNodes(newNodes)
    }

    const nodeById = (id: number): NodeData => {
        const index = nodes.findIndex((node) => node.id === id)
        return nodes[index]
    }    

    return (
        <div
            className='relative z-50 border-2 border-black pointer-events-none'
            style={{
                width,
                height
            }}
        >
            <div
                ref={ref}
                className={`w-full h-full absolute z-10 cursor-move ${activeNode === -1 && 'pointer-events-auto'}`}
            />

            {nodes.map((node) => {
                return (
                    <div key={node.id}>
                    <Node
                        data={node}
                        offset={offset}
                        selectNode={() => selectNode(node.id)}
                        deselectNode={deselectNode}
                        updateNodeData={(data: NodeData) => updateNodeData(node.id, data)}
                    >
                        {node.content}
                    </Node>

                    {node.connections.map((connection, i) => {
                        const n0 = nodeById(node.id)
                        const n1 = nodeById(connection)

                        const p0 = { x: n0.position.x + offset.x, y: n0.position.y + offset.y }
                        const p1 = { x: n1.position.x + offset.x, y: n1.position.y + offset.y }

                        const x0 = p0.x + n0.size.width
                        const y0 = p0.y + (n0.size.height * 0.5)
                        const x1 = p1.x
                        const y1 = p1.y + (n1.size.height * 0.5)

                        const cx = (x0 + x1) / 2
                        const cy = (y0 + y1) / 2

                        const r = 3

                        const lineStyle = {
                            stroke: "#000000",
                            strokeWidth: "1"
                        }

                        const dotStyle = {
                            stroke: "#ffffff",
                            strokeWidth: "1"
                        }

                        return (
                        <svg
                            key={i}
                            className='absolute z-50'
                            width={width}
                            height={height}
                            viewBox={`0 0 ${width} ${height}`}
                        >
                            <path
                                className='path'
                                d={`M${x0},${y0}
                                    C${cx},${y0} ${cx},${y1}
                                    ${x1},${y1}`}
                                fill="none"
                                {...lineStyle}
                            />

                            {i === 0 && <circle
                                cx={x0 - (r * 0.5)}
                                cy={y0}
                                r={r}
                                fill="#ff0000"
                                {...dotStyle}
                            />}

                            <circle
                                cx={x1 + (r * 0.5)}
                                cy={y1}
                                r={r}
                                fill="#0000ff"
                                {...dotStyle}
                            />
                        </svg>
                        )
                    })}
                    </div>
                )
            })}

            <style jsx>{`
                @-webkit-keyframes dash {
                    to {
                        stroke-dashoffset: -1000;
                    }
                }

                .path {
                    -webkit-animation: dash 30s linear infinite;
                    stroke-dasharray: 8;
                }
            `}</style>
        </div>
    )
}

export default Graph