import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { client, loggedInUser }) => {
        let room = null;

        if (userId) {
          const user = await client.user.findUnique({
            where: { id: userId },
            select: { id: true },
          });

          if (!user) {
            return {
              status: false,
              error: "This user does not exist.",
            };
          }

          room = await client.room.create({
            data: {
              users: {
                connect: [{ id: userId }, { id: loggedInUser.id }],
              },
            },
          });
        } else if (roomId) {
          room = await client.room.findUnique({
            where: { id: roomId },
            select: { id: true },
          });

          if (!room) {
            return {
              status: false,
              error: "Room is not found.",
            };
          }
        }

        const message = await client.message.create({
          data: {
            payload,
            room: {
              connect: { id: room.id },
            },
            user: {
              connect: { id: loggedInUser.id },
            },
          },
        });

        pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });

        return {
          status: true,
        };
      }
    ),
  },
};
