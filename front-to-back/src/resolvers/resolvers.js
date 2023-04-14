import queryResolvers from "./query.js";
import mutationResolvers from "./mutations.js";
import subscriptionsResolvers from "./subscriptions.js";
import fieldResolvers from "./fields.js";

const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Subscription: subscriptionsResolvers,
  ...fieldResolvers,
};

export default resolvers;
