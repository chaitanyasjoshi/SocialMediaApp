const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');
const likeResolvers = require('./likes');

module.exports = {
  Post: {
    likesCount: async (parent) => parent.likes.length,
    commentsCount: async (parent) => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...postResolvers.Mutation,
    ...userResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...likeResolvers.Mutation,
  },
};
