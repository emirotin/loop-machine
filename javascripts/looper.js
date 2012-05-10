(function() {

  $(function() {
    var $cont, PLAYLIST_ID, SOUNDCLOUD_ID, build_ui, iter_row, track_loaded, tracks, tracks_loaded, tracks_ready, tracks_total;
    SOUNDCLOUD_ID = '6d5064768cc29c71e1f66691f435589a';
    PLAYLIST_ID = '1768866';
    SC.initialize({
      client_id: SOUNDCLOUD_ID
    });
    tracks = [];
    tracks_total = 0;
    tracks_loaded = 0;
    $cont = $('#loop-machine');
    tracks_ready = function() {
      var i, _results;
      _results = [];
      for (i = 0; 0 <= tracks_total ? i < tracks_total : i > tracks_total; 0 <= tracks_total ? i++ : i--) {
        console.log(tracks[i].readyState);
        _results.push(iter_row(i)());
      }
      return _results;
    };
    iter_row = function(i) {
      var $cell, $cells, $row, cells_count, j, res;
      $row = $cont.find('.track').eq(i);
      $cells = $row.find('.cell');
      cells_count = $cells.size();
      j = 0;
      $cell = $cells.eq(0);
      res = function() {
        var sound;
        $cell.removeClass('playing');
        sound = tracks[i];
        $cell = $cells.eq(j);
        j = (j + 1) % cells_count;
        $cell.addClass('playing');
        if ($cell.hasClass('active') && sound.readyState === 3) {
          return sound.play({
            onfinish: res
          });
        } else {
          return setTimeout(res, sound.readyState === 3 ? sound.duration : sound.durationEstimate);
        }
      };
      return res;
    };
    build_ui = function() {
      var $cell, $row, SQ_COUNT, i, j;
      SQ_COUNT = 10;
      for (i = 0; 0 <= tracks_total ? i < tracks_total : i > tracks_total; 0 <= tracks_total ? i++ : i--) {
        $row = $('<div>').addClass('track').appendTo($cont);
        for (j = 0; 0 <= SQ_COUNT ? j < SQ_COUNT : j > SQ_COUNT; 0 <= SQ_COUNT ? j++ : j--) {
          $cell = $('<div>').addClass('cell').appendTo($row);
        }
      }
      return $cont.find('.cell').click(function() {
        return $(this).toggleClass('active');
      });
    };
    track_loaded = function(i) {
      return function(sound) {
        tracks[i] = sound;
        tracks_loaded += 1;
        if (tracks_loaded === tracks_total) return tracks_ready();
      };
    };
    return SC.get('/playlists/' + PLAYLIST_ID, {
      autoLoad: true
    }, function(pl) {
      var i, track, _results;
      tracks_total = pl.tracks.length;
      build_ui();
      _results = [];
      for (i = 0; 0 <= tracks_total ? i < tracks_total : i > tracks_total; 0 <= tracks_total ? i++ : i--) {
        track = pl.tracks[i];
        _results.push(SC.stream("/tracks/" + track.id, track_loaded(i)));
      }
      return _results;
    });
  });

}).call(this);
