import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../queries'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS, variables: { genre: null } },
      { query: ALL_AUTHORS },
    ],
    onError: (error) => {
      console.log(error.message)
    },
  })

  const submit = (event) => {
    event.preventDefault()

    if (!title || !author || !published || !genre) return

    addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres: [genre],
      },
    })

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenre('')
  }

  return (
    <div>
      <h2>add book</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">title</label>
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="published">published</label>
          <input
            id="published"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <label htmlFor="genre">genre</label>
          <input
            id="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
        </div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook