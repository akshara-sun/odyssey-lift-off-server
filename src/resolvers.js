// This file contains the resolvers for our GraphQL schema.
// Resolvers are functions that are responsible for populating the data for a single field in your schema.
// They can retrieve or calculate data and return an object in a format that matches the schema field's type. They can also return a promise that resolves to the data.

const resolvers = {
  Query: {
    // returns an array of Tracks that will be used to populate the homepage grid of our web client
    tracksForHome: (_, __, { dataSources }) => {
      return dataSources.trackAPI.getTracksForHome();
    },

    // get a single track by ID, for the track page
    track: (_, { id }, { dataSources }) => {
      return dataSources.trackAPI.getTrack(id);
    },

    // get a single module by ID, for the module detail page
    module: (_, { id }, { dataSources }) => {
      return dataSources.trackAPI.getModule(id);
    },
  },

  /* 
  Mutation to increment num views of a specific track

  We are not immediately returning the updated track because the schema is expecting three additional properties: code, success, and message.
  In order to include these properties, we need to update our data source to return an object that includes these properties.
  
  Mutation: {
    incrementTrackViews: (__, { id }, { dataSources }) => {
      return dataSources.trackAPI.incrementTrackViews(id);
    },
  },

  */

  Mutation: {
    incrementTrackViews: async (_, { id }, { dataSources }) => {
      try {
        const track = await dataSources.trackAPI.incrementTrackViews(id);
        return {
          code: 200,
          success: true,
          message: `Successfully incremented number of views for track ${id}`,
          track,
        };
      } catch (err) {
        return {
          code: err.extensions.response.status, // Apollo server has an extensions property that contains the response object from the REST API, which contains the status code.
          success: false,
          message: err.extensions.response.body,
          track: null, // setting this to null because the object wasn't successfully updated/modifed
        };
      }
    },
  },
  Track: {
    author: ({ authorId }, _, { dataSources }) => {
      return dataSources.trackAPI.getAuthor(authorId);
    },

    modules: ({ id }, _, { dataSources }) => {
      return dataSources.trackAPI.getTrackModules(id);
    },

    durationInSeconds: ({ length }) => length,
  },

  Module: {
    durationInSeconds: ({ length }) => length,
  },
};

module.exports = resolvers;

/* RESOLVER PARAMETERS
A resolver function populates the data for a FIELD in your schema. 
The function has four parameters. 
The first, PARENT, contains the returned data of the previous function in the resolver chain. 
The second, ARGS, is an object that contains all the arguments provided to the field.
We use the third parameter, CONTEXT, to access DATA SOURCES such as a database or REST API. 
Finally, the fourth parameter, INFO, contains informational properties about the operation state.
*/

/* RESOLVER CHAINING
When we write a query, we often have nested objects and fields.
For example, when we query for a track, we want to get the author of that track. We could have included the author's information in the track query but that would result in us getting author info in situations where we would only need track info. This results in the resolver being overworked because we are requesting information we may not need all the time. In order to make things more efficient, we created a separate resolver function for fetching author info.
The author resolver function is called when the author field is requested in the previous resolver function. This is called resolver chaining.
We can access the authorId field from the parent resolver function by using the first argument of the resolver function. The parent resolver function is the resolver function that is called before the current resolver function. In this case, the parent resolver function is the track resolver function.
*/
