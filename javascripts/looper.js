(function(){$(function(){var a,b,c,d,e,f,g,h,i,j;return c="6d5064768cc29c71e1f66691f435589a",b="1768866",SC.initialize({client_id:c}),g=[],j=0,h=0,a=$("#loop-machine"),i=function(){var a,b;b=[];for(a=0;0<=j?a<j:a>j;0<=j?a++:a--)console.log(g[a].readyState),b.push(e(a)());return b},e=function(b){var c,d,e,f,h,i;return e=a.find(".track").eq(b),d=e.find(".cell"),f=d.size(),h=0,c=d.eq(0),i=function(){var a;return c.removeClass("playing"),a=g[b],c=d.eq(h),h=(h+1)%f,c.addClass("playing"),c.hasClass("active")&&a.readyState===3?a.play({onfinish:i}):setTimeout(i,a.readyState===3?a.duration:a.durationEstimate)},i},d=function(){var b,c,d,e,f;d=10;for(e=0;0<=j?e<j:e>j;0<=j?e++:e--){c=$("<div>").addClass("track").appendTo(a);for(f=0;0<=d?f<d:f>d;0<=d?f++:f--)b=$("<div>").addClass("cell").appendTo(c)}return a.find(".cell").click(function(){return $(this).toggleClass("active")})},f=function(a){return function(b){g[a]=b,h+=1;if(h===j)return i()}},SC.get("/playlists/"+b,{autoLoad:!0},function(a){var b,c,e;j=a.tracks.length,d(),e=[];for(b=0;0<=j?b<j:b>j;0<=j?b++:b--)c=a.tracks[b],e.push(SC.stream("/tracks/"+c.id,f(b)));return e})})}).call(this);