import React from 'react';
import { Form } from 'semantic-ui-react';

import { useForm } from '../utils/hooks';

export default function PostForm() {
  return (
    <Form onSubmit={onSubmit}>
      <h2>Create Post:</h2>
      <Form.Field>
        <Form.Input placeholder='Hi World!' />
      </Form.Field>
    </Form>
  );
}
