import { FC, useEffect, useState } from "react"

import { Position } from "../types/bounds"
import { NodeDataConnection, NodeDataRowRef, NodeMeta } from "../types/nodes"
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
    const [connectorPoints, setConnectorPoints] = useState<[Position, Position] | null>(null)

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

    const drawConnectorPath = (node: NodeMeta, connection: NodeDataConnection) => {
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

        return `M${x0},${y0}
                C${cx},${y0} ${cx},${y1}
                ${x1},${y1}`
    }

    const drawConnectorToMousePath = () => {
        if (connectorPoints) {
            const [p0, p1] = connectorPoints

            const x0 = p0.x
            const x1 = p1.x
            const y0 = p0.y
            const y1 = p1.y

            const cx = (x0 + x1) / 2
            const cy = (y0 + y1) / 2

            return `M${x0},${y0}
                    C${cx},${y0} ${cx},${y1}
                    ${x1},${y1}`
        }
        
        return ''
    }

    const connectNodeDataRows = (n0: number, d0: number, n1: number, d1: number) => {
        const index = nodes.findIndex((node) => node.id === n0)
        const node = nodes[index]

        const connection: NodeDataConnection = {
            dataId: d0,
            to: {
                nodeId: n1,
                dataId: d1,
            }
        }

        node.connections.push(connection)

        updateNodeMeta(n0, node)
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
            className='relative z-0 overflow-hidden'
            style={{
                width,
                height
            }}
        >
            <Background
                ref={ref}
                offset={offset}
                className={`w-full h-full absolute z-10 cursor-move`}
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

                        {node.data?.map((data, i) => {
                            const n0 = nodeById(node.id)                        
                            const p0 = { x: n0.position.x, y: n0.position.y }  
                            const x0 = p0.x
                            const y0 = p0.y + (n0.size.height * 0.5) + data.id * 24 // TODO: get ref of datarow to find pos    
                            
                            return (
                                <div 
                                    key={`node_${node.id}_data_${data.id}_connectors`}
                                >
                                    <Connector
                                        nodeId={node.id}
                                        dataId={data.id}
                                        position={{ x: x0 - (r * 0.5), y: y0 - (r * 0.5) }}
                                        offset={offset}
                                        radius={r}
                                        setConnectorPoints={(mouse: Position) => setConnectorPoints([{ x: x0 + offset.x, y: y0 + offset.y }, mouse])}
                                        deselectConnector={() => setConnectorPoints(null)}
                                        connectNodeDataRows={(n0: number, d0: number) => connectNodeDataRows(n0, d0, node.id, data.id)}
                                    />

                                    <Connector
                                        nodeId={node.id}
                                        dataId={data.id}
                                        position={{ x: x0 + n0.size.width - (r * 0.5), y: y0 - (r * 0.5) }}
                                        offset={offset}
                                        radius={r}
                                        setConnectorPoints={(mouse: Position) => setConnectorPoints([{ x: x0 + n0.size.width + offset.x, y: y0 + offset.y }, mouse])}
                                        deselectConnector={() => setConnectorPoints(null)}
                                        connectNodeDataRows={(n1: number, d1: number) => connectNodeDataRows(node.id, data.id, n1, d1)}
                                    />
                                </div>
                            )
                        })}

                        {node.connections.map((connection, i) => {
                            return (
                                <div
                                    key={`node_${node.id}_connection_${i}_${i}`}
                                >
                                    <svg
                                        className='absolute z-50 pointer-events-none'
                                        {...svgSizeProps}
                                    >
                                        <path
                                            className='path'
                                            d={drawConnectorPath(node, connection)}
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

            <svg
                className='absolute z-50 pointer-events-none'
                {...svgSizeProps}
            >
                <path
                    d={drawConnectorToMousePath()}
                    fill="none"
                    {...lineStyle}
                />
            </svg>

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