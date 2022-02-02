import { ReactNode } from "react"

import { Position, Size } from "./bounds"

export type NodeData = {
    id: number
    content: ReactNode
    position: Position
    size: Size
    connections: number[]
}
