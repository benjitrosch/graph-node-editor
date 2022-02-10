import { FC, useEffect, useState } from "react"
import { SketchPicker } from 'react-color'

import { Position } from "../types/bounds"
import { NodeGroupData } from "../types/nodes"

import Chevron from "./icons/Chevron"

type Props = {
    id: number
    title: string
    color: string
    nodes: {
        title: string, 
        position: Position,
    }[]
    selected: boolean
    updateGroupData: (data: NodeGroupData) => void
    setSelectedGroups: () => void
    focusNode: (position: Position) => void
}

const NodeGroup: FC<Props> = ({
    id,
    title,
    color,
    nodes,
    selected,
    updateGroupData,
    setSelectedGroups,
    focusNode,
}) => {
    const [newColor, setNewColor] = useState<string>(color)
    const [showColors, toggleShowColors] = useState<boolean>(false)

    const [expanded, toggleExpanded] = useState<boolean>(false)

    useEffect(() => {
        if (newColor !== color) {
            updateGroupData({ id, title, color: newColor })
        }
    }, [color, id, newColor, title, updateGroupData])

    return (
        <div
            className="w-full bg-base-400 rounded"
        >
            <div
                className="node-group flex items-center justify-between w-full p-2"
                onClick={(e) => {
                    e.stopPropagation()
                    toggleExpanded(!expanded)
                }}
            >
                <div className="relative flex items-center gap-2">
                    {showColors && (
                        <>
                            <div
                                className="fixed w-screen h-screen top-0 left-0 z-30"
                                onClick={() => toggleShowColors(false)}
                            />
                            <div className="absolute top-0 my-8 z-50">
                                <SketchPicker
                                    color={newColor}
                                    presetColors={[]}
                                    onChange={(e) => setNewColor(e.hex)}
                                />
                            </div>
                        </>
                    )}
                    
                    <button
                        className={`bevel ${selected && 'selected'} flex items-center justify-center w-6 h-6 p-1 rounded-sm`}
                        onClick={setSelectedGroups}
                    >
                        {selected ? (
                            <input
                                type="checkbox"
                                checked={selected}
                                className="w-full h-full accent-[#13ae47]"
                            />
                        ) : (
                            <div className={`w-full h-full border-2 border-base-200 rounded-sm`}/>
                        )}
                    </button>

                    <button
                        className="w-4 h-4 border-2 border-gray-300 hover:border-white rounded-sm"
                        style={{
                            background: color,
                        }}
                        onClick={() => toggleShowColors(true)}
                    />

                    <span
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                    >
                        {title}
                    </span>
                </div>

                <Chevron
                    style={{
                        transform: `rotate(${expanded ? 90 : 0}deg)`,
                    }}
                />
            </div>

            {expanded && (
                <ul className="bg-base-500 text-sm">
                    {nodes.map((node, i) => {
                        return (
                            <li
                                key={`group_${id}_node_#${i}`}
                                className="px-2 hover:bg-base-300"
                            >
                                <button
                                    className="w-full text-left"
                                    onClick={() => focusNode(node.position)}
                                >
                                    {node.title}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}

            <style jsx>{`
                .node-group:hover > div > .bevel, .selected {
                    background-color: #353535;  
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                }

                .node-group:hover > div > .bevel > div {
                    border-color: white;
                }

                // input[type=checkbox] {
                //     accent-color: red;
                // }
            `}</style>
        </div>
    )
}

export default NodeGroup