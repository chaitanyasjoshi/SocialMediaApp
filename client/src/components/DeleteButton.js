import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_POST_QUERY } from '../utils/graphql';

export default function DeleteButton({ commentId, postId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
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
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <React.Fragment>
      <Popup
        inverted
        content={`${commentId ? 'Delete comment' : 'Delete post'}`}
        trigger={
          <Button
            as='div'
            color='red'
            floated='right'
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name='trash' style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </React.Fragment>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentsCount
    }
  }
`;
