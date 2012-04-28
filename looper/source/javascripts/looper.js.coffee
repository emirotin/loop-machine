$ ->
    SOUNDCLOUD_ID = '6d5064768cc29c71e1f66691f435589a'
    PLAYLIST_ID = '1768866'
    SC.initialize client_id: SOUNDCLOUD_ID
    
    tracks = []
    tracks_total = 0
    
    tracks_ready = ->
        tracks[0].play()
    
    SC.get '/playlists/' + PLAYLIST_ID, (pl) ->
        tracks_total = pl.tracks.length
        for track in pl.tracks
            SC.stream '/tracks/' + track.id, (sound) ->
                tracks.push sound
                if tracks.length == tracks_total
                    tracks_ready()