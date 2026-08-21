const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        query.author = author._id
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author, born: null })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error: error.message }
          })
        }
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
        await book.populate('author')
        return book
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error: error.message }
        })
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      try {
        await author.save()
        return author
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error: error.message }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error: error.message }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('login failed', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    }
  },
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root._id })
    }
  },
  Book: {
    author: async (root) => {
      if (root.author && typeof root.author === 'object' && root.author.name) {
        return root.author
      }
      return await Author.findById(root.author)
    }
  }
}

module.exports = resolvers