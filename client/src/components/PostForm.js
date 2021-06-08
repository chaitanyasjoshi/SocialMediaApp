import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { Button, Form } from 'semantic-ui-react';

import { useForm } from '../utils/hooks';
import { FETCH_POST_QUERY } from '../utils/graphql';

export default function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY,
      });

      let newData = [...data.getPosts];
      newData = [result.data.createPost, ...newData];
      proxy.writeQuery({
        query: FETCH_POST_QUERY,
        data: {
          ...data,
          getPosts: {
            newData,
          },
        },
      });
      values.body = '';
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <React.Fragment>
      <Form onSubmit={onSubmit}>
        <h2>Create Post:</h2>
        <Form.Field>
          <Form.Input
            placeholder='Hi World!'
            name='body'
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type='submit' color='teal'>
            Post
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className='ui error message' style={{ marginBottom: 20 }}>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </React.Fragment>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likesCount
      comments {
        id
        body
        username
        createdAt
      }
      commentsCount
    }
  }
`;
