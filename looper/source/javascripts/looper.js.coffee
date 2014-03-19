$ ->
  SOUNDCLOUD_ID = '6d5064768cc29c71e1f66691f435589a'
  PLAYLIST_ID = '1768866'
  SC.initialize client_id: SOUNDCLOUD_ID

  tracks = []
  tracksTotalCount = 0
  tracksLoadedCount = 0
  $cont = $ '#loop-machine'

  onTracksReady = ->
    for i in [0...tracksTotalCount]
      setTimeout iterRow(i), 0

  iterRow = (i) ->
    $row = $cont.find('.track').eq(i)
    $cells = $row.find('.cell')
    cellsCount = $cells.length
    j = 0
    $cell = null
    playTrack = ->
      $cell?.removeClass('playing')
      sound = tracks[i]
      $cell = $cells.eq(j)
      j = (j + 1) % cellsCount
      $cell.addClass('playing')
      if $cell.hasClass('active') and sound.readyState == 3
        sound.play onfinish: playTrack
      else
        setTimeout playTrack, if sound.readyState == 3 then sound.duration else sound.durationEstimate
    playTrack

  buildUi = ->
    SQ_COUNT = 10
    for i in [0...tracksTotalCount]
      $row = $('<div>').addClass('track').appendTo $cont
      for j in [0...SQ_COUNT]
        $cell = $('<div>').addClass('cell').appendTo $row
    $cont.on 'click', '.cell', ->
      $(this).toggleClass('active')
    # init some cells
    initRowCount = Math.floor tracksTotalCount / 3 * (1 + Math.random())
    for i in [0...initRowCount]
      r = Math.floor tracksTotalCount * Math.random()
      $row = $cont.find('.track').eq(r)
      initCellCount = Math.floor 5 * Math.random()
      for j in [0...initCellCount]
        c = Math.floor SQ_COUNT * Math.random()
        $row.find('.cell').eq(c).addClass 'active'

  onTrackLoaded = (i) ->
    (sound) ->
      tracks[i] = sound
      tracksLoadedCount += 1
      if tracksLoadedCount == tracksTotalCount
        onTracksReady()

  SC.get '/playlists/' + PLAYLIST_ID, (pl) ->
    tracksTotalCount = pl.tracks.length
    buildUi()
    for i in [0...tracksTotalCount]
      track = pl.tracks[i]
      SC.stream "/tracks/#{track.id}", {autoLoad: true}, onTrackLoaded(i)
