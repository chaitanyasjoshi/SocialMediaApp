import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_POST_QUERY } from '../utils/graphql';

export default function DeleteButton({ postId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY,
      });
      const newData = data.getPosts.filter((p) => p.id !== postId);
      proxy.writeQuery({
        query: FETCH_POST_QUERY,
        data: {
          getPosts: {
            newData,
          },
        },
      });
      if (callback) callback();
    },
    variables: {
      postId,
    },
  });

  return (
    <React.Fragment>
      <Button
        as='div'
        color='red'
        floated='right'
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name='trash' style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePost}
      />
    </React.Fragment>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
