import gql from "graphql-tag";

export default gql`
  type Room {
    id: Int!
    unreadTotal: Int!
    users: [User]
    messages: [Message]
    createdAt: String!
    updatedAt: String!
  }
  type Message {
    id: Int!
    payload: String!
    user: User!
    room: Room!
    read: Boolean!
    isMine: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
