import { api } from "../api.js";
import { el } from "../dom.js";
import { toast } from "../toast.js";

export function createPlex(refs, ctx) {
  let loaded = false;
  let loading = false;
  let playlists = [];

  function setHint(message) {
    refs.hint.textContent = message || "";
  }

  function playlistLabel(playlist) {
    const title = playlist.title || playlist.name || playlist.ratingKey || "Untitled playlist";
    const count = playlist.leafCount ?? playlist.childCount ?? playlist.track_count;
    return count == null ? title : `${title} (${count} tracks)`;
  }

  function populate() {
    refs.select.replaceChildren(
      el("option", { value: "" }, playlists.length ? "Choose a Plex playlist" : "No playlists found"),
      ...playlists.map(playlist =>
        el("option", { value: playlist.ratingKey || playlist.key || "" }, playlistLabel(playlist)),
      ),
    );
  }

  async function load(force = false) {
    if ((loaded && !force) || loading) return;
    loading = true;
    refs.scan.disabled = true;
    setHint("Scanning Plex playlists…");
    try {
      const response = await api.getPlexPlaylists();
      playlists = Array.isArray(response.playlists) ? response.playlists : [];
      loaded = true;
      populate();
      setHint(playlists.length ? "Select a playlist or paste a ratingKey manually." : "No Plex playlists were returned.");
    } catch (e) {
      playlists = [];
      loaded = false;
      populate();
      setHint(e.message);
      toast(e.message, true);
    } finally {
      loading = false;
      refs.scan.disabled = false;
    }
  }

  refs.scan.addEventListener("click", () => load(true));
  refs.select.addEventListener("change", () => {
    if (refs.select.value) refs.input.value = refs.select.value;
  });

  refs.form.addEventListener("submit", async e => {
    e.preventDefault();
    const playlistId = refs.input.value.trim() || refs.select.value.trim();
    if (!playlistId) return;
    try {
      await api.castPlex(playlistId);
      toast("Playing Plex playlist…");
    } catch (err) {
      toast(err.message, true);
    }
  });

  function render() {
    const available = ctx.getState()?.sources?.available || [];
    const enabled = available.some(source => source.name === "plex");
    refs.card.hidden = !enabled;
    if (enabled) load();
  }

  return {
    render,
    invalidate: () => {
      loaded = false;
    },
  };
}
