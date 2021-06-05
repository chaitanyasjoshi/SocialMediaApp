const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');
const likeResolvers = require('./likes');

module.exports = {
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
