import { test, expect } from "@playwright/test";
import {
  userAuth,
  driverLoginHeaders,
} from "../utils/envLoader.js";
import { setDriverToken, getDriverToken } from "../utils/tokenManager.js";
import { apiContext, locationsContext } from "../utils/apiClient.js";
import {
  acceptedPayload,
  createRidePayload,
  estimationPayload,
  loginPayload,
  paymentPayload,
  pingBody,
  rideCompletedPayload,
  rideEndedPayload,
  startedPayload,
  userEndRatingPayload,
  waitingPayload,
} from "../payloads/bikeRidePayloads.js";
import { locations } from "../utils/locations.js";
import { decodePolyline } from "../utils/polylineDecoder.js";

let rideId, overviewPolyline, coords;

test.describe("Ride lifecycle flow", () => {
  // driver log in

  test("Step 1: Driver login", async () => {
    const api = await apiContext();
    const res = await api.post("/v2/auth/login", {
      headers: driverLoginHeaders,
      data: loginPayload(),
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const driverToken = body?.access_token?.access_token;
    expect(driverToken).toBeTruthy();
    setDriverToken(driverToken);
  });

  // ride estimation by user
  test("Step 2: Ride Estimation", async () => {
    const api = await apiContext();
    const res = await api.post("/v3/me/rides/estimation?lang=en", {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
      data: estimationPayload(),
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    const bikeService = body.services.find((s) => s.ride_type === 1);
    overviewPolyline = bikeService.overview_polyline;
    expect(overviewPolyline).toBeTruthy();
    console.log("Polyline extracted successfully", overviewPolyline);
  });

  // user creating a ride

  test("Step 3: User creates a ride", async () => {
    const api = await apiContext();
    const res = await api.post("/v2/me/rides", {
      headers: { Authorization: `Bearer ${userAuth.token}` },
      data: createRidePayload(),
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    rideId = body?.ride_id ?? body?.data?.ride_id;
    expect(rideId).toBeTruthy();
  });

  // make driver online

  test("Step 4: Make driver ONLINE", async () => {
    const api = await apiContext();
    const res = await api.patch("/v3/driver/online", {
      headers: {
        Authorization: `Bearer ${getDriverToken()}`,
      },
      data: {
        online: true,
      },
    });

    expect(res.status()).toBe(200);
    console.log(" Driver is now ONLINE");
  });

  // ping for ride request

  test("Step 5: Driver waits for ride (ping loop)", async () => {
    const api = await apiContext();
    const apiLocations = await locationsContext();

    let foundRide = false;
    const maxAttempts = 20;
    const delayMs = 5000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await apiLocations.post("/v1/me/batch", {
        headers: { Authorization: `Bearer ${getDriverToken()}` },
        data: pingBody(
          locations().pickup_latitude,
          locations().pickup_longitude,
          null
        ),
      });
      console.log(`Ping #${attempt} sent`);

      //  Check for assigned ride

      const res = await api.get("/v1/me/rides/open", {
        headers: { Authorization: `Bearer ${getDriverToken()}` },
      });
      if (res.status() === 200) {
        const body = await res.json();

        // get the ride id from the response.

        if (body && body.rider_id) {
          rideId = body.ride_id;
          console.log(" Ride assigned:", rideId);
          console.log(body);
          foundRide = true;
          break;
        }
      }
      console.log(`No ride yet. Waiting...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
    expect(foundRide).toBeTruthy();
  });

  // driver will accept the request

  test("Step 6: Driver ACCEPTS ride", async () => {
    const api = await apiContext();
    const res = await api.patch(`/v1/me/rides/${rideId}?lang=bn`, {
      headers: {
        Authorization: `Bearer ${getDriverToken()}`,
      },
      data: acceptedPayload(), // accepted payload
    });

    expect(res.status()).toBe(200);
    console.log(" Ride ACCEPTED by driver");
  });

  // driver will wait at the pickup point

  test("Step 7: Driver WAITING at pickup", async () => {
    const api = await apiContext();
    const res = await api.patch(`/v1/me/rides/${rideId}`, {
      headers: {
        Authorization: `Bearer ${getDriverToken()}`,
      },
      data: waitingPayload(),
    });
    expect(res.status()).toBe(200);
    console.log(" Driver is now WAITING at pickup");
  });

  // waiting loop

  test("Step 8: Waiting Ping Loop", async () => {
    const apiLocations = await locationsContext();

    const maxAttempts = 10;
    const delayMs = 1000;

    const pickup_lat = locations().pickup_latitude;
    const pickup_lon = locations().pickup_longitude;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const pingBodyy = pingBody(pickup_lat, pickup_lon, rideId);
      const res = await apiLocations.post("/v1/me/batch", {
        headers: { Authorization: `Bearer ${getDriverToken()}` },
        data: pingBodyy,
      });
      expect(res.status()).toBe(202 || 200);
      console.log(`Waiting ping #${attempt} sent`);

      await new Promise((r) => setTimeout(r, delayMs));
    }

    console.log(" Waiting pings complete. Ready to START ride.");
  });

  // test("Step odlkfngkjasndl)", async () => {
  //   // const api = await apiContext();
  //   const apiLocations = await locationsContext();

  //   // let foundRide = false;
  //   const maxAttempts = 10;
  //   const delayMs = 3000;

  //   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  //     await apiLocations.post("/v1/me/batch", {
  //       headers: { Authorization: `Bearer ${getDriverToken()}` },
  //       data: pingBody(
  //         locations().pickup_latitude,
  //         locations().pickup_longitude,
  //         rideId
  //       ),
  //     });
  //     console.log(`Ping #${attempt} sent`);
    
  //   await new Promise((r) => setTimeout(r, delayMs));
  //   }})


  // test("Step 7: Waiting Ping Loop", async () => {
  //   const apiLocations = await locationsContext();

  //   const maxAttempts = 10; 
  //   const delayMs = 3000;
  //   for (let attempt = 1; attempt <= maxAttempts; attempt++) {

  //     const pingBody = {
  //       batch_location_pings: [
  //         {
  //           accuracy: "32.804",
  //           bearing: "313.62",
  //           current_altitude: -37.89999771118164,
  //           current_latitude: locations().pickup_latitude,
  //           current_longitude: locations().pickup_longitude,
  //           device_time: Date.now(),
  //           elapsed_location_age: 136,
  //           gps_timestamp: Date.now(),
  //           is_mock: false,
  //           speed: "0.52293724",
  //         },
  //       ],
  //       battery_level: 34,
  //       device_id: "akidee304b69fd752b0driver",
  //       device_name: "Xiaomi M2101K6P",
  //       is_open_for_deliveries: false,
  //       is_running_foreground: false,
  //       location_mode: 3,
  //       order_ids: [rideId],
  //       os_version: "12",
  //     };

  //     const res = await apiLocations.post("/v1/me/rides/batch", {
  //       headers: { Authorization: `Bearer ${getDriverToken()}` },
  //       data: pingBody,
  //     });

  //     expect(res.status()).toBe(202);
  //     console.log(`Waiting ping #${attempt} sent`);

  //     await new Promise((r) => setTimeout(r, delayMs));
  //   }

  //   console.log("✅ Waiting pings complete. Ready to START ride.");
  // });

  // driver started the ride

  test("Step 9: Driver STARTED ride", async () => {
    const api = await apiContext();
    const res = await api.patch(`/v1/me/rides/${rideId}`, {
      headers: {
        Authorization: `Bearer ${getDriverToken()}`,
      },
      data: startedPayload(), //started payload
    });

    expect(res.status()).toBe(200);
    console.log(" Ride STARTED by driver");
  });

  // after starting it will move to the destination with pings

  test("Step 10: Movement Ping Loop", async () => {
    // testInfo.setTimeout(12000000); //

    const apiLocations = await locationsContext();
    console.log(overviewPolyline);
    coords = decodePolyline(overviewPolyline);

    console.log("Decoded points:", coords.length);

    for (const { lat, lon } of coords) {
      const pingBodyy = pingBody(lat, lon, rideId);

      const res = await apiLocations.post("/v1/me/rides/batch", {
        headers: { Authorization: `Bearer ${getDriverToken()}` },
        data: pingBodyy,
      });
      expect(res.status()).toBeTruthy();
      await new Promise((r) => setTimeout(r, 1000));
      console.log(`Sending ping lat ${lat} and lon ${lon}`);
    }

    console.log(" Movement pings complete");
  });

  // Ride ended

  test("Step 11: Ride ENDED", async () => {
    const api = await apiContext();
    const lastPoint = coords[coords.length - 1];
    let endlat = lastPoint.lat;
    let endlon = lastPoint.lon;

    const res = await api.patch(`/v1/me/rides/${rideId}`, {
      headers: {
        Authorization: `Bearer ${getDriverToken()}`,
      },
      data: rideEndedPayload(endlat, endlon),
    });

    expect(res.status()).toBe(200);
    console.log("Ride ENDED");
  });

  // ride completed by driver

  test("Step 12: Ride COMPLETED", async () => {
    const api = await apiContext();

    const res = await api.patch(`/v1/me/rides/${rideId}`, {
      headers: {
        Authorization: `Bearer ${getDriverToken()}`,
      },
      data: rideCompletedPayload(),
    });

    expect(res.status()).toBe(200);
    console.log("Ride marked as COMPLETED");
  });

  // payment done by user

  test("Step 13: Payment done from user", async () => {
    const api = await apiContext();
    const res = await api.patch(`/v1/me/rides/${rideId}`, {
      headers: {
        Authorization: `Bearer ${userAuth.token}`,
      },
      data: paymentPayload(),
    });

    expect(res.status()).toBe(200);
    console.log(" Payment completed by user");
  });

  // post rating by user

  test("Step 14: Post rating user end", async () => {
    const api = await apiContext();
    console.log(rideId);
    const res = await api.patch(`/v1/me/rides/${rideId}`, {
      headers: { Authorization: `Bearer ${userAuth.token}` },
      data: userEndRatingPayload(rideId),
    });
    console.log(res.json());
    expect(res.status()).toBe(200);
  });


});
