const resolvers = {
    Mutation:{
        signUp:async (_,args,{dataSources})=>dataSources.userApi.signUp(args),
        signIn:async (_,args,{dataSources,res})=>dataSources.sessionApi.signIn(args,res),
        verifyEmail:async(_,args,{dataSources})=>dataSources.userApi.verifyEmail(args),
        createSemester:(_,args,{dataSources,found})=>dataSources.semesterApi.createSemester(args,found),
    },
    Query:{
        simpleQuery:async (_,__,{dataSources,req})=>dataSources.userApi.simp(req),
        getAllSemesters:(_,args,{dataSources,found})=>dataSources.semesterApi.getAllSemesters(args,found),
    }
}

export default resolvers;
