import type { NextPage } from 'next'

import { NodeDataConnectionTypes, NodeGroupData, NodeMeta } from "../types/nodes"

import Graph from '../components/Graph'
import NodeBank from '../components/NodeBank'
import NodeGroupList from '../components/NodeGroupList'

const data: NodeMeta[] = [
  {
    id: 0,
    title: "test_node_00",
    position: { x: 40, y: 50 },
    type: NodeDataConnectionTypes.SENDER,
    connections: [
      {
        dataId: 0,
        to: {
          nodeId: 1,
          dataId: 0,
        }
      },
      {
        dataId: 1,
        to: {
          nodeId: 1,
          dataId: 1,
        }
      }
    ],
    data: [
      {
        id: 0,
        title: 'fruit',
        value: 'banana',
      },
      {
        id: 1,
        title: 'num',
        value: 5,
      },
    ],
    group: 1,
  },
  {
    id: 1,
    title: "test_node_01",
    position: { x: 380, y: 215 },
    type: NodeDataConnectionTypes.CHANNEL,
    connections: [
      {
        dataId: 1,
        to: {
          nodeId: 3,
          dataId: 0,
        }
      }
    ],
    data: [
      {
        id: 0,
        title: 'fruit',
        value: '',
      },
      {
        id: 1,
        title: 'num',
        value: 0,
      },
    ],
    group: 0,
  },
  {
    id: 2,
    title: "test_node_02",
    position: { x: 40, y: 350 },
    type: NodeDataConnectionTypes.SENDER,
    connections: [
      {
        dataId: 0,
        to: {
          nodeId: 1,
          dataId: 0,
        }
      },
      {
        dataId: 1,
        to: {
          nodeId: 1,
          dataId: 1,
        }
      }
    ],
    data: [
      {
        id: 0,
        title: 'fruit',
        value: 'apple',
      },
      {
        id: 1,
        title: 'num',
        value: 8,
      },
    ],
    group: 0,
  },
  {
    id: 3,
    title: "test_node_03",
    position: { x: 690, y: 250 },
    type: NodeDataConnectionTypes.CHANNEL,
    connections: [
      {
        dataId: 0,
        to: {
          nodeId: 4,
          dataId: 0,
        }
      },
      {
        dataId: 0,
        to: {
          nodeId: 5,
          dataId: 0,
        }
      },
    ],
    data: [
      {
        id: 0,
        title: 'num',
        value: 5,
      },
    ],
    group: 2,
  },
  {
    id: 4,
    title: "test_node_04",
    position: { x: 960, y: 75 },
    type: NodeDataConnectionTypes.RECEIVER,
    connections: [],
    data: [
      {
        id: 0,
        title: 'num',
        value: 0,
      },
    ],
    group: 0,
  },
  {
    id: 5,
    title: "test_node_05",
    position: { x: 960, y: 415 },
    type: NodeDataConnectionTypes.RECEIVER,
    connections: [],
    data: [
      {
        id: 0,
        title: 'num',
        value: 2,
      },
    ],
    group: 0,
  },
]

const groups: NodeGroupData[] = [
  {
    id: 0,
    title: "Group 00",
    color: '#47a5d3',
  },
  {
    id: 1,
    title: "Group 01",
    color: '#aa44dd',
  },
  {
    id: 2,
    title: "Group 02",
    color: '#54ba08',
  },
]

const Home: NextPage = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className='flex items-center justify-between w-full p-2 bg-black text-white'>
        <h1>Shader Node Editor v.0.1.0</h1>
        <span>by Benjamin Trosch</span>
      </div>

      <div className='w-full h-full flex items-center justify-center bg-black text-base-100'>
        <div className='flex flex-col gap-4 h-full w-96 text-lg p-2'>
          <NodeBank />
          <NodeGroupList
            data={groups}
            nodes={data}
            className='h-96'
          />
        </div>

        <Graph
          data={data}
          groups={groups}
        />
      </div>
    </div>
  )
}

export default Home
