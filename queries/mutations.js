import { gql } from '@apollo/client';

export const LOGOUT = gql`
  mutation {
    logOut {
      id
    }
  }
`;

export const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    logIn(data: { email: $email, password: $password }) {
      email
    }
  }
`;
export const SIGNUP = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    signUp(data: { name: $name, email: $email, password: $password }) {
      email
    }
  }
`;
