import { gql } from "@apollo/client";

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
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
