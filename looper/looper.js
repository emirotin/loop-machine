$(() => {
  const SOUNDCLOUD_ID = "6d5064768cc29c71e1f66691f435589a";
  const PLAYLIST_ID = "1768866";
  SC.initialize({ client_id: SOUNDCLOUD_ID });

  const tracks = [];
  let started = false;
  let tracksTotalCount = 0;
  let tracksLoadedCount = 0;
  const $cont = $("#loop-machine");

  const iterRow = i => {
    const $row = $cont.find(".track").eq(i);
    const $cells = $row.find(".cell");
    const cellsCount = $cells.length;
    let j = 0;
    let $cell = null;
    const playTrack = () => {
      if (!started) {
        return setTimeout(playTrack, 100);
      }
      $cell && $cell.removeClass("playing");
      const sound = tracks[i];
      $cell = $cells.eq(j);
      j = (j + 1) % cellsCount;
      $cell.addClass("playing");
      if ($cell.hasClass("active") && sound.readyState == 3) {
        sound.play({ onfinish: playTrack });
      } else {
        setTimeout(
          playTrack,
          sound.readyState == 3 ? sound.duration : sound.durationEstimate
        );
      }
    };
    return playTrack;
  };

  const onTracksReady = () => {
    for (let i = 0; i < tracksTotalCount; i++) {
      setTimeout(iterRow(i), 0);
    }
  };

  const buildUi = () => {
    const SQ_COUNT = 10;
    for (let i = 0; i < tracksTotalCount; i++) {
      const $row = $("<div>")
        .addClass("track")
        .appendTo($cont);
      for (let j = 0; j < SQ_COUNT; j++) {
        const $cell = $("<div>")
          .addClass("cell")
          .appendTo($row);
      }
    }
    $cont.on("click", ".cell", function() {
      $(this).toggleClass("active");
    });
    // init some cells
    const initRowCount = Math.floor(
      (tracksTotalCount / 3) * (1 + Math.random())
    );
    for (let i = 0; i < initRowCount; i++) {
      const r = Math.floor(tracksTotalCount * Math.random());
      const $row = $cont.find(".track").eq(r);
      const initCellCount = Math.floor(5 * Math.random());
      for (let j = 0; j < initCellCount; j++) {
        const c = Math.floor(SQ_COUNT * Math.random());
        $row
          .find(".cell")
          .eq(c)
          .addClass("active");
      }
    }

    $("#toggle").click(function() {
      started = !started;
      $(this).text(started ? "Pause" : "Play");
    });
  };

  const onTrackLoaded = i => sound => {
    tracks[i] = sound;
    tracksLoadedCount += 1;
    if (tracksLoadedCount == tracksTotalCount) {
      onTracksReady();
    }
  };

  SC.get("/playlists/" + PLAYLIST_ID, pl => {
    tracksTotalCount = pl.tracks.length;
    buildUi();
    for (let i = 0; i < tracksTotalCount; i++) {
      const track = pl.tracks[i];
      SC.stream("/tracks/" + track.id, { autoLoad: true }, onTrackLoaded(i));
    }
  });
});
