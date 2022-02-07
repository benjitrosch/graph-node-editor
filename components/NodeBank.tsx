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
        "relative w-full h-auto grid grid-cols-2 gap-2 p-2 bg-base-600 border border-base-200 rounded select-none",
        className
    )

    return (
        <fieldset
            className={classes}
            style={{...style}}
        >
            <legend>NODE BANK</legend>
            
            <NodeBankItem type={NodeDataConnectionTypes.SENDER}>
                SENDER
            </NodeBankItem>

            <NodeBankItem type={NodeDataConnectionTypes.CHANNEL}>
                CHANNEL
            </NodeBankItem>

            <NodeBankItem type={NodeDataConnectionTypes.RECEIVER}>
                RECEIVER
            </NodeBankItem>
        </fieldset>
    )
}

export default NodeBank