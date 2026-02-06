import { gql } from "@apollo/client";

export const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id)
  }
`;
