import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api } from "../dist/js/api.js";

function ok(body = {}) {
  return vi.fn().mockResolvedValue({ ok: true, json: async () => body });
}

function lastCall() {
  const [path, opts] = global.fetch.mock.calls.at(-1);
  return {
    path,
    method: opts.method,
    body: opts.body ? JSON.parse(opts.body) : undefined,
    headers: opts.headers,
  };
}

beforeEach(() => {
  global.fetch = ok();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("api endpoints", () => {
  it("getState GETs /api/state with no body", async () => {
    await api.getState();
    expect(lastCall()).toEqual({ path: "/api/state", method: "GET", body: undefined, headers: {} });
  });

  it("getConfig / reloadConfig / putConfig hit /api/config", async () => {
    await api.getConfig();
    expect(lastCall().path).toBe("/api/config");
    expect(lastCall().method).toBe("GET");

    await api.reloadConfig();
    expect(lastCall()).toMatchObject({ path: "/api/config/reload", method: "POST" });

    await api.putConfig({ audio: { output_gain: 0.4 } });
    const put = lastCall();
    expect(put.path).toBe("/api/config");
    expect(put.method).toBe("PUT");
    expect(put.body).toEqual({ audio: { output_gain: 0.4 } });
    expect(put.headers).toEqual({ "content-type": "application/json" });
  });

  it("casts and shuffle carry the right body", async () => {
    await api.castYoutube("https://yt");
    expect(lastCall()).toMatchObject({
      path: "/api/source/youtube_music/cast",
      body: { url: "https://yt" },
    });

    await api.shuffleYoutube(true);
    expect(lastCall()).toMatchObject({
      path: "/api/source/youtube_music/shuffle",
      body: { shuffle: true },
    });

    await api.castJellyfin("pl-1");
    expect(lastCall()).toMatchObject({
      path: "/api/source/jellyfin/cast",
      body: { playlist_id: "pl-1" },
    });

    await api.castPlex("42");
    expect(lastCall()).toMatchObject({
      path: "/api/source/plex/cast",
      body: { playlist_id: "42" },
    });
  });

  it("loads Plex playlists", async () => {
    await api.getPlexPlaylists();
    expect(lastCall()).toMatchObject({
      path: "/api/source/plex/playlists",
      method: "GET",
    });
  });

  it("castOnlineRadio carries url plus optional name/logo", async () => {
    await api.castOnlineRadio("https://stream");
    expect(lastCall()).toMatchObject({
      path: "/api/source/online_radio/cast",
      body: { url: "https://stream" },
    });

    await api.castOnlineRadio("https://stream", { name: "Jazz FM", logo: "http://logo" });
    expect(lastCall()).toMatchObject({
      path: "/api/source/online_radio/cast",
      body: { url: "https://stream", name: "Jazz FM", logo: "http://logo" },
    });
  });

  it("putExternalAudio PUTs config payload", async () => {
    await api.putExternalAudio({ enabled: true, endpoint_id: "dev", media_session_id: "sess" });
    expect(lastCall()).toMatchObject({
      path: "/api/external_audio/config",
      method: "PUT",
      body: { enabled: true, endpoint_id: "dev", media_session_id: "sess" },
    });
  });

  it("local files endpoints carry the right method and body", async () => {
    await api.browseFs("C:\\Music");
    expect(lastCall()).toMatchObject({
      path: "/api/fs/browse",
      method: "POST",
      body: { path: "C:\\Music" },
    });

    await api.getLocalStations();
    expect(lastCall()).toMatchObject({ path: "/api/source/local_files/stations", method: "GET" });

    const stations = [{ name: "Rock", roots: ["D:\\Rock"], excluded: [] }];
    await api.putLocalStations(stations, "Rock");
    expect(lastCall()).toMatchObject({
      path: "/api/source/local_files/stations",
      method: "PUT",
      body: { stations, active_station: "Rock" },
    });

    await api.activateLocalStation("Rock");
    expect(lastCall()).toMatchObject({
      path: "/api/source/local_files/activate",
      method: "POST",
      body: { name: "Rock" },
    });

    await api.getLocalQueue();
    expect(lastCall()).toMatchObject({ path: "/api/source/local_files/queue", method: "GET" });

    await api.playLocalIndex(7);
    expect(lastCall()).toMatchObject({
      path: "/api/source/local_files/play",
      method: "POST",
      body: { index: 7 },
    });

    await api.reshuffleLocal();
    expect(lastCall()).toMatchObject({ path: "/api/source/local_files/reshuffle", method: "POST" });
  });

  it("throws the server error message on non-ok responses", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: "Bad Gateway",
      json: async () => ({ error: "jellyfin fetch failed" }),
    });
    await expect(api.castJellyfin("x")).rejects.toThrow("jellyfin fetch failed");
  });

  it("falls back to statusText when no error body", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: false, statusText: "Not Found", json: async () => ({}) });
    await expect(api.getState()).rejects.toThrow("Not Found");
  });
});
