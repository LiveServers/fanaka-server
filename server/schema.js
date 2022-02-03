import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum Roles {
    admin
    user
  }
  type Mutation {
    studentSignUp(input: StudentInput!): CommonResponse!
    signIn(userName: String!, password: String!): CommonResponse!
    verifyEmail(token: String!): String!
    createSemester(input: SemesterInput!): SemesterResult!
    createUnit(input: UnitInput!): Result
    uploadFilesToExistingUnit(input: UpdateUnits!) : Result
    logOut:CommonResponse
    createRoom(input:RoomInput!):CommonResponse
    addMessages(input:MessageInput!):CommonResponse
  }
  type Query {
    getAllSemesters(year: String!): [AllSemestersResults]!
    getAllUnits(courseCode: String!): [AllUnitsResults]!
    fetchFilesForSpecificUnit(id:String!): FetchFilesResponse!
    fetchStudentDetailsAndFilesForRegisteredSemester(id:String!):StudentDetails!
    fetchMessages(roomName:String!):RoomMessages!
  }
  input MessageInput {
    id:String!
    from:String!
    message:String!
  }
  input RoomInput {
    roomName:String!
    school:String!
    programme:String!
    certificate:String!
    year:String!
    semester:String!
  }
  input UpdateUnits {
    unitName: String! 
    files: [Upload!]!
    unitId: String!
  }
  input SemesterInput {
    path: String!
    semester: String!
    year: String!
  }
  input UnitInput {
    semester: String!
    year: String!
    unitName: String!
    files: [Upload!]!
    school:String
    certification:String!
    programme:String!
    courseCode: String!
  }
  type RoomMessages {
    messages:[Messages!]!
    _id:String!
  }
  type Messages {
    from:String!
    subject:String!
  }
  type StudentDetails {
    result:[Units!]!
    studentDetails:Details!
  }
  type Units {
      files: [String!]!
      fileNames : [String!]!
      unitName:String!
      courseCode:String!
  }
  type Details {
     certification:String!
     currentEnrolledProgramme:String!
     semester:String!
     id:String!
  }
  type FetchFilesResponse{
    fileUrls: [String!]!
    fileNames : [String!]!
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
    certification: String!
    password: String!
    regNo:String!
    userName:String!
    currentEnrolledProgramme:String!
    year:String!
    semester:String!
    school:String!
  }
  type CommonResponse {
    status: String
    id: String
    message:String
    role:String
    userName:String
  }
  type AllUnitsResults {
    unitName: String!
    _id: String!
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
