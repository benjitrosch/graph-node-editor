import { CSSProperties, FC, useState } from "react"
import clsx from 'clsx'

import { NodeGroupData, NodeMeta } from "../types/nodes"

import NodeGroup from "./NodeGroup"

type Props = {
    data: NodeGroupData[]
    nodes: NodeMeta[]
    className?: string
    style?: CSSProperties
}

const NodeGroupList: FC<Props> = ({
    data,
    nodes,
    className,
    style
}) => {
    const [groups, setGroups] = useState<NodeGroupData[]>(data)
    const [selectedGroups, setSelectedGroups] = useState<number[]>([])

    const classes = clsx(
        "flex flex-col gap-1",
        className
    )

    const updateGroupData = (id: number, data: NodeGroupData) => {
        const index = groups.findIndex((group) => group.id === id)

        const newGroups = [...groups]
        newGroups.splice(index, 1, data)

        setGroups(newGroups)
    }

    const addNodeGroup = () => {
        const group: NodeGroupData = {
            id: groups.length,
            title: `Group 0${groups.length}`,
            color: '#47a5d3',
        }

        setGroups((g) => g.concat(group))
    }

    return (
        <fieldset
            className="relative w-full h-auto overflow-y-auto p-2 bg-base-600 border border-base-200 rounded select-none"
        >
            <legend>GROUPS</legend>

            <div
                className={classes}
                style={style}
            >
                {groups.map((group, i) => {
                    return (
                        <NodeGroup
                            key={`group_${group.id}_#${i}`}
                            id={group.id}
                            title={group.title}
                            color={group.color}
                            nodes={nodes.filter((n) => n.group === group.id).map((n) => {
                                return {
                                    title: n.title,
                                    position: n.position,
                                }
                            })}
                            selected={selectedGroups.includes(group.id)}
                            updateGroupData={(data: NodeGroupData) => updateGroupData(group.id, data)}
                            setSelectedGroups={() => setSelectedGroups((g) => selectedGroups.includes(group.id) ? g.filter((i) => i !== group.id) : g.concat(group.id))}
                        />
                    )
                })}

                <div
                    className="flex items-center justify-center w-full p-2 hover:bg-base-500 border border-dashed border-base-300 text-base-300 rounded cursor-pointer"
                    onClick={addNodeGroup}
                >
                    +
                </div>
            </div>

            <style jsx>{`
                ::-webkit-scrollbar {
                  width: 4px;
                }
                
                ::-webkit-scrollbar-track {
                  background: transparent;
                }
                
                ::-webkit-scrollbar-thumb {
                  background: #555555;
                  border-radius: 16px;
                }
            `}</style>
        </fieldset>
    )
}

export default NodeGroupList