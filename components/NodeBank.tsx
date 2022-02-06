import { CSSProperties, FC } from "react"
import clsx from 'clsx'

import NodeBankItem from "./NodeBankItem"
import { NodeDataConnectionTypes } from "../types/nodes"

type Props = {
    className?: string
    style?: CSSProperties
}

const NodeBank: FC<Props> = ({ className, style }) => {
    const classes = clsx(
        "relative flex flex-col w-full h-full gap-4 p-8 border border-[#777777] select-none",
        className
    )

    return (
        <div
            className={classes}
            style={{...style}}
        >
            <NodeBankItem type={NodeDataConnectionTypes.SENDER}>
                SENDER
            </NodeBankItem>

            <NodeBankItem type={NodeDataConnectionTypes.CHANNEL}>
                CHANNEL
            </NodeBankItem>

            <NodeBankItem type={NodeDataConnectionTypes.RECEIVER}>
                RECEIVER
            </NodeBankItem>
        </div>
    )
}

export default NodeBank