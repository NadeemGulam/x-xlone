
import type { CodegenConfig } from '@graphql-codegen/cli';

// For the Local Host Setup
// schema: "http://localhost:8000/graphql",
const config: CodegenConfig = {
  overwrite: true,
  schema: "https://d2bwnedkc2tq8a.cloudfront.net/graphql",
  documents: ["**/*.{tsx,ts}", "!node_modules/**/*.{tsx,ts}"],
  generates: {
    "gql/": {
      preset: "client",
      plugins: []
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
