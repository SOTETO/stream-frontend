(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b9e74410"],{"05e6":function(e,t,r){"use strict";var n=r("a8b5"),a=r.n(n);a.a},"0617":function(e,t,r){},"150f":function(e,t,r){},"1af6":function(e,t,r){var n=r("63b6");n(n.S,"Array",{isArray:r("9003")})},"28a5":function(e,t,r){"use strict";var n=r("aae3"),a=r("cb7c"),o=r("ebd6"),i=r("0390"),s=r("9def"),c=r("5f1b"),u=r("520a"),l=r("79e5"),d=Math.min,p=[].push,h="split",f="length",m="lastIndex",g=4294967295,y=!l((function(){RegExp(g,"y")}));r("214f")("split",2,(function(e,t,r,l){var v;return v="c"=="abbc"[h](/(b)*/)[1]||4!="test"[h](/(?:)/,-1)[f]||2!="ab"[h](/(?:ab)*/)[f]||4!="."[h](/(.?)(.?)/)[f]||"."[h](/()()/)[f]>1||""[h](/.?/)[f]?function(e,t){var a=String(this);if(void 0===e&&0===t)return[];if(!n(e))return r.call(a,e,t);var o,i,s,c=[],l=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),d=0,h=void 0===t?g:t>>>0,y=new RegExp(e.source,l+"g");while(o=u.call(y,a)){if(i=y[m],i>d&&(c.push(a.slice(d,o.index)),o[f]>1&&o.index<a[f]&&p.apply(c,o.slice(1)),s=o[0][f],d=i,c[f]>=h))break;y[m]===o.index&&y[m]++}return d===a[f]?!s&&y.test("")||c.push(""):c.push(a.slice(d)),c[f]>h?c.slice(0,h):c}:"0"[h](void 0,0)[f]?function(e,t){return void 0===e&&0===t?[]:r.call(this,e,t)}:r,[function(r,n){var a=e(this),o=void 0==r?void 0:r[t];return void 0!==o?o.call(r,a,n):v.call(String(a),r,n)},function(e,t){var n=l(v,e,this,t,v!==r);if(n.done)return n.value;var u=a(e),p=String(this),h=o(u,RegExp),f=u.unicode,m=(u.ignoreCase?"i":"")+(u.multiline?"m":"")+(u.unicode?"u":"")+(y?"y":"g"),b=new h(y?u:"^(?:"+u.source+")",m),x=void 0===t?g:t>>>0;if(0===x)return[];if(0===p.length)return null===c(b,p)?[p]:[];var k=0,S=0,O=[];while(S<p.length){b.lastIndex=y?S:0;var $,_=c(b,y?p:p.slice(S));if(null===_||($=d(s(b.lastIndex+(y?0:S)),p.length))===k)S=i(p,S,f);else{if(O.push(p.slice(k,S)),O.length===x)return O;for(var C=1;C<=_.length-1;C++)if(O.push(_[C]),O.length===x)return O;S=k=$}}return O.push(p.slice(k)),O}]}))},"2bd6":function(e,t,r){},"313a":function(e,t,r){"use strict";var n=r("0617"),a=r.n(n);a.a},3268:function(e,t,r){"use strict";var n=r("5570"),a=r.n(n);a.a},"40a4":function(e,t,r){"use strict";var n=r("150f"),a=r.n(n);a.a},"40c3":function(e,t,r){var n=r("6b4c"),a=r("5168")("toStringTag"),o="Arguments"==n(function(){return arguments}()),i=function(e,t){try{return e[t]}catch(r){}};e.exports=function(e){var t,r,s;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=i(t=Object(e),a))?r:o?n(t):"Object"==(s=n(t))&&"function"==typeof t.callee?"Arguments":s}},"469f":function(e,t,r){r("6c1c"),r("1654"),e.exports=r("7d7b")},4917:function(e,t,r){"use strict";var n=r("cb7c"),a=r("9def"),o=r("0390"),i=r("5f1b");r("214f")("match",1,(function(e,t,r,s){return[function(r){var n=e(this),a=void 0==r?void 0:r[t];return void 0!==a?a.call(r,n):new RegExp(r)[t](String(n))},function(e){var t=s(r,e,this);if(t.done)return t.value;var c=n(e),u=String(this);if(!c.global)return i(c,u);var l=c.unicode;c.lastIndex=0;var d,p=[],h=0;while(null!==(d=i(c,u))){var f=String(d[0]);p[h]=f,""===f&&(c.lastIndex=o(u,a(c.lastIndex),l)),h++}return 0===h?null:p}]}))},"504c":function(e,t,r){var n=r("9e1e"),a=r("0d58"),o=r("6821"),i=r("52a7").f;e.exports=function(e){return function(t){var r,s=o(t),c=a(s),u=c.length,l=0,d=[];while(u>l)r=c[l++],n&&!i.call(s,r)||d.push(e?[r,s[r]]:s[r]);return d}}},"54a1":function(e,t,r){r("6c1c"),r("1654"),e.exports=r("95d5")},5570:function(e,t,r){},"5d6f":function(e,t,r){"use strict";var n=r("84b1"),a=r.n(n);a.a},"5d73":function(e,t,r){e.exports=r("469f")},"5dbc":function(e,t,r){var n=r("d3f4"),a=r("8b97").set;e.exports=function(e,t,r){var o,i=t.constructor;return i!==r&&"function"==typeof i&&(o=i.prototype)!==r.prototype&&n(o)&&a&&a(e,o),e}},"60bf":function(e,t,r){"use strict";var n=r("ab43"),a=r.n(n);a.a},"768b":function(e,t,r){"use strict";var n=r("a745"),a=r.n(n);function o(e){if(a()(e))return e}var i=r("5d73"),s=r.n(i),c=r("c8bb"),u=r.n(c);function l(e,t){if(u()(Object(e))||"[object Arguments]"===Object.prototype.toString.call(e)){var r=[],n=!0,a=!1,o=void 0;try{for(var i,c=s()(e);!(n=(i=c.next()).done);n=!0)if(r.push(i.value),t&&r.length===t)break}catch(l){a=!0,o=l}finally{try{n||null==c["return"]||c["return"]()}finally{if(a)throw o}}return r}}function d(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function p(e,t){return o(e)||l(e,t)||d()}r.d(t,"a",(function(){return p}))},"7cd6":function(e,t,r){var n=r("40c3"),a=r("5168")("iterator"),o=r("481b");e.exports=r("584a").getIteratorMethod=function(e){if(void 0!=e)return e[a]||e["@@iterator"]||o[n(e)]}},"7d7b":function(e,t,r){var n=r("e4ae"),a=r("7cd6");e.exports=r("584a").getIterator=function(e){var t=a(e);if("function"!=typeof t)throw TypeError(e+" is not iterable!");return n(t.call(e))}},"82a4":function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));r("6b54"),r("a481"),r("c5f6"),r("4917");var n=r("d225"),a=r("b0b4"),o=function(){function e(t,r){Object(n["a"])(this,e),this.selectedCurrency=t,this.value=r,this.numericValue=this.numeric()}return Object(a["a"])(e,[{key:"getNumeric",value:function(){return this.numericValue}},{key:"match",value:function(){return"EUR"===this.selectedCurrency&&this.value.match(e.regex.EUR)||"CHF"===this.selectedCurrency&&this.value.match(e.regex.CHF)||"USD"===this.selectedCurrency&&this.value.match(e.regex.USD)}},{key:"numeric",value:function(){var t=Number(0),r=this.value;return"EUR"===this.selectedCurrency&&this.value.match(e.regex.EUR)?(r=r.replace(".",""),r=r.replace(/(\s*€)/g,""),r=r.replace(",","."),t=parseFloat(r)):"CHF"===this.selectedCurrency&&this.value.match(e.regex.CHF)?(r=r.replace(",",""),r=r.replace(/((F|f)(R|r)\.?\s*)/g,""),r=r.replace(/(\s*(F|f)(R|r)\.?)/g,""),t=parseFloat(r)):"USD"===this.selectedCurrency&&this.value.match(e.regex.USD)&&(r=r.replace(",",""),r=r.replace(/(\s*\$)/g,""),r=r.replace(/(\$\s*)/g,""),t=parseFloat(r)),t}},{key:"localize",value:function(){var t=this.value;return"EUR"===this.selectedCurrency&&this.value.match(e.regex.EUR)?t=e.formatMoney(this.numericValue,2,",",".")+" €":"CHF"===this.selectedCurrency&&this.value.match(e.regex.CHF)?t="Fr. "+e.formatMoney(this.numericValue):"USD"===this.selectedCurrency&&this.value.match(e.regex.USD)&&(t="$"+e.formatMoney(this.numericValue)),t}}],[{key:"getDefault",value:function(t){return new e(t,e.defaults[t])}},{key:"getFromNumeric",value:function(t,r){var n=e.defaults[t];return"EUR"===t?n=e.formatMoney(r,2,",",".")+" €":"CHF"===t?n="Fr. "+e.formatMoney(r):"USD"===t&&(n="$"+e.formatMoney(r)),new e(t,n)}},{key:"formatMoney",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:".",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:",";try{t=Math.abs(t),t=isNaN(t)?2:t;var a=e<0?"-":"",o=parseInt(e=Math.abs(Number(e)||0).toFixed(t)).toString(),i=o.length>6?o.length%6:0;return a+(i?o.substr(0,i)+n:"")+o.substr(i).replace(/(\d{6})(?=\d)/g,"$1"+n)+(t?r+Math.abs(e-o).toFixed(t).slice(2):"")}catch(s){}}}]),e}();o.regex={EUR:/^\d+(\.\d{3})*(,\d{2})?(\s*€)?$/,CHF:/^((F|f)(R|r)\.?\s*)?\d+(,\d{3})*(\.\d{2})?(\s*(F|f)(R|r)\.?)?$/,USD:/^(\$\s*)?\d+(,\d{3})*(\.\d{2})?(\s*\$)?$/},o.defaults={EUR:"0,00",CHF:"0.00",USD:"0.00"}},"84b1":function(e,t,r){},"8b97":function(e,t,r){var n=r("d3f4"),a=r("cb7c"),o=function(e,t){if(a(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,t,n){try{n=r("9b43")(Function.call,r("11e9").f(Object.prototype,"__proto__").set,2),n(e,[]),t=!(e instanceof Array)}catch(a){t=!0}return function(e,r){return o(e,r),t?e.__proto__=r:n(e,r),e}}({},!1):void 0),check:o}},"8c15":function(e,t,r){"use strict";var n=r("dda3"),a=r.n(n);a.a},"95d5":function(e,t,r){var n=r("40c3"),a=r("5168")("iterator"),o=r("481b");e.exports=r("584a").isIterable=function(e){var t=Object(e);return void 0!==t[a]||"@@iterator"in t||o.hasOwnProperty(n(t))}},a745:function(e,t,r){e.exports=r("f410")},a8b5:function(e,t,r){},a8f7:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VcAFrame",{attrs:{title:e.headerTitle,hasContainer:"true"}},[r("el-form",{staticClass:"columns-container",attrs:{model:e.taking,rules:e.rules}},[r("VcAColumn",{attrs:{size:"60%"}},[r("el-card",{staticClass:"box-card"},[r("TakingContext",{attrs:{context:e.taking.context},model:{value:e.taking.context,callback:function(t){e.$set(e.taking,"context",t)},expression:"taking.context"}})],1),r("el-card",{staticClass:"box-card tail expand"},[r("TakingCalculator",{attrs:{first:!1,sourceCount:e.sourceCount,amount:e.taking.amount},model:{value:e.taking.amount,callback:function(t){e.$set(e.taking,"amount",t)},expression:"taking.amount"}})],1),e.showExternalTransactions?r("el-card",{staticClass:"box-card tail expand"},[r("ExternalTransactionDetails",{attrs:{taking:e.taking,sources:e.taking.amount.sources,name:e.taking.context.description},model:{value:e.taking.details,callback:function(t){e.$set(e.taking,"details",t)},expression:"taking.details"}})],1):e._e(),r("el-card",{staticClass:"box-card tail expand"},[r("el-form-item",{staticClass:"vca-categories",attrs:{label:e.$t("donation.placeholder.comment")}},[r("el-input",{attrs:{type:"textarea",rows:4,placeholder:e.$t("takings.placeholder.comment")},model:{value:e.taking.comment,callback:function(t){e.$set(e.taking,"comment",t)},expression:"taking.comment"}})],1),e.showInternalTransactions?r("el-card",{staticClass:"box-card tail expand"},[r("TakingDeadline",{attrs:{received:e.taking.amount.received}}),r("br"),r("br"),r("div",[r("span",[e._v(e._s(e.$t("donation.placeholder.internalDetails.description")))])]),r("br"),r("ReasonForPayment",{attrs:{taking:e.taking,name:e.taking.context.description},on:{addReason:e.addReason}})],1):e._e(),e.updateMode?e._e():r("button",{staticClass:"vca-button-primary vca-full-width",attrs:{disabled:!e.validDonation},on:{click:function(t){return t.preventDefault(),e.submitForm(t)}}},[e._v("\n                      "+e._s(e.$t("takings.buttons.save"))+"\n                  ")]),e.updateMode?r("button",{staticClass:"vca-button-primary vca-full-width",attrs:{disabled:!e.validDonation},on:{click:function(t){return t.preventDefault(),e.updateForm(t)}}},[e._v("\n                      "+e._s(e.$t("takings.buttons.update"))+"\n                  ")]):e._e()],1)],1)],1)],1)},a=[],o=(r("8e6e"),r("ac6a"),r("456d"),r("7f7f"),r("bd86")),i=r("bc3a"),s=r.n(i),c=r("2f62"),u=r("0ced"),l=(r("1207"),r("5c96")),d=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("template",{slot:"header"},[r("el-select",{attrs:{size:"small"},model:{value:e.currency,callback:function(t){e.currency=t},expression:"currency"}},e._l(e.currencyOptions,(function(t){return r("el-option",{key:t,attrs:{label:e.$t("currencies.label."+t),value:t}})})),1)],1),r("div",{staticClass:"collector"},[r("el-form",{attrs:{model:e.dataForm,rules:e.rules}},[r("el-form-item",{staticClass:"vca-form user-select",attrs:{required:!1,label:e.$t("donation.placeholder.involved.label"),prop:"who"}},e._l(e.amount.involvedSupporter,(function(t){return r("el-tag",{attrs:{"disable-transitions":!1}},[e._v("\n              "+e._s(t.name)+"\n            ")])})),1),r("el-form-item",{staticClass:"vca-form",attrs:{label:e.$t("donation.placeholder.received"),prop:"when"}},[r("el-date-picker",{attrs:{placeholder:e.$t("donation.placeholder.received"),format:"dd.MMM yyyy","default-value":e.formatReceived,"picker-options":e.datePickerOptions},on:{change:e.changeWhen},model:{value:e.dataForm.when,callback:function(t){e.$set(e.dataForm,"when",t)},expression:"dataForm.when"}})],1),r("el-form-item",{attrs:{label:e.$t("donation.header.donationSource.sourceSelect"),prop:"where"}},[r("br"),r("TakingSelectSource",{attrs:{sources:e.amount.sources},on:{input:function(t){return e.addSourceType(t)}}})],1),r("table",{staticClass:"sources"},[r("col",{attrs:{width:"65%"}}),r("col",{attrs:{width:"20%"}}),r("col",{attrs:{width:"5%"}}),r("col",{attrs:{width:"*"}}),r("thead",[r("tr",[r("th",[e._v(e._s(e.$t("donation.header.donationSource.sourceSelect")))]),r("th",[e._v(e._s(e.$t("donation.header.donationSource.sum")))]),r("th",[e._v(e._s(e.$t("donation.header.donationSource.sourceType.cash")))]),r("th",[e._v(e._s(e.$t("donation.header.donationSource.sourceType.extern")))])])]),r("tbody",e._l(e.amount.sources,(function(t){return r("TakingSource",{key:t.key,attrs:{source:t,category:t.category,checked:e.getCheckedSource(t.category),type:e.getTypeSource(t.category),numeric:e.getNumericSource(t.category),description:t.desc,descriptionText:e.getDescSource(t.category),disableDelete:e.disableDelete(t)},on:{delete:function(r){return e.deleteSource(t)}}})})),1)])],1)],1),r("div",{staticClass:"evaluation"},[r("span",{staticClass:"part"},[e._v(e._s(e.$t("donation.hints.total.cash",{total:e.getTotalCash})))]),r("span",{staticClass:"part"},[e._v(e._s(e.$t("donation.hints.total.extern",{total:e.getTotalExtern})))]),r("span",{staticClass:"all"},[e._v(e._s(e.$t("donation.hints.total.all",{total:e.getTotalAll})))])])],2)},p=[],h=(r("6b54"),r("c5f6"),r("30be")),f=(r("2bd6"),function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("el-select",{on:{input:e.commit},model:{value:e.val,callback:function(t){e.val=t},expression:"val"}},e._l(e.sourceGroups,(function(t){return r("el-option-group",{key:t.label,attrs:{label:t.label}},e._l(t.sourceSelect,(function(e){return r("el-option",{key:e.id,attrs:{label:e.label,value:e.value,disabled:e.disabled}})})),1)})),1)}),m=[],g=r("768b"),y=(r("ffc1"),{name:"TakingSelectSource",components:{"el-select":l["Select"],"el-option":l["Option"]},props:{sources:{type:Array,required:!0}},created:function(){var e=this;this.sourceGroups=this.sourceGroups.map((function(t){return t.sourceSelect=t.sourceSelect.map((function(t){for(var r in e.sources)e.sources[r].category===t.value.category&&(t.disabled=!0,console.log(t));return t})),t}))},data:function(){return{val:"",sourceGroups:[{label:this.$t("donation.placeholder.source.group.donations"),sourceSelect:[{label:this.$t("donation.placeholder.source.unknown"),disabled:!1,value:{amount:{amount:0,currency:"EUR"},category:"unknown",norms:"DONATION",typeOfSource:{},desc:!1}},{label:this.$t("donation.placeholder.source.can"),disabled:!1,value:{amount:{amount:0,currency:"EUR"},category:"can",norms:"DONATION",typeOfSource:{},desc:!1}},{label:this.$t("donation.placeholder.source.box"),disabled:!1,value:{amount:{amount:0,currency:"EUR"},category:"box",norms:"DONATION",typeOfSource:{},desc:!1}},{label:this.$t("donation.placeholder.source.gl"),disabled:!1,value:{amount:{amount:0,currency:"EUR"},category:"gl",norms:"DONATION",typeOfSource:{},desc:!1}},{label:this.$t("donation.placeholder.source.other"),disabled:!1,value:{amount:{amount:0,currency:"EUR"},category:"other",norms:"DONATION",typeOfSource:{},desc:!0}}]},{label:this.$t("donation.placeholder.source.group.economic"),sourceSelect:[{label:this.$t("donation.placeholder.source.merch"),disabled:!1,value:{amount:{amount:0,currency:"EUR"},category:"merch",norms:"ECONOMIC",typeOfSource:{},desc:!1}},{label:this.$t("donation.placeholder.source.other"),disabled:!1,value:{amount:{amount:0,currency:"EUR"},category:"other_ec",norms:"ECONOMIC",typeOfSource:{},desc:!1}}]}]}},methods:{commit:function(){var e=this;this.$emit("input",this.val),Object.entries(this.sourceGroups).forEach((function(t){var r=Object(g["a"])(t,2),n=r[0],a=r[1];Object.entries(a.sourceSelect).forEach((function(t){var r=Object(g["a"])(t,2),a=r[0],o=r[1];e.val.category==o.value.category&&(e.sourceGroups[n].sourceSelect[a].disabled=!0)}))}))}}}),v=y,b=(r("5d6f"),r("2877")),x=Object(b["a"])(v,f,m,!1,null,"60fbb5aa",null),k=x.exports,S=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("tr",{staticClass:"source"},[r("td",[r("div",{staticClass:"category"},[r("span",[e._v(" "+e._s(e.$t("donation.placeholder.source."+e.source.category)))]),r("el-form-item",{staticClass:"category-description"},[r("el-input",{attrs:{placeholder:e.$t("donation.placeholder.source.description")},model:{value:e.source.description,callback:function(t){e.$set(e.source,"description",t)},expression:"source.description"}})],1)],1)]),r("td",[r("MoneyInput",{attrs:{amount:e.source.amount},on:{"vca-money-validationError":e.invalid},model:{value:e.source.amount,callback:function(t){e.$set(e.source,"amount",t)},expression:"source.amount"}})],1),r("td",[r("el-form-item",[r("el-radio",{attrs:{label:"cash"},model:{value:e.source.typeOfSource.category,callback:function(t){e.$set(e.source.typeOfSource,"category",t)},expression:"source.typeOfSource.category"}},[e._v(" ")])],1)],1),r("td",[r("el-form-item",[r("el-radio",{attrs:{label:"extern"},model:{value:e.source.typeOfSource.category,callback:function(t){e.$set(e.source.typeOfSource,"category",t)},expression:"source.typeOfSource.category"}},[e._v(" ")])],1)],1),r("td",[r("el-button",{attrs:{type:"danger",icon:"el-icon-delete",disabled:e.disableDelete},on:{click:e.deleteSource}})],1)])},O=[],$=r("82a4"),_=r("63ee"),C={name:"TakingSource",components:{MoneyInput:_["a"]},props:{disableDelete:{type:Boolean,default:!1},source:{type:Object,default:function(){return{amount:{amount:0,currency:"EUR"},category:"",description:"",typeOfSource:{category:""}}}}},data:function(){var e=$["a"].getDefault(this.source.amount.currency);return{checkedVar:!1,amount:{formatted:e.localize(),amount:e.getNumeric()},typeVar:"cash",descriptionTextVar:"",amountErrorState:!1}},created:function(){var e=$["a"].getFromNumeric(this.source.amount.currency,this.numeric);this.amount.formatted=e.localize(),this.amount.amount=e.getNumeric(),this.checkedVar=this.checked,this.typeVar=this.type,this.descriptionTextVar=this.descriptionText},methods:{commit:function(){if(this.checkedVar&&!this.amountErrorState){var e={category:this.category,amount:this.source.amount.amount,currency:this.source.amount.currency,type:this.typeVar};this.descriptionText&&(e["description"]=this.descriptionTextVar),this.$emit("input",e)}else this.checkedVar||this.amountErrorState||this.deselect()},deleteSource:function(){this.$emit("delete")},deselect:function(){this.$emit("deselect",this.category)},valid:function(){this.amountErrorState=!1,this.checkedVar=!0,this.commit()},invalid:function(){this.amountErrorState=!0,this.checkedVar=!1,this.commit()}}},w=C,F=(r("8c15"),Object(b["a"])(w,S,O,!1,null,"14bfd438",null)),E=F.exports,D=r("d4d5"),R={name:"TakingCalculator",components:{"el-date-picker":l["DatePicker"],"el-form-item":l["FormItem"],"el-select":l["Select"],"el-option":l["Option"],TakingSource:E,WidgetUserAutocomplete:h["WidgetUserAutocomplete"],TakingSelectSource:k},props:{sourceCount:{type:Number,default:0},amount:{type:Object,default:function(){return{received:"",sources:"",involvedSupporter:this.dataForm.who}}}},watch:{amount:function(e,t){e.hasOwnProperty("received")&&(this.received=this.received,this.dataForm.when=this.formatReceived),e.hasOwnProperty("sources")&&(this.sources=e.sources),e.hasOwnProperty("involvedSupporter")&&(this.involvedSupporter=e.involvedSupporter)}},data:function(){var e=[],t=new Date,r=[];return"undefined"!==typeof this.amount&&null!==this.amount&&(this.amount.hasOwnProperty("sources")&&(e=this.amount.sources),this.amount.hasOwnProperty("received")&&(t=this.amount.received),this.amount.hasOwnProperty("involvedSupporter")&&(r=this.amount.involvedSupporter)),{datePickerOptions:{disabledDate:function(e){return e.getTime()>Date.now()}},count:this.amount.sources.length,result:Number,dataForm:{when:"",who:""},rules:{who:[{required:!0,message:"test",trigger:"change"}],when:[{type:"date",required:!0,pattern:/^\d{2}.[a-zA-Z]{3}.\d{4}$/,message:"test",trigger:"change"}],where:[{type:"array",required:!0,message:"test",trigger:"blur"}]},sourceTypes:[{category:"unknown",desc:!1},{category:"can",desc:!1},{category:"box",desc:!1},{category:"gl",desc:!1},{category:"other",desc:!0},{category:"merch",desc:!1},{category:"com",desc:!1},{category:"better",desc:!1},{category:"other_ec",desc:!0}],currentSourceType:[],currency:this.$t("currencies.default"),currencyOptions:["EUR","USD","CHF"],involvedSupporter:r,received:t,sources:e}},computed:{getTotalCash:function(){return this.getTotal("cash")},getTotalExtern:function(){return this.getTotal("extern")},getTotalAll:function(){return this.getTotal()},formatReceived:function(){return new Date(this.amount.received)}},created:function(){"undefined"!==typeof this.amount&&null!==this.amount&&(this.amount.hasOwnProperty("received")&&(this.received=this.received,this.dataForm.when=this.formatReceived),this.amount.hasOwnProperty("sources")&&(this.sources=this.amount.sources),this.amount.hasOwnProperty("involvedSupporter")&&(this.involvedSupporter=this.amount.involvedSupporter))},methods:{addSourceType:function(e){var t=this.amount.sources.filter((function(t){return t.category===e.category}));0===t.length&&this.amount.sources.push(e)},deleteSource:function(e){var t=this.amount.sources.indexOf(e);t>-1&&this.amount.sources.splice(t,1)},disableDelete:function(e){var t=this.amount.sources.indexOf(e);return t<this.sourceCount},getWhen:function(){var e=this.formatReceived.getDate(),t=this.formatReceived.toString().substr(4,3),r=this.formatReceived.getFullYear();return e+"."+t+" "+r},changeDonation:function(e){var t=this.sources.slice(0);t=t.filter((function(t){return e.category!==t.category})),t.push(e),this.sources=t,this.commit()},deselect:function(e){var t=this.sources.slice(0);t=t.filter((function(t){return e!==t.category})),this.sources=t,this.commit()},changeWhen:function(){this.received=Date.parse(this.dataForm.when),this.commit()},getTotal:function(e){var t=function(e,t){return e+t.amount.amount},r=function(t){return t.typeOfSource===e},n=this.amount.sources.reduce(t,0);return"string"!==typeof e||"cash"!==e&&"extern"!==e||(n=this.amount.sources.filter(r).reduce(t,0)),D["a"].getString(n,this.currency)},commit:function(){var e={received:this.received,sources:this.sources,involvedSupporter:this.involvedSupporter};this.$emit("input",e)},getCheckedSource:function(e){var t=this.sources.filter((function(t){return t.category===e})).pop(),r=!1;return"undefined"!==typeof t&&(r=!0),r},getTypeSource:function(e){var t=this.sources.filter((function(t){return t.category===e})).pop(),r="cash";return"undefined"!==typeof t&&(r=t.type),r},getNumericSource:function(e){var t=this.sources.filter((function(t){return t.category===e})).pop(),r=0;return"undefined"!==typeof t&&(r=t.amount),r},getDescSource:function(e){var t=this.sources.filter((function(t){return t.category===e})).pop(),r="";return"undefined"!==typeof t&&null!==t&&t.hasOwnProperty("description")&&(r=t.description),r},selectSupporter:function(e){this.amount.involvedSupporter=e}}},T=R,P=(r("05e6"),Object(b["a"])(T,d,p,!1,null,"6e38d01e",null)),N=P.exports,I=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",[r("span",[e._v(e._s(e.$t("donation.placeholder.externalDetails.partner.label")))]),r("el-form-item",[r("el-input",{attrs:{placeholder:e.$t("donation.placeholder.externalDetails.partner.name")},on:{change:e.changeName},model:{value:e.partner.name,callback:function(t){e.$set(e.partner,"name",t)},expression:"partner.name"}})],1),r("el-form-item",[r("el-input",{attrs:{placeholder:e.$t("donation.placeholder.externalDetails.partner.asp")},on:{change:e.changeASP},model:{value:e.partner.asp,callback:function(t){e.$set(e.partner,"asp",t)},expression:"partner.asp"}})],1),r("el-form-item",[r("el-input",{attrs:{placeholder:e.$t("donation.placeholder.externalDetails.partner.email")},on:{change:e.changeEmail},model:{value:e.partner.email,callback:function(t){e.$set(e.partner,"email",t)},expression:"partner.email"}})],1),r("el-form-item",[r("el-input",{attrs:{placeholder:e.$t("donation.placeholder.externalDetails.partner.address")},on:{change:e.changeAddress},model:{value:e.partner.address,callback:function(t){e.$set(e.partner,"address",t)},expression:"partner.address"}})],1)],1),r("el-form-item",[r("el-checkbox",{on:{change:e.commit},model:{value:e.donationReceipt,callback:function(t){e.donationReceipt=t},expression:"donationReceipt"}},[e._v(e._s(e.$t("donation.placeholder.externalDetails.receipt")))])],1),r("el-card",{staticClass:"box-card tail expand"},[r("div",[r("span",[e._v(e._s(e.$t("donation.placeholder.externalDetails.description")))])]),r("br"),r("ReasonForPayment",{attrs:{taking:e.taking,typeOfSource:e.external,name:e.name,address:e.partner.address}})],1)],1)},A=[],j=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",["external"==e.typeOfSource?r("p",[r("span",{staticClass:"donationAccount"},[e._v(e._s(e.$t("donation.placeholder.externalDetails.account.label")))]),r("br"),r("span",[e._v(e._s(e.$t("donation.placeholder.externalDetails.account.owner")))]),r("br"),r("span",[e._v(e._s(e.$t("donation.placeholder.externalDetails.account.iban")))]),r("br"),r("span",[e._v(e._s(e.$t("donation.placeholder.externalDetails.account.bic")))]),r("br")]):e._e(),r("span",{staticClass:"reasonForPayment"},[e._v(e._s(e.$t("externalTransaction.label.reasonForPayment",{generated:e.reasonForPayments})))]),r("br"),r("br")])},U=[],M={name:"ReasonForPayment",props:{typeOfSource:{type:String,default:null},name:{type:String,default:null},address:{type:String,default:null},taking:{type:Object,required:!0}},data:function(){return{reasonForPayment:""}},created:function(){this.reasonForPayment=this.reasonForPayments},methods:{getCurrentReason:function(){if(""!==this.taking.details.reasonForPayment)return this.taking.details.reasonForPayment;var e=this.getCrewForReason(),t=this.getActionForReason(),r=e+" - "+t;return this.$emit("addReason",r),r},getCrewForReason:function(){var e="UKN",t=this.$store.getters["user/getCrew"];return void 0!==t&&null!==t&&this.$store.getters["user/getCrew"]&&(e=this.$store.getters["user/getCrew"][0]["name"],e=e.substr(0,3).toUpperCase()),e},getActionForReason:function(){var e="AKN";return null!==this.name&&""!==this.name&&(e=this.name.toUpperCase()),e}},computed:{reasonForPayments:function(){var e=this.getCurrentReason();return"external"==this.typeOfSource&&(e+=" - EXT"),e}}},V=M,q=(r("c61f"),Object(b["a"])(V,j,U,!1,null,"0170e3a4",null)),H=q.exports,G={name:"ExternalTransactionDetails",components:{"el-input":l["Input"],"el-checkbox":l["Checkbox"],"el-form-item":l["FormItem"],ReasonForPayment:H},props:{value:{type:Object},taking:{type:Object},sources:{type:Array},name:{type:String,default:null}},data:function(){return{donationReceipt:!1,reasonForPayment:"",partner:{name:"",asp:"",email:"",address:""}}},computed:{external:function(){return"external"}},created:function(){if(this.sources.length>0)for(var e in this.sources)"extern"===this.sources[e].typeOfSource.category&&("undefined"==typeof this.sources[e].typeOfSource.external?this.sources[e].typeOfSource["external"]={location:"",address:"",contactPerson:"",email:"",receipt:!1}:(this.partner.name=this.sources[e].typeOfSource.external.location,this.partner.address=this.sources[e].typeOfSource.external.address,this.partner.asp=this.sources[e].typeOfSource.external.contactPerson,this.partner.email=this.sources[e].typeOfSource.external.email,this.donationReceipt=this.sources[e].typeOfSource.external.receipt));"undefined"!==typeof this.value&&null!==this.value&&(this.value.hasOwnProperty("receipt")&&(this.donationReceipt=this.value.receipt),this.value.hasOwnProperty("partner")&&(this.partner=this.value.partner)),this.commit()},watch:{sources:{deep:!0,handler:function(e){for(var t in this.sources)"extern"===this.sources[t].typeOfSource.category?"undefined"==typeof this.sources[t].typeOfSource.external&&(this.sources[t].typeOfSource["external"]={location:this.partner.name,address:this.partner.address,contactPerson:this.partner.asp,email:this.partner.email,receipt:this.donationReceipt}):"undefined"!=typeof this.sources[t].typeOfSource.external&&delete this.sources[t].typeOfSource.external}}},methods:{commit:function(){var e={reasonForPayment:this.reasonForPayment,receipt:this.donationReceipt,partner:this.partner};this.$emit("input",e)},changeName:function(){if(this.sources.length>0)for(var e in this.sources)"extern"===this.sources[e].typeOfSource.category&&(this.sources[e].typeOfSource.external.location=this.partner.name)},changeAddress:function(){if(this.sources.length>0)for(var e in this.sources)"extern"===this.sources[e].typeOfSource.category&&(this.sources[e].typeOfSource.external.address=this.partner.address)},changeASP:function(){if(this.sources.length>0)for(var e in this.sources)"extern"===this.sources[e].typeOfSource.category&&(this.sources[e].typeOfSource.external.contactPerson=this.partner.asp)},changeEmail:function(){if(this.sources.length>0)for(var e in this.sources)"extern"===this.sources[e].typeOfSource.category&&(this.sources[e].typeOfSource.external.email=this.partner.email)},changeReceipt:function(){if(this.sources.length>0)for(var e in this.sources)"extern"===this.sources[e].typeOfSource.category&&(this.sources[e].external.receipt=this.donationReceipt)}}},z=G,W=(r("60bf"),Object(b["a"])(z,I,A,!1,null,"3d329bd3",null)),X=W.exports,L=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("span",[e.immediately?r("i18n",{attrs:{path:"donation.hints.deadline.prefix",tag:"span",for:"donation.hints.deadline.date"}},[r("span",{staticClass:"deadline"},[e._v(e._s(e.$t("donation.hints.deadline.immediately")))])]):r("i18n",{attrs:{path:"donation.hints.deadline.prefix",tag:"span",for:"donation.hints.deadline.date"}},[r("span",{staticClass:"deadline"},[e._v(e._s(e.$t("donation.hints.deadline.date",{deadline:e.deadline})))])])],1)},B=[],Y={name:"DonationDeadline",props:{received:{type:Number,required:!0}},computed:{deadline:function(){var e=this.calculator();return this.$d(e.date,"short")},immediately:function(){var e=this.calculator();return e.immediately}},methods:{calculator:function(){var e=new Date(this.received);e.setDate(e.getDate()+28);var t={date:e,immediately:!1};return e<=Date.now()&&(t.immediately=!0),t}}},J=Y,K=(r("313a"),Object(b["a"])(J,L,B,!1,null,"707a6084",null)),Z=K.exports,Q=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"context-form"},[r("el-form",{attrs:{rules:e.rules,model:e.context}},[r("el-form-item",{attrs:{label:e.$t("donation.placeholder.context.label"),prop:"description"}},[r("el-input",{attrs:{placeholder:e.$t("donation.placeholder.context.indicator")},model:{value:e.context.description,callback:function(t){e.$set(e.context,"description",t)},expression:"context.description"}})],1),r("el-form-item",{staticClass:"vca-categories",attrs:{label:e.$t("donation.placeholder.category"),prop:"category"}},[r("el-checkbox-group",{model:{value:e.dataForm.category,callback:function(t){e.$set(e.dataForm,"category",t)},expression:"dataForm.category"}},[r("table",{staticClass:"categoryChooser"},e._l(e.categories,(function(t,n){return r("tr",{key:n,staticClass:"vca-group"},e._l(t,(function(t){return r("td",{key:t},[r("el-checkbox",{attrs:{label:t},on:{change:e.createCategoryString}},[e._v(e._s(e.$t("donation.placeholder.categories."+t)))])],1)})),0)})),0)])],1)],1)],1)},ee=[],te=(r("28a5"),{name:"TakingContext",props:{context:{type:Object,default:function(){return{description:"",category:""}}}},watch:{context:function(e,t){this.dataForm.description=e.description,this.dataForm.category=""!==e.category?e.category.split(","):[]}},components:{"el-input":l["Input"],"el-radio":l["Radio"],"el-form-item":l["FormItem"]},data:function(){return{categories:[["concert","run4wash","streetFestivals"],["festival","school","karaoke"],["stadium","party","kicker"],["other"]],dataForm:{description:"",category:[]},rules:{description:[{required:!0,message:this.$t("takings.validations.description"),trigger:"blur"}],category:[{required:!0,message:this.$t("takings.validations.category"),trigger:"change"}]}}},methods:{createCategoryString:function(){this.context.category=this.dataForm.category.join(",")}}}),re=te,ne=(r("40a4"),Object(b["a"])(re,Q,ee,!1,null,"7bc5047e",null)),ae=ne.exports;function oe(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ie(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?oe(Object(r),!0).forEach((function(t){Object(o["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):oe(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var se={name:"TakingsEdit",components:{TakingCalculator:N,ExternalTransactionDetails:X,ReasonForPayment:H,TakingDeadline:Z,TakingContext:ae,VcAFrame:u["VcAFrame"],VcAColumn:u["VcAColumn"],"el-card":l["Card"],"el-input":l["Input"],"el-form":l["Form"]},props:{id:{type:String,default:null}},data:function(){return{reason:"",sourceCount:0,taking:{context:{description:"",category:""},comment:"",details:{reasonForPayment:"",receipt:!1,partner:{}},description:"",amount:{received:Date.now(),sources:[],involvedSupporter:[]},created:Date.now(),updated:Date.now()},rules:{}}},mounted:function(){var e=this;null!==this.id&&s.a.get("/backend/stream/takings/id/"+this.id,{headers:{"X-Requested-With":"XMLHttpRequest"}}).then((function(t){200===t.status&&(e.taking=t.data,e.sourceCount=e.taking.amount.sources.length)})).catch((function(e){return console.log(e)}))},computed:ie({},Object(c["c"])("takings",{get:"getById"}),{headerTitle:function(){return null!==this.id?this.$t("takingsEdit.header.edit"):this.$t("takingsEdit.header.add")},updateMode:function(){return null!==this.id},showExternalTransactions:function(){return this.taking.amount.sources.filter((function(e){return"extern"===e.typeOfSource.category})).length>0},showInternalTransactions:function(){return this.taking.amount.sources.filter((function(e){return"cash"===e.typeOfSource.category})).length>0},showCalculator:function(){return this.taking.context.hasOwnProperty("category")&&""!==this.taking.context.category&&this.taking.context.hasOwnProperty("description")&&""!==this.taking.context.description},validDonation:function(){function e(e){return e.amount.hasOwnProperty("amount")&&e.amount.amount>0&&e.hasOwnProperty("typeOfSource")&&""!==e.typeOfSource}return this.taking.amount.sources.length>0&&this.taking.amount.sources.every(e)}}),methods:ie({},Object(c["b"])("takings",["add","update","getById"]),{addReason:function(e){this.reason=e},submitForm:function(){if(this.taking.amount.sources.length>0)for(var e in this.taking.amount.sources)"extern"==this.taking.amount.sources[e].typeOfSource.category&&(this.taking.amount.sources[e].typeOfSource.external={location:this.taking.details.partner.name,contactPerson:this.taking.details.partner.asp,email:this.taking.details.partner.email,address:this.taking.details.partner.address,receipt:this.taking.details.receipt});this.taking.details.reasonForPayment=this.reason,this.add(this.taking),this.$router.push("/takings")},updateForm:function(){if(this.taking.amount.sources.length>0)for(var e in this.taking.amount.sources)"extern"==this.taking.amount.sources[e].typeOfSource.category&&(this.taking.amount.sources[e].typeOfSource.external={location:this.taking.details.partner.name,contactPerson:this.taking.details.partner.asp,email:this.taking.details.partner.email,address:this.taking.details.partner.address,receipt:this.taking.details.receipt});this.update(this.taking),this.$router.push("/takings")}})},ce=se,ue=(r("3268"),Object(b["a"])(ce,n,a,!1,null,"62171a8e",null));t["default"]=ue.exports},aa77:function(e,t,r){var n=r("5ca1"),a=r("be13"),o=r("79e5"),i=r("fdef"),s="["+i+"]",c="​",u=RegExp("^"+s+s+"*"),l=RegExp(s+s+"*$"),d=function(e,t,r){var a={},s=o((function(){return!!i[e]()||c[e]()!=c})),u=a[e]=s?t(p):i[e];r&&(a[r]=u),n(n.P+n.F*s,"String",a)},p=d.trim=function(e,t){return e=String(a(e)),1&t&&(e=e.replace(u,"")),2&t&&(e=e.replace(l,"")),e};e.exports=d},aae3:function(e,t,r){var n=r("d3f4"),a=r("2d95"),o=r("2b4c")("match");e.exports=function(e){var t;return n(e)&&(void 0!==(t=e[o])?!!t:"RegExp"==a(e))}},ab43:function(e,t,r){},ba8a:function(e,t,r){},c5f6:function(e,t,r){"use strict";var n=r("7726"),a=r("69a8"),o=r("2d95"),i=r("5dbc"),s=r("6a99"),c=r("79e5"),u=r("9093").f,l=r("11e9").f,d=r("86cc").f,p=r("aa77").trim,h="Number",f=n[h],m=f,g=f.prototype,y=o(r("2aeb")(g))==h,v="trim"in String.prototype,b=function(e){var t=s(e,!1);if("string"==typeof t&&t.length>2){t=v?t.trim():p(t,3);var r,n,a,o=t.charCodeAt(0);if(43===o||45===o){if(r=t.charCodeAt(2),88===r||120===r)return NaN}else if(48===o){switch(t.charCodeAt(1)){case 66:case 98:n=2,a=49;break;case 79:case 111:n=8,a=55;break;default:return+t}for(var i,c=t.slice(2),u=0,l=c.length;u<l;u++)if(i=c.charCodeAt(u),i<48||i>a)return NaN;return parseInt(c,n)}}return+t};if(!f(" 0o1")||!f("0b1")||f("+0x1")){f=function(e){var t=arguments.length<1?0:e,r=this;return r instanceof f&&(y?c((function(){g.valueOf.call(r)})):o(r)!=h)?i(new m(b(t)),r,f):b(t)};for(var x,k=r("9e1e")?u(m):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),S=0;k.length>S;S++)a(m,x=k[S])&&!a(f,x)&&d(f,x,l(m,x));f.prototype=g,g.constructor=f,r("2aba")(n,h,f)}},c61f:function(e,t,r){"use strict";var n=r("ba8a"),a=r.n(n);a.a},c8bb:function(e,t,r){e.exports=r("54a1")},dda3:function(e,t,r){},f410:function(e,t,r){r("1af6"),e.exports=r("584a").Array.isArray},fdef:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},ffc1:function(e,t,r){var n=r("5ca1"),a=r("504c")(!0);n(n.S,"Object",{entries:function(e){return a(e)}})}}]);
//# sourceMappingURL=chunk-b9e74410.d49333ac.js.map