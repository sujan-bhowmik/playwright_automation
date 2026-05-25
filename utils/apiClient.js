import { request } from "@playwright/test";
import { baseUrls } from "./envLoader.js";

export async function apiContext() {
  return request.newContext({
    baseURL: baseUrls.api,
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      "User-Agent": "akid/2024.01.03",
      "App-Agent": "driver/android/233",
    },
    Authorization: ` `,
  });
}

export async function locationsContext() {
  return request.newContext({
    baseURL: baseUrls.locations,
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      "User-Agent": "akid/2024.01.03",
      "App-Agent": "driver/android/274",
      "Content-Length": "635",
    },
  });
}
