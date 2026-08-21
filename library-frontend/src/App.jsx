import { useState, useEffect } from 'react'
import { useQuery, useApolloClient } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import Notify from './components/Notify'
import { ALL_BOOKS, ALL_AUTHORS, ME } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token') || null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const meResult = useQuery(ME, { skip: !token })

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) setToken(savedToken)
  }, [])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 10000)
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  if (authorsResult.loading || booksResult.loading || (token && meResult.loading)) {
    return <div>loading...</div>
  }

  if (authorsResult.error || booksResult.error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h3>⚠️ Backend Connection Error</h3>
        <p>Please make sure your backend server is running at localhost:4000</p>
        <pre>{authorsResult.error?.message || booksResult.error?.message}</pre>
      </div>
    )
  }

  const authors = authorsResult.data?.allAuthors || []
  const books = booksResult.data?.allBooks || []
  const favoriteGenre = meResult.data?.me?.favoriteGenre || ''

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={onLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      {page === 'authors' && <Authors authors={authors} setError={notify} token={token} />}
      {page === 'books' && <Books books={books} />}
      {page === 'add' && <BookForm setError={notify} />}
      {page === 'recommend' && <Recommend books={books} favoriteGenre={favoriteGenre} />}
      {page === 'login' && !token && <LoginForm setToken={setToken} setError={notify} />}
    </div>
  )
}

export default App