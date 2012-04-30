$ ->
  SOUNDCLOUD_ID = '6d5064768cc29c71e1f66691f435589a'
  PLAYLIST_ID = '1768866'
  SC.initialize client_id: SOUNDCLOUD_ID

  tracks = []
  tracks_total = 0
  tracks_loaded = 0
  $cont = $ '#loop-machine'

  tracks_ready = ->
    for track in tracks
      console.log track

  iter_row = (i) ->
    $row = $cont.find('.track').eq(i)
    j = 0
    $cells = $row.find('.cell')
    cells_count = $cells.size()
    res = ->
      # sound = tracks[i]
      $cell = $cells.eq(j)
      j = (j + 1) % cells_count
      $cell.addClass('playing')
      setTimeout (-> $cell.removeClass('playing')), 1000 # subscribe to play end
      if $cell.hasClass('active')
        # play sound here
        return
      # set timeout for self with sound.readyState == 3 ? sound.duration : sound.durationEstimate


  build_ui = ->
    SQ_COUNT = 10
    INTERVAL = 500
    for i in [0...tracks_total]
      $row = $('<div>').addClass('track').appendTo $cont
      for j in [0...SQ_COUNT]
        $cell = $('<div>').addClass('cell').appendTo $row
      setInterval iter_row(i), INTERVAL
    $cont.find('.cell').click ->
      $(this).toggleClass('active')

  track_loaded = (i) ->
    (sound) ->
      tracks[i] = sound
      tracks_loaded += 1
      if tracks_loaded == tracks_total
        tracks_ready()
        # iter_row(i) //, sound.readyState == 3 ? sound.duration : sound.durationEstimate

  SC.get '/playlists/' + PLAYLIST_ID, (pl) ->
    tracks_total = pl.tracks.length
    build_ui()
    for i in [0...tracks_total]
      track = pl.tracks[i]
      console.log "Fetching #{track.id}"
      SC.stream "/tracks/#{track.id}", {}, track_loaded(i)