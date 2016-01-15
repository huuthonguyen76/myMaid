var _graphql = require('graphql');
var GraphQLSchemaLanguage = require('graphql/language');

var schema = new _graphql.GraphQLSchema({
  query: new _graphql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: _graphql.GraphQLString,
        resolve: function resolve() {
          return 'world';
        }
      }
    }
  })
});
console.log(GraphQLSchemaLanguage.parseSchemaIntoAST(schema));
var query = '{ hello }';

_graphql.graphql(schema, query)
  .then(function (result) {

  // Prints
  // {
  //   data: { hello: "world" }
  // }
  console.log(result);
});