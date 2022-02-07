import { DragEvent, FC, ReactNode } from "react"
import { NodeDataConnectionTypes } from "../types/nodes"

type Props = {
    type: NodeDataConnectionTypes
    children: ReactNode
}

const NodeBankItem: FC<Props> = ({ type, children }) => {
    const onDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('nodeConnectionType', type.toString())
        e.dataTransfer.effectAllowed = 'move'
    }

    return (
        <div
            className="flex items-center justify-center p-2 bg-base-400 rounded cursor-grab"
            onDragStart={onDragStart}
            draggable
        >
            {children}
        </div>
    )
}

export default NodeBankItem