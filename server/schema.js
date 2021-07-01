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
        createSemester(input:SemesterInput!):SemesterResult!
    }
    type Query {
        simpleQuery:String
        getAllSemesters(year:String!):[AllSemestersResults]!
    }
    input SemesterInput{
        path:String!
        semester:String!
        year:String!
    }
    type SemesterResult{
        _id:String!
        year:String!
        semester:String!
        path:String!
    }
    type AllSemestersResults {
        _id:String!
        year:String!
        semester:String!
        path:String!
    }
    input StudentInput{
        email:String!
        password:String!
    }

    type StudentResult {
        status:String
        id:String
        token:String
    }

`
export default typeDefs;