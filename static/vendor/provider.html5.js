webpackJsonpjwplayer([2],{24:function(t,e,i){var r,n;r=[i(7)],n=function(t){function e(t){t||i()}function i(){throw new Error("Invalid DFXP file")}var r=t.seconds;return function(n){e(n);var a=[],s=n.getElementsByTagName("p"),c=30,u=n.getElementsByTagName("tt");if(u&&u[0]){var o=parseFloat(u[0].getAttribute("ttp:frameRate"));isNaN(o)||(c=o)}e(s),s.length||(s=n.getElementsByTagName("tt:p"),s.length||(s=n.getElementsByTagName("tts:p")));for(var d=0;d<s.length;d++){var l=s[d],h=l.innerHTML||l.textContent||l.text||"",f=t.trim(h).replace(/>\s+</g,"><").replace(/tts?:/g,"").replace(/<br.*?\/>/g,"\r\n");if(f){var T=l.getAttribute("begin"),k=l.getAttribute("dur"),g=l.getAttribute("end"),v={begin:r(T,c),text:f};g?v.end=r(g,c):k&&(v.end=v.begin+r(k,c)),a.push(v)}}return a.length||i(),a}}.apply(e,r),!(void 0!==n&&(t.exports=n))},27:function(t,e,i){var r,n;r=[i(1),i(28),i(2),i(12),i(15),i(24),i(29)],n=function(t,e,r,n,a,s,c){function u(t){if(this._currentTextTrackIndex=-1,t){if(this._textTracks||this._initTextTracks(),t.length){var e=0,i=t.length;for(e;e<i;e++){var n=t[e];if(n._id||("captions"===n.kind||"metadata"===n.kind?n._id="native"+n.kind:n._id=y.call(this,n),n.inuse=!0),n.inuse&&!this._tracksById[n._id])if("metadata"===n.kind)n.mode="hidden",n.oncuechange=R.bind(this),this._tracksById[n._id]=n;else if(A(n.kind)){var a,s=n.mode;if(n.mode="hidden",!n.cues.length&&n.embedded)continue;if(n.mode=s,this._cuesByTrackId[n._id]&&!this._cuesByTrackId[n._id].loaded){for(var c=this._cuesByTrackId[n._id].cues;a=c.shift();)E(n,a);n.mode=s,this._cuesByTrackId[n._id].loaded=!0}S.call(this,n)}}}this._renderNatively&&(this.textTrackChangeHandler=this.textTrackChangeHandler||m.bind(this),this.addTracksListener(this.video.textTracks,"change",this.textTrackChangeHandler),r.isEdge()&&(this.addTrackHandler=this.addTrackHandler||x.bind(this),this.addTracksListener(this.video.textTracks,"addtrack",this.addTrackHandler))),this._textTracks.length&&this.trigger("subtitlesTracks",{tracks:this._textTracks})}}function o(t){var e=t===this._itemTracks;e||b(this._itemTracks),this._itemTracks=t,t&&(e||(this._renderNatively=c(this.getName().name),this._renderNatively&&(this.disableTextTrack(),N.call(this)),this.addTextTracks(t)))}function d(){return this._currentTextTrackIndex}function l(e){this._textTracks&&(0===e&&t.each(this._textTracks,function(t){t.mode="disabled"}),this._currentTextTrackIndex!==e-1&&(this.disableTextTrack(),this._currentTextTrackIndex=e-1,this._renderNatively&&(this._textTracks[this._currentTextTrackIndex]&&(this._textTracks[this._currentTextTrackIndex].mode="showing"),this.trigger("subtitlesTrackChanged",{currentTrack:this._currentTextTrackIndex+1,tracks:this._textTracks}))))}function h(t){if(t.text&&t.begin&&t.end){var e=t.trackid.toString(),i=this._tracksById&&this._tracksById[e];i||(i={kind:"captions",_id:e,data:[]},this.addTextTracks([i]),this.trigger("subtitlesTracks",{tracks:this._textTracks}));var r;t.useDTS&&(i.source||(i.source=t.source||"mpegts")),r=t.begin+"_"+t.text;var n=this._metaCuesByTextTime[r];if(!n){n={begin:t.begin,end:t.end,text:t.text},this._metaCuesByTextTime[r]=n;var a=D([n])[0];i.data.push(a)}}}function f(t){this._tracksById||this._initTextTracks();var e="native"+t.type,i=this._tracksById[e],r="captions"===t.type?"Unknown CC":"ID3 Metadata";if(!i){var n={kind:t.type,_id:e,label:r,embedded:!0};i=w.call(this,n),this._renderNatively||"metadata"===i.kind?this.setTextTracks(this.video.textTracks):(i.data=[],p.call(this,[i]))}this._renderNatively||"metadata"===i.kind?E(i,t.cue):i.data.push(t.cue)}function T(t){var e=this._tracksById[t.name];if(e){e.source=t.source;for(var i=t.captions||[],r=[],n=!1,a=0;a<i.length;a++){var s=i[a],c=t.name+"_"+s.begin+"_"+s.end;this._metaCuesByTextTime[c]||(this._metaCuesByTextTime[c]=s,r.push(s),n=!0)}n&&r.sort(function(t,e){return t.begin-e.begin});var u=D(r);Array.prototype.push.apply(e.data,u)}}function k(t,e,i){t&&(g(t,e,i),this.instreamMode||(t.addEventListener?t.addEventListener(e,i):t["on"+e]=i))}function g(t,e,i){t&&(t.removeEventListener?t.removeEventListener(e,i):t["on"+e]=null)}function v(){b(this._itemTracks);var t=this._tracksById&&this._tracksById.nativemetadata;(this._renderNatively||t)&&(I.call(this,this.video.textTracks),t&&(t.oncuechange=null)),this._itemTracks=null,this._textTracks=null,this._tracksById=null,this._cuesByTrackId=null,this._metaCuesByTextTime=null,this._unknownCount=0,this._activeCuePosition=null,this._renderNatively&&(this.removeTracksListener(this.video.textTracks,"change",this.textTrackChangeHandler),I.call(this,this.video.textTracks))}function _(){this._textTracks&&this._textTracks[this._currentTextTrackIndex]&&(this._textTracks[this._currentTextTrackIndex].mode="disabled")}function m(){var e=this.video.textTracks,i=t.filter(e,function(t){return(t.inuse||!t._id)&&A(t.kind)});(!this._textTracks||i.length>this._textTracks.length)&&this.setTextTracks(e);var r=-1,n=0;for(n;n<this._textTracks.length;n++)if("showing"===this._textTracks[n].mode){r=n;break}r!==this._currentTextTrackIndex&&this.setSubtitlesTrack(r+1)}function x(){this.setTextTracks(this.video.textTracks)}function p(t){if(t){this._textTracks||this._initTextTracks(),this._renderNatively=c(this.getName().name);for(var e=0;e<t.length;e++){var i=t[e];if(!i.kind||A(i.kind)){var r=w.call(this,i);S.call(this,r),i.file&&(i.data=[],i.xhr=M.call(this,i,r))}}!this._renderNatively&&this._textTracks&&this._textTracks.length&&this.trigger("subtitlesTracks",{tracks:this._textTracks})}}function b(e){t.each(e,function(t){var e=t.xhr;e&&(e.onload=null,e.onreadystatechange=null,e.onerror=null,"abort"in e&&e.abort())})}function y(t){var e,i=t.kind||"cc";return e=t["default"]||t.defaulttrack?"default":t._id||t.name||t.file||t.label||i+this._textTracks.length}function E(t,e){if(!r.isEdge()||!window.TextTrackCue)return void t.addCue(e);var i=new window.TextTrackCue(e.startTime,e.endTime,e.text);t.addCue(i)}function I(e){e.length&&t.each(e,function(t){t.mode="hidden";for(var e=t.cues.length;e--;)t.removeCue(t.cues[e]);t.mode="disabled",t.inuse=!1})}function A(t){return"subtitles"===t||"captions"===t}function L(){this._textTracks=[],this._tracksById={},this._metaCuesByTextTime={},this._cuesByTrackId={},this._unknownCount=0}function w(e){var i,r=C.call(this,e);if(this._renderNatively||"metadata"===e.kind){var n=this.video.textTracks;i=t.findWhere(n,{label:r}),i?(i.kind=e.kind,i.label=r,i.language=e.language||""):i=this.video.addTextTrack(e.kind,r,e.language||""),i["default"]=e["default"],i.mode="disabled",i.inuse=!0}else i=e,i.data=i.data||[];return i._id||(i._id=y.call(this,e)),i}function C(t){var e=t.label||t.name||t.language;return e||(e="Unknown CC",this._unknownCount++,this._unknownCount>1&&(e+=" ["+this._unknownCount+"]")),e}function S(t){this._textTracks.push(t),this._tracksById[t._id]=t}function M(t,e){var i=this;return r.ajax(t.file,function(t){F.call(i,t,e)},O)}function N(){if(this._textTracks){var e=t.filter(this._textTracks,function(t){return t.embedded||"subs"===t.groupid});this._initTextTracks(),t.each(e,function(t){this._tracksById[t._id]=t}),this._textTracks=e}}function B(t,e){if(this._renderNatively){var i=this._tracksById[t._id];if(!i)return this._cuesByTrackId||(this._cuesByTrackId={}),void(this._cuesByTrackId[t._id]={cues:e,loaded:!1});if(this._cuesByTrackId[t._id]&&this._cuesByTrackId[t._id].loaded)return;var r;for(this._cuesByTrackId[t._id]={cues:e,loaded:!0};r=e.shift();)E(i,r)}else t.data=e}function D(e){var i=window.VTTCue,r=t.map(e,function(t){return new i(t.begin,t.end,t.text)});return r}function P(t,e){var r=this._renderNatively;i.e(8,function(require){var n=i(16),a=new n(window);r?a.oncue=function(t){E(e,t)}:(e.data=e.data||[],a.oncue=function(t){e.data.push(t)});try{a.parse(t).flush()}catch(s){O(s)}})}function R(i){var r=i.currentTarget.activeCues;if(r&&r.length){var n=r[r.length-1].startTime;if(this._activeCuePosition!==n){var a=[];if(t.each(r,function(t){t.startTime<n||(t.data||t.value?a.push(t):t.text&&this.trigger("meta",{metadataTime:n,metadata:JSON.parse(t.text)}))},this),a.length){var s=e.parseID3(a);this.trigger("meta",{metadataTime:n,metadata:s})}this._activeCuePosition=n}}}function F(t,e){var i,r,c=t.responseXML?t.responseXML.firstChild:null;if(c)for("xml"===n.localName(c)&&(c=c.nextSibling);c.nodeType===c.COMMENT_NODE;)c=c.nextSibling;try{if(c&&"tt"===n.localName(c))i=s(t.responseXML),r=D(i),B.call(this,e,r);else{var u=t.responseText;u.indexOf("WEBVTT")>=0?P.call(this,u,e):(i=a(u),r=D(i),B.call(this,e,r))}}catch(o){O(o.message+": "+e.file)}}function O(t){r.log("CAPTIONS("+t+")")}var W={_itemTracks:null,_textTracks:null,_tracksById:null,_cuesByTrackId:null,_metaCuesByTextTime:null,_currentTextTrackIndex:-1,_unknownCount:0,_renderNatively:!1,_activeCuePosition:null,_initTextTracks:L,addTracksListener:k,clearTracks:v,disableTextTrack:_,getSubtitlesTrack:d,removeTracksListener:g,addTextTracks:p,setTextTracks:u,setupSideloadedTracks:o,setSubtitlesTrack:l,textTrackChangeHandler:null,addTrackHandler:null,addCuesToTrack:T,addCaptionsCue:h,addVTTCue:f};return W}.apply(e,r),!(void 0!==n&&(t.exports=n))},46:function(t,e,i){var r,n;r=[i(19),i(2),i(50),i(1),i(4),i(5),i(18),i(3),i(27)],n=function(t,e,i,r,n,a,s,c,u){function o(t,i){e.foreach(t,function(t,e){i.addEventListener(t,e,!1)})}function d(t,i){e.foreach(t,function(t,e){i.removeEventListener(t,e,!1)})}function l(t){if("hls"===t.type)if(t.androidhls!==!1){var i=e.isAndroidNative;if(i(2)||i(3)||i("4.0"))return!1;if(e.isAndroid())return!0}else if(e.isAndroid())return!1;return null}function h(h,E){function I(){It&&(ot(Rt.audioTracks),mt.setTextTracks(Rt.textTracks),Rt.setAttribute("jw-loaded","data"))}function A(){It&&Rt.setAttribute("jw-loaded","started")}function L(t){mt.trigger("click",t)}function w(){It&&!Lt&&(P(D()),N(it(),gt,kt))}function C(){It&&N(it(),gt,kt)}function S(){f(yt),pt=!0,It&&(mt.state===a.STALLED?mt.setState(a.PLAYING):mt.state===a.PLAYING&&(yt=setTimeout(et,T)),Lt&&Rt.duration===1/0&&0===Rt.currentTime||(P(D()),B(Rt.currentTime),N(it(),gt,kt),mt.state===a.PLAYING&&(mt.trigger(n.JWPLAYER_MEDIA_TIME,{position:gt,duration:kt}),M())))}function M(){var t=Dt.level;if(t.width!==Rt.videoWidth||t.height!==Rt.videoHeight){if(t.width=Rt.videoWidth,t.height=Rt.videoHeight,ft(),!t.width||!t.height||At===-1)return;Dt.reason=Dt.reason||"auto",Dt.mode="hls"===_t[At].type?"auto":"manual",Dt.bitrate=0,t.index=At,t.label=_t[At].label,mt.trigger("visualQuality",Dt),Dt.reason=""}}function N(t,e,i){0===i||t===Et&&i===kt||(Et=t,mt.trigger(n.JWPLAYER_MEDIA_BUFFER,{bufferPercent:100*t,position:e,duration:i}))}function B(t){kt<0&&(t=-(Z()-t)),gt=t}function D(){var t=Rt.duration,e=Z();if(t===1/0&&e){var i=e-Rt.seekable.start(0);i!==1/0&&i>120&&(t=-i)}return t}function P(t){kt=t,bt&&t&&t!==1/0&&mt.seek(bt)}function R(){var t=D();Lt&&t===1/0&&(t=0),mt.trigger(n.JWPLAYER_MEDIA_META,{duration:t,height:Rt.videoHeight,width:Rt.videoWidth}),P(t)}function F(){It&&(pt=!0,Lt||ft(),g&&mt.setTextTracks(mt._textTracks),W())}function O(){It&&(Rt.muted&&(Rt.muted=!1,Rt.muted=!0),Rt.setAttribute("jw-loaded","meta"),R())}function W(){vt||(vt=!0,mt.trigger(n.JWPLAYER_MEDIA_BUFFER_FULL))}function H(){mt.setState(a.PLAYING),Rt.hasAttribute("jw-played")||Rt.setAttribute("jw-played",""),mt.trigger(n.JWPLAYER_PROVIDER_FIRST_FRAME,{})}function j(){mt.state!==a.COMPLETE&&Rt.currentTime!==Rt.duration&&mt.setState(a.PAUSED)}function Y(){Lt||Rt.paused||Rt.ended||mt.state!==a.LOADING&&mt.state!==a.ERROR&&(mt.seeking||mt.setState(a.STALLED))}function J(){It&&(e.log("Error playing media: %o %s",Rt.error,Rt.src),mt.trigger(n.JWPLAYER_MEDIA_ERROR,{message:"Error loading media: File could not be played"}))}function G(t){var i;return"array"===e.typeOf(t)&&t.length>0&&(i=r.map(t,function(t,e){return{label:t.label||e}})),i}function U(t){_t=t,At=V(t);var e=G(t);e&&mt.trigger(n.JWPLAYER_MEDIA_LEVELS,{levels:e,currentQuality:At})}function V(t){var e=Math.max(0,At),i=E.qualityLabel;if(t)for(var r=0;r<t.length;r++)if(t[r]["default"]&&(e=r),i&&t[r].label===i)return r;return Dt.reason="initial choice",Dt.level={},e}function Q(){var t=Rt.play();t&&t["catch"]&&t["catch"](function(t){console.warn(t)})}function K(t,i){bt=0,f(yt);var r=document.createElement("source");r.src=_t[At].file;var n=Rt.src!==r.src,s=Rt.getAttribute("jw-loaded"),c=Rt.hasAttribute("jw-played");n||"none"===s||"started"===s?(kt=i,X(_t[At]),mt.setupSideloadedTracks(mt._itemTracks),Rt.load()):(0===t&&Rt.currentTime>0&&(bt=-1,mt.seek(t)),Q()),gt=Rt.currentTime,_&&!c&&(W(),Rt.paused||mt.state===a.PLAYING||mt.setState(a.LOADING)),e.isIOS()&&mt.getFullScreen()&&(Rt.controls=!0),t>0&&mt.seek(t)}function X(t){Mt=null,Nt=-1,Bt=-1,Dt.reason||(Dt.reason="initial choice",Dt.level={}),pt=!1,vt=!1,Lt=l(t),t.preload&&t.preload!==Rt.getAttribute("preload")&&Rt.setAttribute("preload",t.preload);var e=document.createElement("source");e.src=t.file;var i=Rt.src!==e.src;i&&(Rt.setAttribute("jw-loaded","none"),Rt.src=t.file)}function q(){Rt&&(mt.disableTextTrack(),Rt.removeAttribute("crossorigin"),Rt.removeAttribute("preload"),Rt.removeAttribute("src"),Rt.removeAttribute("jw-loaded"),Rt.removeAttribute("jw-played"),i.emptyElement(Rt),At=-1,!v&&"load"in Rt&&Rt.load())}function z(){for(var t=Rt.seekable?Rt.seekable.length:0,e=1/0;t--;)e=Math.min(e,Rt.seekable.start(t));return e}function Z(){for(var t=Rt.seekable?Rt.seekable.length:0,e=0;t--;)e=Math.max(e,Rt.seekable.end(t));return e}function $(){mt.seeking=!1,mt.trigger(n.JWPLAYER_MEDIA_SEEKED)}function tt(){mt.trigger("volume",{volume:Math.round(100*Rt.volume)}),mt.trigger("mute",{mute:Rt.muted})}function et(){Rt.currentTime===gt&&Y()}function it(){var t=Rt.buffered,i=Rt.duration;return!t||0===t.length||i<=0||i===1/0?0:e.between(t.end(t.length-1)/i,0,1)}function rt(){if(It&&mt.state!==a.IDLE&&mt.state!==a.COMPLETE){if(f(yt),At=-1,Ct=!0,mt.trigger(n.JWPLAYER_MEDIA_BEFORECOMPLETE),!It)return;nt()}}function nt(){f(yt),mt.setState(a.COMPLETE),Ct=!1,mt.trigger(n.JWPLAYER_MEDIA_COMPLETE)}function at(t){St=!0,ut(t),e.isIOS()&&(Rt.controls=!1)}function st(){for(var t=-1,e=0;e<Rt.audioTracks.length;e++)if(Rt.audioTracks[e].enabled){t=e;break}dt(t)}function ct(t){St=!1,ut(t),e.isIOS()&&(Rt.controls=!1)}function ut(t){mt.trigger("fullscreenchange",{target:t.target,jwstate:St})}function ot(t){if(Mt=null,t){if(t.length){for(var e=0;e<t.length;e++)if(t[e].enabled){Nt=e;break}Nt===-1&&(Nt=0,t[Nt].enabled=!0),Mt=r.map(t,function(t){var e={name:t.label||t.language,language:t.language};return e})}mt.addTracksListener(t,"change",st),Mt&&mt.trigger("audioTracks",{currentTrack:Nt,tracks:Mt})}}function dt(t){Rt&&Rt.audioTracks&&Mt&&t>-1&&t<Rt.audioTracks.length&&t!==Nt&&(Rt.audioTracks[Nt].enabled=!1,Nt=t,Rt.audioTracks[Nt].enabled=!0,mt.trigger("audioTrackChanged",{currentTrack:Nt,tracks:Mt}))}function lt(){return Mt||[]}function ht(){return Nt}function ft(){if("hls"===_t[0].type){var t="video";0===Rt.videoHeight&&(t="audio"),mt.trigger("mediaType",{mediaType:t})}}this.state=a.IDLE,this.seeking=!1,r.extend(this,c,u),this.trigger=function(t,e){if(It)return c.trigger.call(this,t,e)},this.setState=function(t){if(It)return s.setState.call(this,t)};var Tt,kt,gt,vt,_t,mt=this,xt={click:L,durationchange:w,ended:rt,error:J,loadstart:A,loadeddata:I,loadedmetadata:O,canplay:F,playing:H,progress:C,pause:j,seeked:$,timeupdate:S,volumechange:tt,webkitbeginfullscreen:at,webkitendfullscreen:ct},pt=!1,bt=0,yt=-1,Et=-1,It=!0,At=-1,Lt=null,wt=!!E.sdkplatform,Ct=!1,St=!1,Mt=null,Nt=-1,Bt=-1,Dt={level:{}},Pt=document.getElementById(h),Rt=Pt?Pt.querySelector("video"):void 0;Rt=Rt||document.createElement("video"),Rt.className="jw-video jw-reset",this.isSDK=wt,this.video=Rt,r.isObject(E.cast)&&E.cast.appid&&Rt.setAttribute("disableRemotePlayback",""),o(xt,Rt),p||(Rt.controls=!0,Rt.controls=!1),Rt.setAttribute("x-webkit-airplay","allow"),Rt.setAttribute("webkit-playsinline",""),this.stop=function(){f(yt),It&&(q(),this.clearTracks(),e.isIE()&&Rt.pause(),this.setState(a.IDLE))},this.destroy=function(){d(xt,Rt),this.removeTracksListener(Rt.audioTracks,"change",st),this.removeTracksListener(Rt.textTracks,"change",mt.textTrackChangeHandler),this.remove(),this.off()},this.init=function(t){It&&(_t=t.sources,At=V(t.sources),t.sources.length&&"hls"!==t.sources[0].type&&this.sendMediaType(t.sources),gt=t.starttime||0,kt=t.duration||0,Dt.reason="",X(_t[At]),this.setupSideloadedTracks(t.tracks))},this.load=function(t){It&&(U(t.sources),t.sources.length&&"hls"!==t.sources[0].type&&this.sendMediaType(t.sources),_&&!Rt.hasAttribute("jw-played")||mt.setState(a.LOADING),K(t.starttime||0,t.duration||0))},this.play=function(){return mt.seeking?(mt.setState(a.LOADING),void mt.once(n.JWPLAYER_MEDIA_SEEKED,mt.play)):void Q()},this.pause=function(){f(yt),Rt.pause(),this.setState(a.PAUSED)},this.seek=function(t){if(It)if(t<0&&(t+=z()+Z()),0===bt&&this.trigger(n.JWPLAYER_MEDIA_SEEK,{position:Rt.currentTime,offset:t}),pt||(pt=!!Z()),pt){bt=0;try{mt.seeking=!0,Rt.currentTime=t}catch(e){mt.seeking=!1,bt=t}}else bt=t,m&&Rt.paused&&Q()},this.volume=function(t){t=e.between(t/100,0,1),Rt.volume=t},this.mute=function(t){Rt.muted=!!t},this.checkComplete=function(){return Ct},this.detachMedia=function(){return f(yt),this.disableTextTrack(),It=!1,Rt},this.attachMedia=function(){It=!0,pt=!1,this.seeking=!1,Rt.loop=!1,Ct&&nt()},this.setContainer=function(t){Tt=t,t.appendChild(Rt)},this.getContainer=function(){return Tt},this.remove=function(){q(),f(yt),Tt===Rt.parentNode&&Tt.removeChild(Rt)},this.setVisibility=function(e){e=!!e,e||x?t.style(Tt,{visibility:"visible",opacity:1}):t.style(Tt,{visibility:"",opacity:0})},this.resize=function(e,i,r){if(!(e&&i&&Rt.videoWidth&&Rt.videoHeight))return!1;var n={objectFit:"",width:"",height:""};if("uniform"===r){var a=e/i,s=Rt.videoWidth/Rt.videoHeight;Math.abs(a-s)<.09&&(n.objectFit="fill",r="exactfit")}var c=k||x||p||b;if(c){var u=-Math.floor(Rt.videoWidth/2+1),o=-Math.floor(Rt.videoHeight/2+1),d=Math.ceil(100*e/Rt.videoWidth)/100,l=Math.ceil(100*i/Rt.videoHeight)/100;"none"===r?d=l=1:"fill"===r?d=l=Math.max(d,l):"uniform"===r&&(d=l=Math.min(d,l)),n.width=Rt.videoWidth,n.height=Rt.videoHeight,n.top=n.left="50%",n.margin=0,t.transform(Rt,"translate("+u+"px, "+o+"px) scale("+d.toFixed(2)+", "+l.toFixed(2)+")")}return t.style(Rt,n),!1},this.setFullscreen=function(t){if(t=!!t){var i=e.tryCatch(function(){var t=Rt.webkitEnterFullscreen||Rt.webkitEnterFullScreen;t&&t.apply(Rt)});return!(i instanceof e.Error)&&mt.getFullScreen()}var r=Rt.webkitExitFullscreen||Rt.webkitExitFullScreen;return r&&r.apply(Rt),t},mt.getFullScreen=function(){return St||!!Rt.webkitDisplayingFullscreen},this.setCurrentQuality=function(t){if(At!==t&&t>=0&&_t&&_t.length>t){At=t,Dt.reason="api",Dt.level={},this.trigger(n.JWPLAYER_MEDIA_LEVEL_CHANGED,{currentQuality:t,levels:G(_t)}),E.qualityLabel=_t[t].label;var e=Rt.currentTime||0,i=Rt.duration||0;i<=0&&(i=kt),mt.setState(a.LOADING),K(e,i)}},this.getCurrentQuality=function(){return At},this.getQualityLevels=function(){return G(_t)},this.getName=function(){return{name:y}},this.setCurrentAudioTrack=dt,this.getAudioTracks=lt,this.getCurrentAudioTrack=ht}var f=window.clearTimeout,T=256,k=e.isIE(),g=e.isIE(9),v=e.isMSIE(),_=e.isMobile(),m=e.isFF(),x=e.isAndroidNative(),p=e.isIOS(7),b=e.isIOS(8),y="html5",E=function(){};return E.prototype=s,h.prototype=new E,h.getName=function(){return{name:"html5"}},h}.apply(e,r),!(void 0!==n&&(t.exports=n))}});
//# sourceMappingURL=provider.html5.863a3168ddc9ec65f0de.map