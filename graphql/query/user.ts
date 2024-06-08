import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`#graphql
query verifyUserGoogleTokenQuery($token:String!){
    verifyGoogleToken(token: $token)
}`);

export const getCurrentUserQuery = graphql(`
query  GetCurrentUser{
    getCurrentUser {
    id
    profileImageURL
    email
    firstName
    lastName
    recommendedUsers {
      id
      firstName
      lastName
      profileImageURL
    }
    followers{
      id
      firstName
      lastName
      profileImageURL
    }
    following{
      firstName
      lastName
      profileImageURL
      id
    }
    tweets{
        id
        content
        imageURL
        author {
          id
          profileImageURL
          firstName
          lastName
       }
    }
  }
} 
`);

export const getUserByIdQuery = graphql(`
#graphql
query GetuserById($id: ID!) {
  getUserById(id: $id) {
    id
    firstName
    lastName
    profileImageURL
    followers{
      firstName
      lastName
      profileImageURL
    }
    following{
      firstName
      lastName
      profileImageURL
    }
    tweets {
      content
      id
      imageURL
      author {
        firstName
        lastName
        profileImageURL
      }
    }
  }
}
`)