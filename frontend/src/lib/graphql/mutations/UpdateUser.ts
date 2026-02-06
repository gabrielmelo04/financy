import { gql } from '@apollo/client';

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($name: String!) {
    updateUser(name: $name) {
      id
      name
    }
  }
`;