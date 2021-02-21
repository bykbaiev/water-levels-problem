(()=>{"use strict";const e=[{landscape:[1],time:1,result:[1]},{landscape:[2,3],time:1,result:[1.5,.5]},{landscape:[3,2],time:1,result:[.5,1.5]},{landscape:[0,0,0,0,0],time:1,result:[1,1,1,1,1]},{landscape:[5,4,3,2,1],time:1,result:[0,0,.666,1.666,2.666]},{landscape:[7,2,3,3,5],time:1,result:[0,2.333,1.333,1.333,0]},{landscape:[4,1,5,2,4,9,8,7,6,8],time:1,result:[0,2.5,0,2.5,.5,0,.375,1.375,2.375,.375]},{landscape:[1,2,3,4,1],time:1,result:[2.16667,1.16667,.16667,0,1.5]},{landscape:[1,2,3,4,1],time:2,result:[3.2,2.2,1.2,.2,3.2]},{landscape:[4,1,5,2,4,9,8,7,6,8],time:2,result:[1.8,4.8,.8,3.8,1.8,0,1,2,3,1]},{landscape:[3,1,6,4,8,9],time:1,result:[1,3,0,2,0,0]},{landscape:[3,1,6,4,8,9],time:2,result:[3.5,5.5,.5,2.5,0,0]},{landscape:[3,1,6,4,8,9],time:3,result:[5,7,2,4,0,0]}];var t,r,n=function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var n=Array(e),i=0;for(t=0;t<r;t++)for(var u=arguments[t],l=0,a=u.length;l<a;l++,i++)n[i]=u[l];return n},i="#landscapeEl",u="#time",l="#error",a="#result",h=1e3,c=500,f=("div",function(e,t){var r=document.createElement("div");return Object.keys(e).map((function(t){return r.setAttribute(t,e[t])})),t.map((function(e){return r.appendChild(e)})),r}),o=function(e){return document.createTextNode(e)},s=function(e){return Number(e.toFixed(3)).toString()},d=function(e){var t=Math.ceil(e/25);return{diff:t,items:Array(e).fill(0).map((function(e,t){return t})).filter((function(e){return e%t==0}))}},g=function(e,t){var r=d(e),n=r.items,i=r.diff;return n.map((function(e){return f({class:"ruler-item",style:"height:"+t*i+"px"},[f({class:"ruler-number"},[o(e.toString())])])}))},p=function(e){var t=document.querySelector("#landscape");t.innerHTML="",t.append(function(e){var t=e.length,r=Math.max.apply(Math,e.map((function(e){return e.height+e.water})));if(0===t)return f({class:"empty",style:"width: 1000px; height: 500px; line-height: 500px;"},[o("Please provide the landscape")]);var i,u,l=Math.ceil(1.3*r),a=c/l,p=(i=h/t,u=a,function(e){var t=e.height,r=e.water;return f({class:"segment",style:"width:"+i+"px"},[f({class:"total"},[o(s(t+r))]),f({class:"water",style:"height: "+r*u+"px"},[]),f({class:"ground",style:"height: "+t*u+"px"},[]),f({class:"water-level"},[o(s(r))])])});return f({class:"board-wrapper",style:"width: 1000px; height: 500px;"},n(function(e,t){var r=d(e),n=r.items,i=r.diff;return n.map((function(){return f({class:"line",style:"height:"+t*i+"px"},[])}))}(l,a),[f({class:"board"},n(e.map(p),[f({class:"ruler"},g(l,a))]))]))}(e))},m=function(e){document.querySelector(l).innerHTML=e},v=function(){return(v=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)},x=function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var n=Array(e),i=0;for(t=0;t<r;t++)for(var u=arguments[t],l=0,a=u.length;l<a;l++,i++)n[i]=u[l];return n},y=function(e){return e.reduce((function(e,t){return x([t],e)}),[])},q=function(e){var t=[{height:1/0,index:-1}];return e.reduce((function(e,r,n){for(var i=[];r>=t[t.length-1].height;)i.unshift(t.pop());var u=i.reduce((function(n,u,l){var a=u.height,h=u.index,c=0===l?t[t.length-1]:i[l-1],f=(r-a)*(h-c.index);return n+e[h]+f}),0);return t.push({height:r,index:n}),x(e,[u])}),[])},S=function(e,t){var r=[{height:1/0,index:-1}];return e.reduce((function(e,n,i){for(var u=null;t(n,r[r.length-1].height);)u=r.pop();var l=u?{index:u.index,square:i-r[r.length-1].index-1}:{index:-1,square:0};return r.push({height:n,index:i}),x(e,[l])}),[])},L=function(e,t,r,n,i){var u,l;if(0===e.length||-1===n)return null;if(1===e.length){var a=e[0];return v(v({},a),{isLeftChild:i,left:null,right:null,leftSquare:0,rightSquare:0})}var h=t[n],c=r[n];return v(v({},e[n]),{isLeftChild:i,leftSquare:(null==h?void 0:h.square)||0,rightSquare:(null==c?void 0:c.square)||0,left:L(e,t,r,null!==(u=null==h?void 0:h.index)&&void 0!==u?u:-1,!0),right:L(e,t,r,null!==(l=null==c?void 0:c.index)&&void 0!==l?l:-1,!1)})},D=function(e){return e?x(D(e.left),[e.height],D(e.right)):[]},b=function(e,t){return e?v(v({},e),{height:t,left:b(e.left,t),right:b(e.right,t)}):e},E=function(e,t,r){if(!e)return null;var n=1*r,i=n+t,u=e.leftSquare*n,l=e.rightSquare*n,a=!0===e.isLeftChild,h=!1===e.isLeftChild,c=!e.isLeftChild&&!h,f=n+u+l+t-e.leftDeficit-e.rightDeficit;if(f>=0)return b(e,e.height+f/(e.leftSquare+e.rightSquare+1));var o=n/2;if(!e.left)return v(v({},e),{left:null,right:E(e.right,n+t,r)});if(!e.right)return v(v({},e),{left:E(e.left,n+t,r),right:null});var s=e.leftDeficit-u-o,d=e.rightDeficit-l-o;return v(v({},e),c&&s>=0&&d>=0?{left:E(e.left,o,r),right:E(e.right,o,r)}:a&&s>=0&&d-t>=0?{left:E(e.left,o,r),right:E(e.right,t+o,r)}:h&&s-t>=0&&d>=0?{left:E(e.left,t+o,r),right:E(e.right,o,r)}:c&&s<0?{left:b(e.left,e.height),right:E(e.right,n-(e.leftDeficit-u),r)}:c&&d<0?{left:E(e.left,n-(e.rightDeficit-l),r),right:b(e.right,e.height)}:a&&s<0?{left:b(e.left,e.height),right:E(e.right,i-(e.leftDeficit-u),r)}:a&&d-t<0?{left:E(e.left,i-(e.rightDeficit-l),r),right:b(e.right,e.height)}:h&&d<0?{right:b(e.right,e.height),left:E(e.left,i-(e.rightDeficit-l),r)}:{left:b(e.left,e.height),right:E(e.left,i-(e.leftDeficit-u),r)})},M=function(e,t){var r,n=function(e,t){if(0===e.length)return[];var r=function(e){if(1===e.length){var t=[{index:-1,square:0}];return L(e.map((function(e,t){return{height:e,leftDeficit:0,rightDeficit:0,index:t}})),t,t,0,null)}var r=q(e),n=function(e){return y(q(y(e)))}(e),i=function(e){return S(e,(function(e,t){return e>=t}))}(e),u=function(e){return y(S(y(e),(function(e,t){return e>t})).map((function(t){return-1===t.index?t:v(v({},t),{index:e.length-t.index-1})})))}(e),l=e.reduce((function(e,t,r){var n=i[r].index,l=u[r].index;return t>=e.height&&(-1!==n||-1!==l)?{index:r,height:t}:e}),{index:-1,height:-1}).index;return L(e.map((function(e,t){return{height:e,leftDeficit:r[t],rightDeficit:n[t],index:t}})),i,u,l,null)}(e),n=E(r,0,t);return D(n).map((function(t,r){return t-e[r]}))}(e,t);p(e.map((function(e,t){return{height:e,water:n[t]}}))),r="\n    LANDSCAPE:"+e.join(", ")+"\n    <br/>\n    TIME:"+t+"\n    <br/>\n    WATER LEVELS: "+n.map((function(e){return Number(e.toFixed(3))})).join(", ")+"\n    ",document.querySelector(a).innerHTML=r};t=function(){var e,t,r,n;document.querySelector(l).innerHTML="",document.querySelector(a).innerHTML="",e=document.querySelector(i).value,t=document.querySelector(u).value,r=e.split(",").map((function(e){return parseFloat(e)})),n=parseFloat(t),r.some((function(e){return isNaN(e)||e<0}))?m("There is invalid landscape: every segment should be valid positive number"):isNaN(n)||n<0?m("There is invalid time period: it should be positive"):M(r,n)},r=function(e){"Enter"===e.key&&t()},document.querySelector("#start").addEventListener("click",t),document.querySelector(i).addEventListener("keypress",r),document.querySelector(u).addEventListener("keypress",r),document.querySelector("#startRandom").addEventListener("click",(function(){var t=Math.round(Math.random()*e.length),r=e[t],n=r.landscape,i=r.time;M(n,i)})),p([])})();