import { FC, ReactNode, useState } from "react"

import { Position } from "../types/bounds"

import Chevron from "./icons/Chevron"

type Props = {
    position: Position
}

const GraphContextMenu: FC<Props> = ({
    position,
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
            <GraphContextMenuItem
                submenu={[
                    <GraphContextMenuItem key={1}>Sender</GraphContextMenuItem>,
                    <GraphContextMenuItem key={2}>Channel</GraphContextMenuItem>,
                    <GraphContextMenuItem key={3}>Receiver</GraphContextMenuItem>,
                ]}
            >
                Add Node
            </GraphContextMenuItem>
        </ul>
    )
}

type ItemProps = {
    children: ReactNode
    submenu?: ReactNode[]
    onClick?: () => void
}

const GraphContextMenuItem: FC<ItemProps> = ({ children, submenu, onClick }) => {
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

export default GraphContextMenu
