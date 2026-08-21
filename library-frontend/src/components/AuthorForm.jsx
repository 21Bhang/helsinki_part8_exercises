import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const AuthorForm = ({ authors, setError }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.message)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    try {
      await editAuthor({
        variables: { name, setBornTo: parseInt(born) }
      })
      setName('')
      setBorn('')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select name="name" value={name} onChange={({ target }) => setName(target.value)}>
            <option value="">select author</option>
            {authors.map(a => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="born">born</label>
          <input id="born" type="number" value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorForm