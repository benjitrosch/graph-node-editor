import type { NextPage } from 'next'

import Graph from '../components/Graph'
import NodeBank from '../components/NodeBank'
import NodeGroupList from '../components/NodeGroupList'

const Home: NextPage = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className='w-full h-full flex items-center justify-center bg-black text-base-100'>
        <div className='flex flex-col gap-4 h-full w-96 text-lg p-2'>
          <NodeBank />
          <NodeGroupList />
        </div>

        <Graph />
      </div>
    </div>
  )
}

export default Home
