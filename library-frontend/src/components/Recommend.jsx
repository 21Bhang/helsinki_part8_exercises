import { useState } from 'react'

const Recommend = ({ books, favoriteGenre }) => {
  const [genre, setGenre] = useState('')
  const genres = [...new Set(books.flatMap(b => b.genres))]

  let displayedBooks = books
  if (favoriteGenre) {
    displayedBooks = books.filter(b => b.genres.includes(favoriteGenre))
  } else if (genre) {
    displayedBooks = books.filter(b => b.genres.includes(genre))
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre: {favoriteGenre || 'none'}</p>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {displayedBooks.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setGenre('')}>all genres</button>
        {genres.map(g => (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
      </div>
    </div>
  )
}

export default Recommend