import {
    createRef,
    CSSProperties,
    FC,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState, 
    WheelEvent
} from "react"
import clsx from 'clsx'

import { NodeDataConnection, NodeDataConnectionTypes, NodeDataConnectorType, NodeGroupData, NodeMeta } from "../types/nodes"
import { Position } from "../types/bounds"
import useContextMenu from "../hooks/useContextMenu"
import useDrag from "../hooks/useDrag"

import Background from "./Background"
import Connector, { ConnectorRef } from "./Connector"
import DataRow from "./DataRow"
import GraphContextMenu from "./GraphContextMenu"
import GraphControls from "./GraphControls"
import Node from '../components/Node'
import { drawBezierPath, drawSteppedPath } from "../utils/paths"

type Props = {
    data?: NodeMeta[]
    groups?: NodeGroupData[]
    width?: number
    height?: number
    className?: string
    style?: CSSProperties
}

const Graph: FC<Props> = ({
    data = [],
    groups = [],
    width,
    height,
    className,
    style,
}) => {
    const graphRef = useRef<HTMLDivElement>(null)
    const connectorRefs = useRef<{
        type: NodeDataConnectorType,
        nodeId: number,
        dataId: number,
        ref: RefObject<ConnectorRef>
    }[]>([])

    const [nodes, setNodes] = useState<NodeMeta[]>(data)
    const [activeNode, setActiveNode] = useState<number>(-1)
    
    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState<number>(1)
    const [connectorPoints, setConnectorPoints] = useState<[Position, Position] | null>(null)

    const [locked, toggleLocked] = useState<boolean>(false)
    const [fullscreen, toggleFullscreen] = useState<boolean>(false)

    const { ref, state, position } = useDrag(0, 0, offset.x, offset.y)
    const { anchorPoint, showMenu: showGraphMenu } = useContextMenu(ref)

    const svgSizeProps = {
        width: width ?? '100%',
        height: height ?? '100%',
    }

    const lineStyle = {
        stroke: "#fbb81b",
        strokeWidth: "1"
    }

    const buttonSize = 8 * zoom

    const classes = clsx(
        `${fullscreen ? 'absolute' : 'relative'} z-0 overflow-hidden bg-base-600`,
        className
    )

    useEffect(() => { 
        deselectNode()
        
        if (!locked) {
            setOffset(position) 
        }
    }, [locked, position, state])

    useEffect(() => {
        const graph = graphRef.current

        if (graph != null && document != null) {
            const openFullscreen = () => {
                if (graph.requestFullscreen) {
                    graph.requestFullscreen()
                }
            }
            
            const closeFullscreen = () => {
                if (document.fullscreenElement && document.exitFullscreen) {
                    document.exitFullscreen()
                }
            }

            fullscreen ? openFullscreen() : closeFullscreen()
        }
    }, [fullscreen])

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

    const updateNodeMeta = useCallback((id: number, data: NodeMeta) => {
        const index = nodes.findIndex((node) => node.id === id)
        
        const newNodes = [...nodes]
        newNodes.splice(index, 1, data)

        setNodes(newNodes)
    }, [nodes])

    const nodeById = (id: number): NodeMeta => {
        const index = nodes.findIndex((node) => node.id === id)
        return nodes[index]
    }  

    const addNode = (type: NodeDataConnectionTypes, x: number, y: number) => {
        setNodes((n) => n.concat({
            id: n.length,
            title: `test_node_0${n.length}`,
            position: { x: x - (graphRef.current?.offsetLeft ?? 0) - offset.x, y: y - (graphRef.current?.offsetTop ?? 0) - offset.y },
            type,
            connections: [],
            data: []
          }
        ))
    }

    const cloneNode = (node: NodeMeta) => {
        setNodes((n) => n.concat({
            id: n.length,
            title: `test_node_0${n.length}`,
            position: { x: node.position.x + 100 , y: node.position.y + 100 },
            type: node.type,
            group: node.group,
            connections: [],
            data: node.data
          }
        ))
    }

    const removeNode = (id: number) => {
        const index = nodes.findIndex((node) => node.id === id)
        const newNodes = [...nodes]

        newNodes.forEach((node) => {
            node.connections = node.connections.filter((c) => c.to.nodeId !== id)
        })
        newNodes.splice(index, 1)

        setNodes(newNodes)
    }
    
    const getMidpointBetweenConnectors = (node: NodeMeta, connection: NodeDataConnection) => {
        const n0 = nodeById(node.id)
        const n1 = nodeById(connection.to.nodeId)

        const p0 = { x: zoom * n0.position.x + offset.x, y: zoom * n0.position.y + offset.y }
        const p1 = { x: zoom * n1.position.x + offset.x, y: zoom * n1.position.y + offset.y }

        const x0 = p0.x //+ n0.size.width
        const y0 = p0.y //+ (n0.size.height * 0.5) + connection.dataId * 24 // TODO: get ref of datarow to find pos
        const x1 = p1.x
        const y1 = p1.y //+ (n1.size.height * 0.5) + connection.to.dataId * 24 // TODO: get ref of datarow to find pos

        const cx = (x0 + x1) / 2
        const cy = (y0 + y1) / 2

        return { x: cx, y: cy }
    }

    const drawConnectorToMousePath = () => {
        if (connectorPoints) {
            const [p0, p1] = connectorPoints
            return drawBezierPath(p0, p1)
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
            className={classes}
            style={{
                ...style,
                width: width ?? '100%',
                height: height ?? '100%',
            }}
            onWheelCapture={(e) => onScroll(e)}
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
            }}
            onDrop={(e) => {
                const type = e.dataTransfer.getData('nodeConnectionType')
                addNode(Number(type), e.clientX, e.clientY)
            }}
        >
            <ul className="absolute z-50 left-0 top-0 m-1 text-xs text-base-300">
                <li>({offset.x.toFixed(0)}, {offset.y.toFixed(0)})</li>
                <li>* {zoom.toFixed(2)}</li>
            </ul>

            {showGraphMenu && (
                <GraphContextMenu
                    position={anchorPoint}
                    addNode={(type: NodeDataConnectionTypes) => addNode(type, anchorPoint.x, anchorPoint.y)}
                    setZoom={(zoom: number) => setZoom(zoom)}
                    toggleFullscreen={() => toggleFullscreen(!fullscreen)}
                    toggleLocked={() => toggleLocked(!locked)}
                />
            )}

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
                toggleLocked={() => toggleLocked(!locked)}
                toggleFullscreen={() => toggleFullscreen(!fullscreen)}
            />

            {nodes.map((node, i) => {
                return (
                    <div key={node.id}>
                        <Node
                            data={node}
                            offset={offset}
                            zoom={zoom}
                            color={groups.find((group) => group.id === node.group)?.color ?? '#47a5d3'}
                            isActive={node.id === activeNode}
                            groups={groups}
                            selectNode={() => selectNode(node.id)}
                            deselectNode={deselectNode}
                            updateNodeMeta={(data: NodeMeta) => updateNodeMeta(node.id, data)}
                            cloneNode={() => cloneNode(node)}
                            removeNode={() => removeNode(node.id)}
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
                                const y0 = p0.y //+ (n0.size.height * 0.5) + data.id * 24 // TODO: get ref of datarow to find pos    
                                
                                let receiverRef = connectorRefs.current.find((c) => c.type === 'in' && c.nodeId === node.id && c.dataId === data.id)
                                if (!receiverRef) {
                                    receiverRef = {
                                        type: 'in',
                                        nodeId: node.id,
                                        dataId: data.id,
                                        ref: createRef<ConnectorRef>()
                                    }
                                    connectorRefs.current.push(receiverRef)
                                }

                                let senderRef = connectorRefs.current.find((c) => c.type === 'out' && c.nodeId === node.id && c.dataId === data.id)
                                if (!senderRef) {
                                    senderRef = {
                                        type: 'out',
                                        nodeId: node.id,
                                        dataId: data.id,
                                        ref: createRef<ConnectorRef>()
                                    }
                                    connectorRefs.current.push(senderRef)
                                }

                                const receiver = (<Connector
                                                    ref={receiverRef.ref}
                                                    type="in"
                                                    nodeId={node.id}
                                                    dataId={data.id}
                                                    graphRef={graphRef}
                                                    zoom={zoom}
                                                    hasConnection={nodes.find((n) => n.connections.find((c) => c.to.nodeId === node.id && c.to.dataId === data.id)) != null}
                                                    setConnectorPoints={(position: Position, mouse: Position) => setConnectorPoints([{ x: zoom * (x0 + position.x + 8) + offset.x, y: zoom * (y0 + position.y + 22) + offset.y }, mouse])}
                                                    deselectConnector={() => setConnectorPoints(null)}
                                                    connectNodeDataRows={(n0: number, d0: number) => connectNodeDataRows(n0, d0, node.id, data.id)}
                                                    style={{
                                                        zIndex: 20 + i
                                                    }}
                                                />)

                                const sender = (<Connector
                                                    ref={senderRef.ref}
                                                    type="out"
                                                    nodeId={node.id}
                                                    dataId={data.id}
                                                    graphRef={graphRef}
                                                    zoom={zoom}
                                                    hasConnection={n0.connections.find((c) => c.dataId === data.id) != null}
                                                    setConnectorPoints={(position: Position, mouse: Position) => setConnectorPoints([{ x: zoom * (x0 + position.x + 8) + offset.x, y: zoom * (y0 + position.y + 22) + offset.y }, mouse])}
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
                            // const { x, y } = getMidpointBetweenConnectors(node, connection)

                            const style = {...lineStyle}
                            if (node.id === activeNode) {
                                style.stroke = "#54ba08"
                                style.strokeWidth = "2"
                            }
                            if (connection.to.nodeId === activeNode) {
                                style.stroke = "#aa44dd"
                                style.strokeWidth = "2"
                            }

                            const sender = connectorRefs.current.find((c) => c.type === 'out' && c.nodeId === node.id && c.dataId === connection.dataId)
                            const receiver = connectorRefs.current.find((c) => c.type === 'in' && c.nodeId === connection.to.nodeId && c.dataId === connection.to.dataId)

                            const senderPosition = sender?.ref.current?.getPosition() ?? { x: 0, y: 0 } 
                            const receiverPosition = receiver?.ref.current?.getPosition() ?? { x: 0, y: 0 } 

                            const n0 = nodeById(node.id)
                            const n1 = nodeById(connection.to.nodeId)
                    
                            const p0 = { x: zoom * (n0.position.x + senderPosition.x + 8) + offset.x, y: zoom * (n0.position.y + senderPosition.y + 22) + offset.y }
                            const p1 = { x: zoom * (n1.position.x + receiverPosition.x + 8) + offset.x, y: zoom * (n1.position.y + receiverPosition.y + 22) + offset.y }                    
                            
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
                                            // className='path'
                                            d={drawSteppedPath(p0, p1)}
                                            fill="none"
                                            {...style}
                                        />
                                        {/* <g
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
                                        </g> */}
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
                    className='path'
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