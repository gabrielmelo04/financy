import { gql } from "@apollo/client";

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      id
      name
      icon
      color
      description
    }
  }
`;
