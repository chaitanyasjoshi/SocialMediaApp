const checkAuth = require('../../utils/authCheck');
const { UserInputError } = require('apollo-server');

const Post = require('../../models/Post');

module.exports = {
  Mutation: {
    likePost: async (_, { postId }, context) => {
      const user = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        const likeIndex = post.likes.findIndex(
          (l) => l.username === user.username
        );
        if (likeIndex > -1) {
          post.likes.splice(likeIndex, 1);
        } else {
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
  },
};
