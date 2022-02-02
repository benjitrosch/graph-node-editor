import { ReactNode, RefObject } from "react"

import { Position, Size } from "./bounds"

export type NodeMeta = {
    id: number
    content: ReactNode
    position: Position
    size: Size
    connections: NodeDataConnection[]
    data?: NodeData<any>[]
}

export type NodeData<T> = {
    id: number
    title: string
    value: T
}

export type NodeDataConnection = {
    dataId: number,
    to: {
        nodeId: number,
        dataId: number
    }
}

export type NodeDataRowRef = {
    nodeId: number,
    dataId: number,
    ref: RefObject<HTMLDivElement>
}