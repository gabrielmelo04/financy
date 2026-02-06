import { gql } from "@apollo/client";

export const LIST_CATEGORIES_QUERY = gql`
  query ListCategories {
    listCategories {
      id
      name
      description
      icon
      color
      transactionCount
      createdAt
      updatedAt
    }
  }
`;
