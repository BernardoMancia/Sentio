import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};
const API_BASE: string = extra.apiUrl || "http://82.112.245.99:2345/api";
const API_KEY: string = extra.apiKey || "";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }
  return headers;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export async function registerTap(deviceId: string) {
  const res = await fetch(`${API_BASE}/tap`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ device_id: deviceId }),
  });
  return handleResponse(res);
}

export async function getTodayCount(deviceId: string) {
  const res = await fetch(`${API_BASE}/today/${deviceId}`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function getMonthlySummary(
  deviceId: string,
  year?: number,
  month?: number
) {
  const res = await fetch(`${API_BASE}/monthly-summary`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ device_id: deviceId, year, month }),
  });
  return handleResponse(res);
}

export async function registerPushToken(
  deviceId: string,
  expoToken: string
) {
  const res = await fetch(`${API_BASE}/register-token`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ device_id: deviceId, expo_token: expoToken }),
  });
  return handleResponse(res);
}
