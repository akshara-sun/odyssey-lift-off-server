// This file is responsible for fetching data from the REST API and returning it to the resolvers.
// An API is a set of functions that allow applications to access data and interact with external software components, operating systems, or microservices.
// In short, APIs connect different software components and allow them to communicate with each other. They act as messengers that transfer data from one software component to another.

const { RESTDataSource } = require("apollo-datasource-rest");

class TrackAPI extends RESTDataSource {
  constructor() {
    super();
    // the Catstronauts catalog is hosted on this server
    this.baseURL = "https://odyssey-lift-off-rest-api.herokuapp.com/";
  }

  getTracksForHome() {
    return this.get("tracks");
  }

  getAuthor(authorId) {
    return this.get(`author/${authorId}`);
  }

  getTrack(trackId) {
    return this.get(`track/${trackId}`);
  }

  getTrackModules(trackId) {
    return this.get(`track/${trackId}/modules`);
  }

  getModule(moduleId) {
    return this.get(`module/${moduleId}`);
  }

  incrementTrackViews(trackId) {
    return this.patch(`track/${trackId}/numberOfViews`);
  }
}

module.exports = TrackAPI;
