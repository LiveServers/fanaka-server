const resolvers = {
    Mutation:{
        signUp:async (_,args,{dataSources})=>dataSources.userApi.signUp(args),
        signIn:async (_,args,{dataSources})=>dataSources.sessionApi.signIn(args),
        verifyEmail:async(_,args,{dataSources})=>dataSources.userApi.verifyEmail(args),
    },
    Query:{
        simpleQuery:async (_,__,{dataSources,req})=>dataSources.userApi.simp(req)
    }
}

export default resolvers;
