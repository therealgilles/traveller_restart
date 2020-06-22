// controller for all Google API requests
// api guide https://developers.google.com/maps/documentation/javascript/places#place_search_requests
// keyword guide https://developers.google.com/places/supported_types

import { create } from 'apisauce'
import Secrets from 'react-native-config'
import pThrottle from 'p-throttle'

// 1609 meters = 1 mile
// 4827 meters = 3 miles

const debug = __DEV__ && false // set to true to enable log messages for debug

const key = process.env.GOOGLE_KEY || Secrets.GOOGLE_KEY
const serverUrl = 'https://maps.googleapis.com/maps/api'
const api = create({ baseURL: serverUrl })

const nearbySearchUrl = '/place/nearbysearch/json'
// const radarUrl = '/place/radarsearch/json' - deprecated
const detailsUrl = '/place/details/json'
const distanceUrl = '/distancematrix/json'

// //how to use google places nearby search *unused*
// const getData = (place, lat, long) => {
//   lat = lat || 37.7825177
//   long = long || -122.4106772
//   return api.get(`${nearbySearchUrl}?radius=1609&type=${place}&location=${lat},${long}&key=${key}`) // FIXME: radius hardcoded
//     .then(resp => resp.data)
//     .catch(error => { if (debug) console.tron.error(error) })
// }

//how to use google radar search
const getRadarData = (place, lat, long, radius) => {
  return api.get(`${nearbySearchUrl}?rankby=distance&location=${lat},${long}&type=${place}&key=${key}`)
    .then(resp => resp.data)
    .catch(error => { if (debug) console.tron.error(error) })
}

// converting client mode of transportation query to match google api requirements
const modeKeys = {
  car: 'driving',
  bike: 'cycling',
  walk: 'walking',
  transit: 'transit',
}

// //google place detail search *unused*
// const getDetailData = (req, res, placeID) =>{
//   let placeInfo = {}
//   return api.get(`${detailsUrl}?placeid=${placeID}&key=${key}`)
//     .then(resp => {
//       placeInfo = {
//         name: resp.data.result.name,
//         url: resp.data.result.url,
//       }
//       return res.status(200).json(placeInfo)
//     })
//     .catch(error => error(error))
// }

// Google distance matrix throttler to avoid rate limiting (4 requests/second)
const throttledDistanceAPI = pThrottle(api.get, 4, 1000)

//google distance matrix api
const getDistanceData = (arrayOfPlaces, lat, long, mode) => {
  let destinationString = 'place_id:'

  for (let i = 0; i < arrayOfPlaces.length; i++) {
    destinationString += arrayOfPlaces[i].id;
    if (i !== arrayOfPlaces.length - 1 ) {
      destinationString += '|place_id:'
    }
  }

  return throttledDistanceAPI(`${distanceUrl}?units=imperial&origins=${lat},${long}&destinations=${destinationString}&key=${key}&mode=${mode}&departure_time=now`)
    .then(resp => resp.data)
    .catch(error => console.tron.error(error))
}

// google api handler, chains radar and distance matrix results
export const getGoogleData = (req, keyword) => {
  lat = req.query.lat || 37.7825177
  long = req.query.long || -122.4106772
  radius = req.query.radius || 50000
  mode = modeKeys[req.query.mode] || 'transit'
  date = req.query.date || 'now'
  size = req.query.size || 200
  let radarResults = []
  const divider = 25

  //grab ids from radar search    
  return getRadarData(keyword, lat, long, radius)
  .then(data => {
    if (!data.results.length) {
      if (debug) console.tron.error(`No google places data found for ${keyword}`);
      return
    }
    data.results.forEach(place => {
      //radar search gives us place_id, which we use in the distance matrix
      // results array, each array element is a place
      //  [ 
      //   { id: 
      //     place_id:  *we use this in the distance matrix*
      //     reference: 
      //     geometry:{ location:{lat: long:} }  *we grab location as our coordinates*
      //   } 
      //  ]
      radarResults.push({
        name: place.name,
        id: place.place_id,
        coordinates: place.geometry.location //should we call it location? what does the client want
      })
    })
    radarResults = radarResults.splice(0, size)
    return radarResults
  }) //take radar results and throttle them into distance matrix api
  .then(results => {  
    return Promise.all(
      //break up the radar array into groups of 25, then call api
      [...Array(Math.ceil(results.length / divider))].map((v, index) => {
        const values = results.slice(index * divider, (index + 1) * divider)
        return getDistanceData(values, lat, long, mode)
          .then(data => data)
          .catch(error => {
            throw new Error(error)
          })
      })
    )
    .then(dataArray => {
      let finalResults = []
      // dataArray, each element of dataArray is one of the returned promises
      //  [ 
      //   { 
      //     destination_addresses: [ *array of addresses*] 
      //     origin_address: [ *our origin point, only one element in this array UNNEEDED*] 
      //     rows: [ *there is only one 'row', row[0]*
      //            elements: [   *there is an element which corresponds to each of the destination_addresses*
      //              {
      //               distance: { text: value:}
      //               duration: { text: value:}
      //               fare:{value:}
      //               status:
      //              }
      //            ]
      //           ] 
      //   } 
      //  ]
      let googleStuff = [].concat(...dataArray)
      let index = 0
      googleStuff.map((distanceResult, distanceResultIndex) => {
        if (debug) console.tron.log('distance result ', distanceResult)
        distanceResult.destination_addresses.map((destinationAddress, destinationAddressIndex) => {
          if (debug) console.tron.log('destinationaddress ', destinationAddress)
          const element = distanceResult.rows[0].elements[destinationAddressIndex]
          if (debug) console.tron.log('element ', element)
          if (element.status !== 'ZERO_RESULTS') {
            finalResults.push({
              name: results[index].name, // destinationAddress
              // time: distanceResult.rows[0].elements[destination_addressIndex].duration.text,
              time: element.duration.text,
              location: radarResults[index].coordinates,
              distance: element.distance.text,
              'metric distance': element.distance.value,
            })
            index++
          }
        })
      })
      if (debug) console.tron.log('finalResults', finalResults)
      if (debug) console.tron.log(finalResults.length)
      // client get an an array of the following place objects
      // {
      //   'name': *from destination_addresses 
      //   'time': *duration.text
      //   'location': *finalResults.coordinates
      //   'distance': *distance.text
      //   'metric distance': *distance.value
      // } 
      // distanceResultIndex 0 to 8 (max)
      // chunkIndex 0 to 25 (max)
      // index 0 to 199 (max)
      // res.status(200).json(finalResults)
      return { ok: true, data: finalResults }
    })
    .catch(error => {
      if (debug) console.tron.error(error)
      throw new Error(error)
    })
  })
  .catch(error => { if (debug) console.tron.error('server error, check request endpoint') })
}
