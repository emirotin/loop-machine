$ ->
  SOUNDCLOUD_ID = '6d5064768cc29c71e1f66691f435589a'
  PLAYLIST_ID = '1768866'
  SC.initialize client_id: SOUNDCLOUD_ID

  tracks = []
  tracks_total = 0
  tracks_loaded = 0
  $cont = $ '#loop-machine'

  tracks_ready = ->
    for i in [0...tracks_total]
      console.log tracks[i].readyState
      iter_row(i)()

  iter_row = (i) ->
    $row = $cont.find('.track').eq(i)
    $cells = $row.find('.cell')
    cells_count = $cells.size()
    j = 0
    $cell = $cells.eq(0)
    res = ->
      $cell.removeClass('playing')
      sound = tracks[i]
      $cell = $cells.eq(j)
      j = (j + 1) % cells_count
      $cell.addClass('playing')
      if $cell.hasClass('active') and sound.readyState == 3
        sound.play onfinish: res
      else
        setTimeout res, if sound.readyState == 3 then sound.duration else sound.durationEstimate
    res

  build_ui = ->
    SQ_COUNT = 10
    for i in [0...tracks_total]
      $row = $('<div>').addClass('track').appendTo $cont
      for j in [0...SQ_COUNT]
        $cell = $('<div>').addClass('cell').appendTo $row
    $cont.find('.cell').click ->
      $(this).toggleClass('active')

  track_loaded = (i) ->
    (sound) ->
      tracks[i] = sound
      tracks_loaded += 1
      if tracks_loaded == tracks_total
        tracks_ready()

  SC.get '/playlists/' + PLAYLIST_ID, autoLoad: true, (pl) ->
    tracks_total = pl.tracks.length
    build_ui()
    for i in [0...tracks_total]
      track = pl.tracks[i]
      SC.stream "/tracks/#{track.id}", track_loaded(i)