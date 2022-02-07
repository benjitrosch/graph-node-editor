import { FC, ReactNode, useState } from "react"

import { Position } from "../types/bounds"
import { NodeGroupData } from "../types/nodes"

import Chevron from "./icons/Chevron"

type Props = {
    position: Position
    groups: NodeGroupData[]
}

const NodeContextMenu: FC<Props> = ({
    position,
    groups,
}) => {
    return (
        <ul
            className="absolute z-50 w-32 top-0 left-0 bg-base-500 rounded"
            style={{
                marginTop: position.y,
                marginLeft: position.x,
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
            }}
        >
            <NodeContextMenuItem>
                Collapse
            </NodeContextMenuItem>
            <NodeContextMenuItem submenu={groups.map((group) => {
                return (
                    <li
                        key={group.id}
                        className="w-full border border-black"
                    >
                        <button
                            className="w-full p-1 border border-white text-sm text-black"
                            style={{
                                background: group.color,
                            }} 
                        >
                            {group.title}
                        </button>
                    </li>
                )
            })}>
                Group
            </NodeContextMenuItem>

            <hr className="border-base-300" />

            <NodeContextMenuItem>Clone</NodeContextMenuItem>

            <hr className="border-base-300" />

            <NodeContextMenuItem>Remove</NodeContextMenuItem>
        </ul>
    )
}

type ItemProps = {
    children: ReactNode
    submenu?: ReactNode[]
    onClick?: () => void
}

const NodeContextMenuItem: FC<ItemProps> = ({ children, submenu, onClick }) => {
    const [hover, toggleHover] = useState<boolean>(false)

    return (
        <li
            className="relative w-full"
            onMouseOver={() => toggleHover(true)}
            onMouseOut={() => toggleHover(false)}
        >
            <button
                className="w-full flex items-center justify-between p-1 pl-4 text-left hover:bg-base-400 hover:border-l-4 border-base-200 rounded"
                onClick={() => onClick && onClick}
            >
                {children}
                {submenu && submenu.length && <Chevron size={8} />}
            </button>

            {hover && (
                <ul
                    className="absolute z-50 w-32 ml-32 top-0 bg-base-500 rounded"
                >
                    {submenu}
                </ul>
            )}
        </li>
    )
}

export default NodeContextMenu
