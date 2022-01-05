const resolvers = {
  // Upload: GraphQLUpload,
  Mutation: {
    signUp: async (_, args, { dataSources }) =>
      dataSources.userApi.signUp(args),
    signIn: async (_, args, { dataSources, res }) =>
      dataSources.sessionApi.signIn(args, res),
    verifyEmail: async (_, args, { dataSources }) =>
      dataSources.userApi.verifyEmail(args),
    createSemester: (_, args, { dataSources, found }) =>
      dataSources.semesterApi.createSemester(args, found),
    createUnit: async (_, args, { dataSources, found }) =>
      dataSources.unitsApi.createUnit(args, found),
  },
  Query: {
    getAllSemesters: (_, args, { dataSources, found }) =>
      dataSources.semesterApi.getAllSemesters(args, found),
    getAllUnits: (_, args, { dataSources }) =>
      dataSources.unitsApi.getAllUnits(args),
  },
};

export default resolvers;
