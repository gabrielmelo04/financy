import { gql } from "@apollo/client";

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($categoryId: String!, $data: UpdateCategoryInput!) {
    updateCategory(id: $categoryId, data: $data) {
      id
      name
      description
      icon
      color
    }
  }
`;
