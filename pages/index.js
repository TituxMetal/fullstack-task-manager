import { useContext } from 'react'

import { TaskContext } from '../context'
import { Page } from '../components/layout'
import { List, Form } from '../components/tasks'

const Home = () => {
  const { list, loading } = useContext(TaskContext)

  return (
    <Page title='Home page'>
      <h1>Fullstack Task Manager</h1>
      <Form />
      {loading ? <p>Loading data...</p> : list.length > 0 && <List />}
    </Page>
  )
}

export default Home
