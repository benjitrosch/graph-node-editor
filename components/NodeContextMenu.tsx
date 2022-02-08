import { FC, ReactNode } from "react"
import {
    FolderIcon,
    PlusSmIcon,
    MinusSmIcon,
    ClipboardIcon,
    TrashIcon
} from '@heroicons/react/outline'

import { Position } from "../types/bounds"
import { NodeGroupData } from "../types/nodes"

import Chevron from "./icons/Chevron"

type Props = {
    position: Position
    groups: NodeGroupData[]
    expanded: boolean
    toggleExpanded: () => void
    setGroup: (group: number) => void
    cloneNode: () => void
    removeNode: () => void
}

const NodeContextMenu: FC<Props> = ({
    position,
    groups,
    expanded,
    toggleExpanded,
    setGroup,
    cloneNode,
    removeNode,
}) => {
    return (
        <ul
            className="absolute z-50 w-36 top-0 left-0 bg-base-500 rounded"
            style={{
                marginTop: position.y,
                marginLeft: position.x,
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
            }}
        >
            <NodeContextMenuItem
                icon={expanded ? <MinusSmIcon /> : <PlusSmIcon />}
                onClick={toggleExpanded}
            >
                {expanded ? 'Collapse' : 'Expand'}
            </NodeContextMenuItem>

            <NodeContextMenuItem
                icon={<FolderIcon />}
                submenu={groups.map((group) => {
                    return (
                        <li
                            key={group.id}
                            className="w-full p-1"
                        >
                            <button
                                className="w-full p-1 text-sm border-2 border-gray-400 hover:border-white"
                                style={{
                                    color: (parseInt(group.color.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff',
                                    background: group.color,
                                }} 
                                onClick={() => setGroup(group.id)}
                            >
                                {group.title}
                            </button>
                        </li>
                    )
                })}
            >
                Group
            </NodeContextMenuItem>

            <hr className="border-base-300" />

            <NodeContextMenuItem
                icon={<ClipboardIcon />}
                onClick={cloneNode}
            >
                Clone
            </NodeContextMenuItem>

            <hr className="border-base-300" />

            <NodeContextMenuItem
                icon={<TrashIcon />}
                onClick={removeNode}
            >
                Remove
            </NodeContextMenuItem>
        </ul>
    )
}

type ItemProps = {
    children: ReactNode
    icon?: ReactNode
    submenu?: ReactNode[]
    onClick?: () => void
}

const NodeContextMenuItem: FC<ItemProps> = ({ children, icon, submenu, onClick }) => {
    return (
        <li
            className="menu relative w-full"
        >
            <button
                className="w-full flex items-center justify-between p-1 pl-4 text-left hover:bg-base-400 hover:border-l-4 border-base-200 rounded"
                onClick={() => onClick && onClick()}
            >
                <div className="flex items-center gap-2">
                    {icon && <div className="w-4 h-4 m-0 p-0">{icon}</div>}
                    {children}
                </div>

                {submenu && submenu.length && <Chevron size={8} />}
            </button>

            <ul
                className="hidden absolute z-50 w-36 ml-36 top-0 bg-base-500 rounded"
            >
                {submenu}
            </ul>

            <style jsx>{`
                .menu:hover > ul {
                    display: block;
                }
            `}</style>
        </li>
    )
}

export default NodeContextMenu
