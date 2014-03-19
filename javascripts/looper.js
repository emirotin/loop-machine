(function() {
  $(function() {
    var $cont, PLAYLIST_ID, SOUNDCLOUD_ID, buildUi, iterRow, onTrackLoaded, onTracksReady, tracks, tracksLoadedCount, tracksTotalCount;
    SOUNDCLOUD_ID = '6d5064768cc29c71e1f66691f435589a';
    PLAYLIST_ID = '1768866';
    SC.initialize({
      client_id: SOUNDCLOUD_ID
    });
    tracks = [];
    tracksTotalCount = 0;
    tracksLoadedCount = 0;
    $cont = $('#loop-machine');
    onTracksReady = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= tracksTotalCount ? _i < tracksTotalCount : _i > tracksTotalCount; i = 0 <= tracksTotalCount ? ++_i : --_i) {
        _results.push(setTimeout(iterRow(i), 0));
      }
      return _results;
    };
    iterRow = function(i) {
      var $cell, $cells, $row, cellsCount, j, playTrack;
      $row = $cont.find('.track').eq(i);
      $cells = $row.find('.cell');
      cellsCount = $cells.length;
      j = 0;
      $cell = null;
      playTrack = function() {
        var sound;
        if ($cell != null) {
          $cell.removeClass('playing');
        }
        sound = tracks[i];
        $cell = $cells.eq(j);
        j = (j + 1) % cellsCount;
        $cell.addClass('playing');
        if ($cell.hasClass('active') && sound.readyState === 3) {
          return sound.play({
            onfinish: playTrack
          });
        } else {
          return setTimeout(playTrack, sound.readyState === 3 ? sound.duration : sound.durationEstimate);
        }
      };
      return playTrack;
    };
    buildUi = function() {
      var $cell, $row, SQ_COUNT, c, i, initCellCount, initRowCount, j, r, _i, _j, _k, _results;
      SQ_COUNT = 10;
      for (i = _i = 0; 0 <= tracksTotalCount ? _i < tracksTotalCount : _i > tracksTotalCount; i = 0 <= tracksTotalCount ? ++_i : --_i) {
        $row = $('<div>').addClass('track').appendTo($cont);
        for (j = _j = 0; 0 <= SQ_COUNT ? _j < SQ_COUNT : _j > SQ_COUNT; j = 0 <= SQ_COUNT ? ++_j : --_j) {
          $cell = $('<div>').addClass('cell').appendTo($row);
        }
      }
      $cont.on('click', '.cell', function() {
        return $(this).toggleClass('active');
      });
      initRowCount = Math.floor(tracksTotalCount / 3 * (1 + Math.random()));
      _results = [];
      for (i = _k = 0; 0 <= initRowCount ? _k < initRowCount : _k > initRowCount; i = 0 <= initRowCount ? ++_k : --_k) {
        r = Math.floor(tracksTotalCount * Math.random());
        $row = $cont.find('.track').eq(r);
        initCellCount = Math.floor(5 * Math.random());
        _results.push((function() {
          var _l, _results1;
          _results1 = [];
          for (j = _l = 0; 0 <= initCellCount ? _l < initCellCount : _l > initCellCount; j = 0 <= initCellCount ? ++_l : --_l) {
            c = Math.floor(SQ_COUNT * Math.random());
            _results1.push($row.find('.cell').eq(c).addClass('active'));
          }
          return _results1;
        })());
      }
      return _results;
    };
    onTrackLoaded = function(i) {
      return function(sound) {
        tracks[i] = sound;
        tracksLoadedCount += 1;
        if (tracksLoadedCount === tracksTotalCount) {
          return onTracksReady();
        }
      };
    };
    return SC.get('/playlists/' + PLAYLIST_ID, function(pl) {
      var i, track, _i, _results;
      tracksTotalCount = pl.tracks.length;
      buildUi();
      _results = [];
      for (i = _i = 0; 0 <= tracksTotalCount ? _i < tracksTotalCount : _i > tracksTotalCount; i = 0 <= tracksTotalCount ? ++_i : --_i) {
        track = pl.tracks[i];
        _results.push(SC.stream("/tracks/" + track.id, {
          autoLoad: true
        }, onTrackLoaded(i)));
      }
      return _results;
    });
  });

}).call(this);
