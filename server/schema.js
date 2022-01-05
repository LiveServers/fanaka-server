import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum Roles {
    admin
    user
  }
  type Mutation {
    signUp(input: StudentInput!): StudentResult!
    signIn(email: String!, password: String!): StudentResult!
    verifyEmail(token: String!): String!
    createSemester(input: SemesterInput!): SemesterResult!
    createUnit(input: UnitInput!): Result
  }
  type Query {
    getAllSemesters(year: String!): [AllSemestersResults]!
    getAllUnits(semester: String!): [AllUnitsResults]!
  }
  input SemesterInput {
    path: String!
    semester: String!
    year: String!
  }
  input UnitInput {
    semesterId: String!
    year: String!
    unitName: String!
    files: [Upload!]!
  }
  type SemesterResult {
    _id: String!
    year: String!
    semester: String!
    path: String!
  }
  type AllSemestersResults {
    _id: String!
    year: String!
    semester: String!
    path: String!
  }
  input StudentInput {
    email: String!
    password: String!
  }
  type StudentResult {
    status: String
    id: String
    token: String
  }
  type AllUnitsResults {
    author: String!
    year: String!
    unitName: String!
    semester: AllSemestersResults!
    files: [String]
  }
  type UnitCreator {
    name: String
    email: String
    _id: String
  }
  type Result {
    status: Boolean
    message: String
  }
`;
export default typeDefs;
// createUnit(input:UnitInput!):Result
