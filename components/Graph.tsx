import { FC, useEffect, useState } from "react"

import { Position } from "../types/bounds"
import { NodeData, NodeDataRowRef, NodeMeta } from "../types/nodes"
import useDrag from "../hooks/useDrag"

import Node from '../components/Node'
import Background from "./Background"
import DataRow from "./DataRow"
import Connector from "./Connector"

type Props = {
    data?: NodeMeta[]
    width?: number
    height?: number
}

const Graph: FC<Props> = ({
    data = [],
    width = 1920,
    height = 1080,
}) => {
    const [nodes, setNodes] = useState<NodeMeta[]>(data)
    const [activeNode, setActiveNode] = useState<number>(-1)
    const [dataRowRefs, setDataRowRefs] = useState<NodeDataRowRef[]>([])
    
    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 })

    const { state, position, ref } = useDrag(0, 0, offset.x, offset.y)

    const svgSizeProps = {
        width,
        height,
        viewBox: `0 0 ${width} ${height}`
    }

    const lineStyle = {
        stroke: "#000000",
        strokeWidth: "1"
    }

    const r = 8

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

    const updateNodeMeta = (id: number, data: NodeMeta) => {
        const index = nodes.findIndex((node) => node.id === id)
        const newNodes = [...nodes]

        newNodes.splice(index, 1, data)

        setNodes(newNodes)
    }

    const nodeById = (id: number): NodeMeta => {
        const index = nodes.findIndex((node) => node.id === id)
        return nodes[index]
    }    

    const checkDataSources = (id: number, data: number) => {
        const sources = nodes.reduce((values, node) => {
            const connection = node.connections.find((c) => c.to.nodeId === id && c.to.dataId === data)
            if (connection != null) {
                const dataId = connection.dataId
                const nodeData = node.data?.find((d) => d.id === dataId)

                if (nodeData != null) {
                    const mod = checkDataSources(node.id, dataId)
                    const value = mod ? { ...nodeData, value: nodeData.value + mod } : nodeData
                    
                    values.push(value)
                }
            }

            return values
        }, [] as any[])

        if (!sources.length) {
            return null
        }

        return sources.reduce((acc, data, i) => {
            if (i === 0) return acc
            return acc + data.value
        }, sources[0].value)
    }

    return (
        <div
            className='relative z-50 overflow-hidden pointer-events-none'
            style={{
                width,
                height
            }}
        >
            <Background
                offset={offset}
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
                            updateNodeMeta={(data: NodeMeta) => updateNodeMeta(node.id, data)}
                        >
                            {node.content}
                            {node.data?.map((data, i) => {
                                const mod = checkDataSources(node.id, data.id)
                                const value = mod ? data.value + mod : data.value

                                return (
                                    <DataRow
                                        key={`node_${node.id}_data_${data.id}_#${i}`}
                                        title={data.title}
                                        value={value}
                                    />
                                )
                            })}
                        </Node>

                        {node.connections.map((connection, i) => {
                            const n0 = nodeById(node.id)
                            const n1 = nodeById(connection.to.nodeId)

                            const p0 = { x: n0.position.x + offset.x, y: n0.position.y + offset.y }
                            const p1 = { x: n1.position.x + offset.x, y: n1.position.y + offset.y }

                            const x0 = p0.x + n0.size.width
                            const y0 = p0.y + (n0.size.height * 0.5) + connection.dataId * 24 // TODO: get ref of datarow to find pos
                            const x1 = p1.x
                            const y1 = p1.y + (n1.size.height * 0.5) + connection.to.dataId * 24 // TODO: get ref of datarow to find pos

                            const cx = (x0 + x1) / 2
                            const cy = (y0 + y1) / 2

                            return (
                                <div
                                    key={`node_${node.id}_connection_${i}_${i}`}
                                >
                                    <Connector
                                        position={{ x: x0 - (r * 0.5), y: y0 - (r * 0.5) }}
                                        radius={r}
                                    />

                                    <Connector
                                        position={{ x: x1 - (r * 0.5), y: y1 - (r * 0.5) }}
                                        radius={r}
                                    />

                                    <svg
                                        className='absolute z-50'
                                        {...svgSizeProps}
                                    >
                                        <path
                                            className='path'
                                            d={`M${x0},${y0}
                                                C${cx},${y0} ${cx},${y1}
                                                ${x1},${y1}`}
                                            fill="none"
                                            {...lineStyle}
                                        />
                                    </svg>
                                </div>
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