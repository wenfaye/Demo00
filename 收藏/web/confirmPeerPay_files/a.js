arale.cookie=function(name,value,props){var c=document.cookie;if(arguments.length==1){var matches=c.match(new RegExp("(?:^|; )"+arale.cookie._expEscapeString(name)+"=([^;]*)"));
return matches?decodeURIComponent(matches[1]):undefined}else{props=props||{};var exp=props.expires;
if(typeof exp=="number"){var d=new Date();d.setTime(d.getTime()+exp*24*60*60*1000);
exp=props.expires=d}if(exp&&exp.toUTCString){props.expires=exp.toUTCString()}value=encodeURIComponent(value);
var updatedCookie=name+"="+value,propName;for(propName in props){updatedCookie+="; "+propName;
var propValue=props[propName];if(propValue!==true){updatedCookie+="="+propValue}}document.cookie=updatedCookie
}};arale.cookie._expEscapeString=function(str,except){return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,function(ch){if(except&&except.indexOf(ch)!=-1){return ch
}return"\\"+ch})};arale.cookie.isSupported=function(){if(!("cookieEnabled" in navigator)){this("__djCookieTest__","CookiesAllowed");
navigator.cookieEnabled=this("__djCookieTest__")=="CookiesAllowed";if(navigator.cookieEnabled){this("__djCookieTest__","",{expires:-1})
}}return navigator.cookieEnabled};arale.module("arale.uri",(function(){var _re_search=/\?(.*)/,_re_hostptc=/(https|http)\:\/\/((\w+|\.)+)/,_re_hostnoptc=/(\w+|\.)+/,_re_portnoptc=/^https|^http\:\/\/(\w+|\.)+(\:\d+)/,_re_portptc=/(\w+|\.)+(\:\d+)/;
return{setParams:function(url,data){var params_readay=arale.uri.getParams(url);var params=null;
if(data){params=typeof(data)=="object"?$H(data).toQueryString():data}if(arale.uri.getProtocol(url)){var protocol=arale.uri.getProtocol(url)+"://"
}else{var protocol=""}url=protocol+arale.uri.getHost(url,true)+arale.uri.getPath(url);
if(params_readay){url+="?"+params_readay;url=params?url+"&"+params:url}else{url=params?url+="?"+params:url
}return url},getPath:function(url){var path="";if(/(.*)\?/.test(url)){url=/(.*)\?/.exec(url)[1]
}url=url.replace(/(http|https)\:\/\//,"");var index=url.indexOf("/");if(index>-1){return url.substring(index,url.length)
}return""},getPort:function(url){if(/\:(\d+)/.test(url)){return/\:(\d+)/.exec(url)[1]
}return"80"},getHost:function(url,nonedefaultport){var hostname=arale.uri.getHostName(url);
var port=arale.uri.getPort(url);if(nonedefaultport&&port=="80"){return hostname}else{return hostname+":"+port
}},getProtocol:function(url){var reg1=/^http|^https/,reg2=/^http\:|^https\:/;if(reg1.test(url)){return reg2.exec(url)[0].replace(":","")
}return null},getHostName:function(url){if(_re_hostptc.test(url)){return _re_hostptc.exec(url)[2]
}if(_re_hostnoptc.test(url)){return _re_hostnoptc.exec(url)[0]}return null},getParams:function(url,isobject){var result={},params=_re_search.exec(url);
if(!params){return null}if(params.length&&params.length>=2){params=params[1].split("&");
for(var p;p=params.shift();){if(p.split("=").length>1){result[p.split("=")[0]]=p.split("=")[1]
}}if(isobject){return result}else{return $H(result).toQueryString()}}return null},getHash:function(url){var h=url||window.location.hash;
if(h.charAt(0)=="#"){h=h.substring(1)}else{if(h.lastIndexOf("#")>-1){h=h.substring(h.lastIndexOf("#")+1)
}}return arale.browser.Engine.gecko?h:decodeURIComponent(h)}}}),"$URI");URI=$URI;arale.module("arale.ajax",function(){var f={_input_charset:"utf-8"},h=arale.cookie("ctoken");h&&(f.ctoken=h);var c=function(a,b){this._options={headers:{"X-Requested-With":"XMLHttpRequest",Accept:"text/javascript, text/html, application/xml, text/xml, */*"},async:!0,method:"get",urlEncoded:!0,encoding:"utf-8",timeout:0,timeoutTimer:null,cache:!1,success:function(){},failure:function(){},arguments:null,scope:window,dataType:"json"};this._xhr=arale.browser.Request();this._response={};this._url=a;this._running=
!1;$H(this._options).extend(b||{});this._response.arguments=this._options.arguments;this._response.scope=this._options.scope},g=function(a){function b(b){if("string"!==typeof b||!b)return!1;b=b.replace(/^\s+|\s+$/g,"");return/^[\],:{}\s]*$/.test(b.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))}var d;if(d=window.JSON)if(d=window.JSON.parse)try{JSON.parse("{ a: 1 }"),d=!0}catch(e){d=
!1}g=d?function(a){a=b(a)?window.JSON.parse(a):null;return a}:function(a){a=b(a)?(new Function("return ("+a+")"))():null;return a};return g(a)};arale.augment(c,{setHeader:function(a,b){$H(this._options.headers).set(a,b);return this},getHeader:function(a){return arale.$try(function(){return this._xhr.getResponseHeader(a)})},onSuccess:function(){var a=this._options.scope;this._response.timeout=!1;this._options.success.call(a,this._response[this._options.dataType]||this._response)},onFailure:function(){this._options.failure.call(this._options.scope,
this._response)},send:function(a){var b=this,d=this._options;this.cancel();this._xhr=arale.browser.Request();var e=this._url,a=arale.mixin(a,f);"post"==this._options.method.toLowerCase()&&this._options.form&&(a=arale.mixin(a,this.formToObject($(this._options.form)),!0));d.async&&0<d.timeout&&(d.timeoutTimer=setTimeout(function(){b.cancel();b._response.text=null;b._response.xml=null;b._response.json=null;b._response.timeout=!0;b.onFailure()},d.timeout));this._options.urlEncoded&&$H(a).each(function(b){var d=
a[b];d&&(a[b]=$S(d).urlEncode())});a=$H(a).toQueryString();this._running=!0;this._options.urlEncoded&&"post"==this._options.method.toLowerCase()&&$H(this._options.headers).set("Content-Type","application/x-www-form-urlencoded; charset="+this._options.encoding.toLowerCase());this._options.cache||(a.noCache=(new Date).getTime());a&&"get"==this._options.method.toLowerCase()&&(e=0<e.indexOf("?")?e+"&"+a:e+"?"+a,a=null);d=e;e=$Ajax.decorateUrl(e);this._xhr.open(this._options.method.toUpperCase(),e?e:d,
this._options.async);$H(this._options.headers).each(function(b,a){try{this._xhr.setRequestHeader(b,a)}catch(d){}},this);this._xhr.onreadystatechange=arale.hitch(this,this.onStateChange);this._xhr.send(a);if(!this._options.async)this.onStateChange();return this},cancel:function(){if(!this._running)return this;this._running=!1;this._xhr.onreadystatechange=function(){};this._xhr.abort();this._xhr=arale.browser.Request();return this},onStateChange:function(){var a=this,b=this._options;if(4==this._xhr.readyState&&
this._running)if(this._running=!1,arale.$try(function(){a._status=a._xhr.status}),this._xhr.onreadystatechange=function(){},b.timeoutTimer&&(clearTimeout(b.timeoutTimer),b.timeoutTimer=null),this._response.status=this._xhr.status,200==this._xhr.status){this._response.text=this._xhr.responseText;this._response.xml=this._xhr.responseXML;if("json"==this._options.dataType)try{this._response.json=g(this._xhr.responseText)}catch(d){this._response.json=null}this.onSuccess()}else this._response.text=null,
this._response.xml=null,this._response.json=null,this.onFailure()},formToObject:function(a){var b={},d=this;$A($$(":input",a)).each(function(a){var c=a.attr("name"),g=(a.attr("type")||"").toLowerCase();if(c&&g&&-1=="file|submit|image|reset|button|".indexOf(g)&&!a.node.disabled){a=d.fieldToObject(a);if(null!==a){var f=b[c];"string"==typeof f?b[c]=[f,a]:arale.isArray(f)?f.push(a):b[c]=a}"image"==g&&(b[c+".x"]=b[c+".y"]=b[c].x=b[c].y=0)}});return b},fieldToObject:function(a){var b=null;if(a){var c=a.attr("name"),
e=(a.attr("type")||"").toLowerCase();c&&e&&!a.node.disabled&&("radio"==e||"checkbox"==e?a.node.checked&&(b=a.node.value):a.node.multiple?(b=[],$A($$("option",a)).each(function(a){a.node.selected&&b.push(a.node.value)})):b=a.node.value)}return b}});return{getAjaxFactory:function(){return c},get:function(a,b,d){arale.isFunction(b)&&(b={success:b});a=new c(a,b);d||a.send(b.data);return a},post:function(a,b,d){arale.isFunction(b)&&(b={succuss:b});b=arale.mixin({method:"post"},b);a=new c(a,b);d||a.send(b.data);
return a},jsonp:function(a,b,c){arale.isFunction(b)&&(b={succuss:b});a=new $Jsonp.JsonpFactory(a,b);b=b.data||{};b._input_charset="utf-8";c||a.send(b);return a},text:function(a){var b="";(new c(a+"?date="+(new Date).getTime(),{async:!1,dataType:"text",success:function(a){b=a}})).send();return b}}}(),"$Ajax");Ajax=$Ajax;$Ajax.decorateUrl=function(f){return f};
arale.module("arale.jsonp",function(){arale.cache.callback_num=1;arale.cache.callbacks=arale.cache.callbacks||{};var f={failure:function(){},success:function(){},timeout:0,callparam:"_callback"},h=function(c,g){this._url=c;this._options=g||{};arale.mixin(this._options,f);this._callback_id=1;this._timeout_error=null};arale.augment(h,{send:function(c){var f=this;if(!document.documentElement.firstChild)return null;c=c||{};c.r=(new Date).getTime();var a=arale.cookie("ctoken");a&&(c.ctoken=a);$H(c).each(function(a){var b=
c[a];b&&(c[a]=$S(b).urlEncode())});arale.cache.callback_num++;this._callback_id="jsonp"+arale.cache.callback_num;arale.cache.callbacks[this._callback_id]=this._options.success;c[this._options.callparam]="arale.cache.callbacks."+this._callback_id;0<this._options.timeout&&(this._timeout_error=setTimeout(this._options.failure,this._options.timeout));var b=document.createElement("script");b.setAttribute("type","text/javascript");b.setAttribute("id",this._callback_id);a=$URI.setParams(this._url,c);if($Ajax.decorateUrl)var d=
a,a=(a=$Ajax.decorateUrl(a))?a:d;b.setAttribute("src",a);this._options.charset&&b.setAttribute("charset",this._options.charset);b.onloadDone=!1;b.onload=function(){clearTimeout(f._timeout_error)};b.onreadystatechange=function(){if(("loaded"===b.readyState||"complete"===b.readyState)&&!b.onloadDone){b.onloadDone=true;b.onload()}};document.getElementsByTagName("head")[0].appendChild(b)},cancel:function(){var c=$(this._callback_id).node;c&&"SCRIPT"==c.tagName.toUpperCase()&&(c.parentNode.removeChild(c),
delete arale.cache.callbacks[this._callback_id],clearTimeout(this._timeout_error))}});return{JsonpFactory:h}}(),"$Jsonp");(function(){var d=arale._from_token||"_from_token",e=function(){if(arale.cookie.isSupported()){var a=arale.cookie(d);if(!a)return!1}return a}();if(e)for(var f=["get","post","jsonp","text"],a,b,c=0,g=f.length;c<g;c++)b=f[c],a=$Ajax[b],$Ajax[b]=function(){var b=[].slice.call(arguments,0);b[0]=$URI.setParams(b[0],{_form_token:e});return a.apply($Ajax,b)}})();arale.namespace("alipay.http");
(function(d){var e={_input_charset:"utf-8"},f=function(a,b,c){if("json"==a)return new (d.ajax.getAjaxFactory())(b,c);if("jsonp"==a)return new $Jsonp.JsonpFactory(b,c)};alipay.http.core=function(a,b){var c=this;this.url=a;this.options=b;this.options.data=this.options.data||{};this.options.successCallback=this.options.success;this.options.success=function(a){var a=a.json||a,b=c.options;if(a)switch(a.stat){case "ok":b.successCallback(a);break;case "deny":alipay.http.core.callfromiframe?self.parent.location.reload():
location.href=a.target;break;default:b.failure(a)}};d.mixin(this.options.data,e);this.cache={};this.request=f(b.format||"jsonp",a,b)};alipay.http.core.prototype.call=function(a){a=a?d.mixin(a,this.options.data):this.options.data;this.request.send(a)}})(arale);arale.module("arale.declare",function(){var a=arale,contextStack=[];var safeMixin=function(){var baseClass=arguments[0],clazzs=[].slice.call(arguments,1);
for(var i=0,len=clazzs.length;i<len;i++){var clazz=clazzs[i];a._mixin(baseClass.prototype,clazz.prototype)
}};var getPpFn=function(couns,fn,fnName){var superCouns=couns.superCouns,superProto=superCouns.prototype;
if(fn!==superProto[fnName]){return superProto[fnName]}else{return getPpFn(superCouns,fn,fnName)
}};var getFnName=function(couns,fn){if(fn.fnName){return fn.fnName}var fnName=$H(couns.prototype).keyOf(fn);
if(fnName==null){return getFnName(couns.superCouns,fn)}fn.fnName=fnName;return fnName
};var ConstructorFactory=function(className,parents,proto){var current=a.namespace(className),parent=null;
var couns=function(){this.declaredClass=className;this.init&&this.init.apply(this,arguments);
this.create&&this.create.apply(this,arguments)};if(parents&&arale.isArray(parents)){parent=parents.shift()
}else{parent=parents}parent&&a.inherits(couns,parent);a.augment(couns,proto);couns.prototype.parent=function(){var couns=this.constructor;
var fn=arguments[0].callee;var fnName=getFnName(couns,fn);fn=getPpFn(couns,fn,fnName);
return fn.apply(this,arguments[0])};if(parents&&parents.length>0){safeMixin.apply(null,[couns].concat(parents))
}current._parentModule[current._moduleName]=couns};return ConstructorFactory},"$Declare");(function(){var cache={};arale.tmpl=function tmpl(str,data,opt_context){var fn=!/\W/.test(str)?cache[str]=cache[str]||arale.tmpl(document.getElementById(str).innerHTML):new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+str.replace(/[\r\t\n]/g," ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");
return data?fn.call(opt_context||window,data):fn}})();arale.module("arale.aspect",(function(arale){var a=arale,aop=arale.aspect,ap=Array.prototype,contextStack=[],context;
var Advice=function(){this.next_before=this.prev_before=this.next_around=this.prev_around=this.next_afterReturning=this.prev_afterReturning=this.next_afterThrowing=this.prev_afterThrowing=this;
this.counter=0};arale.augment(Advice,{add:function(advice){var dyn=a.isFunction(advice),node={advice:advice,dynamic:dyn};
this._add(node,"before","",dyn,advice);this._add(node,"around","",dyn,advice);this._add(node,"after","Returning",dyn,advice);
this._add(node,"after","Throwing",dyn,advice);++this.counter;return node},_add:function(node,topic,subtopic,dyn,advice){var full=topic+subtopic;
if(dyn||advice[topic]||(subtopic&&advice[full])){var next="next_"+full,prev="prev_"+full;
(node[prev]=this[prev])[next]=node;(node[next]=this)[prev]=node}},remove:function(node){this._remove(node,"before");
this._remove(node,"around");this._remove(node,"afterReturning");this._remove(node,"afterThrowing");
--this.counter},_remove:function(node,topic){var next="next_"+topic,prev="prev_"+topic;
if(node[next]){node[next][prev]=node[prev];node[prev][next]=node[next]}},isEmpty:function(){return !this.counter
}});var getDispatcher=function(){return function(){var self=arguments.callee,advices=self.advices,ret,i,a,e,t;
if(context){contextStack.push(context)}context={instance:this,joinPoint:self,depth:contextStack.length,around:advices.prev_around,dynAdvices:[],dynIndex:0};
try{for(i=advices.prev_before;i!=advices;i=i.prev_before){if(i.dynamic){context.dynAdvices.push(a=new i.advice(context));
if(t=a.before){t.apply(a,arguments)}}else{t=i.advice;t.before.apply(t,arguments)}}try{ret=(advices.prev_around==advices?self.target:arale.aspect.proceed).apply(this,arguments)
}catch(e){context.dynIndex=context.dynAdvices.length;for(i=advices.next_afterThrowing;
i!=advices;i=i.next_afterThrowing){a=i.dynamic?context.dynAdvices[--context.dynIndex]:i.advice;
if(t=a.afterThrowing){t.call(a,e)}if(t=a.after){t.call(a)}}throw e}context.dynIndex=context.dynAdvices.length;
for(i=advices.next_afterReturning;i!=advices;i=i.next_afterReturning){a=i.dynamic?context.dynAdvices[--context.dynIndex]:i.advice;
if(t=a.afterReturning){t.call(a,ret)}if(t=a.after){t.apply(a,arguments)}}var ls=self._listeners;
for(i in ls){if(!(i in ap)){ls[i].apply(this,arguments)}}}finally{for(i=0;i<context.dynAdvices.length;
++i){a=context.dynAdvices[i];if(a.destroy){a.destroy()}}context=contextStack.length?contextStack.pop():null
}return ret}};return{advise:function(obj,method,advice){if(typeof obj!="object"){obj=obj.prototype
}var methods=[];if(!(method instanceof Array)){method=[method]}for(var j=0;j<method.length;
++j){var t=method[j];if(t instanceof RegExp){for(var i in obj){if(a.isFunction(obj[i])&&t.test(i)){methods.push(i)
}}}else{if(a.isFunction(obj[t])){methods.push(t)}}}if(!a.isArray(advice)){advice=[advice]
}return arale.aspect.adviseRaw(obj,methods,advice)},adviseRaw:function(obj,methods,advices){if(!methods.length||!advices.length){return null
}var m={},al=advices.length;for(var i=methods.length-1;i>=0;--i){var name=methods[i],o=obj[name],ao=new Array(al),t=o.advices;
if(!t){var x=obj[name]=getDispatcher();x.target=o.target||o;x.targetName=name;x._listeners=o._listeners||[];
x.advices=new Advice;t=x.advices}for(var j=0;j<al;++j){ao[j]=t.add(advices[j])}m[name]=ao
}return[obj,m]},unadvise:function(handle){if(!handle){return}var obj=handle[0],methods=handle[1];
for(var name in methods){var o=obj[name],t=o.advices,ao=methods[name];for(var i=ao.length-1;
i>=0;--i){t.remove(ao[i])}if(t.isEmpty()){var empty=true,ls=o._listeners;if(ls.length){for(i in ls){if(!(i in ap)){empty=false;
break}}}if(empty){obj[name]=o.target}else{var x=obj[name]=d._listener.getDispatcher();
x.target=o.target;x._listeners=ls}}}},getContext:function(){return context},getContextStack:function(){return contextStack
},proceed:function(){var joinPoint=context.joinPoint,advices=joinPoint.advices;for(var c=context.around;
c!=advices;c=context.around){context.around=c.prev_around;if(c.dynamic){var a=context.dynAdvices[context.dynIndex++],t=a.around;
if(t){return t.apply(a,arguments)}}else{return c.advice.around.apply(c.advice,arguments)
}}return joinPoint.target.apply(context.instance,arguments)}}})(arale),"$Aspect");
Aspect=$Aspect;arale.declare("aralex.View",null,{show:function(){this.domNode&&$Node(this.domNode).setStyle("display","block")
},hide:function(){this.domNode&&$Node(this.domNode).setStyle("display","none")}});
arale.declare("aralex.Widget",null,{id:null,domNode:null,init:function(params){},create:function(params){arale.mixin(this,params,true);
this._connects=[];this.actionFilters={};this.beforeCreate.apply(this,arguments);this.initDom.apply(this,arguments);
this.bind.apply(this,arguments);this.postCreate();this._created=true},beforeCreate:function(){},initDom:function(){if(this.id){this.domNode=$(this.id)
}},postCreate:function(){},bind:function(){},addEvent:function(eventType,handler,selector){var handler=$E.delegate(this.domNode,eventType,arale.hitch(this,handler),selector);
this._connects.push(handler)},aroundFn:function(fn){var that=this;var tracer={before:function(){$E.publish(that._getEventTopic(fn,"before"),[].slice.call(arguments))
},after:function(){$E.publish(that._getEventTopic(fn,"after"),[].slice.call(arguments))
}};$Aspect.advise(this,fn,tracer);this.defaultFn(fn)},defaultFn:function(fn){var b="before"+$S(fn).capitalize();
var a="after"+$S(fn).capitalize();this[b]&&this.before(fn,this[b]);this[a]&&this.after(fn,this[a]);
var that=this;var tracer={around:function(){var checkFuncs;if(checkFuncs=that.getActionFilters_(fn)){for(var e in checkFuncs){var isValid=checkFuncs[e];
if(arale.isFunction(isValid)&&!isValid.apply(that,arguments)){return}}}return arale.aspect.proceed.apply(null,arguments)
}};$Aspect.advise(this,fn,tracer)},addActionFilter:function(fn,filter){var id=arale.getUniqueId();
(this.actionFilters[fn]||(this.actionFilters[fn]={}))[id]=filter;return[fn,id]},getActionFilters_:function(fn){return this.actionFilters[fn]
},removeActionFilter:function(handler){if(arale.isArray(handler)){var fn=handler[0],id=handler[1];
if(fn&&arale.isNumber(id)&&arale.isObject(this.actionFilters[fn])){delete this.actionFilters[fn][id]
}}},_getEventTopic:function(fn,phase){return this.declaredClass+"/"+(this.id||1)+"/"+fn+"/"+phase
},before:function(fn,callback){return $E.subscribe(this._getEventTopic(fn,"before"),arale.hitch(this,callback))
},after:function(fn,callback){return $E.subscribe(this._getEventTopic(fn,"after"),arale.hitch(this,callback))
},rmFn:function(handler){$E.unsubscribe(handler)},attr:function(key,value){if((key in this)&&value!==undefined){return(this[key]=value)
}return this[key]},destroy:function(){$A(this._connects).each(function(handler){$E.disConnect(handler)
})}});arale.declare("aralex.TplWidget",aralex.Widget,{onlyWidget:false,srcId:null,parentId:null,data:null,templatePath:null,tmpl:null,tmplReg:/<script\s+type=\"text\/html"\s+id=\"([^"]+)\"[^>]*>([\s\S]*?)<\/script>/g,templateString:null,isUrlDecode:true,initDom:function(){this.tmpl={};
this._initParent();if(!this.id){this._initWidgetId.apply(this,arguments)}if(!this.domNode){this._initDomNode.apply(this,arguments)
}},_initParent:function(){this.parentNode=this.parentId?$(this.parentId):$(document.body)
},_initWidgetId:function(params){if(this.srcId){this.id=this.srcId;return}if(this.domNode){this.id=$(this.domNode).attr("id")
}else{this.id=arale.getUniqueId(this.declaredClass.replace(/\./g,"_"))}},_initDomNode:function(params){this._initTmpl();
this._mixinProperties();this.domNode=$Node($D.toDom(this.templateString));this.domNode.attr("id",this.id);
if(this.srcId){$(this.srcId).replace(this.domNode)}else{this.domNode.inject(this.parentNode.node,"bottom")
}if(this.data){this.renderData(this.data)}},_mixinProperties:function(){this.templateString=$S(this.templateString).substitute(this)
},_initTmpl:function(){var that=this;if(!this.templateString){this.templateString=$Ajax.text(this.templatePath)
}else{if(this.isUrlDecode){this.templateString=$S(this.templateString).urlDecode()
}}var num=0,defaultTmpl;this.templateString=this.templateString.replace(this.tmplReg,function(tmpl,id,tmplContent){that.tmpl[id]=tmplContent;
num++;defaultTmpl=id;return""});if(num==1){this.defaultTmpl=defaultTmpl}},renderData:function(data,tmplId,isReplace){var that=this;
if(tmplId){this._fillTpl(data,tmplId,isReplace)}else{$H(this.tmpl).each(function(tmplId,tmpl,isReplace){that._fillTpl(data,tmplId)
})}},_fillTpl:function(data,tmplId,isReplace){var html=this.getTmplHtml(data,tmplId);
if(isReplace){var id=$(this._getTmplId(tmplId)).attr("id");var node=$D.toDom(html);
$Node(node).attr("id",id);$D.replace($Node(node).node,node)}else{$(this._getTmplId(tmplId)).setHtml(html)
}},_getTmplId:function(tmplId){if(this.onlyWidget){return tmplId}else{return this.id+"_"+tmplId
}},getTmplHtml:function(data,tmplId){var tmpl=this.tmpl[tmplId];return arale.tmpl(tmpl,data,this)
}});(function(){function Animator(options){this.setOptions(options);var _this=this;this.timerDelegate=function(){_this.onTimerEvent()
};this.subjects=[];this.target=0;this.state=0;this.lastTime=null}Animator.prototype={setOptions:function(options){this.options=Animator.applyDefaults({interval:20,duration:400,onComplete:function(){},onStep:function(){},transition:Animator.tx.easeInOut},options)
},seekTo:function(to){this.seekFromTo(this.state,to)},seekFromTo:function(from,to){this.target=Math.max(0,Math.min(1,to));
this.state=Math.max(0,Math.min(1,from));this.lastTime=new Date().getTime();if(!this.intervalId){this.intervalId=window.setInterval(this.timerDelegate,this.options.interval)
}},jumpTo:function(to){this.target=this.state=Math.max(0,Math.min(1,to));this.propagate()
},toggle:function(){this.seekTo(1-this.target)},addSubject:function(subject){this.subjects[this.subjects.length]=subject;
return this},clearSubjects:function(){this.subjects=[]},propagate:function(){var value=this.options.transition(this.state);
for(var i=0;i<this.subjects.length;i++){if(this.subjects[i].setState){this.subjects[i].setState(value)
}else{this.subjects[i](value)}}},onTimerEvent:function(){var now=new Date().getTime();
var timePassed=now-this.lastTime;this.lastTime=now;var movement=(timePassed/this.options.duration)*(this.state<this.target?1:-1);
if(Math.abs(movement)>=Math.abs(this.state-this.target)){this.state=this.target}else{this.state+=movement
}try{this.propagate()}finally{this.options.onStep.call(this);if(this.target==this.state){window.clearInterval(this.intervalId);
this.intervalId=null;this.options.onComplete.call(this)}}},play:function(){this.seekFromTo(0,1)
},reverse:function(){this.seekFromTo(1,0)},inspect:function(){var str="#<Animator:\n";
for(var i=0;i<this.subjects.length;i++){str+=this.subjects[i].inspect()}str+=">";
return str}};Animator.applyDefaults=function(defaults,prefs){prefs=prefs||{};var prop,result={};
for(prop in defaults){result[prop]=prefs[prop]!==undefined?prefs[prop]:defaults[prop]
}return result};Animator.makeArray=function(o){if(o==null){return[]}if(!o.length){return[o]
}var result=[];for(var i=0;i<o.length;i++){result[i]=o[i]}return result};Animator.camelize=function(string){var oStringList=string.split("-");
if(oStringList.length==1){return oStringList[0]}var camelizedString=string.indexOf("-")==0?oStringList[0].charAt(0).toUpperCase()+oStringList[0].substring(1):oStringList[0];
for(var i=1,len=oStringList.length;i<len;i++){var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1)
}return camelizedString};Animator.apply=function(el,style,options){if(style instanceof Array){return new Animator(options).addSubject(new CSSStyleSubject(el,style[0],style[1]))
}return new Animator(options).addSubject(new CSSStyleSubject(el,style))};Animator.makeEaseIn=function(a){return function(state){return Math.pow(state,a*2)
}};Animator.makeEaseOut=function(a){return function(state){return 1-Math.pow(1-state,a*2)
}};Animator.makeElastic=function(bounces){return function(state){state=Animator.tx.easeInOut(state);
return((1-Math.cos(state*Math.PI*bounces))*(1-state))+state}};Animator.makeADSR=function(attackEnd,decayEnd,sustainEnd,sustainLevel){if(sustainLevel==null){sustainLevel=0.5
}return function(state){if(state<attackEnd){return state/attackEnd}if(state<decayEnd){return 1-((state-attackEnd)/(decayEnd-attackEnd)*(1-sustainLevel))
}if(state<sustainEnd){return sustainLevel}return sustainLevel*(1-((state-sustainEnd)/(1-sustainEnd)))
}};Animator.makeBounce=function(bounces){var fn=Animator.makeElastic(bounces);return function(state){state=fn(state);
return state<=1?state:2-state}};Animator.tx={easeInOut:function(pos){return((-Math.cos(pos*Math.PI)/2)+0.5)
},linear:function(x){return x},easeIn:Animator.makeEaseIn(1.5),easeOut:Animator.makeEaseOut(1.5),strongEaseIn:Animator.makeEaseIn(2.5),strongEaseOut:Animator.makeEaseOut(2.5),elastic:Animator.makeElastic(1),veryElastic:Animator.makeElastic(3),bouncy:Animator.makeBounce(1),veryBouncy:Animator.makeBounce(3)};
function NumericalStyleSubject(els,property,from,to,units){this.els=Animator.makeArray(els);
if(property=="opacity"&&window.ActiveXObject&&Number(arale.browser.ver())<9){this.property="filter"
}else{this.property=Animator.camelize(property)}this.from=parseFloat(from);this.to=parseFloat(to);
this.units=units!=null?units:"px"}NumericalStyleSubject.prototype={setState:function(state){var style=this.getStyle(state);
var visibility=(this.property=="opacity"&&state==0)?"hidden":"";var j=0;for(var i=0;
i<this.els.length;i++){try{this.els[i].style[this.property]=style}catch(e){if(this.property!="fontWeight"){throw e
}}if(j++>20){return}}},getStyle:function(state){state=this.from+((this.to-this.from)*state);
if(this.property=="filter"){return"alpha(opacity="+Math.round(state*100)+")"}if(this.property=="opacity"){return state
}return Math.round(state)+this.units},inspect:function(){return"\t"+this.property+"("+this.from+this.units+" to "+this.to+this.units+")\n"
}};function ColorStyleSubject(els,property,from,to){this.els=Animator.makeArray(els);
this.property=Animator.camelize(property);this.to=this.expandColor(to);this.from=this.expandColor(from);
this.origFrom=from;this.origTo=to}ColorStyleSubject.prototype={expandColor:function(color){var hexColor,red,green,blue;
hexColor=ColorStyleSubject.parseColor(color);if(hexColor){red=parseInt(hexColor.slice(1,3),16);
green=parseInt(hexColor.slice(3,5),16);blue=parseInt(hexColor.slice(5,7),16);return[red,green,blue]
}if(window.DEBUG){alert("Invalid colour: '"+color+"'")}},getValueForState:function(color,state){return Math.round(this.from[color]+((this.to[color]-this.from[color])*state))
},setState:function(state){var color="#"+ColorStyleSubject.toColorPart(this.getValueForState(0,state))+ColorStyleSubject.toColorPart(this.getValueForState(1,state))+ColorStyleSubject.toColorPart(this.getValueForState(2,state));
for(var i=0;i<this.els.length;i++){this.els[i].style[this.property]=color}},inspect:function(){return"\t"+this.property+"("+this.origFrom+" to "+this.origTo+")\n"
}};ColorStyleSubject.parseColor=function(string){var color="#",match;if(match=ColorStyleSubject.parseColor.rgbRe.exec(string)){var part;
for(var i=1;i<=3;i++){part=Math.max(0,Math.min(255,parseInt(match[i])));color+=ColorStyleSubject.toColorPart(part)
}return color}if(match=ColorStyleSubject.parseColor.hexRe.exec(string)){if(match[1].length==3){for(var i=0;
i<3;i++){color+=match[1].charAt(i)+match[1].charAt(i)}return color}return"#"+match[1]
}return false};ColorStyleSubject.toColorPart=function(number){if(number>255){number=255
}var digits=number.toString(16);if(number<16){return"0"+digits}return digits};ColorStyleSubject.parseColor.rgbRe=/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
ColorStyleSubject.parseColor.hexRe=/^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;function DiscreteStyleSubject(els,property,from,to,threshold){this.els=Animator.makeArray(els);
this.property=Animator.camelize(property);this.from=from;this.to=to;this.threshold=threshold||0.5
}DiscreteStyleSubject.prototype={setState:function(state){var j=0;for(var i=0;i<this.els.length;
i++){this.els[i].style[this.property]=state<=this.threshold?this.from:this.to}},inspect:function(){return"\t"+this.property+"("+this.from+" to "+this.to+" @ "+this.threshold+")\n"
}};function CSSStyleSubject(els,style1,style2){els=Animator.makeArray(els);this.subjects=[];
if(els.length==0){return}var prop,toStyle,fromStyle;if(style2){fromStyle=this.parseStyle(style1,els[0]);
toStyle=this.parseStyle(style2,els[0])}else{toStyle=this.parseStyle(style1,els[0]);
fromStyle={};for(prop in toStyle){fromStyle[prop]=CSSStyleSubject.getStyle(els[0],prop)
}}var prop;for(prop in fromStyle){if(fromStyle[prop]==toStyle[prop]){delete fromStyle[prop];
delete toStyle[prop]}}var prop,units,match,type,from,to;for(prop in fromStyle){var fromProp=String(fromStyle[prop]);
var toProp=String(toStyle[prop]);if(toStyle[prop]==null){if(window.DEBUG){alert("No to style provided for '"+prop+'"')
}continue}if(from=ColorStyleSubject.parseColor(fromProp)){to=ColorStyleSubject.parseColor(toProp);
type=ColorStyleSubject}else{if(fromProp.match(CSSStyleSubject.numericalRe)&&toProp.match(CSSStyleSubject.numericalRe)){from=parseFloat(fromProp);
to=parseFloat(toProp);type=NumericalStyleSubject;match=CSSStyleSubject.numericalRe.exec(fromProp);
var reResult=CSSStyleSubject.numericalRe.exec(toProp);if(match[1]!=null){units=match[1]
}else{if(reResult[1]!=null){units=reResult[1]}else{units=reResult}}}else{if(fromProp.match(CSSStyleSubject.discreteRe)&&toProp.match(CSSStyleSubject.discreteRe)){from=fromProp;
to=toProp;type=DiscreteStyleSubject;units=0}else{if(window.DEBUG){alert("Unrecognised format for value of "+prop+": '"+fromStyle[prop]+"'")
}continue}}}this.subjects[this.subjects.length]=new type(els,prop,from,to,units)}}CSSStyleSubject.prototype={parseStyle:function(style,el){var rtn={};
if(style.indexOf(":")!=-1){var styles=style.split(";");for(var i=0;i<styles.length;
i++){var parts=CSSStyleSubject.ruleRe.exec(styles[i]);if(parts){rtn[parts[1]]=parts[2]
}}}else{var prop,value,oldClass;oldClass=el.className;el.className=style;for(var i=0;
i<CSSStyleSubject.cssProperties.length;i++){prop=CSSStyleSubject.cssProperties[i];
value=CSSStyleSubject.getStyle(el,prop);if(value!=null){rtn[prop]=value}}el.className=oldClass
}return rtn},setState:function(state){for(var i=0;i<this.subjects.length;i++){this.subjects[i].setState(state)
}},inspect:function(){var str="";for(var i=0;i<this.subjects.length;i++){str+=this.subjects[i].inspect()
}return str}};CSSStyleSubject.getStyle=function(el,property){var style;if(document.defaultView&&document.defaultView.getComputedStyle){style=document.defaultView.getComputedStyle(el,"").getPropertyValue(property);
if(style){return style}}property=Animator.camelize(property);if(el.currentStyle){style=el.currentStyle[property]
}return style||el.style[property]};CSSStyleSubject.ruleRe=/^\s*([a-zA-Z\-]+)\s*:\s*(\S(.+\S)?)\s*$/;
CSSStyleSubject.numericalRe=/^-?\d+(?:\.\d+)?(%|[a-zA-Z]{2})?$/;CSSStyleSubject.discreteRe=/^\w+$/;
CSSStyleSubject.cssProperties=["azimuth","background","background-attachment","background-color","background-image","background-position","background-repeat","border-collapse","border-color","border-spacing","border-style","border-top","border-top-color","border-right-color","border-bottom-color","border-left-color","border-top-style","border-right-style","border-bottom-style","border-left-style","border-top-width","border-right-width","border-bottom-width","border-left-width","border-width","bottom","clear","clip","color","content","cursor","direction","display","elevation","empty-cells","css-float","font","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","height","left","letter-spacing","line-height","list-style","list-style-image","list-style-position","list-style-type","margin","margin-top","margin-right","margin-bottom","margin-left","max-height","max-width","min-height","min-width","orphans","outline","outline-color","outline-style","outline-width","overflow","padding","padding-top","padding-right","padding-bottom","padding-left","pause","position","right","size","table-layout","text-align","text-decoration","text-indent","text-shadow","text-transform","top","vertical-align","visibility","white-space","width","word-spacing","z-index","opacity","outline-offset","overflow-x","overflow-y"];
function AnimatorChain(animators,options){this.animators=animators;this.setOptions(options);
for(var i=0;i<this.animators.length;i++){this.listenTo(this.animators[i])}this.forwards=false;
this.current=0}AnimatorChain.prototype={setOptions:function(options){this.options=Animator.applyDefaults({resetOnPlay:true},options)
},play:function(){this.forwards=true;this.current=-1;if(this.options.resetOnPlay){for(var i=0;
i<this.animators.length;i++){this.animators[i].jumpTo(0)}}this.advance()},reverse:function(){this.forwards=false;
this.current=this.animators.length;if(this.options.resetOnPlay){for(var i=0;i<this.animators.length;
i++){this.animators[i].jumpTo(1)}}this.advance()},toggle:function(){if(this.forwards){this.seekTo(0)
}else{this.seekTo(1)}},listenTo:function(animator){var oldOnComplete=animator.options.onComplete;
var _this=this;animator.options.onComplete=function(){if(oldOnComplete){oldOnComplete.call(animator)
}_this.advance()}},advance:function(){if(this.forwards){if(this.animators[this.current+1]==null){return
}this.current++;this.animators[this.current].play()}else{if(this.animators[this.current-1]==null){return
}this.current--;this.animators[this.current].reverse()}},seekTo:function(target){if(target<=0){this.forwards=false;
this.animators[this.current].seekTo(0)}else{this.forwards=true;this.animators[this.current].seekTo(1)
}}};function Accordion(options){this.setOptions(options);var selected=this.options.initialSection,current;
if(this.options.rememberance){current=document.location.hash.substring(1)}this.rememberanceTexts=[];
this.ans=[];var _this=this;for(var i=0;i<this.options.sections.length;i++){var el=this.options.sections[i];
var an=new Animator(this.options.animatorOptions);var from=this.options.from+(this.options.shift*i);
var to=this.options.to+(this.options.shift*i);an.addSubject(new NumericalStyleSubject(el,this.options.property,from,to,this.options.units));
an.jumpTo(0);var activator=this.options.getActivator(el);activator.index=i;activator.onclick=function(){_this.show(this.index)
};this.ans[this.ans.length]=an;this.rememberanceTexts[i]=activator.innerHTML.replace(/\s/g,"");
if(this.rememberanceTexts[i]===current){selected=i}}this.show(selected)}Accordion.prototype={setOptions:function(options){this.options=Object.extend({sections:null,getActivator:function(el){return document.getElementById(el.getAttribute("activator"))
},shift:0,initialSection:0,rememberance:true,animatorOptions:{}},options||{})},show:function(section){for(var i=0;
i<this.ans.length;i++){this.ans[i].seekTo(i>section?1:0)}if(this.options.rememberance){document.location.hash=this.rememberanceTexts[section]
}}};arale.animator=window.$Animator=Animator;$Animator.prototype.stop=function(){this.clearSubjects();
return this};$Animator.prototype.addMotion=function(ele,prop,from,to){var obj=function(){};
ele=ele.node?ele.node:ele;switch(arale.typeOf(from)){case"number":obj=new NumericalStyleSubject(ele,prop,from,to);
break;case"string":obj=from.charAt(0)=="#"?new ColorStyleSubject(ele,prop,from,to):new DiscreteStyleSubject(ele,prop,from,to,arguments[4]);
break}this.addSubject(obj);return this};$Animator.prototype.addCSSMotion=function(ele,fromStyle,toStyle){ele=ele.node?ele.node:ele;
this.addSubject(new CSSStyleSubject(ele,fromStyle,toStyle));return this};$Node.fn.fadeTo=function(duration,opacity,callback){var anim=new $Animator({duration:duration,onComplete:function(){callback&&callback()
}});anim.addCSSMotion(this,"opacity:"+opacity);anim.play();return this};$Node.fn.fadeIn=function(duration,callback){var o={opacity:0};
if(this.getStyle("display")=="none"){o.display="block"}return this.setStyle(o).fadeTo(duration,1,callback)
};$Node.fn.fadeOut=function(duration,callback){if(this.getStyle("display")=="none"){return this
}var that=this;return this.setStyle("opacity",1).fadeTo(duration,0,function(){that.setStyle({display:"none",opacity:1});
callback&&callback()})};$Node.fn.hide=function(duration,callback){var display=this.getStyle("display");
if(display=="none"){return}var that=this;if(duration&&arale.isNumber(duration)){var height=this.getStyle("height");
var width=this.getStyle("width");var overflow=this.getStyle("overflow");this.setStyle("overflow","hidden");
var anim=new $Animator({duration:duration,onComplete:function(){that.setStyle({display:"none",width:width,height:height,overflow:overflow});
callback&&callback()}});anim.addCSSMotion(this,"width:0;height:0;");anim.play();return anim
}else{this.setStyle("display","none")}return this};$Node.fn.show=function(duration,callback){var display=this.getStyle("display");
if(display!="none"){return this}var that=this;if(duration&&arale.isNumber(duration)){var height=this.getStyle("height");
var width=this.getStyle("width");var overflow=this.getStyle("overflow");this.setStyle({width:0,height:0,display:"block",overflow:"hidden"});
var anim=new $Animator({duration:duration,onComplete:function(){that.setStyle("overflow",overflow);
callback&&callback()}});anim.addCSSMotion(this,"width:"+width+";height:"+height+";overflow:"+overflow);
anim.play();return anim}else{this.setStyle("display","block")}return this};$Node.fn.slideDown=function(duration,callback){var display=this.getStyle("display");
if(display!="none"){return}var that=this;var height=this.getStyle("height");var of=this.getStyle("overflow");
this.setStyle({height:0,display:"block",overflow:"hidden"});var duration=duration?duration:400;
var anim=new $Animator({duration:duration,onComplete:function(){that.setStyle({overflow:of});
callback&&callback()}});anim.addCSSMotion(this,"height:"+height);anim.play();return this
};$Node.fn.slideUp=function(duration,callback){var display=this.getStyle("display");
if(display=="none"){return}var that=this;var height=this.getStyle("height");var of=this.getStyle("overflow");
this.setStyle({overflow:"hidden"});var duration=duration?duration:400;var anim=new $Animator({duration:duration,onComplete:function(){that.setStyle({display:"none",height:height,overflow:of});
callback&&callback()}});anim.addCSSMotion(this,"height:0");anim.play();return this
}})();Animator=$Animator;$Loader.css("aralex.xbox-1.10.css");
arale.declare("aralex.xbox.Xbox",[aralex.Widget],{cfg:{MOCK:"xbox-mock",MOCK_CLASS:"ui-xbox",LOAD:"xbox-load",IFRAME:"xbox-iframe",IFRAME_FIX:"xbox-hide-select",OVERLAY:"xbox-overlay",OVERLAY_BG:"ui-xbox-shadow"},xboxClass:null,closeLink:'<a href="#" class="ui-xbox-close" title="\u5173\u95ed">\u00d7</a>',el:"",type:"xbox",value:"",modal:!0,width:600,height:"",maxWidth:800,maxHeight:500,minHeight:null,autoFit:!0,autoShow:!1,border:!0,beforeShow:!1,beforeHide:!1,noScroll:!1,fixed:!1,load:!1,isOld:!1,
isNeedOverlayIframe:!0,isStopBindElEvent:!0,beforeCreate:function(){this._fixType();aralex.xbox.Xbox.cache={};this._mergeXboxClass();if(this.isOld)this.closeLink=""},_mergeXboxClass:function(){null!==this.xboxClass?(this.xboxClass.MOCK_CLASS=this.xboxClass.MOCK_CLASS?this.cfg.MOCK_CLASS+" "+this.xboxClass.MOCK_CLASS:this.cfg.MOCK_CLASS,this.xboxClass.OVERLAY_BG=this.xboxClass.OVERLAY_BG?this.cfg.OVERLAY_BG+" "+this.xboxClass.OVERLAY_BG:this.cfg.OVERLAY_BG):this.xboxClass={MOCK_CLASS:this.cfg.MOCK_CLASS,
OVERLAY_BG:this.cfg.OVERLAY_BG}},postCreate:function(){var a=this;if(!this.id)this.id=arale.getUniqueId();this.aroundFn("show");this.aroundFn("hide");this.before("show",function(){a.setCurrentXbox()});this.after("show",function(){a._bindEsc();a._bindClose()});this.after("hide",function(){a.destroy()})},_bindEsc:function(){var a=this;this._connects.push($E.connect(document,"keyup",function(b){27==b.which&&a.hide()}))},_bindClose:function(){var a=this;this._connects.push($E.delegate(this._mock,"click",
function(b,c){a.hide();c.preventDefault()},".ui-xbox-action a"))},setCurrentXbox:function(){aralex.xbox.Xbox.cache.current=this},_fixType:function(){this.type=this.type.toLowerCase()},bind:function(){this.el&&this.bindEl(this.el)},bindEl:function(a){var b=this,c=this.isStopBindElEvent;arale.isArray(a)||(a=[a]);$A(a).each(function(a){a&&$(a)&&$(a).click(function(a){c&&a.stopEvent();b.show(a.target)})})},show:function(a){if(a)aralex.xbox.Xbox.cache.fireObject=a;if(!$(this.cfg.MOCK)&&(this._renderOverlay(),
this._renderMock(),this._showOverlay.call(this),this._fixAliedit(),this.isOld))arale.namespace("AP.widget.xBox"),AP.widget.xBox.hide=arale.hitch(this,function(){this.hide()})},_fixAliedit:function(){$A($$("#xbox-mock .alieditContainer")).each(function(a){a.setStyle({visibility:"visible",opacity:"1",filter:"alpha(opacity = 1)"})})},_getOptWidth:function(){var a;try{a=parent&&parent.$("xbox-iframe")&&0<parent.$("xbox-iframe").attr("auto-width")?parent.$("xbox-iframe").attr("auto-width"):parseInt(this.width,
10)}catch(b){a=parseInt(this.width,10)}return this.width=a},_getOptHeight:function(){return parseInt(this.height,10)},_getNiceTop:function(){var a=$(this.cfg.MOCK),a="dom"==this.type?a:a.first(),b=document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop,c=$D.getViewportHeight(),a=this.getMh(a),b=Math.max(50,c>a?0.382*c-a/2:50)+b,b=Math.max(50,b);return parseInt(b,10)},getMh:function(a){return this._getWH(a)[1]},_getNiceLeft:function(){var a=this._getWH($(this.cfg.MOCK))[0],
a=($D.getViewportWidth()-5-a)/2;return parseInt(a,10)},_getWH:function(a){a=$(a).region();return[a.width,a.height]},makeValue:function(){var a=this.value;return arale.isFunction(a)?a.call(this,aralex.xbox.Xbox.cache.fireObject):this._isId(a)?$(a):this._isCssExp(a)?$$(a)[0]:a.toString()},_isId:function(a){return/^[a-zA-Z]([^#.\s]*)[a-zA-Z0-9]$/.test(a)},_isCssExp:function(a){return/^[a-zA-Z#\.]*(\s?)(.*)[a-zA-Z0-9]$/.test(a)},_fixUrl:function(a){return a+(0>a.indexOf("?")?"?_xbox=true":"&_xbox=true")},
_renderMock:function(){this._mock||this._createMock();this.makeContent()},_createMock:function(){this._mock=$D.create("div",{id:this.cfg.MOCK,"class":this.xboxClass.MOCK_CLASS,style:{visibility:"hidden",display:""},appendTo:document.body,innerHTML:'<div class="ui-xbox-action">'+this.closeLink+'</div><div class="ui-xbox-content"></div>'});this.border||this._mock.setStyle("border","none");this.title&&""!==this.title&&$D.create("div",{"class":"xbox-caption",innerHTML:this.title,appendTo:this._mock})},
makeContent:function(){},_renderOverlay:function(){var a=D.getDocumentWidth()+50+"px",b=D.getDocumentHeight()+50+"px";$(this.cfg.OVERLAY)||this._createOverlayElem();this._hackOverlayForIe6(a,b);this._coverSelectAndPassAliedit();this._fixJump();this._fixZIndexForFF()},_coverSelectAndPassAliedit:function(){if(!$(this.cfg.IFRAME_FIX))this._overlay.setHtml(this._createOverlayHtml()),modal=this.cfg.IFRAME_FIX},_createOverlayHtml:function(){return"<iframe id='"+this.cfg.IFRAME_FIX+"' src=\"javascript:''\"></iframe>"},
_createOverlayElem:function(){this._overlay=$D.create("div",{id:this.cfg.OVERLAY,"class":this.xboxClass.OVERLAY_BG,style:{visibility:"hidden",opacity:"0",overflow:"hidden",filter:"alpha(opacity=20)"},appendTo:document.body})},_fixZIndexForFF:function(){arale.isFF()&&"1.9.1.9"===arale.browser.ver?$(this.cfg.IFRAME_FIX).setStyle("display","none"):this._fixZIndexForFF=function(){}},_fixJump:function(){this._fixIe67aliedit({visibility:"hidden",opacity:"0",filter:"alpha(opacity = 0)"})},_hackOverlayForIe6:function(a,
b){arale.isIE6()&&(this.noScroll||(a="100%"),$(this.cfg.OVERLAY).setStyle({height:b,width:a}))},_showOverlay:function(){$(this.cfg.OVERLAY).setStyle("visibility","visible");this.showLoad();$(this.cfg.OVERLAY).fadeTo(200,0.2)},showLoad:function(){},_hideOverlay:function(){var a=this;$(this.cfg.OVERLAY).fadeTo(200,0.2,function(){$(a.cfg.OVERLAY).dispose()})},hide:function(){this._fixIe67aliedit({visibility:"visible",opacity:"1",filter:"alpha(opacity = 100)"});this.cleanMock();this.cleanOverlay();aralex.xbox.Xbox.cache=
{};if(this.isOld&&AP.widget.xBox)AP.widget.xBox=null},cleanMock:function(){this._mock&&this._mock.dispose();this._mock=null},cleanOverlay:function(){var a=$("xbox-overlay");a&&a.dispose()},_fixIe67aliedit:function(a){var b=function(){};if(arale.isIE6()||arale.isFF())b=function(a){try{$A($$(".alieditContainer")).each(function(b){b.setStyle(a)})}catch(b){}};b.call(this,a);this._fixIe67aliedit=b}});
arale.declare("aralex.xbox.DomXbox",[aralex.xbox.Xbox],{type:"dom",fullScreen:!1,initDom:function(){this.domNode=this.makeValue();this.domParent=this.domNode.parent();this.domNode.dispose()},makeContent:function(){this.domNode||this.initDom();this._mock.last("div").adopt(this.domNode.node);this._contentOnLoad()},_contentOnLoad:function(){var a=$(this.cfg.MOCK),b=this._getWH("dom"===this.type?a:a.first()),c=parseInt(this.width,10)||b[0],d=this._getNiceTop(!1)+"px",e=this._getNiceLeft(c)+"px";a.setStyle({width:c+
"px",height:"auto",top:d,left:e,visibility:"visible"});if(this.isNeedOverlayIframe&&arale.isIE6()&&!this.fullScreen){var f=this.cfg.IFRAME_FIX;setTimeout(function(){var b=$(a).region().height+"px";$(f).setStyle({width:c+"px",height:b,top:d,left:e,position:"absolute",zIndex:1E4})},50)}},adjustPos:function(a,b){var c=$(this.cfg.MOCK),d=this._getWH("dom"===this.type?c:c.first()),d=parseInt(this.width,10)||d[0],e=(a||this._getNiceTop(!1))+"px",f=(b||this._getNiceLeft(d))+"px";c.setStyle({width:d+"px",
height:"auto",top:e,left:f,visibility:"visible"});this.isNeedOverlayIframe&&arale.isIE6()&&(c=c.getStyle("top"),$(this.cfg.IFRAME_FIX).setStyle({width:d+"px",height:parseInt(c)+30+"px",top:e,left:f,position:"absolute"}))},_getNiceLeft:function(a){return parseInt(($D.getViewportWidth()-5-a)/2,10)},cleanMock:function(){this.parent(arguments);this.domNode.dispose()},show:function(){$(this.cfg.MOCK)||(this.parent(arguments),this.domNode.setStyle("display","block"))},hide:function(){this.parent(arguments);
this.domNode.setStyle("display","none");this.domNode.dispose();this.domParent&&this.domParent.adopt(this.domNode);this.domNode=null}});arale.declare("aralex.xbox.StringXbox",[aralex.xbox.DomXbox],{type:"string",initDom:function(){this.domNode=$($D.toDom(this.makeValue()))}});
arale.declare("aralex.xbox.IframeXbox",[aralex.xbox.Xbox],{type:"iframe",loadsrc:"http://img.alipay.net/global/loading.gif",getMh:function(){return parseInt(this._getIFRHeight()||$(this.cfg.MOCK).getStyle("height"),10)},makeContent:function(){this.load=!0;this._iframe=$D.create("iframe",{id:this.cfg.IFRAME,name:this.cfg.IFRAME+(new Date).getTime(),frameBorder:"no",allowTransparency:"true",scrolling:"no",src:this._fixUrl(this.makeValue()),style:{visibility:"hidden",width:this._getOptWidth()+"px"},
callback:arale.hitch(this,"_iframeOnLoad")});this._mock.last("div").node.appendChild(this._iframe.node)},_iframeOnLoad:function(){this.hideLoad();this._fitIFR();$(this._mock)&&($(this._mock).setStyle("top",this._getNiceTop(!0)+"px"),this._iframe.setStyle("height",this._getIFRHeight()+"px"),this.autoFit&&this._autoFit(),$(this._iframe).setStyle("visibility","visible"),$(this._mock).setStyle("visibility","visible"))},_fitIFR:function(){try{var a=this._mock,b=this._iframe;a.setStyle({width:this._getOptWidth()+
"px",height:this._getIFRHeight()+"px",left:($D.getViewportWidth()-this.width)/2+"px"});b.setStyle({width:this._getOptWidth()+"px",height:this._getIFRHeight()+"px"});a.getStyle("height")+a.getStyle("top")>$D.getViewportHeight()&&a.setStyle("top",this._getNiceTop(!0)+"px")}catch(c){}},_autoFit:function(){var a=this;try{aralex.xbox.Xbox.cache.timer&&clearInterval(aralex.xbox.Xbox.cache.timer),aralex.xbox.Xbox.cache.timer=setInterval(function(){a._fitIFR()},75)}catch(b){}},_addCloseToIfr:function(){var a=
this;try{$$(".xbox-close-link",this._iframe).click(function(b){a.hide();b.preventDefault()})}catch(b){}},_temp:{bHeight:null,dHeight:null},_getIFRHeight:function(){var a=this._iframe.node;try{var b=a.contentWindow.document.body.scrollHeight,c=a.contentWindow.document.documentElement.scrollHeight,d;null!=this._temp.dHeight&&c==this._temp.dHeight&&(c-=this._temp.bHeight-b);d=arale.isSafari()||arale.isChrome()||arale.isFF()?Math.min(b,c):Math.max(b,c);this._temp.bHeight=b;this._temp.dHeight=c;if(0<parseInt(this.minHeight,
10)&&this.minHeight>d)d=this.minHeight;return d}catch(e){return this.height}},makeValue:function(){var a=this.value;return arale.isFunction(a)?a.call(this,aralex.xbox.Xbox.cache.fireObject):a},showLoad:function(){if(!$(this.cfg.LOAD)){var a=0.382*$D.getViewportHeight();arale.isIE6()&&(a+=document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop);$D.create("div",{id:this.cfg.LOAD,innerHTML:"<img src='"+this.loadsrc+"' />",style:{top:a+"px",display:"block"},appendTo:document.body})}},
hideLoad:function(){$(this.cfg.LOAD)&&$(this.cfg.LOAD).dispose()},cleanMock:function(){var a=this._iframe;a&&a.dispose();this._iframe=null;this.parent(arguments);aralex.xbox.Xbox.cache.timer&&clearInterval(aralex.xbox.Xbox.cache.timer)}});arale.declare("alipay.faq",[aralex.Widget],{target:"faq",warnClass:"m-warn",iconClass:"m-cue",duartion:1E3,speed:20,scrollPage:!0,autoShow:!0,originalColor:"#FFF",highlightColor:"#FFFFA4",hasSearchBox:!0,form:"faqsearch",textDefaultClass:"i-text-gray",textDefaultExplain:"data-explain",beforeCreate:function(){this.icons=$$("."+this.iconClass,$(this.target));this.hasSearchBox&&(this.input=$$("input[type='text']",$(this.form))[0],this.defaultText=this.input[0].getAttribute(this.textDefaultExplain))},
bind:function(){this.blur();$E.on($("viewFaq"),"click",this,function(){this.show()});$E.on(this.input,"focus",this,this.focus);$E.on(this.input,"blur",this,this.blur);$E.on(this.form,"submit",this,function(a){(""==$S(this.input[0].value).trim()||$S(this.input[0].value).trim()==this.defaultText)&&a.stopEvent()})},postCreate:function(){this.autoShow&&this.show()},show:function(){this.animation()},animation:function(){var a=this;this.changeIcon();this.reset(this.originalColor,this.highlightColor);this.trans("animBegin");
$E.subscribe("animBeginDone",function(){a.reset(a.highlightColor,a.originalColor);a.trans("animEnd")});$E.subscribe("animEndDone",function(){a.changeIcon("done")})},changeIcon:function(a){"done"==a?$A(this.icons).each(function(a){a.removeClass(this.warnClass).addClass(this.iconClass)}):$A(this.icons).each(function(a){a.removeClass(this.iconClass).addClass(this.warnClass)})},getColorArr:function(a){var b=RegExp;if(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.test(a))return[b.$1,b.$2,b.$3].map(function(a){return parseInt(a,
16)});if(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(a))return[b.$1,b.$2,b.$3].map(function(a){return parseInt(a+a,16)});if(/^rgb\((.*),(.*),(.*)\)$/i.test(a))return[b.$1,b.$2,b.$3].map(function(a){return 0<a.indexOf("%")?2.55*parseFloat(a,10):a|0})},calColorArr:function(a,b,c){var d,e,f=[],g=0;d=parseFloat(b[0]-a[0])/c;e=parseFloat(b[1]-a[1])/c;for(b=parseFloat(b[2]-a[2])/c;g<c;g++)a[0]+=d,a[1]+=e,a[2]+=b,f.push([parseInt(a[0]),parseInt(a[1]),parseInt(a[2])]);return f},reset:function(a,b){this._index=
0;this._step=this.duartion/this.speed;this._colors=this.calColorArr(this.getColorArr(a),this.getColorArr(b),this._step)},trans:function(a){var b=this;this.stop();this._index++;$(this.target)[0].style.backgroundColor="rgb("+this._colors[this._index].join(",")+")";this._index<this._step-1?this._timer=setTimeout(function(){b.trans(a)},this.speed):$E.publish(a+"Done")},stop:function(){clearTimeout(this._timer)},focus:function(){$S(this.input[0].value).trim()==this.defaultText&&(this.input[0].value="");
this.input.removeClass(this.textDefaultClass)},blur:function(){if(""==$S(this.input[0].value).trim()||$S(this.input[0].value).trim()==this.defaultText)this.input[0].value=this.defaultText,this.input.addClass(this.textDefaultClass)}});
