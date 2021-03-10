const { buildSchema } = require("graphql");

const graphqlSchema = buildSchema(`
        type User {
            _id: ID
            email: String
            firstName: String
            lastName: String
            message: String
            createdAt: String
        }

        input SignupInput {
            email: String!
            password: String!
            firstName: String!
            lastName: String!
        }

        type AuthData {
            userId:ID
            token: String
            tokenExpiration: Int
            message: String
        }

        type RootQuery {
            allUsers: [User!]!
            getUser(id:ID!):User
            isLoggedIn(token: String!): AuthData!
            someUsers(page:Int!,limit:Int!):[User!]!
            login(email: String!,password: String!): AuthData! 
        }

        type RootMutation {
            signup(data: SignupInput!): User!
        }
        
        schema {
            query: RootQuery,
            mutation:RootMutation
        }
    `);

exports.graphqlSchema = graphqlSchema;
