import type { NextPage } from 'next'

import { NodeData } from "../types/nodes"

import Graph from '../components/Graph'

const data: NodeData[] = [
  {
    id: 0,
    content: <span>sender</span>,
    position: { x: 50, y: 50 },
    size: { width: 0, height: 0 },
    connections: [1]
  },
  {
    id: 1,
    content: <span>receiver</span>,
    position: { x: 500, y: 150 },
    size: { width: 0, height: 0 },
    connections: [],
  },
  {
    id: 2,
    content: <span>sender</span>,
    position: { x: 150, y: 300 },
    size: { width: 0, height: 0 },
    connections: [1],
  },
]

const Home: NextPage = () => {
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
      <h1 className='text-lg font-bold'>
        Graph Node Editor
      </h1>

      <Graph
        data={data}
        width={640}
        height={480}
      />

      <p>by Benjamin Trosch</p>
    </div>
  )
}

export default Home
