arale.module("arale.uri",(function(){var _re_search=/\?(.*)/,_re_hostptc=/(https|http)\:\/\/((\w+|\.)+)/,_re_hostnoptc=/(\w+|\.)+/,_re_portnoptc=/^https|^http\:\/\/(\w+|\.)+(\:\d+)/,_re_portptc=/(\w+|\.)+(\:\d+)/;
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
}}return arale.browser.Engine.gecko?h:decodeURIComponent(h)}}}),"$URI");URI=$URI;arale.module("arale.ajax",(function(){var getOptions=function(){return arale.extend(_options)
};var defaultData={_input_charset:"utf-8"};var getData=function(data){return arale.mixin(data,defaultData)
};var setValue=function(obj,name,value){if(value===null){return}var val=obj[name];
if(typeof val=="string"){obj[name]=[val,value]}else{if(arale.isArray(val)){val.push(value)
}else{obj[name]=value}}};var AjaxFactory=function(url,options){this._options={headers:{"X-Requested-With":"XMLHttpRequest",Accept:"text/javascript, text/html, application/xml, text/xml, */*"},async:true,method:"get",urlEncoded:true,encoding:"utf-8",timeout:0,timeoutTimer:null,cache:false,success:function(){},failure:function(){},arguments:null,scope:window,dataType:"json"};
this._xhr=arale.browser.Request();this._response={};this._url=url;this._running=false;
$H(this._options).extend(options||{});this._response["arguments"]=this._options.arguments;
this._response.scope=this._options.scope};var parseJSON=function(data){function validJSON(data){if(typeof data!=="string"||!data){return false
}data=data.replace(/^\s+|\s+$/g,"");return(/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))
}function W3CParse(data){if(validJSON(data)){return window.JSON.parse(data)}else{return null;
arale.error("Invalid JSON: "+data)}}function defaultParse(data){if(validJSON(data)){return(new Function("return ("+data+")"))()
}else{return null;arale.error("Invalid JSON: "+data)}}var ok_wrong_json=function(){try{JSON.parse("{ a: 1 }");
return true}catch(x){return false}};if(window.JSON&&window.JSON.parse&&ok_wrong_json()){parseJSON=function(data){return W3CParse.call(this,data)
}}else{parseJSON=function(data){return defaultParse.call(this,data)}}return parseJSON(data)
};arale.augment(AjaxFactory,{setHeader:function(name,value){$H(this._options.headers).set(name,value);
return this},getHeader:function(name){return arale.$try(function(){return this._xhr.getResponseHeader(name)
})},onSuccess:function(){var scope=this._options.scope;this._response.timeout=false;
this._options.success.call(scope,this._response[this._options.dataType]||this._response)
},onFailure:function(){var scope=this._options.scope;this._options.failure.call(scope,this._response)
},send:function(data){var that=this,options=this._options;this.cancel();this._xhr=arale.browser.Request();
var url=this._url;data=getData(data);if(this._options.method.toLowerCase()=="post"&&this._options.form){data=arale.mixin(data,this.formToObject($(this._options.form)),true)
}if(options.async&&options.timeout>0){options.timeoutTimer=setTimeout(function(){that.cancel();
that._response.text=null;that._response.xml=null;that._response.json=null;that._response.timeout=true;
that.onFailure()},options.timeout)}if(this._options.urlEncoded){$H(data).each(function(key){var value=data[key];
if(value){data[key]=$S(value).urlEncode()}})}data=$H(data).toQueryString();this._running=true;
if(this._options.urlEncoded&&this._options.method.toLowerCase()=="post"){$H(this._options.headers).set("Content-Type","application/x-www-form-urlencoded; charset="+this._options.encoding.toLowerCase())
}if(!this._options.cache){data.noCache=new Date().getTime()}if(data&&this._options.method.toLowerCase()=="get"){if(url.indexOf("?")>0){url=url+"&"+data
}else{url=url+"?"+data}data=null}var url_old=url;url=$Ajax.decorateUrl(url);url=url?url:url_old;
this._xhr.open(this._options.method.toUpperCase(),url,this._options.async);$H(this._options.headers).each(function(key,value){try{this._xhr.setRequestHeader(key,value)
}catch(e){}},this);this._xhr.onreadystatechange=arale.hitch(this,this.onStateChange);
this._xhr.send(data);if(!this._options.async){this.onStateChange()}return this},cancel:function(){if(!this._running){return this
}this._running=false;this._xhr.onreadystatechange=function(){};this._xhr.abort();
this._xhr=arale.browser.Request();return this},onStateChange:function(){var that=this,options=this._options;
if(this._xhr.readyState!=4||!this._running){return}this._running=false;arale.$try(function(){that._status=that._xhr.status
});this._xhr.onreadystatechange=function(){};if(options.timeoutTimer){clearTimeout(options.timeoutTimer);
options.timeoutTimer=null}this._response.status=this._xhr.status;if(this._xhr.status==200){this._response.text=this._xhr.responseText;
this._response.xml=this._xhr.responseXML;if(this._options.dataType=="json"){try{this._response.json=parseJSON(this._xhr.responseText)
}catch(e){this._response.json=null}}this.onSuccess()}else{this._response.text=null;
this._response.xml=null;this._response.json=null;this.onFailure()}},formToObject:function(formNode){var ret={},that=this;
var exclude="file|submit|image|reset|button|";$A($$(":input",formNode)).each(function(item){var _in=item.attr("name");
var type=(item.attr("type")||"").toLowerCase();if(_in&&type&&exclude.indexOf(type)==-1&&!item.node.disabled){setValue(ret,_in,that.fieldToObject(item));
if(type=="image"){ret[_in+".x"]=ret[_in+".y"]=ret[_in].x=ret[_in].y=0}}});return ret
},fieldToObject:function(item){var ret=null;if(item){var _in=item.attr("name");var type=(item.attr("type")||"").toLowerCase();
if(_in&&type&&!item.node.disabled){if(type=="radio"||type=="checkbox"){if(item.node.checked){ret=item.node.value
}}else{if(item.node.multiple){ret=[];$A($$("option",item)).each(function(opt){if(opt.node.selected){ret.push(opt.node.value)
}})}else{ret=item.node.value}}}}return ret}});return{getAjaxFactory:function(){return AjaxFactory
},get:function(url,options,delay){if(arale.isFunction(options)){options={success:options}
}var ajax=new AjaxFactory(url,options);if(!delay){ajax.send(options.data)}return ajax
},post:function(url,options,delay){if(arale.isFunction(options)){options={succuss:options}
}options=arale.mixin({method:"post"},options);var ajax=new AjaxFactory(url,options);
if(!delay){ajax.send(options.data)}return ajax},jsonp:function(url,options,delay){if(arale.isFunction(options)){options={succuss:options}
}var jsonp=new $Jsonp.JsonpFactory(url,options);var data=options.data||{};data._input_charset="utf-8";
if(!delay){jsonp.send(data)}return jsonp},text:function(url,options){var text="";
var ajax=new AjaxFactory(url+"?date="+new Date().getTime(),{async:false,dataType:"text",success:function(data){text=data
}});ajax.send();return text}}}()),"$Ajax");Ajax=$Ajax;$Ajax.decorateUrl=function(url){return url
};arale.module("arale.jsonp",(function(){arale.cache.callback_num=1;arale.cache.callbacks=arale.cache.callbacks||{};
var _default={failure:function(){},success:function(){},timeout:0,callparam:"_callback"};
var JsonpFactory=function(url,options){this._url=url;this._options=options||{};arale.mixin(this._options,_default);
this._callback_id=1;this._timeout_error=null};arale.augment(JsonpFactory,{send:function(data){var that=this;
if(!document.documentElement.firstChild){return null}data=data||{};data.r=(new Date()).getTime();
$H(data).each(function(key){var value=data[key];if(value){data[key]=$S(value).urlEncode()
}});if(this._options.timeout>0){this._timeout_error=setTimeout(this._options.failure,this._options.timeout)
}arale.cache.callback_num++;this._callback_id="jsonp"+arale.cache.callback_num;arale.cache.callbacks[this._callback_id]=function(){clearTimeout(that._timeout_error);
that._options.success.apply(this,[].slice.call(arguments,0))};data[this._options.callparam]="arale.cache.callbacks."+this._callback_id;
var script=document.createElement("script");script.setAttribute("type","text/javascript");
script.setAttribute("id",this._callback_id);var src=$URI.setParams(this._url,data);
if($Ajax.decorateUrl){var src_old=src;src=$Ajax.decorateUrl(src);src=src?src:src_old
}script.setAttribute("src",src);this._options.charset&&script.setAttribute("charset",this._options.charset);
document.getElementsByTagName("head")[0].appendChild(script)},cancel:function(){var scriptnode=$(this._callback_id).node;
if(scriptnode&&scriptnode.tagName.toUpperCase()=="SCRIPT"){scriptnode.parentNode.removeChild(scriptnode);
delete arale.cache.callbacks[this._callback_id];clearTimeout(this._timeout_error)
}}});return{JsonpFactory:JsonpFactory}}()),"$Jsonp");arale.namespace("alipay.http");(function(arale){var success=function(data,options){if(data){switch(data.stat){case"ok":options.successCallback(data);
break;case"deny":if(alipay.http.core.callfromiframe){self.parent.location.reload()
}else{location.href=data.target}break;default:options.failure(data);break}}};var defaultData={_input_charset:"utf-8"};
var typeSelect=function(type,url,options){if(type=="json"){var ajax=arale.ajax.getAjaxFactory();
return new ajax(url,options)}else{if(type=="jsonp"){return new $Jsonp.JsonpFactory(url,options)
}}};alipay.http.core=function(url,options){var that=this;this.url=url;this.options=options;
this.options.data=this.options.data||{};this.options.successCallback=this.options.success;
this.options.success=function(data){data=data.json||data;success(data,that.options)
};arale.mixin(this.options.data,defaultData);this.cache={};this.request=typeSelect(options.format||"jsonp",url,options)
};alipay.http.core.prototype.call=function(data){if(data){data=arale.mixin(data,this.options.data)
}else{data=this.options.data}this.request.send(data)}}(arale));arale.module("arale.declare",function(){var a=arale,contextStack=[];var safeMixin=function(){var baseClass=arguments[0],clazzs=[].slice.call(arguments,1);
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
}});arale.namespace("aralex.validator.RuleFactory");aralex.validator.RuleFactory=function(){};
aralex.validator.RuleFactory.setRule=function(name,rule,opt_override){if(arale.isString(rule)){rule=new RegExp(rule)
}var obj={};obj[name]=rule;arale.mixin(aralex.validator.RuleFactory.rules_,obj,opt_override)
};aralex.validator.RuleFactory.getRule=function(name){return aralex.validator.RuleFactory.rules_[name]
};aralex.validator.RuleFactory.rules_={email:/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,cnPhone:/^(\d{3,4}-)\d{7,8}(-\d{1,6})?$/,mobile:/^1[3458]\d{9}$/,cnMobile:/^1\d{10}$/,date:/^\d{4}\-[01]?\d\-[0-3]?\d$|^[01]\d\/[0-3]\d\/\d{4}$|^\d{4}年[01]?\d月[0-3]?\d[日号]$/,string:/\d$/,integer:/^[1-9][0-9]*$/,number:/^[+-]?[1-9][0-9]*(\.[0-9]+)?([eE][+-][1-9][0-9]*)?$|^[+-]?0?\.[0-9]+([eE][+-][1-9][0-9]*)?$/,numberWithZero:/^[0-9]+$/,money:/^\d+(\.\d{0,2})?$/,alpha:/^[a-zA-Z]+$/,alphaNum:/^[a-zA-Z0-9_]+$/,betaNum:/^[a-zA-Z0-9-_]+$/,cnID:/^\d{15}$|^\d{17}[0-9a-zA-Z]$/,urls:/^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,url:/^(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,chinese:/^[\u2E80-\uFE4F]+$/,postal:/^[0-9]{6}$/,mutiYYYMM:/(20[0-1][0-9]((0[1-9])|(1[0-2]))[\,]?)+$/,name:/^([\u4e00-\u9fa5|A-Z|\s]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5|A-Z|\s]|\u3007)+$/,minValue:function($ele,min){return parseFloat($ele.attr("value"))>=min
},maxValue:function($ele,max){return parseFloat($ele.attr("value"))<=max},minLength:function($ele,min){return $ele.attr("value").length>=min
},maxLength:function($ele,max){return $ele.attr("value").length<=max},valueBetween:function($ele,min,max){var val=$ele.attr("value");
return val>=min&&val<=max},lengthBetween:function($ele,min,max){var l=$ele.attr("value").length;
return l>=min&&l<=max},required:function($ele){var t=$ele.attr("type");switch(t){case"checkbox":case"radio":var n=$ele.attr("name");
var eles=$$('input[name="'+n+'"]',this.domNode);return $A(eles).some(function(item){return item.attr("checked")
});default:var v=$ele.node.value;if(!$S(v).trim()){return false}return true}},post:function($ele,url,check,msg,domain,makeData){$E.publish(this._getEventTopic("ajaxValidate","before"),[$ele]);
var data=$ele.node.value;if(makeData){var pobj=makeData($ele)}else{var pobj={};pobj[$ele.attr("name")]=data
}var that=this;var options={success:function(json){$E.publish(that._getEventTopic("ajaxValidate","after"),[$ele,check(json),msg(json),json])
},failure:function(json){$E.publish(that._getEventTopic("ajaxValidate","after"),[$ele,check(json),msg(json),json])
},method:"post",format:"json",data:pobj};domain&&(options.api_url=domain);var ajax=new alipay.http.core(url,options);
ajax.call();return true},get:function($ele,url,check,msg,domain,makeData){$E.publish(this._getEventTopic("ajaxValidate","before"),[$ele]);
var data=$ele.node.value;if(makeData){var pobj=makeData($ele)}else{var pobj={};pobj[$ele.attr("name")]=data
}url=$URI.setParams(url,pobj);var that=this;var options={success:function(json){$E.publish(that._getEventTopic("ajaxValidate","after"),[$ele,check(json),msg(json),json])
},failure:function(json){$E.publish(that._getEventTopic("ajaxValidate","after"),[$ele,check(json),msg(json),json])
},method:"get",format:"json"};domain&&(options.api_url=domain);var ajax=new alipay.http.core(url,options);
ajax.call();return true}};arale.namespace("aralex.validator.MsgFactory");aralex.validator.MsgFactory=function(){};
aralex.validator.MsgFactory.getMsg=function(name){return aralex.validator.MsgFactory.msgs_[name]
};aralex.validator.MsgFactory.setMsg=function(name,msg,opt_override){if(aralex.validator.MsgFactory.msgs_[name]==undefined||opt_override){aralex.validator.MsgFactory.msgs_[name]=msg
}};aralex.validator.MsgFactory.msgs_={number:"%s必须为数字。",betaNum:"%s只能包含数字、字母、下划线和横杠。",email:"%s格式不正确。",money:"%s必须为整数或小数，小数点后不超过2位。",numberWithZero:"%s必须为数字。",chinese:"%s必须为汉字。",cnMobile:"手机号码格式有误，是11位数字，且是以13，14，15，18开头。",name:"%s只能含汉字、大写字母、符号中的空格和点，且至少两个字。",maxLength:"%s长度不能超过%s。",minLength:"%s长度不能小于%s。",maxValue:"%s数值不能大于%s。",minValue:"%s数值不能小于%s。",lengthBetween:"%s长度必须在%s到%s之间。",valueBetween:"%s数值必须在%s到%s之间。",required:"%s不能为空。",requiredText:"请填写%s。",requiredRadio:"请选择%s。",requiredSelect:"请选择%s。",requiredCheckbox:"请选择%s。"};
arale.declare("aralex.validator.Validator",[aralex.Widget],{ruleFactory:aralex.validator.RuleFactory,msgFactory:aralex.validator.MsgFactory,formId:"",triggerMethod:["blur"],checkOnSubmit:true,stopSubmit:false,onSuccess:null,onFail:null,checkNull:false,rules:null,init:function(){this.rules={}
},beforeCreate:function(){this.id=this.formId},_ajaxComplete:true,_ajaxValid:true,stopOnError:false,bind:function(){this._handlers=[];
this._shandlers=[];var that=this;var gTriggers=arale.isString(this.triggerMethod)?[this.triggerMethod]:this.triggerMethod;
for(var item in this.rules){var eles=$$(item,this.domNode);var cfg=this.rules[item];
var triggers=cfg.triggerMethod?cfg.triggerMethod:gTriggers;if(arale.isString(triggers)){triggers=[triggers]
}for(var i=0,l=triggers.length;i<l;i++){if(eles[0]&&(eles[0].attr("type")=="radio"||eles[0].attr("type")=="checkbox")){break
}$A(eles).each(function($ele){var t=this;var h=$E.connect($ele,triggers[i],function(e){if(e.type=="blur"&&!that.checkNull&&!$ele.attr("value")){return
}var valid=that.validate($ele,t)});that._handlers[that._handlers.length]=h},cfg)}}var handler=$E.connect(this.domNode,"submit",function(e){e.preventDefault();
if(that.checkOnSubmit){var bValid=that.validateAll();if(bValid&&!that.stopSubmit){if(that._ajaxComplete){if(that._ajaxValid){that.submit()
}}else{that._waittingSubmit=true;setTimeout(function(){that._waittingSubmit=false
},2000)}}}else{if(!that.stopSubmit){that.submit()}}});this._handlers[this._handlers.length]=handler;
var sh=$E.subscribe(this._getEventTopic("ajaxValidate","before"),function($ele){that._ajaxComplete=false
});this._shandlers[this._shandlers.length]=sh;sh=$E.subscribe(this._getEventTopic("ajaxValidate","after"),function($ele,valid){that._ajaxComplete=true;
that._ajaxValid=valid;if(valid){if(that._waittingSubmit){that.submit()}}});this._shandlers[this._shandlers.length]=sh
},unbind:function(){$A(this._handlers).each(function(h){$E.disConnect(h)});$A(this._shandlers).each(function(h){$E.unsubscribe(h)
})},submit:function(){this.domNode.node.submit()},stop:function(){this.stopSubmit=true
},validateAll:function(){$E.publish(this._getEventTopic("validateAll","before"));
var that=this;var b=true;for(var item in this.rules){var eles=$$(item);var cfg=this.rules[item];
var bValid;if(eles[0]&&(eles[0].attr("type")=="radio"||eles[0].attr("type")=="checkbox")){bValid=this.valid_(eles[0],cfg)
}else{if(this.stopOnError){bValid=!$A(eles).some(function($ele,i){return !that.valid_($ele,cfg)
})}else{bValid=$A(eles).every(function($ele,i){return that.valid_($ele,cfg)})}}b=(b&&bValid);
if(this.stopOnError&&!bValid){break}}$E.publish(this._getEventTopic("validateAll","after"),[b]);
return b},valid_:function($ele,cfg){return(cfg.skipHidden&&this.eleIsHidden_($ele))||this.validate($ele,cfg)
},eleIsHidden_:function(_el){if(!_el){return true}_el=_el.node||_el;return !_el.offsetHeight
},postCreate:function(){this.defaultFn("validate");this.defaultFn("ajaxValidate");
this.defaultFn("validateAll");this.aroundFn("submit");this.after("validateAll",function(bValid){if(bValid){this.onSuccess&&this.onSuccess(this.domNode.node)
}else{this.onFail&&this.onFail(this.domNode.node)}})},validate:function($ele,rulecfg){$ele=$($ele);
$E.publish(this._getEventTopic("validate","before"),[$ele.node,rulecfg]);var msg="",valid=false,thatcfg,v=$ele.attr("value");
var that=this;var rules=rulecfg.type;if(arale.isString(rules)){rules=[rules]}var unrequired=!$A(rules).some(function(v,i){return arale.isString(v)&&v.indexOf("required")>-1
});if(unrequired&&this._isNull($ele)){valid=true}else{valid=(!rules)?true:!$A(rules).some(function(cfg){var ruleName=arale.isArray(cfg)?cfg[0]:cfg;
var rule=that.ruleFactory.getRule(that._fixRuleName(ruleName));msg=that.msgFactory.getMsg(ruleName);
thatcfg=[rulecfg.desc||""];if(arale.isArray(cfg)){for(var k=1,l=cfg.length;k<l;k++){thatcfg[thatcfg.length]=cfg[k]
}}var b=arale.isFunction(rule)?that._funcValidate($ele,cfg):that._regValidate($ele,rule);
return !b})}$E.publish(this._getEventTopic("validate","after"),[$ele.node,valid,rulecfg.errorMsg||this._dealMsg(msg,thatcfg,$ele)]);
return valid},_fixRuleName:function(s){return s.indexOf("required")>-1?"required":s
},_isNull:function($ele){var t=$ele.attr("type");switch(t){case"checkbox":case"radio":var n=$ele.attr("name");
var eles=$$(t+'[name="'+n+'"]',this.domNode);return !$A(eles).some(function(item){return item.attr("checked")
});default:var v=$ele.node.value;if(!$S(v).trim()){return true}return false}},_dealMsg:function(msg,cfg,$ele){if(arale.isString(msg)){var i=0;
while(msg&&typeof cfg[i]!=="undefined"){msg=msg.replace(/%s/,cfg[i++])}}else{if(arale.isFunction(msg)){var args=[$ele];
msg=msg.apply(this,$A(args).extend(cfg))}}return msg},_funcValidate:function($ele,rulecfg){var args=[$ele];
if(arale.isArray(rulecfg)){var ruleName=rulecfg[0];for(var i=1,l=rulecfg.length;i<l;
i++){args[args.length]=rulecfg[i]}}else{var ruleName=rulecfg;args[args.length]=$ele
}ruleName=this._fixRuleName(ruleName);var rule=this.ruleFactory.getRule(ruleName);
return rule.apply(this,args)},_regValidate:function($ele,rule){var p=$ele.attr("placeholder");
var v=$ele.node.value;var str=(p&&v==p)?"":v;return rule.test(str)}});arale.declare("aralex.validator.ClassicValidator",[aralex.validator.Validator],{itemClass:"ui-fm-item",notifyClass:"ui-fm-explain",errorClass:"ui-fm-error",hoverClass:"ui-fm-hover",focusClass:"ui-fm-focus",loadClass:"ui-fm-status",ajaxLoadClass:"ui-fm-loading",ajaxSuccessClass:"ui-fm-success",placeholderClass:"ui-fm-placeholder",defaultAfterValidate:function(ele,bValid,errorMsg){var p=this.getParentItem(ele);
if(!bValid){p.removeClass(this.hoverClass);if($(ele).attr("placeholder")&&ele.value!=$(ele).attr("placeholder")){$(ele).removeClass(this.placeholderClass)
}p.addClass(this.errorClass);errorMsg&&(this.getExplain(ele).node.innerHTML=this._strfix(errorMsg))
}else{p.removeClass(this.errorClass);if(this._ajaxComplete){this.getExplain(ele).node.innerHTML=this._strfix($(ele).attr(this.notifyClass))
}}},defaultAfterAjaxValidate:function($ele,v,msg){var parent=this.getParentItem($ele);
parent.removeClass(this.ajaxLoadClass);if(v){parent.addClass(this.ajaxSuccessClass)
}else{parent.addClass(this.errorClass);this.getExplain($ele).node.innerHTML=this._strfix(msg)
}},customAfterValidate:null,customAfterAjaxValidate:null,bind:function(){this.parent(arguments);
var bPlaceHolder=this._supportPlaceholder();var that=this;for(var e in this.rules){$A($$(e,this.domNode)).each(function($ele){if(!bPlaceHolder&&$ele.attr("placeholder")){if(!$ele.node.value||$ele.node.value==$ele.attr("placeholder")){$ele.attr("value",$ele.attr("placeholder"));
$ele.addClass(that.placeholderClass)}}var bNC=$ele.attr(that.notifyClass);if(bNC==null&&bNC==undefined){$ele.attr(that.notifyClass,that.getExplain($ele).attr("html").replace(/(\"|\')/g,"$1"))
}var h=$E.on($ele,"mouseover",function(e){that.getParentItem($ele).addClass(that.hoverClass)
});that._handlers[that._handlers.length]=h;h=$E.on($ele,"mouseout",function(e){that.getParentItem($ele).removeClass(that.hoverClass)
});that._handlers[that._handlers.length]=h;var type=$ele.attr("type");h=$E.on($ele,"focus",handler);
that._handlers[that._handlers.length]=h;if(type=="radio"||type=="checkbox"){h=$E.on($ele,"change",handler);
that._handlers[that._handlers.length]=h}function handler(e){if($ele.attr("placeholder")&&!bPlaceHolder&&$ele.attr("value")==$ele.attr("placeholder")){$ele.node.value="";
$ele.removeClass(that.placeholderClass)}var p=that.getParentItem($ele);p.removeClass(that.hoverClass);
p.removeClass(that.ajaxLoadClass);p.removeClass(that.ajaxSuccessClass);p.addClass(that.focusClass);
p.removeClass(that.errorClass);that.getExplain($ele).node.innerHTML=that._strfix($ele.attr(that.notifyClass))
}h=$E.on($ele,"blur",function(e){if($ele.attr("placeholder")&&!bPlaceHolder&&!$ele.node.value){$ele.attr("value",$ele.attr("placeholder"));
$ele.addClass(that.placeholderClass)}that.getParentItem($ele).removeClass(that.focusClass)
});that._handlers[that._handlers.length]=h})}var h=this.before("validate",function(ele){if($Node(ele).attr("placeholder")&&ele.value==$Node(ele).attr("placeholder")){ele.value=""
}});this._shandlers[this._shandlers.length]=h;h=this.after("validate",this.customAfterValidate||this.defaultAfterValidate);
this._shandlers[this._shandlers.length]=h;if(this.checkOnSubmit){var h=this.before("validateAll",function(){this.loadClass&&$A($$("."+this.loadClass,this.domNode)).each(function(item){item.removeClass("fn-hide")
})});this._shandlers[this._shandlers.length]=h;h=this.after("validateAll",function(){this.loadClass&&$A($$("."+this.loadClass,this.domNode)).each(function(item){item.addClass("fn-hide")
})});this._shandlers[this._shandlers.length]=h}h=this.before("ajaxValidate",function($ele){this.getExplain($ele).node.innerHTML="检测中";
this.getParentItem($ele).addClass(this.ajaxLoadClass)});this._shandlers[this._shandlers.length]=h;
h=this.after("ajaxValidate",this.customAfterAjaxValidate||this.defaultAfterAjaxValidate);
this._shandlers[this._shandlers.length]=h},getParentItem:function(ele){return $($(ele).parent("."+this.itemClass))
},getExplain:function(ele){var parent=this.getParentItem(ele);return $$("."+this.notifyClass,parent)[0]||$($D.toDom('<div class="'+this.notifyClass+'"></div>')).inject(parent,"bottom")
},_supportPlaceholder:function(){var i=document.createElement("input");return"placeholder" in i
},_strfix:function(str){return(str==null||str==undefined)?"":str}});