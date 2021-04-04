import {gql} from  "apollo-server-express";

const typeDefs = gql `
    enum Roles {
        admin
        user
    }
    type Mutation {
        studentSignUp(input:StudentInput!):StudentResult!
        signIn(email:String!,password:String!):StudentResult!
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