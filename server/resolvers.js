const resolvers = {
  // Upload: GraphQLUpload,
  Mutation: {
    // signUp: async (_, args, { dataSources }) =>
    //   dataSources.userApi.signUp(args),
    signIn: async (_, args, { dataSources, res }) =>
      dataSources.sessionApi.signIn(args, res),
    verifyEmail: async (_, args, { dataSources }) =>
      dataSources.userApi.verifyEmail(args),
    createSemester: (_, args, { dataSources, found }) =>
      dataSources.semesterApi.createSemester(args, found),
    createUnit: async (_, args, { dataSources, found }) =>
      dataSources.unitsApi.createUnit(args, found),
    uploadFilesToExistingUnit: async (_,args,{dataSources,found}) =>dataSources.unitsApi.uploadFilesToExistingUnit(args,found),
    studentSignUp: async (_,args,{dataSources,res}) => dataSources.sessionApi.studentSignUp(args,res),
    logOut: (_,__,{dataSources, res})=>dataSources.sessionApi.logOut(res),
    createRoom: (_,args,{ dataSources, found})=> dataSources.roomApi.createRoom(args,found),
    addMessages: (_,args,{dataSources,found})=>dataSources.roomApi.addMessages(args,found),
  },
  Query: {
    getAllSemesters: (_, args, { dataSources, found }) =>
      dataSources.semesterApi.getAllSemesters(args, found),
    getAllUnits: (_, args, { dataSources, found }) =>
      dataSources.unitsApi.getAllUnits(args,found),
    fetchFilesForSpecificUnit: (_, args, {dataSources, found}) => dataSources.unitsApi.fetchFilesForSpecificUnit(args,found),
    fetchStudentDetailsAndFilesForRegisteredSemester: (_,args,{dataSources,found}) => dataSources.unitsApi.fetchStudentDetailsAndFilesForRegisteredSemester(args,found),
    fetchMessages: (_,args,{dataSources,found})=>dataSources.roomApi.fetchMessages(args,found),
  },
};

export default resolvers;
