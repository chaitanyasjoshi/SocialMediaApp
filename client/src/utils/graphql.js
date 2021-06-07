import gql from 'graphql-tag';

export const FETCH_POST_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      commentsCount
      likesCount
      likes {
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
