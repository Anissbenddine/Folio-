(this.webpackJsonpfithab=this.webpackJsonpfithab||[]).push([[0],{385:function(t,e,n){"use strict";n.r(e),n.d(e,"createSwipeBackGesture",(function(){return a}));var r=n(87),a=function(t,e,n,a,i){var o=t.ownerDocument.defaultView;return Object(r.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:function(t){return t.startX<=50&&e()},onStart:n,onMove:function(t){var e=t.deltaX/o.innerWidth;a(e)},onEnd:function(t){var e=t.deltaX,n=o.innerWidth,r=e/n,a=t.velocityX,c=n/2,u=a>=0&&(a>.2||t.deltaX>c),s=(u?1-r:r)*n,h=0;if(s>5){var f=s/Math.abs(a);h=Math.min(f,540)}i(u,r<=0?.01:r,h)}})}}}]);
//# sourceMappingURL=0.d219e657.chunk.js.map