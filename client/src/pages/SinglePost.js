import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useContext } from 'react';
import { Button, Card, Grid, Icon, Image, Label } from 'semantic-ui-react';
import DeleteButton from '../components/DeleteButton';
import LikeButton from '../components/LikeButton';

import { AuthContext } from '../context/auth';

export default function SinglePost(props) {
  const { user } = useContext(AuthContext);

  const postId = props.match.params.postId;

  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
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
