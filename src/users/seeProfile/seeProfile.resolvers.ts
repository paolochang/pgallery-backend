import { Resolvers } from "../../types";

export default {
  Query: {
    seeProfile: (_, { username }, { client }) =>
      client.user.findUnique({
        where: { username },
        include: {
          following: true,
          followers: true,
        },
      }),
  },
};
