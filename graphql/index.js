const { gql, makeExecutableSchema } = require('apollo-server-express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Authtoken {
    token: String!
  }
  input UserLoginInput {
    email: String!
    password: String!
  }
  input UserSignUpInput {
    name: String!
    email: String!
    password: String!
  }
  type Query {
    users: [User]!
    currentUser: User
  }
  type Mutation {
    signUp(data: UserSignUpInput!): User!
    logIn(data: UserLoginInput!): User!
    logOut: User!
  }
`;

const maxAge = 3 * 24 * 60 * 60;

const resolvers = {
  Query: {
    users: () => {
      return User.find({});
    },
    currentUser: (_, __, { req }) => {
      const { user } = req;
      return user;
    },
  },
  Mutation: {
    signUp: async (_, { data: { name, email, password } }, { req, res }) => {
      if (!name || !email || !password) {
        throw new Error('You must provide an email and password.');
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email in use');
      }

      const hash = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hash });

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: maxAge,
        },
      );

      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      return user.save();
    },
    logIn: async (_, { data: { email, password } }, { req, res }) => {
      if (!email || !password) {
        throw new Error('You must provide an email and password.');
      }
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Invalid Credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign(
          { id: user._id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: maxAge,
          },
        );
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        return user;
      } else {
        throw new Error('password does not match');
      }
    },
    logOut: (_, __, { req, res }) => {
      const { user } = req;
      console.log(user);
      res.cookie('jwt', '', { maxAge: 1 });
      return user;
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
