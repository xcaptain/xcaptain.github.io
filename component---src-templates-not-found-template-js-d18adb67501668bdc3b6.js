(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"/d1K":function(e,t,a){"use strict";a.d(t,"a",(function(){return j}));a("E5k/");var n=a("3eUO"),i=a("q1tI"),r=a.n(i),l=a("Wbzz"),c=(a("pJf4"),a("iSRb")),o=a.n(c),s=function(e){var t=e.author,a=e.isIndex;return r.a.createElement("div",{className:o.a.author},r.a.createElement(l.Link,{to:"/"},r.a.createElement("img",{src:Object(l.withPrefix)(t.photo),className:o.a.author__photo,width:"75",height:"75",alt:t.name})),a?r.a.createElement("h1",{className:o.a.author__title},r.a.createElement(l.Link,{className:o.a["author__title-link"],to:"/"},t.name)):r.a.createElement("h2",{className:o.a.author__title},r.a.createElement(l.Link,{className:o.a["author__title-link"],to:"/"},t.name)),r.a.createElement("p",{className:o.a.author__subtitle},t.bio))},u=(a("rzGZ"),a("Dq+y"),a("8npG"),a("Ggvi"),a("7Qib")),m=a("euHg"),_=a.n(m),d=function(e){var t=e.icon;return r.a.createElement("svg",{className:_.a.icon,viewBox:t.viewBox},r.a.createElement("path",{d:t.path}))},p=a("aU/I"),h=a.n(p),b=function(e){var t=e.contacts;return r.a.createElement("div",{className:h.a.contacts},r.a.createElement("ul",{className:h.a.contacts__list},Object.keys(t).map((function(e){return r.a.createElement("li",{className:h.a["contacts__list-item"],key:e},r.a.createElement("a",{className:h.a["contacts__list-item-link"],href:Object(u.a)(e,t[e]),rel:"noopener noreferrer",target:"_blank"},r.a.createElement(d,{icon:Object(u.b)(e)})))}))))},g=a("Nrk+"),E=a.n(g),f=function(e){var t=e.copyright;return r.a.createElement("div",{className:E.a.copyright},t)},v=a("je8k"),N=a.n(v),k=function(e){var t=e.menu;return r.a.createElement("nav",{className:N.a.menu},r.a.createElement("ul",{className:N.a.menu__list},t.map((function(e){return r.a.createElement("li",{className:N.a["menu__list-item"],key:e.path},r.a.createElement(l.Link,{to:e.path,className:N.a["menu__list-item-link"],activeClassName:N.a["menu__list-item-link--active"]},e.label))}))))},y=a("SySy"),x=a.n(y),O=function(e){var t=e.data,a=e.isIndex,n=t.site.siteMetadata,i=n.author,l=n.copyright,c=n.menu;return r.a.createElement("div",{className:x.a.sidebar},r.a.createElement("div",{className:x.a.sidebar__inner},r.a.createElement(s,{author:i,isIndex:a}),r.a.createElement(k,{menu:c}),r.a.createElement(b,{contacts:i.contacts}),r.a.createElement(f,{copyright:l})))},j=function(e){return r.a.createElement(l.StaticQuery,{query:"213204691",render:function(t){return r.a.createElement(O,Object.assign({},e,{data:t}))},data:n})}},"3eUO":function(e){e.exports=JSON.parse('{"data":{"site":{"siteMetadata":{"title":"Joey的博客","subtitle":"每天进步一点点","copyright":"© All rights reserved.","menu":[{"label":"文章","path":"/"},{"label":"关于我","path":"/pages/about"},{"label":"联系我","path":"/pages/contacts"},{"label":"分类","path":"/categories"},{"label":"标签","path":"/tags"}],"author":{"name":"Joey Xie","photo":"/photo.jpg","bio":"保持冷静，保持激情","contacts":{"twitter":"xf_joey","github":"xcaptain","email":"joey.xf@gmail.com","rss":"/rss.xml"}}}}}}')},"76aL":function(e,t,a){"use strict";a.r(t),a.d(t,"query",(function(){return o}));var n=a("q1tI"),i=a.n(n),r=a("/d1K"),l=a("Zttt"),c=a("RXmK"),o="4269591176";t.default=function(e){var t=e.data.site.siteMetadata,a=t.title,n=t.subtitle;return i.a.createElement(l.a,{title:"Not Found - "+a,description:n},i.a.createElement(r.a,null),i.a.createElement(c.a,{title:"NOT FOUND"},i.a.createElement("p",null,"You just hit a route that doesn't exist... the sadness.")))}},"Nrk+":function(e,t,a){e.exports={copyright:"Copyright-module--copyright--1ariN"}},RBgx:function(e,t,a){e.exports={page:"Page-module--page--2nMky",page__inner:"Page-module--page__inner--2M_vz",page__title:"Page-module--page__title--GPD8L",page__body:"Page-module--page__body--Ic6i6"}},RXmK:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a("q1tI"),i=a.n(n),r=a("RBgx"),l=a.n(r),c=function(e){var t=e.title,a=e.children,r=Object(n.useRef)();return Object(n.useEffect)((function(){r.current.scrollIntoView()})),i.a.createElement("div",{ref:r,className:l.a.page},i.a.createElement("div",{className:l.a.page__inner},t&&i.a.createElement("h1",{className:l.a.page__title},t),i.a.createElement("div",{className:l.a.page__body},a)))}},SySy:function(e,t,a){e.exports={sidebar:"Sidebar-module--sidebar--X4z2p",sidebar__inner:"Sidebar-module--sidebar__inner--Jdc5s"}},"aU/I":function(e,t,a){e.exports={contacts:"Contacts-module--contacts--1rGd1",contacts__list:"Contacts-module--contacts__list--3OgdW","contacts__list-item":"Contacts-module--contacts__list-item--16p9q","contacts__list-item-link":"Contacts-module--contacts__list-item-link--2MIDn"}},euHg:function(e,t,a){e.exports={icon:"Icon-module--icon--Gpyvw"}},iSRb:function(e,t,a){e.exports={author__photo:"Author-module--author__photo--36xCH",author__title:"Author-module--author__title--2CaTb","author__title-link":"Author-module--author__title-link--Yrism",author__subtitle:"Author-module--author__subtitle--cAaEB"}},je8k:function(e,t,a){e.exports={menu:"Menu-module--menu--Efbin",menu__list:"Menu-module--menu__list--31Zeo","menu__list-item":"Menu-module--menu__list-item--1lJ6B","menu__list-item-link":"Menu-module--menu__list-item-link--10Ush","menu__list-item-link--active":"Menu-module--menu__list-item-link--active--2CbUO"}}}]);
//# sourceMappingURL=component---src-templates-not-found-template-js-d18adb67501668bdc3b6.js.map