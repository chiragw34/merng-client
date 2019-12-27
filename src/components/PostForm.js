import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const [errors, setErrors] = useState({});
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ""
  });

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      const new_post = result.data.createPost;
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [new_post, ...data.getPosts] }
      });
      values.body = "";
      setErrors({});
    },
    onError(err) {
      setErrors(err.graphQLErrors[0]);
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <div className='post-form'>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Share your thoughts..."
            name="body"
            onChange={onChange}
            value={values.body}
            error={errors.message ? true : false}
          />
          <Button type="submit" color="blue" floated='right'>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message" style={{marginBottom:20}}>
          {errors.message}
        </div>
      )}
    </div>
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
      likeCount
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
