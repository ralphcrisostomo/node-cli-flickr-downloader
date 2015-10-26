"use strict";var Download,ProgressBar,_,async,chalk,fs,mixin,request;_=require("lodash"),async=require("async"),request=require("superagent"),ProgressBar=require("progress"),chalk=require("chalk"),fs=require("fs"),mixin=require("./mixin"),Download=function(){function n(){this.retry=0}return n.prototype.run=function(n,e){return function(r){return function(t){return async.waterfall([r._getId(e),r._getPhoto(n),r._downloadVideo(e),r._updateManifest(e)],function(i,o){return"retry"===i?(mixin.write("red","\n------------------"),mixin.write("red","\nRetrying... ("+r.retry+")"),r.run(n,e)(t)):"continue"===i?r.run(n,e)(t):(r.retry=0,t(i,o))})}}(this)},n.prototype._getPhoto=function(n){return function(e){return function(e,r){var t;return t=e,n.photos.getSizes({api_key:process.env.FLICKR_API_KEY,photo_id:t.id},function(n,e){return _.assign(t,_.findWhere(e.sizes.size,{label:"Large 2048"})),r(n,t)})}}(this)},n.prototype._getId=function(n){return function(e){var r,t,i,o;return i=process.cwd()+"/"+n+"/manifest.json",o=require(i),r=_.filter(o,{status:"completed"}),t=_.find(o,{status:"created"}),_.isEmpty(t)?(mixin.write("green","\nDownload Complete"),e("completed",null)):(mixin.write("cyan","\n------------------"),mixin.write("cyan","\nIndex 		: "+((null!=r?r.length:void 0)+1)+" of "+(null!=o?o.length:void 0)),mixin.write("cyan","\nId 		: "+(null!=t?t.id:void 0)),mixin.write("cyan","\nName 		: "+(null!=t?t.name:void 0)),e(null,t))}},n.prototype._downloadVideo=function(n){return function(e){return function(r,t){var i,o;return i=r,o=i.source,mixin.write("cyan","\nUrl 		: "+o),request.get(o).parse(function(e){var r,o,u,s,a,l;return o=null!=(l=i.name+" ["+i.id+"].jpg")?l.replace(/\/+/g," "):void 0,a=process.cwd()+"/"+n,u=fs.createWriteStream(a+"/_"+o),s={complete:"=",incomplete:" ",width:20,total:parseInt(e.headers["content-length"],10)},r=new ProgressBar("Downloading 	: [:bar] :percent :etas",s),e.on("data",function(n){return r.tick(n.length)}),e.on("end",function(){return fs.rename(a+"/_"+o,a+"/"+o,function(n){return mixin.write("green","Downloaded 	: "+o),t(n,i)})}),e.pipe(u)}).end(function(n,r){return n?(e.retry++,t("retry",null)):void 0})}}(this)},n.prototype._updateManifest=function(n){return function(e,r){var t,i,o,u,s;return s=e,t=[],o=process.cwd()+"/"+n+"/manifest.json",u=require(o),null!=u&&u.forEach(function(n){return parseInt(null!=n?n.id:void 0)===parseInt(null!=s?s.id:void 0)&&(n.status="completed"),t.push(n)}),i=_.filter(t,{status:"completed"}),fs.writeFile(o,JSON.stringify(t,null,4),function(n){return function(n){return i.length<=t.length?r("continue",s):r(null,s)}}(this))}},n}(),module.exports=Download;