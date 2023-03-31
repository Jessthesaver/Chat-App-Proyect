import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import {createClient} from 'graphql-ws';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {getMainDefinition} from '@apollo/client/utilities';

const SERVER_URI = "/graphql";
const WS_URL = `ws://localHost:3000/graphql`;


const httpLink=  new HttpLink({
    uri: SERVER_URI,
    credentials:'same-origin'
})

const wsLink = new GraphQLWsLink( createClient({
    url: WS_URL,
    connectionParams:{
        credentials:'same-origin'
    }
}))

const spitLink = split(({query})=>{
    const definition=getMainDefinition(query)
    return (definition.kind==='OperationDefinition' && definition.operation === 'subscription')
}, wsLink, httpLink)

const client = new ApolloClient({
    link: spitLink,
    cache: new InMemoryCache({
        addTypename: false
    }),
});

export default client;