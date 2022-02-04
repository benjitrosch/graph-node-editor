import type { NextPage } from 'next'

import { NodeDataConnectionTypes, NodeMeta } from "../types/nodes"

import Graph from '../components/Graph'

const data: NodeMeta[] = [
  {
    id: 0,
    title: "test_node_00",
    position: { x: 40, y: 50 },
    size: { width: 0, height: 0 },
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
    ]
  },
  {
    id: 1,
    title: "test_node_01",
    position: { x: 380, y: 215 },
    size: { width: 0, height: 0 },
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
        value: [] as string[],
      },
      {
        id: 1,
        title: 'num',
        value: 0,
      },
    ]
  },
  {
    id: 2,
    title: "test_node_02",
    position: { x: 40, y: 350 },
    size: { width: 0, height: 0 },
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
    ]
  },
  {
    id: 3,
    title: "test_node_03",
    position: { x: 690, y: 250 },
    size: { width: 0, height: 0 },
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
    ]
  },
  {
    id: 4,
    title: "test_node_04",
    position: { x: 1075, y: 75 },
    size: { width: 0, height: 0 },
    type: NodeDataConnectionTypes.RECEIVER,
    connections: [],
    data: [
      {
        id: 0,
        title: 'num',
        value: 0,
      },
    ]
  },
  {
    id: 5,
    title: "test_node_05",
    position: { x: 1060, y: 415 },
    size: { width: 0, height: 0 },
    type: NodeDataConnectionTypes.RECEIVER,
    connections: [],
    data: [
      {
        id: 0,
        title: 'num',
        value: 2,
      },
    ]
  },
]

const Home: NextPage = () => {
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center bg-black text-white'>
      <h1 className='text-lg font-bold'>
        Graph Node Editor
      </h1>

      <Graph
        data={data}
        width={1280}
        height={720}
      />

      <p>by Benjamin Trosch</p>
    </div>
  )
}

export default Home
