import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = ({ favoriteGenre }) => {
  const [genre, setGenre] = useState(favoriteGenre || 'all genres')

  useEffect(() => {
    if (favoriteGenre) {
      setGenre(favoriteGenre)
    }
  }, [favoriteGenre])

  // Query for all books (to get all genres)
  const allBooksResult = useQuery(ALL_BOOKS)
  // Query for filtered books (only if genre is selected)
  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre: genre === 'all genres' ? null : genre },
    skip: genre === 'all genres',
  })

  if (allBooksResult.loading) {
    return <div>loading...</div>
  }

  const allBooks = allBooksResult.data.allBooks
  const allGenres = Array.from(new Set(allBooks.flatMap((b) => b.genres)))

  const books = genre === 'all genres'
    ? allBooks
    : filteredResult.data?.allBooks

  if (genre !== 'all genres' && filteredResult.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setGenre('all genres')}>all genres</button>
        {allGenres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books