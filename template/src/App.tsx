import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from 'antd'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='bg-red-100 flex flex-col items-center justify-center'>
        <h1>HIHI</h1>

      </div>
      <Button color='green' variant='solid'>Button</Button>
    </>
  )
}

export default App
