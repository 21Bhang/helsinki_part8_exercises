import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import { ME } from './queries'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  const client = useApolloClient()
  const result = useQuery(ME, {
    skip: !token,
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    )
  }

  const favoriteGenre = result.data?.me?.favoriteGenre

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={onLogout}>logout</button>
      </div>

      {page === 'authors' && <Authors />}
      {page === 'books' && <Books favoriteGenre={favoriteGenre} />}
      {page === 'add' && <NewBook />}
    </div>
  )
}

export default App