import { gql } from 'graphql-tag';

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      description
      createdAt
      creator {
        id
        username
      }
      memberships {
        id
        userId
      }
    }
  }
`;

export const SEARCH_ROOMS = gql`
  query SearchRooms($name: String!) {
    searchRooms(name: $name) {
      id
      name
      description
      createdAt
      creator {
        id
        username
      }
      memberships {
        id
        userId
      }
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($name: String!, $description: String) {
    createRoom(name: $name, description: $description) {
      id
      name
      description
      createdAt
      creator {
        id
        username
      }
      memberships {
        id
        userId
      }
    }
  }
`;

export const JOIN_ROOM = gql`
  mutation JoinRoom($roomId: String!) {
    joinRoom(roomId: $roomId) {
      id
      roomId
      userId
    }
  }
`;

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($roomId: String!, $name: String, $description: String) {
    updateRoom(roomId: $roomId, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;