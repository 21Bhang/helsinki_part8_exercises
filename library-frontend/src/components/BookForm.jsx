import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const BookForm = ({ setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => setError(error.message)
  })

  const submit = async (event) => {
    event.preventDefault()
    try {
      await addBook({
        variables: { title, author, published: parseInt(published), genres }
      })
      setTitle('')
      setAuthor('')
      setPublished('')
      setGenre('')
      setGenres([])
    } catch (error) {
      setError(error.message)
    }
  }

  const addGenre = () => {
    if (genre.trim() !== '') {
      setGenres(genres.concat(genre.trim()))
      setGenre('')
    }
  }

  return (
    <div>
      <h2>add a book</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">title</label>
          <input id="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input id="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          <label htmlFor="published">published</label>
          <input id="published" type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div>
          <label htmlFor="genre">genre</label>
          <input id="genre" value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button type="button" onClick={addGenre}>add genre</button>
        </div>
        <div style={{ marginTop: '5px', marginBottom: '10px' }}>
          {genres.map(g => <span key={g} style={{ marginRight: '8px' }}>{g}</span>)}
        </div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default BookForm