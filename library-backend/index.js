const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky',
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
    born: null,
  },
  {
    name: 'Sandi Metz',
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
    born: null,
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5b6f6-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2004,
    author: 'Joshua Kerievsky',
    id: 'afa5b6f7-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5b6f8-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5b6f9-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5b6fa-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,

    allBooks: (root, args) => {
      let result = books

      if (args.author) {
        result = result.filter((book) => book.author === args.author)
      }

      if (args.genre) {
        result = result.filter((book) => book.genres.includes(args.genre))
      }

      return result
    },

    allAuthors: () => {
      return authors.map((author) => ({
        ...author,
        bookCount: books.filter((book) => book.author === author.name).length,
      }))
    },
  },

  Mutation: {
    addBook: (root, args) => {
      let author = authors.find((a) => a.name === args.author)

      if (!author) {
        author = {
          name: args.author,
          id: uuid(),
          born: null,
        }

        authors = authors.concat(author)
      }

      const book = {
        ...args,
        id: uuid(),
      }

      books = books.concat(book)
      return book
    },

    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name === args.name)

      if (!author) {
        return null
      }

      const updatedAuthor = {
        ...author,
        born: args.setBornTo,
      }

      authors = authors.map((a) =>
        a.name === args.name ? updatedAuthor : a
      )

      return updatedAuthor
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, { listen: { port: 4000 } }).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})