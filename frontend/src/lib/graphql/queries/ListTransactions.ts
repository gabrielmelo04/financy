import { gql } from "@apollo/client";

export const LIST_TRANSACTIONS_QUERY = gql`
  query ListTransactions {
    listTransactions {
      id
      title
      type
      amount
      date
      createdAt
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
