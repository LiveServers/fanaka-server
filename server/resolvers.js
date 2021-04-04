const resolvers = {
    Mutation:{
        studentSignUp:async (_,args,{dataSources})=>dataSources.studentsApi.signUp(args),
        signIn:async (_,args,{dataSources})=>dataSources.sessionApi.signIn(args),
    },
    Query:{
        simpleQuery:async (_,__,{dataSources,req})=>dataSources.studentsApi.simp(req)
    }
}

export default resolvers;
