const { ApolloServer, gql } = require('apollo-server-express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authUser } = require('../utils/authUser');

const typeDefs = gql`
  type User {
    email: String!
  }
  type Authtoken {
    token: String!
  }
  input UserLoginInput {
    email: String!
    password: String!
  }
  type Query {
    users: [User]!
    currentUser: User!
  }
  type Mutation {
    signUp(data: UserLoginInput!): User!
    logIn(data: UserLoginInput!): Authtoken!
    logOut: User
  }
`;

const resolvers = {
  Query: {
    users: (_, __, { req }) => {
      console.log(req.userId);
      return User.find({});
    },
    currentUser: (_, __, { req }) => {
      const { user } = req;
      console.log(user);
      return user;
    },
  },
  Mutation: {
    signUp: async (_, { data: { email, password } }, { req }) => {
      if (!email || !password) {
        throw new Error('You must provide an email and password.');
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email in use');
      }

      const hash = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hash });

      return user.save();
    },
    logIn: async (_, { data: { email, password } }, { req, res }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign(
          { id: user._id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
        );
        return { token };
      } else {
        throw new Error('password does not match');
      }
    },
    logOut: (_, __, { req, res }) => {
      res.setHeader('token', '');
      return null;
    },
  },
};

module.exports = { typeDefs, resolvers };
