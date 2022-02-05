import { createRef, FC, RefObject, useEffect, useRef, useState, WheelEvent } from "react"

import { Position } from "../types/bounds"
import { NodeDataConnection, NodeDataConnectionTypes, NodeMeta } from "../types/nodes"
import useDrag from "../hooks/useDrag"

import Background from "./Background"
import Connector from "./Connector"
import DataRow from "./DataRow"
import GraphControls from "./GraphControls"
import Node, { NodeRef } from '../components/Node'

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
    const graphRef = useRef<HTMLDivElement>(null)
    const nodeRefs = useRef<RefObject<NodeRef>[]>([])
    
    const [nodes, setNodes] = useState<NodeMeta[]>(data)
    const [activeNode, setActiveNode] = useState<number>(-1)
    
    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState<number>(1)
    const [connectorPoints, setConnectorPoints] = useState<[Position, Position] | null>(null)

    const [locked, toggleLocked] = useState<boolean>(false)

    const { ref, state, position } = useDrag(0, 0, offset.x, offset.y)

    const svgSizeProps = {
        width,
        height,
        viewBox: `0 0 ${width} ${height}`
    }

    const lineStyle = {
        stroke: "#fbb81b",
        strokeWidth: "1"
    }

    const buttonSize = 8 * zoom

    useEffect(() => {
        for (let i = 0; i < nodes.length; i++) {
            nodeRefs.current.push(createRef<NodeRef>())
        }
    }, [nodes.length])

    useEffect(() => { 
        deselectNode()

        if (!locked) {
            setOffset(position) 
        }
    }, [locked, position, state])

    const selectNode = (id: number) => {
        const index = nodes.findIndex((node) => node.id === id)
        const node = nodes[index]

        const newNodes = [...nodes]

        newNodes.splice(index, 1)
        newNodes.push(node)

        setNodes(newNodes)
        setActiveNode(id)
    }

    const deselectNode = () => {
        setActiveNode(-1)
    }

    const updateNodeMeta = (id: number, data: NodeMeta) => {
        const index = nodes.findIndex((node) => node.id === id)

        const newSize = nodeRefs.current[index]?.current?.resize()
        if (newSize) {
            data.size = newSize
        }
        
        const newNodes = [...nodes]
        newNodes.splice(index, 1, data)

        setNodes(newNodes)
    }

    const nodeById = (id: number): NodeMeta => {
        const index = nodes.findIndex((node) => node.id === id)
        return nodes[index]
    }  
    
    const getMidpointBetweenConnectors = (node: NodeMeta, connection: NodeDataConnection) => {
        const n0 = nodeById(node.id)
        const n1 = nodeById(connection.to.nodeId)

        const p0 = { x: zoom * n0.position.x + offset.x, y: zoom * n0.position.y + offset.y }
        const p1 = { x: zoom * n1.position.x + offset.x, y: zoom * n1.position.y + offset.y }

        const x0 = p0.x + n0.size.width
        const y0 = p0.y + (n0.size.height * 0.5) + connection.dataId * 24 // TODO: get ref of datarow to find pos
        const x1 = p1.x
        const y1 = p1.y + (n1.size.height * 0.5) + connection.to.dataId * 24 // TODO: get ref of datarow to find pos

        const cx = (x0 + x1) / 2
        const cy = (y0 + y1) / 2

        return { x: cx, y: cy }
    }

    const drawConnectorPath = (node: NodeMeta, connection: NodeDataConnection) => {
        const n0 = nodeById(node.id)
        const n1 = nodeById(connection.to.nodeId)

        const p0 = { x: zoom * n0.position.x + offset.x, y: zoom * n0.position.y + offset.y }
        const p1 = { x: zoom * n1.position.x + offset.x, y: zoom * n1.position.y + offset.y }

        const x0 = p0.x + n0.size.width
        const y0 = p0.y + (n0.size.height * 0.5) + connection.dataId * 24 // TODO: get ref of datarow to find pos
        const x1 = p1.x
        const y1 = p1.y + (n1.size.height * 0.5) + connection.to.dataId * 24 // TODO: get ref of datarow to find pos

        const cx = (x0 + x1) / 2

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

            return `M${x0},${y0}
                    C${cx},${y0} ${cx},${y1}
                    ${x1},${y1}`
        }
        
        return ''
    }

    const connectNodeDataRows = (n0: number, d0: number, n1: number, d1: number) => {
        if (n0 === n1) {
            return
        }

        const index = nodes.findIndex((node) => node.id === n0)
        const node = nodes[index]

        const isConnected = node.connections.find((c) =>
            c.dataId === d0 && c.to.nodeId === n1 && c.to.dataId === 1) != null

        if (isConnected) {
            return
        }

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

    const disconnectNodeDataRows = (n0: number, d0: number, n1: number, d1: number) => {
        const index = nodes.findIndex((node) => node.id === n0)
        const node = nodes[index]

        const connectionIndex = node.connections.findIndex((connection) =>
            connection.dataId === d0 && connection.to.nodeId === n1 && connection.to.dataId === d1)

        node.connections.splice(connectionIndex, 1)
        updateNodeMeta(n0, node)
    }

    const checkDataSources = (id: number, data: number) => {
        const sources = nodes.reduce((values, node) => {
            const connections = node.connections.filter((c) => c.to.nodeId === id && c.to.dataId === data)
            connections.forEach((connection) => {
                if (connection != null) {
                    const dataId = connection.dataId
                    const nodeData = node.data?.find((d) => d.id === dataId)
    
                    if (nodeData != null) {
                        const mod = checkDataSources(node.id, dataId)
                        const value = mod ? { ...nodeData, value: nodeData.value + mod } : nodeData
                        
                        values.push(value)
                    }
                }
            })

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

    const onScroll = (e: WheelEvent<HTMLDivElement>) => {
        if (locked) {
            return
        }

        const delta = Math.min(1, Math.max(-1, e.deltaY)) * 0.03
        const newZoom = Math.min(2, Math.max(0.5, zoom + delta))

        setZoom(newZoom)

        const ratio = 1 - newZoom / zoom
        const newTranslation = {
            x: offset.x + (e.clientX - offset.x) * ratio,
            y: offset.y + (e.clientY - offset.y) * ratio
        }

        setOffset(newTranslation)
    }

    return (
        <div
            ref={graphRef}
            className='relative z-0 overflow-hidden bg-[#121212] border border-white rounded'
            style={{
                width,
                height,
            }}
            onWheelCapture={(e) => onScroll(e)}
        >
            <Background
                ref={ref}
                offset={offset}
                zoom={zoom}
                className={`w-full h-full absolute z-10 cursor-move`}
            />

            <GraphControls
                locked={locked}
                zoomIn={() => !locked && setZoom(zoom + 0.1)}
                zoomOut={() => !locked && setZoom(zoom - 0.1)}
                toggleLocked={toggleLocked}
            />

            {nodes.map((node, i) => {
                return (
                    <div key={node.id}>
                        <Node
                            ref={nodeRefs.current[i]}
                            data={node}
                            offset={offset}
                            zoom={zoom}
                            isActive={node.id === activeNode}
                            selectNode={() => selectNode(node.id)}
                            deselectNode={deselectNode}
                            updateNodeMeta={(data: NodeMeta) => updateNodeMeta(node.id, data)}
                            style={{
                                zIndex: 20 + i,
                                transform: `scale(${zoom})`
                            }}
                        >
                            {node.content}
                            {node.data?.map((data, i) => {
                                const mod = checkDataSources(node.id, data.id)
                                const value = mod ? data.value + mod : data.value

                                const n0 = nodeById(node.id)                        
                                const p0 = { x: n0.position.x, y: n0.position.y }  
                                const x0 = p0.x
                                const y0 = p0.y + (n0.size.height * 0.5) + data.id * 24 // TODO: get ref of datarow to find pos    
                                
                                const receiver = (<Connector
                                                    nodeId={node.id}
                                                    dataId={data.id}
                                                    graphRef={graphRef}
                                                    hasConnection={nodes.find((n) => n.connections.find((c) => c.to.nodeId === node.id && c.to.dataId === data.id)) != null}
                                                    setConnectorPoints={(mouse: Position) => setConnectorPoints([{ x: zoom * x0 + offset.x, y: zoom * y0 + offset.y }, mouse])}
                                                    deselectConnector={() => setConnectorPoints(null)}
                                                    connectNodeDataRows={(n0: number, d0: number) => connectNodeDataRows(n0, d0, node.id, data.id)}
                                                    style={{
                                                        zIndex: 20 + i
                                                    }}
                                                />)

                                const sender = (<Connector
                                                    nodeId={node.id}
                                                    dataId={data.id}
                                                    graphRef={graphRef}
                                                    hasConnection={n0.connections.find((c) => c.dataId === data.id) != null}
                                                    setConnectorPoints={(mouse: Position) => setConnectorPoints([{ x: zoom * x0 + n0.size.width + offset.x, y: zoom * y0 + offset.y }, mouse])}
                                                    deselectConnector={() => setConnectorPoints(null)}
                                                    connectNodeDataRows={(n1: number, d1: number) => connectNodeDataRows(node.id, data.id, n1, d1)}
                                                    style={{
                                                        zIndex: 20 + i
                                                    }}
                                                />)

                                return (
                                    <DataRow
                                        key={`node_${node.id}_data_${data.id}_#${i}`}
                                        id={data.id}
                                        title={data.title}
                                        value={value}
                                        node={node}
                                        receiver={node.type == (node.type | NodeDataConnectionTypes.RECEIVER) && receiver}
                                        sender={node.type == (node.type | NodeDataConnectionTypes.SENDER) && sender}
                                        editable={node.type === NodeDataConnectionTypes.SENDER}
                                        updateNodeMeta={(data: NodeMeta) => updateNodeMeta(node.id, data)}
                                    />
                                )
                            })}
                        </Node>

                        {node.connections.map((connection, i) => {
                            const { x, y } = getMidpointBetweenConnectors(node, connection)

                            const style = {...lineStyle}
                            if (node.id === activeNode) {
                                style.stroke = "#54ba08"
                                style.strokeWidth = "2"
                            }
                            if (connection.to.nodeId === activeNode) {
                                style.stroke = "#aa44dd"
                                style.strokeWidth = "2"
                            }
                            
                            return (
                                <div
                                    key={`node_${node.id}_connection_${i}_${i}`}
                                >
                                    <svg
                                        className='absolute pointer-events-none'
                                        style={{
                                            zIndex: 20 + i,
                                        }}
                                        {...svgSizeProps}
                                    >
                                        <path
                                            className='path'
                                            d={drawConnectorPath(node, connection)}
                                            fill="none"
                                            {...style}
                                        />
                                        <g
                                            transform={`translate(${x},${y})`}
                                            stroke="#ba0d34"
                                            strokeWidth="2"
                                        >
                                            <circle
                                                className="cursor-pointer pointer-events-auto"
                                                x={-buttonSize * 0.5}
                                                y={-buttonSize * 0.5}
                                                r={buttonSize * 0.8}
                                                fill="transparent"
                                                onClick={() => disconnectNodeDataRows(node.id, connection.dataId, connection.to.nodeId, connection.to.dataId)}
                                            />
                                            <path
                                                fill="none"
                                                d={`M${-buttonSize * 0.5} ${-buttonSize * 0.5}
                                                    L${buttonSize * 0.5} ${buttonSize * 0.5}`}
                                            />
                                            <path
                                                fill="none"
                                                d={`M${buttonSize * 0.5} ${-buttonSize * 0.5}
                                                    L${-buttonSize * 0.5} ${buttonSize * 0.5}`}
                                            />
                                        </g>
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