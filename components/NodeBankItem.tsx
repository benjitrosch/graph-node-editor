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
            className="flex items-center justify-center p-4 bg-[#323232] border-l-4 border-[#47a5d3] rounded select-none"
            onDragStart={onDragStart}
            draggable
        >
            {children}
        </div>
    )
}

export default NodeBankItem