import { driverAuth } from "../utils/envLoader";
import { locations } from "../utils/locations";

// payment payloads

export const createRidePayload = () => ({
  estimated_ride_distance: 6611,
  city_id: 1,
  estimated_payable_fare_cent: 13000,

  pickup_address: "Pathao HQ, Road 49, Gulshan 2",
  estimated_pickup_latitude: locations().pickup_latitude,
  estimated_dropoff_latitude: locations().dropoff_latitude,

  dropoff_address: "La Meridian Hotel, Nikunjo, Dhaka",
  estimated_pickup_place_id: 235319,
  pickup_short_address: "",

  estimated_dropoff_longitude: locations().dropoff_longitude,
  dropoff_short_address: "",

  payment_method: "CASH_ON_DELIVERY",
  estimated_dropoff_address_source: "RECENT_SEARCH",

  sid: "3f3535bc-2014-4fe5-bac3-cf4e1357a927",

  user_meta: {
    is_mock_location: false,
    ad_id: "74EA0E25-25D0-4FB0-A45E-CCA939220653",
    device_id: "74EA0E25-25D0-4FB0-A45E-CCA939220653",
    location_delta: 1765450280,
    latitude: locations().pickup_latitude,
    longitude: locations().pickup_longitude,
  },

  ride_type: 1,
  country_id: 1,
  is_redispatch_enabled: true,
  estimated_ride_duration: 1080,
  estimated_pickup_address_source: "SUGGESTED_PICKUP",
  is_offer_model: false,

  telapoka: {
    services: [],
  },

  estimated_pickup_longitude: locations().pickup_longitude,
  estimated_dropoff_place_id: 2441992441122,
  estimated_fare_cent: 13000,
});

export const paymentPayload = () => ({
  payment_method: "CASH_ON_DELIVERY",
});

// driver end ratin payload

export const driverEndRatingPayload = () => ({
  rider_rating: 5,
  status: "COMPLETED",
});

// user end rating payload

export const userEndRatingPayload = (rideId) => ({
  feedback_tag_summary_ids: "6,8",
  _method: "PATCH",
  rating: "5",
  ride_id: `${rideId}`,
  had_helmet: true,
  did_rider_ask_destination: false,
  is_refused_dp: false,
});

// status payloads

// ride accept payload

export const acceptedPayload = () => ({
  misc: {
    original_lat: locations().originalLat,
    original_lon: locations().originalLon,
  },
  status: "ACCEPTED",
});

// waiting status payload

export const waitingPayload = () => ({
  misc: {
    original_lat: locations().originalLat,
    original_lon: locations().originalLon,
  },
  status: "WAITING",
});

// ride start payload

export const startedPayload = () => ({
  pickup_latitude: locations().pickup_latitude,
  pickup_longitude: locations().pickup_longitude,
  misc: {
    distance_diff_in_meters: 4,
    original_lat: locations().originalLat,
    original_lon: locations().originalLon,
    time_diff_in_milli: 12568,
  },
  status: "STARTED",
});

// this is login payload 


export const loginPayload = () => ({
  client_id: driverAuth().clientId,
  username: driverAuth().username,
  password: driverAuth().password,
});

// this is estimation payload 

export const estimationPayload = () => ({
  city_id: 1,
  country_id: 1,
  estimated_dropoff_address: "La Meridian Hotel, Nikunjo, Dhaka",
  estimated_dropoff_latitude: locations().dropoff_latitude,
  estimated_dropoff_longitude: locations().dropoff_longitude,
  estimated_dropoff_address_source: "",
  estimated_pickup_address: "Pathao HQ, Road 49, Gulshan 2",
  estimated_pickup_latitude: locations().pickup_latitude,
  estimated_pickup_longitude: locations().pickup_longitude,
  estimated_pickup_place_id: 235319,
  estimated_pickup_address_source: "SAVED_ADDRESS",
  intended_ride_type: 1,
  is_business_enable: false,
  stoppage: [],
});

// this is the ping body

export const pingBody = (lat, lon, rideId) => ({
  batch_location_pings: [
    {
      accuracy: "32.804",
      bearing: "313.62",
      current_altitude: -37.89999771118164,
      current_latitude: lat,
      current_longitude: lon,
      device_time: Date.now(),
      elapsed_location_age: 153,
      gps_timestamp: Date.now(),
      is_mock: false,
      speed: "0.52293724",
    },
  ],
  battery_level: 81,
  device_id: "akidee304b69fd752b0driver",
  device_name: "Xiaomi M2101K6P",
  is_open_for_deliveries: true,
  is_running_foreground: true,
  location_mode: 3,
  order_ids: [rideId],
  os_version: "12",
});

// ride complete payload this is 

export const rideCompletedPayload = () => ({
  rider_rating: 5,
  status: "COMPLETED",
});

// this is ride ended payload 

export const rideEndedPayload = (endlat, endlon) => ({
  dropoff_latitude: endlat,
  dropoff_longitude: endlon,
  status: "ENDED",
});
