let driverToken = '';

export function setDriverToken(token) {
  driverToken = token;
  console.log(driverToken)
}

export function getDriverToken() {
  return driverToken;
}
