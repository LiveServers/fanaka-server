import {gql} from  "apollo-server-express";

const typeDefs = gql `
    enum Roles {
        admin
        user
    }
    type Mutation {
        signUp(input:StudentInput!):StudentResult!
        signIn(email:String!,password:String!):StudentResult!
        verifyEmail(token:String!):String!
    }
    type Query {
        simpleQuery:String
    }
    input StudentInput{
        name:String!
        email:String!
        password:String!
        regNo:String!
        school:String!
        role:Roles!
    }

    type StudentResult {
        status:String
        id:String
        token:String
    }

`
export default typeDefs;