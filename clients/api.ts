import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== 'undefined';
const token = isClient ? window.localStorage.getItem("__Twitter_token") : '';

export const graphqlClient = new GraphQLClient('http://localhost:8000/graphql', {
    headers: {
        Authorization: token ? `Bearer ${token}` : ""
    }
});