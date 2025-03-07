import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { global } from '@storybook/design-system';

import IndexScreen from '../components/screens/IndexScreen/IndexScreen';

const { GlobalStyle } = global;

export default ({ data }) => {
  const {
    latestBlogPosts: { edges },
  } = data;
  const latestBlogPost = edges[0]?.node;

  return (
    <Fragment>
      <GlobalStyle />
      <IndexScreen latestBlogPost={latestBlogPost} />
    </Fragment>
  );
};

// prettier-ignore
export const query = graphql`
  query IndexScreenQuery {
    latestBlogPosts: allGhostPost(
      filter: {
        tags: {
          elemMatch: { slug: { nin: ["data-schema", "hash-preview"] } }
        }
      }
      sort: { order: DESC, fields: [published_at] }
      limit: 1
    ) {
      edges {
        node {
          slug
          title
        }
      }
    }
  }
`;
