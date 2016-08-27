webpackJsonpjwplayer([8],{16:function(e,t,n){var r,i;r=[],i=function(){function e(){return{decode:function(e){if(!e)return"";if("string"!=typeof e)throw new Error("Error - expected string data.");return decodeURIComponent(encodeURIComponent(e))}}}function t(e){function t(e,t,n,r){return 3600*(0|e)+60*(0|t)+(0|n)+(0|r)/1e3}var n=e.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);return n?n[3]?t(n[1],n[2],n[3].replace(":",""),n[4]):n[1]>59?t(n[1],n[2],0,n[4]):t(0,n[1],n[2],n[4]):null}function n(){this.values=Object.create(null)}function r(e,t,n,r){var i=r?e.split(r):[e];for(var s in i)if("string"==typeof i[s]){var a=i[s].split(n);if(2===a.length){var o=a[0],c=a[1];t(o,c)}}}function i(e,i,s){function a(){var n=t(e);if(null===n)throw new Error("Malformed timestamp: "+u);return e=e.replace(/^[^\sa-zA-Z-]+/,""),n}function o(e,t){var i=new n;r(e,function(e,t){switch(e){case"region":for(var n=s.length-1;n>=0;n--)if(s[n].id===t){i.set(e,s[n].region);break}break;case"vertical":i.alt(e,t,["rl","lr"]);break;case"line":var r=t.split(","),a=r[0];i.integer(e,a),i.percent(e,a)&&i.set("snapToLines",!1),i.alt(e,a,["auto"]),2===r.length&&i.alt("lineAlign",r[1],["start","middle","end"]);break;case"position":r=t.split(","),i.percent(e,r[0]),2===r.length&&i.alt("positionAlign",r[1],["start","middle","end"]);break;case"size":i.percent(e,t);break;case"align":i.alt(e,t,["start","middle","end","left","right"])}},/:/,/\s/),t.region=i.get("region",null),t.vertical=i.get("vertical",""),t.line=i.get("line",-1),t.lineAlign=i.get("lineAlign","start"),t.snapToLines=i.get("snapToLines",!0),t.size=i.get("size",100),t.align=i.get("align","middle"),t.position=i.get("position",{start:0,left:0,middle:50,end:100,right:100},t.align),t.positionAlign=i.get("positionAlign",{start:"start",left:"start",middle:"middle",end:"end",right:"end"},t.align)}function c(){e=e.replace(/^\s+/,"")}var u=e;if(c(),i.startTime=a(),c(),"-->"!==e.substr(0,3))throw new Error("Malformed time stamp (time stamps must be separated by '-->'): "+u);e=e.substr(3),c(),i.endTime=a(),c(),o(e,i)}var s=function(t,n){this.window=t,this.state="INITIAL",this.buffer="",this.decoder=n||new e,this.regionList=[]};return n.prototype={set:function(e,t){this.get(e)||""===t||(this.values[e]=t)},get:function(e,t,n){return n?this.has(e)?this.values[e]:t[n]:this.has(e)?this.values[e]:t},has:function(e){return e in this.values},alt:function(e,t,n){for(var r=0;r<n.length;++r)if(t===n[r]){this.set(e,t);break}},integer:function(e,t){/^-?\d+$/.test(t)&&this.set(e,parseInt(t,10))},percent:function(e,t){var n;return!!((n=t.match(/^([\d]{1,3})(\.[\d]*)?%$/))&&(t=parseFloat(t),t>=0&&t<=100))&&(this.set(e,t),!0)}},s.prototype={parse:function(e){function t(){for(var e=s.buffer,t=0;t<e.length&&"\r"!==e[t]&&"\n"!==e[t];)++t;var n=e.substr(0,t);return"\r"===e[t]&&++t,"\n"===e[t]&&++t,s.buffer=e.substr(t),n}function n(e){r(e,function(e,t){switch(e){case"Region":console.log("parse region",t)}},/:/)}var s=this;e&&(s.buffer+=s.decoder.decode(e,{stream:!0}));try{var a;if("INITIAL"===s.state){if(!/\r\n|\n/.test(s.buffer))return this;a=t();var o=a.match(/^WEBVTT([ \t].*)?$/);if(!o||!o[0])throw new Error("Malformed WebVTT signature.");s.state="HEADER"}for(var c=!1;s.buffer;){if(!/\r\n|\n/.test(s.buffer))return this;switch(c?c=!1:a=t(),s.state){case"HEADER":/:/.test(a)?n(a):a||(s.state="ID");continue;case"NOTE":a||(s.state="ID");continue;case"ID":if(/^NOTE($|[ \t])/.test(a)){s.state="NOTE";break}if(!a)continue;if(s.cue=new s.window.VTTCue(0,0,""),s.state="CUE",a.indexOf("-->")===-1){s.cue.id=a;continue}case"CUE":try{i(a,s.cue,s.regionList)}catch(u){s.cue=null,s.state="BADCUE";continue}s.state="CUETEXT";continue;case"CUETEXT":var l=a.indexOf("-->")!==-1;if(!a||l&&(c=!0)){s.oncue&&s.oncue(s.cue),s.cue=null,s.state="ID";continue}s.cue.text&&(s.cue.text+="\n"),s.cue.text+=a;continue;case"BADCUE":a||(s.state="ID");continue}}}catch(u){"CUETEXT"===s.state&&s.cue&&s.oncue&&s.oncue(s.cue),s.cue=null,s.state="INITIAL"===s.state?"BADWEBVTT":"BADCUE"}return this},flush:function(){var e=this;try{if(e.buffer+=e.decoder.decode(),(e.cue||"HEADER"===e.state)&&(e.buffer+="\n\n",e.parse()),"INITIAL"===e.state)throw new Error("Malformed WebVTT signature.")}catch(t){throw t}return e.onflush&&e.onflush(),this}},s}.apply(t,r),!(void 0!==i&&(e.exports=i))}});
//# sourceMappingURL=vttparser.863a3168ddc9ec65f0de.map