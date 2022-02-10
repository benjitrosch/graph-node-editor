import {
    createContext,
    useContext,
    useState,
} from 'react'

import { NodeGroupData, NodeMeta } from '../types/nodes'

interface IGraphContext {
    nodes: NodeMeta[]
    groups: NodeGroupData[]
    setNodes: (nodes: NodeMeta[]) => void
    setGroups: (groups: NodeGroupData[]) => void
}
  
const graphContextDefaultState: IGraphContext = {
    nodes: [],
    groups: [],
    setNodes: (_: NodeMeta[]) => null,
    setGroups: (_: NodeGroupData[]) => null,
}

export const GraphContext = createContext<IGraphContext>(graphContextDefaultState)
export const useGraphContext = (): IGraphContext => {
    return useContext(GraphContext)
}

type Props = {
    data: NodeMeta[]
    groupData: NodeGroupData[]
    children: React.ReactNode
}

const GraphProvider = ({
    data,
    groupData,
    children
}: Props) => {
    const [nodes, setNodes] = useState<NodeMeta[]>(data)
    const [groups, setGroups] = useState<NodeGroupData[]>(groupData)

    const value = {
        nodes,
        groups,
        setNodes,
        setGroups,
    }

    return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
}

export default GraphProvider