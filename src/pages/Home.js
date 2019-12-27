import React, { useContext } from "react";
import { Loader, Grid, Transition } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  let posts = "";

  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  if (data) {
    posts = { data: data.getPosts };
  }

  return (
    <div>
      <Grid columns={3}>
        {user && (
          <Grid.Row>
            <Grid.Column className="post-form-col">
              <PostForm />
            </Grid.Column>
          </Grid.Row>
        )}

        <Grid.Row className="page-title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {loading ? (
            // <h1 className='loading-text'>LOADING POSTS...</h1>
            <Loader active inline="centered" size="big">Fetching posts...</Loader>
          ) : (
            <Transition.Group>
              {posts.data &&
                posts.data.map(post => (
                  <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Home;
