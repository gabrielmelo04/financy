import { gql } from "@apollo/client";

export const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction($id: String!, $data: UpdateTransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      id
      title
      type
      amount
      date
      category {
        id
        name
        description
        icon
        color
      }
    }
  }
`;
