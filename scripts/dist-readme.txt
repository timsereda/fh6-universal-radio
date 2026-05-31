FH6 Universal Radio
===================

Thanks for grabbing this. It's a free, open-source mod that drops a
brand new station into Forza Horizon 6's radio dial. You feed it audio
from a folder of music files on your PC, from online radio stations, from
Spotify, from any YouTube / YouTube Music link, from a Jellyfin or Plex
server, or from any other Windows app (Deezer, a browser tab...), and the game treats the result
like every other station: it ducks for menus, follows your in-game
volume slider, and fades on the loading screen.


Getting it running
~~~~~~~~~~~~~~~~~~

Prefer a video? Watch the installation guide on YouTube:
https://www.youtube.com/watch?v=9Uwy3pDf4SQ

Make sure FH6 isn't open first. Then drop the contents of this archive
straight into the folder that contains forzahorizon6.exe. Depending on
where you installed the game, that'll look like one of:

    Steam      ->  ...\steamapps\common\ForzaHorizon6
    Xbox app   ->  ...\XboxGames\Forza Horizon 6\Content

Let Windows overwrite when it asks. Heads-up: some antivirus tools dunk
on the bundled version.dll because of how the mod hooks into the game.
If yours yeets the file, add the FH6 folder to its exclusions list
and re-extract.

Once the files are in place, launch the game and head into
Settings > Audio. Two switches matter:

    Streamer Mode  ->  ON     (the new station only shows up with
                                this enabled)
    Radio DJ       ->  OFF    (otherwise the in-game DJ chimes in
                                over your tracks)

Now cycle the radio stations in-game until you land on the new one.
The mod's audio only goes out while that station is the active one.
Flip to another station and it stops broadcasting.


Configuring it from your browser
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Everything else is driven from a web dashboard the mod hosts
locally. With the game running, open this URL in any browser on the
same machine:

    http://localhost:8420

From another device on the same network, use your PC's local IP
instead (e.g. http://192.168.1.42:8420). Run `ipconfig` in a Command
Prompt to find it.

From there:

  * Local files: build "stations" from one or more folders of MP3, FLAC,
    WAV, OGG, M4A, AAC, OPUS, M3U, M3U8 or WMA tracks. Subfolders are
    scanned too, and you can uncheck the ones you don't want. Pick a play
    order (shuffle / albums / name / folder), a repeat mode, and browse or
    search the queue.

  * Online radio: search a built-in directory of thousands of internet
    stations by name, genre, or country and tune one in a click, or paste
    a direct stream URL. Save favourites with their logos; the dashboard
    also keeps a "recently played" list.

  * YouTube Music: paste a video URL, a playlist, or a YT Music
    link.

    For age-gated or private content, export your browser's cookies
    as a Netscape cookies.txt (use an extension like "Get cookies.txt
    LOCALLY") and load that from the same panel.

  * Jellyfin: stream playlists from your own Jellyfin server.
    Configure the server URL, API key, user ID, and playlist ID
    under Settings > Jellyfin.

  * Plex: stream music playlists from your own Plex server.
    Configure the server URL, token, and playlist ratingKey under
    Settings > Plex. Plex playback routes through ffmpeg, so the
    configured ffmpeg path must be valid.

  * External audio: capture any Windows playback device and pipe a
    live app (Deezer, a browser tab...) into the radio. The capture
    is a loopback of whatever the device plays, so route the app to a
    virtual audio cable (e.g. VB-Audio Virtual Cable, set to 48000 Hz)
    and pick that cable as the capture device, otherwise you hear the
    app directly instead of through the radio.

  * Spotify Connect: enable Spotify under Settings, then pick
    "FH6 Universal Radio" from the Devices list in your phone's or
    desktop's Spotify app to stream to the game. An old Spotify
    Premium account is required by Spotify Connect.

A handful of in-game extras live under Settings in the dashboard:

  * Race start action: on race begin, advance to next track, restart
    the current one, or leave it alone.
  * Quick station skip: tune the radio knob away and back within 1s
    to skip the current track.
  * Loudness normalization for consistent volume across tracks.
  * 5-band equalizer (60 Hz / 250 Hz / 1 kHz / 4 kHz / 12 kHz peaking
    biquads, +/-6 dB per band, applied producer-side at 48 kHz before
    audio hits the game).


Pulling it back out
~~~~~~~~~~~~~~~~~~~

Two things to remove from the FH6 install folder: version.dll, and the
fh6-radio/ folder sitting next to it. After that, hit "Verify integrity
of game files" (Steam) or "Repair" (Xbox app / MS Store) and the
patched game assets get pulled back to vanilla.


About the project
~~~~~~~~~~~~~~~~~

This mod is a hobby project released under GPLv3. The source lives at
github.com/g0ldyy/fh6-universal-radio. Bug reports, feature ideas, and
PRs are all welcome over there. If you want to chip in financially,
the README on the repo has GitHub Sponsors and Ko-fi links.

Unofficial fan project. Nothing here is affiliated with, endorsed by,
or connected to Turn 10 Studios, Playground Games, Xbox Game Studios,
Microsoft, Google, YouTube, or Jellyfin (Jellyfin LLC). Forza Horizon,
Plex, Forza Motorsport, and all other names dropped above belong to
their respective owners. Provided as-is, no warranty, use at your own
risk.
