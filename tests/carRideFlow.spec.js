import test from "@playwright/test";
import { loginPayload } from "../payloads/bikeRidePayloads";

let rideId, overviewPolyline, coords;

test.describe("Ride life cycle flow", () => {


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
});
