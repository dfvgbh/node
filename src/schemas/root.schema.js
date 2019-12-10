const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} = require('graphql');
const { ObjectID } = require('mongodb');
const {
  manager
} = require('../mongo');

const ProductType = new GraphQLObjectType({
  name: 'ProductType',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLInt },
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    product: {
      type: ProductType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, { _id }) {
        return manager.connection.findOne({ '_id': ObjectID(_id)});
      },
    },
    products: {
      type: GraphQLList(ProductType),
      resolve(parent, args) {
        return manager.connection.find().toArray();
      }
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProduct: {
      type: ProductType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLInt },
      },
      async resolve(parent, { name, description, price }) {
        return (await manager.connection.insertOne({
          name,
          description,
          price
        })).ops[0];
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
