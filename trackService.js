const turf = require("@turf/turf");
const axios = require('axios');

const buildTrack = async (route = [],  numberOfLocations = 1) => {
  try {

    const response = await axios.get('https://apigateway.malankabn.by/central-system/api/v1/locations/map/points');
    const locations = response.data; 

    if (route?.length && locations?.length) {
      const start = turf.point(route[0], { type: 'start-point' });
      const end = turf.point(route[1], { type: 'end-point' });

      const routeLine = turf.lineString(route);

      const locationsPoints = locations.map(location => turf.point([location.latitude, location.longitude], location));
      
      locationsPoints.sort((a, b) => {
        const distanceA = turf.pointToLineDistance(a, routeLine);
        const distanceB = turf.pointToLineDistance(b, routeLine);
        return distanceA - distanceB;
      });

      const nearestLocations = locationsPoints.slice(0, numberOfLocations);

      const nearestLocation = turf.nearestPoint(start, turf.featureCollection(locationsPoints));

      const center = numberOfLocations === 1 ? [nearestLocation] : nearestLocations;

      const routeWithLocations = turf.featureCollection([start, ...center, end]);

      return {
        routeWithLocations,
        nearestLocations,
        nearestLocation,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = buildTrack;
