import type { AppProps } from 'next/app'

import { NodeDataConnectionTypes, NodeGroupData, NodeMeta } from "../types/nodes"

import GraphContext from '../context/GraphContext'

import '../styles/globals.css'

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GraphContext data={data} groupData={groups}>
      <Component {...pageProps} />
    </GraphContext>
  )
}

export default MyApp
