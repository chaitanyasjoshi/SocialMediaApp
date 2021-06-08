import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useContext, useRef, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
} from 'semantic-ui-react';
import DeleteButton from '../components/DeleteButton';
import LikeButton from '../components/LikeButton';

import { AuthContext } from '../context/auth';

export default function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    props.history.push('/');
  }

  if (loading) {
    return <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      commentsCount,
      likes,
      likesCount,
    } = data.getPost;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size='small'
              float='right'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likesCount, likes }} />
                <Button
                  as='div'
                  labelPosition='right'
                  onClick={() => console.log('Comment on post')}
                >
                  <Button basic color='blue'>
                    <Icon name='comments' />
                  </Button>
                  <Label basic color='blue' pointing='left'>
                    {commentsCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='Comment..'
                        name='comment'
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type='submit'
                        className='ui button teal'
                        disabled={comment.trim() === ''}
                        onClick={createComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likesCount
      likes {
        username
      }
      commentsCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentsCount
    }
  }
`;
