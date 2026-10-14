(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Cl="170",wm={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Tm={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},wf=0,ch=1,Tf=2,Em=3,Am=0,Th=1,Eh=2,Wn=3,gi=0,We=1,yn=2,Le=0,ds=1,La=2,hh=3,uh=4,Ah=5,Mn=100,Ef=101,Af=102,Cf=103,Rf=104,Zs=200,Pf=201,If=202,zf=203,Da=204,Ua=205,ka=206,Lf=207,Na=208,Df=209,Uf=210,kf=211,Nf=212,Ff=213,Of=214,Fa=0,Oa=1,Ba=2,vs=3,Va=4,Ha=5,Ga=6,Wa=7,uo=0,Bf=1,Vf=2,pi=0,Ch=1,Rh=2,Ph=3,Rl=4,Hf=5,Ih=6,zh=7,dh="attached",Gf="detached",Pl=300,xi=301,Di=302,Yr=303,$r=304,hr=306,Jn=1e3,Sn=1001,Zr=1002,Ce=1003,Lh=1004,Cm=1004,Ks=1005,Rm=1005,Ee=1006,Ur=1007,Pm=1007,kn=1008,Im=1008,Tn=1009,Dh=1010,Uh=1011,sr=1012,Il=1013,vi=1014,an=1015,pn=1016,zl=1017,Ll=1018,Ui=1020,kh=35902,Nh=1021,Fh=1022,Ne=1023,Oh=1024,Bh=1025,fs=1026,ki=1027,Dl=1028,fo=1029,Vh=1030,Ul=1031,zm=1032,kl=1033,kr=33776,Nr=33777,Fr=33778,Or=33779,Xa=35840,qa=35841,Ya=35842,$a=35843,Za=36196,Ka=37492,ja=37496,Ja=37808,Qa=37809,tl=37810,el=37811,nl=37812,il=37813,sl=37814,rl=37815,ol=37816,al=37817,ll=37818,cl=37819,hl=37820,ul=37821,Br=36492,dl=36494,fl=36495,Hh=36283,pl=36284,ml=36285,gl=36286,Wf=2200,Xf=2201,qf=2202,Kr=2300,xl=2301,Ea=2302,ls=2400,cs=2401,jr=2402,Nl=2500,Gh=2501,Lm=0,Dm=1,Um=2,Yf=3200,$f=3201,km=3202,Nm=3203,Fi=0,Zf=1,qn="",De="srgb",Ms="srgb-linear",po="linear",le="srgb",Fm=0,rs=7680,Om=7681,Bm=7682,Vm=7683,Hm=34055,Gm=34056,Wm=5386,Xm=512,qm=513,Ym=514,$m=515,Zm=516,Km=517,jm=518,fh=519,Kf=512,jf=513,Jf=514,Wh=515,Qf=516,tp=517,ep=518,np=519,Jr=35044,Jm=35048,Qm=35040,tg=35045,eg=35049,ng=35041,ig=35046,sg=35050,rg=35042,og="100",ph="300 es",$n=2e3,Qr=2001;class Qn{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,t);t.target=null}}}const Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Pu=1234567;const ps=Math.PI/180,rr=180/Math.PI;function mn(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Oe[r&255]+Oe[r>>8&255]+Oe[r>>16&255]+Oe[r>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]).toLowerCase()}function ye(r,t,e){return Math.max(t,Math.min(e,r))}function Xh(r,t){return(r%t+t)%t}function ag(r,t,e,n,i){return n+(r-t)*(i-n)/(e-t)}function lg(r,t,e){return r!==t?(e-r)/(t-r):0}function Vr(r,t,e){return(1-e)*r+e*t}function cg(r,t,e,n){return Vr(r,t,1-Math.exp(-e*n))}function hg(r,t=1){return t-Math.abs(Xh(r,t*2)-t)}function ug(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r))}function dg(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10))}function fg(r,t){return r+Math.floor(Math.random()*(t-r+1))}function pg(r,t){return r+Math.random()*(t-r)}function mg(r){return r*(.5-Math.random())}function gg(r){r!==void 0&&(Pu=r);let t=Pu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function xg(r){return r*ps}function vg(r){return r*rr}function _g(r){return(r&r-1)===0&&r!==0}function yg(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Mg(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function bg(r,t,e,n,i){const s=Math.cos,o=Math.sin,a=s(e/2),l=o(e/2),c=s((t+n)/2),h=o((t+n)/2),u=s((t-n)/2),d=o((t-n)/2),f=s((n-t)/2),p=o((n-t)/2);switch(i){case"XYX":r.set(a*h,l*u,l*d,a*c);break;case"YZY":r.set(l*d,a*h,l*u,a*c);break;case"ZXZ":r.set(l*u,l*d,a*h,a*c);break;case"XZX":r.set(a*h,l*p,l*f,a*c);break;case"YXY":r.set(l*f,a*h,l*p,a*c);break;case"ZYZ":r.set(l*p,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function je(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function qt(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const ze={DEG2RAD:ps,RAD2DEG:rr,generateUUID:mn,clamp:ye,euclideanModulo:Xh,mapLinear:ag,inverseLerp:lg,lerp:Vr,damp:cg,pingpong:hg,smoothstep:ug,smootherstep:dg,randInt:fg,randFloat:pg,randFloatSpread:mg,seededRandom:gg,degToRad:xg,radToDeg:vg,isPowerOfTwo:_g,ceilPowerOfTwo:yg,floorPowerOfTwo:Mg,setQuaternionFromProperEuler:bg,normalize:qt,denormalize:je};class Z{constructor(t=0,e=0){Z.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ye(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*i+t.x,this.y=s*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Wt{constructor(t,e,n,i,s,o,a,l,c){Wt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c)}set(t,e,n,i,s,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=s,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],x=i[0],m=i[3],g=i[6],y=i[1],v=i[4],_=i[7],E=i[2],b=i[5],w=i[8];return s[0]=o*x+a*y+l*E,s[3]=o*m+a*v+l*b,s[6]=o*g+a*_+l*w,s[1]=c*x+h*y+u*E,s[4]=c*m+h*v+u*b,s[7]=c*g+h*_+u*w,s[2]=d*x+f*y+p*E,s[5]=d*m+f*v+p*b,s[8]=d*g+f*_+p*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*s*h+n*a*l+i*s*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*s,f=c*s-o*l,p=e*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return t[0]=u*x,t[1]=(i*c-h*n)*x,t[2]=(a*n-i*o)*x,t[3]=d*x,t[4]=(h*e-i*l)*x,t[5]=(i*s-a*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*s)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(fc.makeScale(t,e)),this}rotate(t){return this.premultiply(fc.makeRotation(-t)),this}translate(t,e){return this.premultiply(fc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const fc=new Wt;function ip(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}const Sg={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function js(r,t){return new Sg[r](t)}function to(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function sp(){const r=to("canvas");return r.style.display="block",r}const Iu={};function Ir(r){r in Iu||(Iu[r]=!0,console.warn(r))}function wg(r,t,e){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}function Tg(r){const t=r.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Eg(r){const t=r.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Jt={enabled:!0,workingColorSpace:Ms,spaces:{},convert:function(r,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===le&&(r.r=mi(r.r),r.g=mi(r.g),r.b=mi(r.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(r.applyMatrix3(this.spaces[t].toXYZ),r.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===le&&(r.r=nr(r.r),r.g=nr(r.g),r.b=nr(r.b))),r},fromWorkingColorSpace:function(r,t){return this.convert(r,this.workingColorSpace,t)},toWorkingColorSpace:function(r,t){return this.convert(r,t,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===qn?po:this.spaces[r].transfer},getLuminanceCoefficients:function(r,t=this.workingColorSpace){return r.fromArray(this.spaces[t].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,t,e){return r.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}};function mi(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function nr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}const zu=[.64,.33,.3,.6,.15,.06],Lu=[.2126,.7152,.0722],Du=[.3127,.329],Uu=new Wt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ku=new Wt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Jt.define({[Ms]:{primaries:zu,whitePoint:Du,transfer:po,toXYZ:Uu,fromXYZ:ku,luminanceCoefficients:Lu,workingColorSpaceConfig:{unpackColorSpace:De},outputColorSpaceConfig:{drawingBufferColorSpace:De}},[De]:{primaries:zu,whitePoint:Du,transfer:le,toXYZ:Uu,fromXYZ:ku,luminanceCoefficients:Lu,outputColorSpaceConfig:{drawingBufferColorSpace:De}}});let Rs;class rp{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Rs===void 0&&(Rs=to("canvas")),Rs.width=t.width,Rs.height=t.height;const n=Rs.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Rs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=to("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=mi(s[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(mi(e[n]/255)*255):e[n]=mi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ag=0;class hs{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ag++}),this.uuid=mn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(pc(i[o].image)):s.push(pc(i[o]))}else s=pc(i);n.url=s}return e||(t.images[this.uuid]=n),n}}function pc(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?rp.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Cg=0;class Me extends Qn{constructor(t=Me.DEFAULT_IMAGE,e=Me.DEFAULT_MAPPING,n=Sn,i=Sn,s=Ee,o=kn,a=Ne,l=Tn,c=Me.DEFAULT_ANISOTROPY,h=qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cg++}),this.uuid=mn(),this.name="",this.source=new hs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Z(0,0),this.repeat=new Z(1,1),this.center=new Z(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Pl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Jn:t.x=t.x-Math.floor(t.x);break;case Sn:t.x=t.x<0?0:1;break;case Zr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Jn:t.y=t.y-Math.floor(t.y);break;case Sn:t.y=t.y<0?0:1;break;case Zr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Me.DEFAULT_IMAGE=null;Me.DEFAULT_MAPPING=Pl;Me.DEFAULT_ANISOTROPY=1;class ne{constructor(t=0,e=0,n=0,i=1){ne.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],x=l[2],m=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,_=(f+1)/2,E=(g+1)/2,b=(h+d)/4,w=(u+x)/4,C=(p+m)/4;return v>_&&v>E?v<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(v),i=b/n,s=w/n):_>E?_<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(_),n=b/i,s=C/i):E<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(E),n=w/s,i=C/s),this.set(n,i,s,e),this}let y=Math.sqrt((m-p)*(m-p)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-p)/y,this.y=(u-x)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class op extends Qn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ne(0,0,t,e),this.scissorTest=!1,this.viewport=new ne(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ee,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Me(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new hs(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ke extends op{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Fl extends Me{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=Sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Rg extends ke{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new Fl(null,t,e,n),this.texture.isRenderTargetTexture=!0}}class qh extends Me{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=Sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pg extends ke{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new qh(null,t,e,n),this.texture.isRenderTargetTexture=!0}}class Qe{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=s[o+0],f=s[o+1],p=s[o+2],x=s[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=p,t[e+3]=x;return}if(u!==x||l!==d||c!==f||h!==p){let m=1-a;const g=l*d+c*f+h*p+u*x,y=g>=0?1:-1,v=1-g*g;if(v>Number.EPSILON){const E=Math.sqrt(v),b=Math.atan2(E,g*y);m=Math.sin(m*b)/E,a=Math.sin(a*b)/E}const _=a*y;if(l=l*m+d*_,c=c*m+f*_,h=h*m+p*_,u=u*m+x*_,m===1-a){const E=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=E,c*=E,h*=E,u*=E}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,s,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[o],d=s[o+1],f=s[o+2],p=s[o+3];return t[e]=a*p+h*u+l*f-c*d,t[e+1]=l*p+h*d+c*u-a*f,t[e+2]=c*p+h*f+a*d-l*u,t[e+3]=h*p-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(s/2),d=l(n/2),f=l(i/2),p=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(s+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(s-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ye(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-s*l,this._y=i*h+o*l+s*a-n*c,this._z=s*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Nu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Nu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-s*i),u=2*(s*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-s*u,this.z=i+l*u+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return mc.copy(this).projectOnVector(t),this.sub(mc)}reflect(t){return this.sub(mc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ye(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const mc=new R,Nu=new Qe;class tn{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Cn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Cn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Cn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Cn):Cn.fromBufferAttribute(s,o),Cn.applyMatrix4(t.matrixWorld),this.expandByPoint(Cn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Co.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Co.copy(n.boundingBox)),Co.applyMatrix4(t.matrixWorld),this.union(Co)}const i=t.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Cn),Cn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(xr),Ro.subVectors(this.max,xr),Ps.subVectors(t.a,xr),Is.subVectors(t.b,xr),zs.subVectors(t.c,xr),bi.subVectors(Is,Ps),Si.subVectors(zs,Is),Gi.subVectors(Ps,zs);let e=[0,-bi.z,bi.y,0,-Si.z,Si.y,0,-Gi.z,Gi.y,bi.z,0,-bi.x,Si.z,0,-Si.x,Gi.z,0,-Gi.x,-bi.y,bi.x,0,-Si.y,Si.x,0,-Gi.y,Gi.x,0];return!gc(e,Ps,Is,zs,Ro)||(e=[1,0,0,0,1,0,0,0,1],!gc(e,Ps,Is,zs,Ro))?!1:(Po.crossVectors(bi,Si),e=[Po.x,Po.y,Po.z],gc(e,Ps,Is,zs,Ro))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Cn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Cn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ni),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const ni=[new R,new R,new R,new R,new R,new R,new R,new R],Cn=new R,Co=new tn,Ps=new R,Is=new R,zs=new R,bi=new R,Si=new R,Gi=new R,xr=new R,Ro=new R,Po=new R,Wi=new R;function gc(r,t,e,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){Wi.fromArray(r,s);const a=i.x*Math.abs(Wi.x)+i.y*Math.abs(Wi.y)+i.z*Math.abs(Wi.z),l=t.dot(Wi),c=e.dot(Wi),h=n.dot(Wi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Ig=new tn,vr=new R,xc=new R;class Xe{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Ig.setFromPoints(t).getCenter(n);let i=0;for(let s=0,o=t.length;s<o;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;vr.subVectors(t,this.center);const e=vr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(vr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(xc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(vr.copy(t.center).add(xc)),this.expandByPoint(vr.copy(t.center).sub(xc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ii=new R,vc=new R,Io=new R,wi=new R,_c=new R,zo=new R,yc=new R;class ur{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ii)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ii.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ii.copy(this.origin).addScaledVector(this.direction,e),ii.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){vc.copy(t).add(e).multiplyScalar(.5),Io.copy(e).sub(t).normalize(),wi.copy(this.origin).sub(vc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Io),a=wi.dot(this.direction),l=-wi.dot(Io),c=wi.lengthSq(),h=Math.abs(1-o*o);let u,d,f,p;if(h>0)if(u=o*l-a,d=o*a-l,p=s*h,u>=0)if(d>=-p)if(d<=p){const x=1/h;u*=x,d*=x,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-o*s+a)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(o*s+a)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(vc).addScaledVector(Io,d),f}intersectSphere(t,e){ii.subVectors(t.center,this.origin);const n=ii.dot(this.direction),i=ii.dot(ii)-n*n,s=t.radius*t.radius;if(i>s)return null;const o=Math.sqrt(s-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ii)!==null}intersectTriangle(t,e,n,i,s){_c.subVectors(e,t),zo.subVectors(n,t),yc.crossVectors(_c,zo);let o=this.direction.dot(yc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;wi.subVectors(this.origin,t);const l=a*this.direction.dot(zo.crossVectors(wi,zo));if(l<0)return null;const c=a*this.direction.dot(_c.cross(wi));if(c<0||l+c>o)return null;const h=-a*wi.dot(yc);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ut{constructor(t,e,n,i,s,o,a,l,c,h,u,d,f,p,x,m){Ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c,h,u,d,f,p,x,m)}set(t,e,n,i,s,o,a,l,c,h,u,d,f,p,x,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=s,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=x,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ut().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/Ls.setFromMatrixColumn(t,0).length(),s=1/Ls.setFromMatrixColumn(t,1).length(),o=1/Ls.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=o*h,f=o*u,p=a*h,x=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+p*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,p=c*h,x=c*u;e[0]=d+x*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,p=c*h,x=c*u;e[0]=d-x*a,e[4]=-o*u,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,p=a*h,x=a*u;e[0]=l*h,e[4]=p*c-f,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*h,e[4]=x-d*u,e[8]=p*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+p,e[10]=d-x*u}else if(t.order==="XZY"){const d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=o*h,e[9]=f*u-p,e[2]=p*u-f,e[6]=a*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zg,t,Lg)}lookAt(t,e,n){const i=this.elements;return un.subVectors(t,e),un.lengthSq()===0&&(un.z=1),un.normalize(),Ti.crossVectors(n,un),Ti.lengthSq()===0&&(Math.abs(n.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),Ti.crossVectors(n,un)),Ti.normalize(),Lo.crossVectors(un,Ti),i[0]=Ti.x,i[4]=Lo.x,i[8]=un.x,i[1]=Ti.y,i[5]=Lo.y,i[9]=un.y,i[2]=Ti.z,i[6]=Lo.z,i[10]=un.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],x=n[6],m=n[10],g=n[14],y=n[3],v=n[7],_=n[11],E=n[15],b=i[0],w=i[4],C=i[8],S=i[12],M=i[1],P=i[5],N=i[9],I=i[13],D=i[2],O=i[6],U=i[10],Y=i[14],k=i[3],X=i[7],$=i[11],nt=i[15];return s[0]=o*b+a*M+l*D+c*k,s[4]=o*w+a*P+l*O+c*X,s[8]=o*C+a*N+l*U+c*$,s[12]=o*S+a*I+l*Y+c*nt,s[1]=h*b+u*M+d*D+f*k,s[5]=h*w+u*P+d*O+f*X,s[9]=h*C+u*N+d*U+f*$,s[13]=h*S+u*I+d*Y+f*nt,s[2]=p*b+x*M+m*D+g*k,s[6]=p*w+x*P+m*O+g*X,s[10]=p*C+x*N+m*U+g*$,s[14]=p*S+x*I+m*Y+g*nt,s[3]=y*b+v*M+_*D+E*k,s[7]=y*w+v*P+_*O+E*X,s[11]=y*C+v*N+_*U+E*$,s[15]=y*S+v*I+_*Y+E*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],p=t[3],x=t[7],m=t[11],g=t[15];return p*(+s*l*u-i*c*u-s*a*d+n*c*d+i*a*f-n*l*f)+x*(+e*l*f-e*c*d+s*o*d-i*o*f+i*c*h-s*l*h)+m*(+e*c*u-e*a*f-s*o*u+n*o*f+s*a*h-n*c*h)+g*(-i*a*h-e*l*u+e*a*d+i*o*u-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],p=t[12],x=t[13],m=t[14],g=t[15],y=u*m*c-x*d*c+x*l*f-a*m*f-u*l*g+a*d*g,v=p*d*c-h*m*c-p*l*f+o*m*f+h*l*g-o*d*g,_=h*x*c-p*u*c+p*a*f-o*x*f-h*a*g+o*u*g,E=p*u*l-h*x*l-p*a*d+o*x*d+h*a*m-o*u*m,b=e*y+n*v+i*_+s*E;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/b;return t[0]=y*w,t[1]=(x*d*s-u*m*s-x*i*f+n*m*f+u*i*g-n*d*g)*w,t[2]=(a*m*s-x*l*s+x*i*c-n*m*c-a*i*g+n*l*g)*w,t[3]=(u*l*s-a*d*s-u*i*c+n*d*c+a*i*f-n*l*f)*w,t[4]=v*w,t[5]=(h*m*s-p*d*s+p*i*f-e*m*f-h*i*g+e*d*g)*w,t[6]=(p*l*s-o*m*s-p*i*c+e*m*c+o*i*g-e*l*g)*w,t[7]=(o*d*s-h*l*s+h*i*c-e*d*c-o*i*f+e*l*f)*w,t[8]=_*w,t[9]=(p*u*s-h*x*s-p*n*f+e*x*f+h*n*g-e*u*g)*w,t[10]=(o*x*s-p*a*s+p*n*c-e*x*c-o*n*g+e*a*g)*w,t[11]=(h*a*s-o*u*s-h*n*c+e*u*c+o*n*f-e*a*f)*w,t[12]=E*w,t[13]=(h*x*i-p*u*i+p*n*d-e*x*d-h*n*m+e*u*m)*w,t[14]=(p*a*i-o*x*i-p*n*l+e*x*l+o*n*m-e*a*m)*w,t[15]=(o*u*i-h*a*i+h*n*l-e*u*l-o*n*d+e*a*d)*w,this}scale(t){const e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,h=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,o){return this.set(1,n,s,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,h=o+o,u=a+a,d=s*c,f=s*h,p=s*u,x=o*h,m=o*u,g=a*u,y=l*c,v=l*h,_=l*u,E=n.x,b=n.y,w=n.z;return i[0]=(1-(x+g))*E,i[1]=(f+_)*E,i[2]=(p-v)*E,i[3]=0,i[4]=(f-_)*b,i[5]=(1-(d+g))*b,i[6]=(m+y)*b,i[7]=0,i[8]=(p+v)*w,i[9]=(m-y)*w,i[10]=(1-(d+x))*w,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let s=Ls.set(i[0],i[1],i[2]).length();const o=Ls.set(i[4],i[5],i[6]).length(),a=Ls.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),t.x=i[12],t.y=i[13],t.z=i[14],Rn.copy(this);const c=1/s,h=1/o,u=1/a;return Rn.elements[0]*=c,Rn.elements[1]*=c,Rn.elements[2]*=c,Rn.elements[4]*=h,Rn.elements[5]*=h,Rn.elements[6]*=h,Rn.elements[8]*=u,Rn.elements[9]*=u,Rn.elements[10]*=u,e.setFromRotationMatrix(Rn),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,i,s,o,a=$n){const l=this.elements,c=2*s/(e-t),h=2*s/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i);let f,p;if(a===$n)f=-(o+s)/(o-s),p=-2*o*s/(o-s);else if(a===Qr)f=-o/(o-s),p=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,s,o,a=$n){const l=this.elements,c=1/(e-t),h=1/(n-i),u=1/(o-s),d=(e+t)*c,f=(n+i)*h;let p,x;if(a===$n)p=(o+s)*u,x=-2*u;else if(a===Qr)p=s*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=x,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ls=new R,Rn=new Ut,zg=new R(0,0,0),Lg=new R(1,1,1),Ti=new R,Lo=new R,un=new R,Fu=new Ut,Ou=new Qe;class xn{constructor(t=0,e=0,n=0,i=xn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(ye(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ye(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Fu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Fu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ou.setFromEuler(this),this.setFromQuaternion(Ou,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xn.DEFAULT_ORDER="XYZ";class Ol{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Dg=0;const Bu=new R,Ds=new Qe,si=new Ut,Do=new R,_r=new R,Ug=new R,kg=new Qe,Vu=new R(1,0,0),Hu=new R(0,1,0),Gu=new R(0,0,1),Wu={type:"added"},Ng={type:"removed"},Us={type:"childadded",child:null},Mc={type:"childremoved",child:null};class ie extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Dg++}),this.uuid=mn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ie.DEFAULT_UP.clone();const t=new R,e=new xn,n=new Qe,i=new R(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ut},normalMatrix:{value:new Wt}}),this.matrix=new Ut,this.matrixWorld=new Ut,this.matrixAutoUpdate=ie.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ie.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ol,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ds.setFromAxisAngle(t,e),this.quaternion.multiply(Ds),this}rotateOnWorldAxis(t,e){return Ds.setFromAxisAngle(t,e),this.quaternion.premultiply(Ds),this}rotateX(t){return this.rotateOnAxis(Vu,t)}rotateY(t){return this.rotateOnAxis(Hu,t)}rotateZ(t){return this.rotateOnAxis(Gu,t)}translateOnAxis(t,e){return Bu.copy(t).applyQuaternion(this.quaternion),this.position.add(Bu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Vu,t)}translateY(t){return this.translateOnAxis(Hu,t)}translateZ(t){return this.translateOnAxis(Gu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(si.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Do.copy(t):Do.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),_r.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?si.lookAt(_r,Do,this.up):si.lookAt(Do,_r,this.up),this.quaternion.setFromRotationMatrix(si),i&&(si.extractRotation(i.matrixWorld),Ds.setFromRotationMatrix(si),this.quaternion.premultiply(Ds.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Wu),Us.child=t,this.dispatchEvent(Us),Us.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ng),Mc.child=t,this.dispatchEvent(Mc),Mc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),si.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),si.multiply(t.parent.matrixWorld)),t.applyMatrix4(si),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Wu),Us.child=t,this.dispatchEvent(Us),Us.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,t,Ug),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,kg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));i.material=a}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}ie.DEFAULT_UP=new R(0,1,0);ie.DEFAULT_MATRIX_AUTO_UPDATE=!0;ie.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Pn=new R,ri=new R,bc=new R,oi=new R,ks=new R,Ns=new R,Xu=new R,Sc=new R,wc=new R,Tc=new R,Ec=new ne,Ac=new ne,Cc=new ne;class on{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Pn.subVectors(t,e),i.cross(Pn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){Pn.subVectors(i,e),ri.subVectors(n,e),bc.subVectors(t,e);const o=Pn.dot(Pn),a=Pn.dot(ri),l=Pn.dot(bc),c=ri.dot(ri),h=ri.dot(bc),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,p=(o*h-a*l)*d;return s.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,oi)===null?!1:oi.x>=0&&oi.y>=0&&oi.x+oi.y<=1}static getInterpolation(t,e,n,i,s,o,a,l){return this.getBarycoord(t,e,n,i,oi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,oi.x),l.addScaledVector(o,oi.y),l.addScaledVector(a,oi.z),l)}static getInterpolatedAttribute(t,e,n,i,s,o){return Ec.setScalar(0),Ac.setScalar(0),Cc.setScalar(0),Ec.fromBufferAttribute(t,e),Ac.fromBufferAttribute(t,n),Cc.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(Ec,s.x),o.addScaledVector(Ac,s.y),o.addScaledVector(Cc,s.z),o}static isFrontFacing(t,e,n,i){return Pn.subVectors(n,e),ri.subVectors(t,e),Pn.cross(ri).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Pn.subVectors(this.c,this.b),ri.subVectors(this.a,this.b),Pn.cross(ri).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return on.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return on.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return on.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return on.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return on.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,s=this.c;let o,a;ks.subVectors(i,n),Ns.subVectors(s,n),Sc.subVectors(t,n);const l=ks.dot(Sc),c=Ns.dot(Sc);if(l<=0&&c<=0)return e.copy(n);wc.subVectors(t,i);const h=ks.dot(wc),u=Ns.dot(wc);if(h>=0&&u<=h)return e.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(ks,o);Tc.subVectors(t,s);const f=ks.dot(Tc),p=Ns.dot(Tc);if(p>=0&&f<=p)return e.copy(s);const x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(Ns,a);const m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return Xu.subVectors(s,i),a=(u-h)/(u-h+(f-p)),e.copy(i).addScaledVector(Xu,a);const g=1/(m+x+d);return o=x*g,a=d*g,e.copy(n).addScaledVector(ks,o).addScaledVector(Ns,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ap={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},Uo={h:0,s:0,l:0};function Rc(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class dt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=De){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Jt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Jt.workingColorSpace){if(t=Xh(t,1),e=ye(e,0,1),n=ye(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Rc(o,s,t+1/3),this.g=Rc(o,s,t),this.b=Rc(o,s,t-1/3)}return Jt.toWorkingColorSpace(this,i),this}setStyle(t,e=De){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=De){const n=ap[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=mi(t.r),this.g=mi(t.g),this.b=mi(t.b),this}copyLinearToSRGB(t){return this.r=nr(t.r),this.g=nr(t.g),this.b=nr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=De){return Jt.fromWorkingColorSpace(Be.copy(this),t),Math.round(ye(Be.r*255,0,255))*65536+Math.round(ye(Be.g*255,0,255))*256+Math.round(ye(Be.b*255,0,255))}getHexString(t=De){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Jt.workingColorSpace){Jt.fromWorkingColorSpace(Be.copy(this),e);const n=Be.r,i=Be.g,s=Be.b,o=Math.max(n,i,s),a=Math.min(n,i,s);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Jt.workingColorSpace){return Jt.fromWorkingColorSpace(Be.copy(this),e),t.r=Be.r,t.g=Be.g,t.b=Be.b,t}getStyle(t=De){Jt.fromWorkingColorSpace(Be.copy(this),t);const e=Be.r,n=Be.g,i=Be.b;return t!==De?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ei),this.setHSL(Ei.h+t,Ei.s+e,Ei.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ei),t.getHSL(Uo);const n=Vr(Ei.h,Uo.h,e),i=Vr(Ei.s,Uo.s,e),s=Vr(Ei.l,Uo.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Be=new dt;dt.NAMES=ap;let Fg=0;class qe extends Qn{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fg++}),this.uuid=mn(),this.name="",this.blending=ds,this.side=gi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Da,this.blendDst=Ua,this.blendEquation=Mn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new dt(0,0,0),this.blendAlpha=0,this.depthFunc=vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rs,this.stencilZFail=rs,this.stencilZPass=rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ds&&(n.blending=this.blending),this.side!==gi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Da&&(n.blendSrc=this.blendSrc),this.blendDst!==Ua&&(n.blendDst=this.blendDst),this.blendEquation!==Mn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==vs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==rs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==rs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==rs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=i(t.textures),o=i(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class wn extends qe{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=uo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ui=Og();function Og(){const r=new ArrayBuffer(4),t=new Float32Array(r),e=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const s=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(c&8388608);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:o,offsetTable:a}}function rn(r){Math.abs(r)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),r=ye(r,-65504,65504),ui.floatView[0]=r;const t=ui.uint32View[0],e=t>>23&511;return ui.baseTable[e]+((t&8388607)>>ui.shiftTable[e])}function zr(r){const t=r>>10;return ui.uint32View[0]=ui.mantissaTable[ui.offsetTable[t]+(r&1023)]+ui.exponentTable[t],ui.floatView[0]}const Bg={toHalfFloat:rn,fromHalfFloat:zr},we=new R,ko=new Z;class Qt{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Jr,this.updateRanges=[],this.gpuType=an,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ko.fromBufferAttribute(this,e),ko.applyMatrix3(t),this.setXY(e,ko.x,ko.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=je(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=qt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=je(e,this.array)),e}setX(t,e){return this.normalized&&(e=qt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=je(e,this.array)),e}setY(t,e){return this.normalized&&(e=qt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=je(e,this.array)),e}setZ(t,e){return this.normalized&&(e=qt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=je(e,this.array)),e}setW(t,e){return this.normalized&&(e=qt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=qt(e,this.array),n=qt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=qt(e,this.array),n=qt(n,this.array),i=qt(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=qt(e,this.array),n=qt(n,this.array),i=qt(i,this.array),s=qt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Jr&&(t.usage=this.usage),t}}class Vg extends Qt{constructor(t,e,n){super(new Int8Array(t),e,n)}}class Hg extends Qt{constructor(t,e,n){super(new Uint8Array(t),e,n)}}class Gg extends Qt{constructor(t,e,n){super(new Uint8ClampedArray(t),e,n)}}class Wg extends Qt{constructor(t,e,n){super(new Int16Array(t),e,n)}}class Yh extends Qt{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Xg extends Qt{constructor(t,e,n){super(new Int32Array(t),e,n)}}class $h extends Qt{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class qg extends Qt{constructor(t,e,n){super(new Uint16Array(t),e,n),this.isFloat16BufferAttribute=!0}getX(t){let e=zr(this.array[t*this.itemSize]);return this.normalized&&(e=je(e,this.array)),e}setX(t,e){return this.normalized&&(e=qt(e,this.array)),this.array[t*this.itemSize]=rn(e),this}getY(t){let e=zr(this.array[t*this.itemSize+1]);return this.normalized&&(e=je(e,this.array)),e}setY(t,e){return this.normalized&&(e=qt(e,this.array)),this.array[t*this.itemSize+1]=rn(e),this}getZ(t){let e=zr(this.array[t*this.itemSize+2]);return this.normalized&&(e=je(e,this.array)),e}setZ(t,e){return this.normalized&&(e=qt(e,this.array)),this.array[t*this.itemSize+2]=rn(e),this}getW(t){let e=zr(this.array[t*this.itemSize+3]);return this.normalized&&(e=je(e,this.array)),e}setW(t,e){return this.normalized&&(e=qt(e,this.array)),this.array[t*this.itemSize+3]=rn(e),this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=qt(e,this.array),n=qt(n,this.array)),this.array[t+0]=rn(e),this.array[t+1]=rn(n),this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=qt(e,this.array),n=qt(n,this.array),i=qt(i,this.array)),this.array[t+0]=rn(e),this.array[t+1]=rn(n),this.array[t+2]=rn(i),this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=qt(e,this.array),n=qt(n,this.array),i=qt(i,this.array),s=qt(s,this.array)),this.array[t+0]=rn(e),this.array[t+1]=rn(n),this.array[t+2]=rn(i),this.array[t+3]=rn(s),this}}class bt extends Qt{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Yg=0;const _n=new Ut,Pc=new ie,Fs=new R,dn=new tn,yr=new tn,Ie=new R;class Ft extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yg++}),this.uuid=mn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ip(t)?$h:Yh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Wt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return _n.makeRotationFromQuaternion(t),this.applyMatrix4(_n),this}rotateX(t){return _n.makeRotationX(t),this.applyMatrix4(_n),this}rotateY(t){return _n.makeRotationY(t),this.applyMatrix4(_n),this}rotateZ(t){return _n.makeRotationZ(t),this.applyMatrix4(_n),this}translate(t,e,n){return _n.makeTranslation(t,e,n),this.applyMatrix4(_n),this}scale(t,e,n){return _n.makeScale(t,e,n),this.applyMatrix4(_n),this}lookAt(t){return Pc.lookAt(t),Pc.updateMatrix(),this.applyMatrix4(Pc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fs).negate(),this.translate(Fs.x,Fs.y,Fs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,s=t.length;i<s;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new bt(n,3))}else{for(let n=0,i=e.count;n<i;n++){const s=t[n];e.setXYZ(n,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const s=e[n];dn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ie.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Ie),Ie.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Ie)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xe);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(dn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];yr.setFromBufferAttribute(a),this.morphTargetsRelative?(Ie.addVectors(dn.min,yr.min),dn.expandByPoint(Ie),Ie.addVectors(dn.max,yr.max),dn.expandByPoint(Ie)):(dn.expandByPoint(yr.min),dn.expandByPoint(yr.max))}dn.getCenter(n);let i=0;for(let s=0,o=t.count;s<o;s++)Ie.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(Ie));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ie.fromBufferAttribute(a,c),l&&(Fs.fromBufferAttribute(t,c),Ie.add(Fs)),i=Math.max(i,n.distanceToSquared(Ie))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Qt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new R,l[C]=new R;const c=new R,h=new R,u=new R,d=new Z,f=new Z,p=new Z,x=new R,m=new R;function g(C,S,M){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,M),d.fromBufferAttribute(s,C),f.fromBufferAttribute(s,S),p.fromBufferAttribute(s,M),h.sub(c),u.sub(c),f.sub(d),p.sub(d);const P=1/(f.x*p.y-p.x*f.y);isFinite(P)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(P),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(P),a[C].add(x),a[S].add(x),a[M].add(x),l[C].add(m),l[S].add(m),l[M].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let C=0,S=y.length;C<S;++C){const M=y[C],P=M.start,N=M.count;for(let I=P,D=P+N;I<D;I+=3)g(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const v=new R,_=new R,E=new R,b=new R;function w(C){E.fromBufferAttribute(i,C),b.copy(E);const S=a[C];v.copy(S),v.sub(E.multiplyScalar(E.dot(S))).normalize(),_.crossVectors(b,S);const P=_.dot(l[C])<0?-1:1;o.setXYZW(C,v.x,v.y,v.z,P)}for(let C=0,S=y.length;C<S;++C){const M=y[C],P=M.start,N=M.count;for(let I=P,D=P+N;I<D;I+=3)w(t.getX(I+0)),w(t.getX(I+1)),w(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Qt(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new R,s=new R,o=new R,a=new R,l=new R,c=new R,h=new R,u=new R;if(t)for(let d=0,f=t.count;d<f;d+=3){const p=t.getX(d+0),x=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,p),s.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ie.fromBufferAttribute(t,e),Ie.normalize(),t.setXYZ(e,Ie.x,Ie.y,Ie.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,p=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*h;for(let g=0;g<h;g++)d[p++]=c[f++]}return new Qt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ft,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const qu=new Ut,Xi=new ur,No=new Xe,Yu=new R,Fo=new R,Oo=new R,Bo=new R,Ic=new R,Vo=new R,$u=new R,Ho=new R;class ue extends ie{constructor(t=new Ft,e=new wn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(s&&a){Vo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=a[l],u=s[l];h!==0&&(Ic.fromBufferAttribute(u,t),o?Vo.addScaledVector(Ic,h):Vo.addScaledVector(Ic.sub(e),h))}e.add(Vo)}return e}raycast(t,e){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),No.copy(n.boundingSphere),No.applyMatrix4(s),Xi.copy(t.ray).recast(t.near),!(No.containsPoint(Xi.origin)===!1&&(Xi.intersectSphere(No,Yu)===null||Xi.origin.distanceToSquared(Yu)>(t.far-t.near)**2))&&(qu.copy(s).invert(),Xi.copy(t.ray).applyMatrix4(qu),!(n.boundingBox!==null&&Xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Xi)))}_computeIntersections(t,e,n){let i;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){const m=d[p],g=o[m.materialIndex],y=Math.max(m.start,f.start),v=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let _=y,E=v;_<E;_+=3){const b=a.getX(_),w=a.getX(_+1),C=a.getX(_+2);i=Go(this,g,t,n,c,h,u,b,w,C),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const y=a.getX(m),v=a.getX(m+1),_=a.getX(m+2);i=Go(this,o,t,n,c,h,u,y,v,_),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){const m=d[p],g=o[m.materialIndex],y=Math.max(m.start,f.start),v=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=y,E=v;_<E;_+=3){const b=_,w=_+1,C=_+2;i=Go(this,g,t,n,c,h,u,b,w,C),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const y=m,v=m+1,_=m+2;i=Go(this,o,t,n,c,h,u,y,v,_),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function $g(r,t,e,n,i,s,o,a){let l;if(t.side===We?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,t.side===gi,a),l===null)return null;Ho.copy(a),Ho.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Ho);return c<e.near||c>e.far?null:{distance:c,point:Ho.clone(),object:r}}function Go(r,t,e,n,i,s,o,a,l,c){r.getVertexPosition(a,Fo),r.getVertexPosition(l,Oo),r.getVertexPosition(c,Bo);const h=$g(r,t,e,n,Fo,Oo,Bo,$u);if(h){const u=new R;on.getBarycoord($u,Fo,Oo,Bo,u),i&&(h.uv=on.getInterpolatedAttribute(i,a,l,c,u,new Z)),s&&(h.uv1=on.getInterpolatedAttribute(s,a,l,c,u,new Z)),o&&(h.normal=on.getInterpolatedAttribute(o,a,l,c,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new R,materialIndex:0};on.getNormal(Fo,Oo,Bo,d.normal),h.face=d,h.barycoord=u}return h}class Oi extends Ft{constructor(t=1,e=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};const a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,s,0),p("z","y","x",1,-1,n,e,-t,o,s,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,s,4),p("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new bt(c,3)),this.setAttribute("normal",new bt(h,3)),this.setAttribute("uv",new bt(u,2));function p(x,m,g,y,v,_,E,b,w,C,S){const M=_/w,P=E/C,N=_/2,I=E/2,D=b/2,O=w+1,U=C+1;let Y=0,k=0;const X=new R;for(let $=0;$<U;$++){const nt=$*P-I;for(let ct=0;ct<O;ct++){const te=ct*M-N;X[x]=te*y,X[m]=nt*v,X[g]=D,c.push(X.x,X.y,X.z),X[x]=0,X[m]=0,X[g]=b>0?1:-1,h.push(X.x,X.y,X.z),u.push(ct/w),u.push(1-$/C),Y+=1}}for(let $=0;$<C;$++)for(let nt=0;nt<w;nt++){const ct=d+nt+O*$,te=d+nt+O*($+1),J=d+(nt+1)+O*($+1),rt=d+(nt+1)+O*$;l.push(ct,te,rt),l.push(te,J,rt),k+=6}a.addGroup(f,k,S),f+=k,d+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oi(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function or(r){const t={};for(const e in r){t[e]={};for(const n in r[e]){const i=r[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ke(r){const t={};for(let e=0;e<r.length;e++){const n=or(r[e]);for(const i in n)t[i]=n[i]}return t}function Zg(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function lp(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Jt.workingColorSpace}const bn={clone:or,merge:Ke};var Kg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ge extends qe{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Kg,this.fragmentShader=jg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=or(t.uniforms),this.uniformsGroups=Zg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Bl extends ie{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ut,this.projectionMatrix=new Ut,this.projectionMatrixInverse=new Ut,this.coordinateSystem=$n}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ai=new R,Zu=new Z,Ku=new Z;class Ue extends Bl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=rr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ps*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return rr*2*Math.atan(Math.tan(ps*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ai.x,Ai.y).multiplyScalar(-t/Ai.z),Ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ai.x,Ai.y).multiplyScalar(-t/Ai.z)}getViewSize(t,e){return this.getViewBounds(t,Zu,Ku),e.subVectors(Ku,Zu)}setViewOffset(t,e,n,i,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ps*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Os=-90,Bs=1;class cp extends ie{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ue(Os,Bs,t,e);i.layers=this.layers,this.add(i);const s=new Ue(Os,Bs,t,e);s.layers=this.layers,this.add(s);const o=new Ue(Os,Bs,t,e);o.layers=this.layers,this.add(o);const a=new Ue(Os,Bs,t,e);a.layers=this.layers,this.add(a);const l=new Ue(Os,Bs,t,e);l.layers=this.layers,this.add(l);const c=new Ue(Os,Bs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===$n)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Qr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,s),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class mo extends Me{constructor(t,e,n,i,s,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:xi,super(t,e,n,i,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class hp extends ke{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new mo(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ee}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Oi(5,5,5),s=new ge({name:"CubemapFromEquirect",uniforms:or(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:We,blending:Le});s.uniforms.tEquirect.value=e;const o=new ue(i,s),a=e.minFilter;return e.minFilter===kn&&(e.minFilter=Ee),new cp(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(s)}}const zc=new R,Jg=new R,Qg=new Wt;class zi{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=zc.subVectors(n,e).cross(Jg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(zc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Qg.getNormalMatrix(t),i=this.coplanarPoint(zc).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qi=new Xe,Wo=new R;class go{constructor(t=new zi,e=new zi,n=new zi,i=new zi,s=new zi,o=new zi){this.planes=[t,e,n,i,s,o]}set(t,e,n,i,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=$n){const n=this.planes,i=t.elements,s=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],f=i[8],p=i[9],x=i[10],m=i[11],g=i[12],y=i[13],v=i[14],_=i[15];if(n[0].setComponents(l-s,d-c,m-f,_-g).normalize(),n[1].setComponents(l+s,d+c,m+f,_+g).normalize(),n[2].setComponents(l+o,d+h,m+p,_+y).normalize(),n[3].setComponents(l-o,d-h,m-p,_-y).normalize(),n[4].setComponents(l-a,d-u,m-x,_-v).normalize(),e===$n)n[5].setComponents(l+a,d+u,m+x,_+v).normalize();else if(e===Qr)n[5].setComponents(a,u,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(t){return qi.center.set(0,0,0),qi.radius=.7071067811865476,qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Wo.x=i.normal.x>0?t.max.x:t.min.x,Wo.y=i.normal.y>0?t.max.y:t.min.y,Wo.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Wo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function up(){let r=null,t=!1,e=null,n=null;function i(s,o){e(s,o),n=r.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function t0(r){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=r.createBuffer();r.bindBuffer(l,d),r.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(r.bindBuffer(c,a),u.length===0)r.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],x=u[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const x=u[f];r.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(r.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:s,update:o}}class bs extends Ft{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=t/a,d=e/l,f=[],p=[],x=[],m=[];for(let g=0;g<h;g++){const y=g*d-o;for(let v=0;v<c;v++){const _=v*u-s;p.push(_,-y,0),x.push(0,0,1),m.push(v/a),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let y=0;y<a;y++){const v=y+c*g,_=y+c*(g+1),E=y+1+c*(g+1),b=y+1+c*g;f.push(v,_,b),f.push(_,E,b)}this.setIndex(f),this.setAttribute("position",new bt(p,3)),this.setAttribute("normal",new bt(x,3)),this.setAttribute("uv",new bt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bs(t.width,t.height,t.widthSegments,t.heightSegments)}}var e0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,n0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,i0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,s0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,r0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,o0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,a0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,l0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,c0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,h0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,u0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,d0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,f0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,p0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,m0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,g0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,x0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,v0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,y0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,M0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,b0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,S0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,w0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,T0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,E0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,A0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,C0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,R0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,P0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,I0="gl_FragColor = linearToOutputTexel( gl_FragColor );",z0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,L0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,D0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,U0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,k0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,N0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,F0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,O0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,B0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,V0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,H0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,G0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,W0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,X0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,q0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Y0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,$0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Z0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,K0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,j0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,J0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Q0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,tx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ex=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,nx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ix=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,sx=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rx=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ox=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ax=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,lx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,hx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ux=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,fx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,px=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,mx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,xx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,_x=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,yx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Sx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,wx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Tx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ex=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ax=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Px=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ix=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Lx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ux=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Nx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Fx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ox=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Bx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Vx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Hx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Wx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Xx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,qx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Yx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,$x=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Zx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Kx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Qx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const tv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ev=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ov=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,av=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,lv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,cv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,hv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,uv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,fv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,mv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,_v=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Mv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,bv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Tv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ev=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Av=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Rv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Pv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Iv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,zv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Lv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zt={alphahash_fragment:e0,alphahash_pars_fragment:n0,alphamap_fragment:i0,alphamap_pars_fragment:s0,alphatest_fragment:r0,alphatest_pars_fragment:o0,aomap_fragment:a0,aomap_pars_fragment:l0,batching_pars_vertex:c0,batching_vertex:h0,begin_vertex:u0,beginnormal_vertex:d0,bsdfs:f0,iridescence_fragment:p0,bumpmap_pars_fragment:m0,clipping_planes_fragment:g0,clipping_planes_pars_fragment:x0,clipping_planes_pars_vertex:v0,clipping_planes_vertex:_0,color_fragment:y0,color_pars_fragment:M0,color_pars_vertex:b0,color_vertex:S0,common:w0,cube_uv_reflection_fragment:T0,defaultnormal_vertex:E0,displacementmap_pars_vertex:A0,displacementmap_vertex:C0,emissivemap_fragment:R0,emissivemap_pars_fragment:P0,colorspace_fragment:I0,colorspace_pars_fragment:z0,envmap_fragment:L0,envmap_common_pars_fragment:D0,envmap_pars_fragment:U0,envmap_pars_vertex:k0,envmap_physical_pars_fragment:Y0,envmap_vertex:N0,fog_vertex:F0,fog_pars_vertex:O0,fog_fragment:B0,fog_pars_fragment:V0,gradientmap_pars_fragment:H0,lightmap_pars_fragment:G0,lights_lambert_fragment:W0,lights_lambert_pars_fragment:X0,lights_pars_begin:q0,lights_toon_fragment:$0,lights_toon_pars_fragment:Z0,lights_phong_fragment:K0,lights_phong_pars_fragment:j0,lights_physical_fragment:J0,lights_physical_pars_fragment:Q0,lights_fragment_begin:tx,lights_fragment_maps:ex,lights_fragment_end:nx,logdepthbuf_fragment:ix,logdepthbuf_pars_fragment:sx,logdepthbuf_pars_vertex:rx,logdepthbuf_vertex:ox,map_fragment:ax,map_pars_fragment:lx,map_particle_fragment:cx,map_particle_pars_fragment:hx,metalnessmap_fragment:ux,metalnessmap_pars_fragment:dx,morphinstance_vertex:fx,morphcolor_vertex:px,morphnormal_vertex:mx,morphtarget_pars_vertex:gx,morphtarget_vertex:xx,normal_fragment_begin:vx,normal_fragment_maps:_x,normal_pars_fragment:yx,normal_pars_vertex:Mx,normal_vertex:bx,normalmap_pars_fragment:Sx,clearcoat_normal_fragment_begin:wx,clearcoat_normal_fragment_maps:Tx,clearcoat_pars_fragment:Ex,iridescence_pars_fragment:Ax,opaque_fragment:Cx,packing:Rx,premultiplied_alpha_fragment:Px,project_vertex:Ix,dithering_fragment:zx,dithering_pars_fragment:Lx,roughnessmap_fragment:Dx,roughnessmap_pars_fragment:Ux,shadowmap_pars_fragment:kx,shadowmap_pars_vertex:Nx,shadowmap_vertex:Fx,shadowmask_pars_fragment:Ox,skinbase_vertex:Bx,skinning_pars_vertex:Vx,skinning_vertex:Hx,skinnormal_vertex:Gx,specularmap_fragment:Wx,specularmap_pars_fragment:Xx,tonemapping_fragment:qx,tonemapping_pars_fragment:Yx,transmission_fragment:$x,transmission_pars_fragment:Zx,uv_pars_fragment:Kx,uv_pars_vertex:jx,uv_vertex:Jx,worldpos_vertex:Qx,background_vert:tv,background_frag:ev,backgroundCube_vert:nv,backgroundCube_frag:iv,cube_vert:sv,cube_frag:rv,depth_vert:ov,depth_frag:av,distanceRGBA_vert:lv,distanceRGBA_frag:cv,equirect_vert:hv,equirect_frag:uv,linedashed_vert:dv,linedashed_frag:fv,meshbasic_vert:pv,meshbasic_frag:mv,meshlambert_vert:gv,meshlambert_frag:xv,meshmatcap_vert:vv,meshmatcap_frag:_v,meshnormal_vert:yv,meshnormal_frag:Mv,meshphong_vert:bv,meshphong_frag:Sv,meshphysical_vert:wv,meshphysical_frag:Tv,meshtoon_vert:Ev,meshtoon_frag:Av,points_vert:Cv,points_frag:Rv,shadow_vert:Pv,shadow_frag:Iv,sprite_vert:zv,sprite_frag:Lv},mt={common:{diffuse:{value:new dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},envMapRotation:{value:new Wt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new Z(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new dt(16777215)},opacity:{value:1},center:{value:new Z(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},Dn={basic:{uniforms:Ke([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.fog]),vertexShader:Zt.meshbasic_vert,fragmentShader:Zt.meshbasic_frag},lambert:{uniforms:Ke([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new dt(0)}}]),vertexShader:Zt.meshlambert_vert,fragmentShader:Zt.meshlambert_frag},phong:{uniforms:Ke([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new dt(0)},specular:{value:new dt(1118481)},shininess:{value:30}}]),vertexShader:Zt.meshphong_vert,fragmentShader:Zt.meshphong_frag},standard:{uniforms:Ke([mt.common,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.roughnessmap,mt.metalnessmap,mt.fog,mt.lights,{emissive:{value:new dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag},toon:{uniforms:Ke([mt.common,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.gradientmap,mt.fog,mt.lights,{emissive:{value:new dt(0)}}]),vertexShader:Zt.meshtoon_vert,fragmentShader:Zt.meshtoon_frag},matcap:{uniforms:Ke([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,{matcap:{value:null}}]),vertexShader:Zt.meshmatcap_vert,fragmentShader:Zt.meshmatcap_frag},points:{uniforms:Ke([mt.points,mt.fog]),vertexShader:Zt.points_vert,fragmentShader:Zt.points_frag},dashed:{uniforms:Ke([mt.common,mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Zt.linedashed_vert,fragmentShader:Zt.linedashed_frag},depth:{uniforms:Ke([mt.common,mt.displacementmap]),vertexShader:Zt.depth_vert,fragmentShader:Zt.depth_frag},normal:{uniforms:Ke([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,{opacity:{value:1}}]),vertexShader:Zt.meshnormal_vert,fragmentShader:Zt.meshnormal_frag},sprite:{uniforms:Ke([mt.sprite,mt.fog]),vertexShader:Zt.sprite_vert,fragmentShader:Zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Zt.background_vert,fragmentShader:Zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Wt}},vertexShader:Zt.backgroundCube_vert,fragmentShader:Zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Zt.cube_vert,fragmentShader:Zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Zt.equirect_vert,fragmentShader:Zt.equirect_frag},distanceRGBA:{uniforms:Ke([mt.common,mt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Zt.distanceRGBA_vert,fragmentShader:Zt.distanceRGBA_frag},shadow:{uniforms:Ke([mt.lights,mt.fog,{color:{value:new dt(0)},opacity:{value:1}}]),vertexShader:Zt.shadow_vert,fragmentShader:Zt.shadow_frag}};Dn.physical={uniforms:Ke([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new Z(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new Z},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new dt(0)},specularColor:{value:new dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new Z},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag};const Xo={r:0,b:0,g:0},Yi=new xn,Dv=new Ut;function Uv(r,t,e,n,i,s,o){const a=new dt(0);let l=s===!0?0:1,c,h,u=null,d=0,f=null;function p(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?e:t).get(v)),v}function x(y){let v=!1;const _=p(y);_===null?g(a,l):_&&_.isColor&&(g(_,1),v=!0);const E=r.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(r.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(y,v){const _=p(v);_&&(_.isCubeTexture||_.mapping===hr)?(h===void 0&&(h=new ue(new Oi(1,1,1),new ge({name:"BackgroundCubeMaterial",uniforms:or(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:We,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Yi.copy(v.backgroundRotation),Yi.x*=-1,Yi.y*=-1,Yi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Yi.y*=-1,Yi.z*=-1),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Dv.makeRotationFromEuler(Yi)),h.material.toneMapped=Jt.getTransfer(_.colorSpace)!==le,(u!==_||d!==_.version||f!==r.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,f=r.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new ue(new bs(2,2),new ge({name:"BackgroundMaterial",uniforms:or(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:gi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Jt.getTransfer(_.colorSpace)!==le,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,u=_,d=_.version,f=r.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function g(y,v){y.getRGB(Xo,lp(r)),n.buffers.color.setClear(Xo.r,Xo.g,Xo.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(y,v=1){a.set(y),l=v,g(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,g(a,l)},render:x,addToRenderList:m}}function kv(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=d(null);let s=i,o=!1;function a(M,P,N,I,D){let O=!1;const U=u(I,N,P);s!==U&&(s=U,c(s.object)),O=f(M,I,N,D),O&&p(M,I,N,D),D!==null&&t.update(D,r.ELEMENT_ARRAY_BUFFER),(O||o)&&(o=!1,_(M,P,N,I),D!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(D).buffer))}function l(){return r.createVertexArray()}function c(M){return r.bindVertexArray(M)}function h(M){return r.deleteVertexArray(M)}function u(M,P,N){const I=N.wireframe===!0;let D=n[M.id];D===void 0&&(D={},n[M.id]=D);let O=D[P.id];O===void 0&&(O={},D[P.id]=O);let U=O[I];return U===void 0&&(U=d(l()),O[I]=U),U}function d(M){const P=[],N=[],I=[];for(let D=0;D<e;D++)P[D]=0,N[D]=0,I[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:N,attributeDivisors:I,object:M,attributes:{},index:null}}function f(M,P,N,I){const D=s.attributes,O=P.attributes;let U=0;const Y=N.getAttributes();for(const k in Y)if(Y[k].location>=0){const $=D[k];let nt=O[k];if(nt===void 0&&(k==="instanceMatrix"&&M.instanceMatrix&&(nt=M.instanceMatrix),k==="instanceColor"&&M.instanceColor&&(nt=M.instanceColor)),$===void 0||$.attribute!==nt||nt&&$.data!==nt.data)return!0;U++}return s.attributesNum!==U||s.index!==I}function p(M,P,N,I){const D={},O=P.attributes;let U=0;const Y=N.getAttributes();for(const k in Y)if(Y[k].location>=0){let $=O[k];$===void 0&&(k==="instanceMatrix"&&M.instanceMatrix&&($=M.instanceMatrix),k==="instanceColor"&&M.instanceColor&&($=M.instanceColor));const nt={};nt.attribute=$,$&&$.data&&(nt.data=$.data),D[k]=nt,U++}s.attributes=D,s.attributesNum=U,s.index=I}function x(){const M=s.newAttributes;for(let P=0,N=M.length;P<N;P++)M[P]=0}function m(M){g(M,0)}function g(M,P){const N=s.newAttributes,I=s.enabledAttributes,D=s.attributeDivisors;N[M]=1,I[M]===0&&(r.enableVertexAttribArray(M),I[M]=1),D[M]!==P&&(r.vertexAttribDivisor(M,P),D[M]=P)}function y(){const M=s.newAttributes,P=s.enabledAttributes;for(let N=0,I=P.length;N<I;N++)P[N]!==M[N]&&(r.disableVertexAttribArray(N),P[N]=0)}function v(M,P,N,I,D,O,U){U===!0?r.vertexAttribIPointer(M,P,N,D,O):r.vertexAttribPointer(M,P,N,I,D,O)}function _(M,P,N,I){x();const D=I.attributes,O=N.getAttributes(),U=P.defaultAttributeValues;for(const Y in O){const k=O[Y];if(k.location>=0){let X=D[Y];if(X===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(X=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(X=M.instanceColor)),X!==void 0){const $=X.normalized,nt=X.itemSize,ct=t.get(X);if(ct===void 0)continue;const te=ct.buffer,J=ct.type,rt=ct.bytesPerElement,St=J===r.INT||J===r.UNSIGNED_INT||X.gpuType===Il;if(X.isInterleavedBufferAttribute){const ot=X.data,At=ot.stride,kt=X.offset;if(ot.isInstancedInterleavedBuffer){for(let Lt=0;Lt<k.locationSize;Lt++)g(k.location+Lt,ot.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Lt=0;Lt<k.locationSize;Lt++)m(k.location+Lt);r.bindBuffer(r.ARRAY_BUFFER,te);for(let Lt=0;Lt<k.locationSize;Lt++)v(k.location+Lt,nt/k.locationSize,J,$,At*rt,(kt+nt/k.locationSize*Lt)*rt,St)}else{if(X.isInstancedBufferAttribute){for(let ot=0;ot<k.locationSize;ot++)g(k.location+ot,X.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let ot=0;ot<k.locationSize;ot++)m(k.location+ot);r.bindBuffer(r.ARRAY_BUFFER,te);for(let ot=0;ot<k.locationSize;ot++)v(k.location+ot,nt/k.locationSize,J,$,nt*rt,nt/k.locationSize*ot*rt,St)}}else if(U!==void 0){const $=U[Y];if($!==void 0)switch($.length){case 2:r.vertexAttrib2fv(k.location,$);break;case 3:r.vertexAttrib3fv(k.location,$);break;case 4:r.vertexAttrib4fv(k.location,$);break;default:r.vertexAttrib1fv(k.location,$)}}}}y()}function E(){C();for(const M in n){const P=n[M];for(const N in P){const I=P[N];for(const D in I)h(I[D].object),delete I[D];delete P[N]}delete n[M]}}function b(M){if(n[M.id]===void 0)return;const P=n[M.id];for(const N in P){const I=P[N];for(const D in I)h(I[D].object),delete I[D];delete P[N]}delete n[M.id]}function w(M){for(const P in n){const N=n[P];if(N[M.id]===void 0)continue;const I=N[M.id];for(const D in I)h(I[D].object),delete I[D];delete N[M.id]}}function C(){S(),o=!0,s!==i&&(s=i,c(s.object))}function S(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:C,resetDefaultState:S,dispose:E,releaseStatesOfGeometry:b,releaseStatesOfProgram:w,initAttributes:x,enableAttribute:m,disableUnusedAttributes:y}}function Nv(r,t,e){let n;function i(c){n=c}function s(c,h){r.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(r.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let p=0;p<u;p++)f+=h[p];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)o(c[p],h[p],d[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let p=0;for(let x=0;x<u;x++)p+=h[x]*d[x];e.update(p,n,1)}}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Fv(r,t,e,n){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");i=r.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(w){return!(w!==Ne&&n.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const C=w===pn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==Tn&&n.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==an&&!C)}function l(w){if(w==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),p=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),y=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),v=r.getParameter(r.MAX_VARYING_VECTORS),_=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),E=p>0,b=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:E,maxSamples:b}}function Ov(r){const t=this;let e=null,n=0,i=!1,s=!1;const o=new zi,a=new Wt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,g=r.get(u);if(!i||p===null||p.length===0||s&&!m)s?h(null):c();else{const y=s?0:n,v=y*4;let _=g.clippingState||null;l.value=_,_=h(p,d,v,f);for(let E=0;E!==v;++E)_[E]=e[E];g.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,p){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=l.value,p!==!0||m===null){const g=f+x*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(m===null||m.length<g)&&(m=new Float32Array(g));for(let v=0,_=f;v!==x;++v,_+=4)o.copy(u[v]).applyMatrix4(y,a),o.normal.toArray(m,_),m[_+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function Bv(r){let t=new WeakMap;function e(o,a){return a===Yr?o.mapping=xi:a===$r&&(o.mapping=Di),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Yr||a===$r)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new hp(l.height);return c.fromEquirectangularTexture(r,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class xo extends Bl{constructor(t=-1,e=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Js=4,ju=[.125,.215,.35,.446,.526,.582],as=20,Lc=new xo,Ju=new dt;let Dc=null,Uc=0,kc=0,Nc=!1;const os=(1+Math.sqrt(5))/2,Vs=1/os,Qu=[new R(-os,Vs,0),new R(os,Vs,0),new R(-Vs,0,os),new R(Vs,0,os),new R(0,os,-Vs),new R(0,os,Vs),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class vl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Dc=this._renderer.getRenderTarget(),Uc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,i,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ed(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Dc,Uc,kc),this._renderer.xr.enabled=Nc,t.scissorTest=!1,qo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===xi||t.mapping===Di?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Dc=this._renderer.getRenderTarget(),Uc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ee,minFilter:Ee,generateMipmaps:!1,type:pn,format:Ne,colorSpace:Ms,depthBuffer:!1},i=td(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=td(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Vv(s)),this._blurMaterial=Hv(s,t,e)}return i}_compileMaterial(t){const e=new ue(this._lodPlanes[0],t);this._renderer.compile(e,Lc)}_sceneToCubeUV(t,e,n,i){const a=new Ue(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Ju),h.toneMapping=pi,h.autoClear=!1;const f=new wn({name:"PMREM.Background",side:We,depthWrite:!1,depthTest:!1}),p=new ue(new Oi,f);let x=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,x=!0):(f.color.copy(Ju),x=!0);for(let g=0;g<6;g++){const y=g%3;y===0?(a.up.set(0,l[g],0),a.lookAt(c[g],0,0)):y===1?(a.up.set(0,0,l[g]),a.lookAt(0,c[g],0)):(a.up.set(0,l[g],0),a.lookAt(0,0,c[g]));const v=this._cubeSize;qo(i,y*v,g>2?v:0,v,v),h.setRenderTarget(i),x&&h.render(p,a),h.render(t,a)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===xi||t.mapping===Di;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=nd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ed());const s=i?this._cubemapMaterial:this._equirectMaterial,o=new ue(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;qo(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Lc)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Qu[(i-s-1)%Qu.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,i,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",s),this._halfBlur(o,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ue(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*as-1),x=s/p,m=isFinite(s)?1+Math.floor(h*x):as;m>as&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${as}`);const g=[];let y=0;for(let w=0;w<as;++w){const C=w/x,S=Math.exp(-C*C/2);g.push(S),w===0?y+=S:w<m&&(y+=2*S)}for(let w=0;w<g.length;w++)g[w]=g[w]/y;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=p,d.mipInt.value=v-n;const _=this._sizeLods[i],E=3*_*(i>v-Js?i-v+Js:0),b=4*(this._cubeSize-_);qo(e,E,b,3*_,2*_),l.setRenderTarget(e),l.render(u,Lc)}}function Vv(r){const t=[],e=[],n=[];let i=r;const s=r-Js+1+ju.length;for(let o=0;o<s;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>r-Js?l=ju[o-r+Js-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,x=3,m=2,g=1,y=new Float32Array(x*p*f),v=new Float32Array(m*p*f),_=new Float32Array(g*p*f);for(let b=0;b<f;b++){const w=b%3*2/3-1,C=b>2?0:-1,S=[w,C,0,w+2/3,C,0,w+2/3,C+1,0,w,C,0,w+2/3,C+1,0,w,C+1,0];y.set(S,x*p*b),v.set(d,m*p*b);const M=[b,b,b,b,b,b];_.set(M,g*p*b)}const E=new Ft;E.setAttribute("position",new Qt(y,x)),E.setAttribute("uv",new Qt(v,m)),E.setAttribute("faceIndex",new Qt(_,g)),t.push(E),i>Js&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function td(r,t,e){const n=new ke(r,t,e);return n.texture.mapping=hr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function qo(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function Hv(r,t,e){const n=new Float32Array(as),i=new R(0,1,0);return new ge({name:"SphericalGaussianBlur",defines:{n:as,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Zh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Le,depthTest:!1,depthWrite:!1})}function ed(){return new ge({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Zh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Le,depthTest:!1,depthWrite:!1})}function nd(){return new ge({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Le,depthTest:!1,depthWrite:!1})}function Zh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Gv(r){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Yr||l===$r,h=l===xi||l===Di;if(c||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new vl(r)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new vl(r)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Wv(r){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Ir("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Xv(r,t,e,n){const i={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);for(const p in d.morphAttributes){const x=d.morphAttributes[p];for(let m=0,g=x.length;m<g;m++)t.remove(x[m])}d.removeEventListener("dispose",o),delete i[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const p in d)t.update(d[p],r.ARRAY_BUFFER);const f=u.morphAttributes;for(const p in f){const x=f[p];for(let m=0,g=x.length;m<g;m++)t.update(x[m],r.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,p=u.attributes.position;let x=0;if(f!==null){const y=f.array;x=f.version;for(let v=0,_=y.length;v<_;v+=3){const E=y[v+0],b=y[v+1],w=y[v+2];d.push(E,b,b,w,w,E)}}else if(p!==void 0){const y=p.array;x=p.version;for(let v=0,_=y.length/3-1;v<_;v+=3){const E=v+0,b=v+1,w=v+2;d.push(E,b,b,w,w,E)}}else return;const m=new(ip(d)?$h:Yh)(d,1);m.version=x;const g=s.get(u);g&&t.remove(g),s.set(u,m)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function qv(r,t,e){let n;function i(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,f){r.drawElements(n,f,s,d*o),e.update(f,n,1)}function c(d,f,p){p!==0&&(r.drawElementsInstanced(n,f,s,d*o,p),e.update(f,n,p))}function h(d,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,p);let m=0;for(let g=0;g<p;g++)m+=f[g];e.update(m,n,1)}function u(d,f,p,x){if(p===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d.length;g++)c(d[g]/o,f[g],x[g]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,x,0,p);let g=0;for(let y=0;y<p;y++)g+=f[y]*x[y];e.update(g,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Yv(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case r.TRIANGLES:e.triangles+=a*(s/3);break;case r.LINES:e.lines+=a*(s/2);break;case r.LINE_STRIP:e.lines+=a*(s-1);break;case r.LINE_LOOP:e.lines+=a*s;break;case r.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function $v(r,t,e){const n=new WeakMap,i=new ne;function s(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let S=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();const f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let v=0;f===!0&&(v=1),p===!0&&(v=2),x===!0&&(v=3);let _=a.attributes.position.count*v,E=1;_>t.maxTextureSize&&(E=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const b=new Float32Array(_*E*4*u),w=new Fl(b,_,E,u);w.type=an,w.needsUpdate=!0;const C=v*4;for(let M=0;M<u;M++){const P=m[M],N=g[M],I=y[M],D=_*E*4*M;for(let O=0;O<P.count;O++){const U=O*C;f===!0&&(i.fromBufferAttribute(P,O),b[D+U+0]=i.x,b[D+U+1]=i.y,b[D+U+2]=i.z,b[D+U+3]=0),p===!0&&(i.fromBufferAttribute(N,O),b[D+U+4]=i.x,b[D+U+5]=i.y,b[D+U+6]=i.z,b[D+U+7]=0),x===!0&&(i.fromBufferAttribute(I,O),b[D+U+8]=i.x,b[D+U+9]=i.y,b[D+U+10]=i.z,b[D+U+11]=I.itemSize===4?i.w:1)}}d={count:u,texture:w,size:new Z(_,E)},n.set(a,d),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",o.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];const p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(r,"morphTargetBaseInfluence",p),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function Zv(r,t,e,n){let i=new WeakMap;function s(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class Vl extends Me{constructor(t,e,n,i,s,o,a,l,c,h=fs){if(h!==fs&&h!==ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===fs&&(n=vi),n===void 0&&h===ki&&(n=Ui),super(null,i,s,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ce,this.minFilter=l!==void 0?l:Ce,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const dp=new Me,id=new Vl(1,1),fp=new Fl,pp=new qh,mp=new mo,sd=[],rd=[],od=new Float32Array(16),ad=new Float32Array(9),ld=new Float32Array(4);function dr(r,t,e){const n=r[0];if(n<=0||n>0)return r;const i=t*e;let s=sd[i];if(s===void 0&&(s=new Float32Array(i),sd[i]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,r[o].toArray(s,a)}return s}function Re(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function Pe(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function Hl(r,t){let e=rd[t];e===void 0&&(e=new Int32Array(t),rd[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function Kv(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function jv(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;r.uniform2fv(this.addr,t),Pe(e,t)}}function Jv(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;r.uniform3fv(this.addr,t),Pe(e,t)}}function Qv(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;r.uniform4fv(this.addr,t),Pe(e,t)}}function t_(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Re(e,n))return;ld.set(n),r.uniformMatrix2fv(this.addr,!1,ld),Pe(e,n)}}function e_(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Re(e,n))return;ad.set(n),r.uniformMatrix3fv(this.addr,!1,ad),Pe(e,n)}}function n_(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Re(e,n))return;od.set(n),r.uniformMatrix4fv(this.addr,!1,od),Pe(e,n)}}function i_(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function s_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;r.uniform2iv(this.addr,t),Pe(e,t)}}function r_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;r.uniform3iv(this.addr,t),Pe(e,t)}}function o_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;r.uniform4iv(this.addr,t),Pe(e,t)}}function a_(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function l_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;r.uniform2uiv(this.addr,t),Pe(e,t)}}function c_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;r.uniform3uiv(this.addr,t),Pe(e,t)}}function h_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;r.uniform4uiv(this.addr,t),Pe(e,t)}}function u_(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(id.compareFunction=Wh,s=id):s=dp,e.setTexture2D(t||s,i)}function d_(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||pp,i)}function f_(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||mp,i)}function p_(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||fp,i)}function m_(r){switch(r){case 5126:return Kv;case 35664:return jv;case 35665:return Jv;case 35666:return Qv;case 35674:return t_;case 35675:return e_;case 35676:return n_;case 5124:case 35670:return i_;case 35667:case 35671:return s_;case 35668:case 35672:return r_;case 35669:case 35673:return o_;case 5125:return a_;case 36294:return l_;case 36295:return c_;case 36296:return h_;case 35678:case 36198:case 36298:case 36306:case 35682:return u_;case 35679:case 36299:case 36307:return d_;case 35680:case 36300:case 36308:case 36293:return f_;case 36289:case 36303:case 36311:case 36292:return p_}}function g_(r,t){r.uniform1fv(this.addr,t)}function x_(r,t){const e=dr(t,this.size,2);r.uniform2fv(this.addr,e)}function v_(r,t){const e=dr(t,this.size,3);r.uniform3fv(this.addr,e)}function __(r,t){const e=dr(t,this.size,4);r.uniform4fv(this.addr,e)}function y_(r,t){const e=dr(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function M_(r,t){const e=dr(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function b_(r,t){const e=dr(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function S_(r,t){r.uniform1iv(this.addr,t)}function w_(r,t){r.uniform2iv(this.addr,t)}function T_(r,t){r.uniform3iv(this.addr,t)}function E_(r,t){r.uniform4iv(this.addr,t)}function A_(r,t){r.uniform1uiv(this.addr,t)}function C_(r,t){r.uniform2uiv(this.addr,t)}function R_(r,t){r.uniform3uiv(this.addr,t)}function P_(r,t){r.uniform4uiv(this.addr,t)}function I_(r,t,e){const n=this.cache,i=t.length,s=Hl(e,i);Re(n,s)||(r.uniform1iv(this.addr,s),Pe(n,s));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||dp,s[o])}function z_(r,t,e){const n=this.cache,i=t.length,s=Hl(e,i);Re(n,s)||(r.uniform1iv(this.addr,s),Pe(n,s));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||pp,s[o])}function L_(r,t,e){const n=this.cache,i=t.length,s=Hl(e,i);Re(n,s)||(r.uniform1iv(this.addr,s),Pe(n,s));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||mp,s[o])}function D_(r,t,e){const n=this.cache,i=t.length,s=Hl(e,i);Re(n,s)||(r.uniform1iv(this.addr,s),Pe(n,s));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||fp,s[o])}function U_(r){switch(r){case 5126:return g_;case 35664:return x_;case 35665:return v_;case 35666:return __;case 35674:return y_;case 35675:return M_;case 35676:return b_;case 5124:case 35670:return S_;case 35667:case 35671:return w_;case 35668:case 35672:return T_;case 35669:case 35673:return E_;case 5125:return A_;case 36294:return C_;case 36295:return R_;case 36296:return P_;case 35678:case 36198:case 36298:case 36306:case 35682:return I_;case 35679:case 36299:case 36307:return z_;case 35680:case 36300:case 36308:case 36293:return L_;case 36289:case 36303:case 36311:case 36292:return D_}}class k_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=m_(e.type)}}class N_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=U_(e.type)}}class F_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let s=0,o=i.length;s!==o;++s){const a=i[s];a.setValue(t,e[a.id],n)}}}const Fc=/(\w+)(\])?(\[|\.)?/g;function cd(r,t){r.seq.push(t),r.map[t.id]=t}function O_(r,t,e){const n=r.name,i=n.length;for(Fc.lastIndex=0;;){const s=Fc.exec(n),o=Fc.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){cd(e,c===void 0?new k_(a,r,t):new N_(a,r,t));break}else{let u=e.map[a];u===void 0&&(u=new F_(a),cd(e,u)),e=u}}}class Aa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=t.getActiveUniform(e,i),o=t.getUniformLocation(e,s.name);O_(s,o,this)}}setValue(t,e,n,i){const s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,s=t.length;i!==s;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function hd(r,t,e){const n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}const B_=37297;let V_=0;function H_(r,t){const e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=i;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const ud=new Wt;function G_(r){Jt._getMatrix(ud,Jt.workingColorSpace,r);const t=`mat3( ${ud.elements.map(e=>e.toFixed(4))} )`;switch(Jt.getTransfer(r)){case po:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function dd(r,t,e){const n=r.getShaderParameter(t,r.COMPILE_STATUS),i=r.getShaderInfoLog(t).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+i+`

`+H_(r.getShaderSource(t),o)}else return i}function W_(r,t){const e=G_(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function X_(r,t){let e;switch(t){case Ch:e="Linear";break;case Rh:e="Reinhard";break;case Ph:e="Cineon";break;case Rl:e="ACESFilmic";break;case Ih:e="AgX";break;case zh:e="Neutral";break;case Hf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Yo=new R;function q_(){Jt.getLuminanceCoefficients(Yo);const r=Yo.x.toFixed(4),t=Yo.y.toFixed(4),e=Yo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Y_(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Lr).join(`
`)}function $_(r){const t=[];for(const e in r){const n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Z_(r,t){const e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(t,i),o=s.name;let a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:r.getAttribLocation(t,o),locationSize:a}}return e}function Lr(r){return r!==""}function fd(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function pd(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const K_=/^[ \t]*#include +<([\w\d./]+)>/gm;function mh(r){return r.replace(K_,J_)}const j_=new Map;function J_(r,t){let e=Zt[t];if(e===void 0){const n=j_.get(t);if(n!==void 0)e=Zt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return mh(e)}const Q_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function md(r){return r.replace(Q_,ty)}function ty(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function gd(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function ey(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Th?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===Eh?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Wn&&(t="SHADOWMAP_TYPE_VSM"),t}function ny(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case xi:case Di:t="ENVMAP_TYPE_CUBE";break;case hr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function iy(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Di:t="ENVMAP_MODE_REFRACTION";break}return t}function sy(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case uo:t="ENVMAP_BLENDING_MULTIPLY";break;case Bf:t="ENVMAP_BLENDING_MIX";break;case Vf:t="ENVMAP_BLENDING_ADD";break}return t}function ry(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function oy(r,t,e,n){const i=r.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=ey(e),c=ny(e),h=iy(e),u=sy(e),d=ry(e),f=Y_(e),p=$_(s),x=i.createProgram();let m,g,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Lr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Lr).join(`
`),g.length>0&&(g+=`
`)):(m=[gd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Lr).join(`
`),g=[gd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==pi?"#define TONE_MAPPING":"",e.toneMapping!==pi?Zt.tonemapping_pars_fragment:"",e.toneMapping!==pi?X_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Zt.colorspace_pars_fragment,W_("linearToOutputTexel",e.outputColorSpace),q_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Lr).join(`
`)),o=mh(o),o=fd(o,e),o=pd(o,e),a=mh(a),a=fd(a,e),a=pd(a,e),o=md(o),a=md(a),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===ph?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ph?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const v=y+m+o,_=y+g+a,E=hd(i,i.VERTEX_SHADER,v),b=hd(i,i.FRAGMENT_SHADER,_);i.attachShader(x,E),i.attachShader(x,b),e.index0AttributeName!==void 0?i.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function w(P){if(r.debug.checkShaderErrors){const N=i.getProgramInfoLog(x).trim(),I=i.getShaderInfoLog(E).trim(),D=i.getShaderInfoLog(b).trim();let O=!0,U=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(O=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,x,E,b);else{const Y=dd(i,E,"vertex"),k=dd(i,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+N+`
`+Y+`
`+k)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(I===""||D==="")&&(U=!1);U&&(P.diagnostics={runnable:O,programLog:N,vertexShader:{log:I,prefix:m},fragmentShader:{log:D,prefix:g}})}i.deleteShader(E),i.deleteShader(b),C=new Aa(i,x),S=Z_(i,x)}let C;this.getUniforms=function(){return C===void 0&&w(this),C};let S;this.getAttributes=function(){return S===void 0&&w(this),S};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=i.getProgramParameter(x,B_)),M},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=V_++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=b,this}let ay=0;class ly{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new cy(t),e.set(t,n)),n}}class cy{constructor(t){this.id=ay++,this.code=t,this.usedTimes=0}}function hy(r,t,e,n,i,s,o){const a=new Ol,l=new ly,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,M,P,N,I){const D=N.fog,O=I.geometry,U=S.isMeshStandardMaterial?N.environment:null,Y=(S.isMeshStandardMaterial?e:t).get(S.envMap||U),k=Y&&Y.mapping===hr?Y.image.height:null,X=p[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const $=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,nt=$!==void 0?$.length:0;let ct=0;O.morphAttributes.position!==void 0&&(ct=1),O.morphAttributes.normal!==void 0&&(ct=2),O.morphAttributes.color!==void 0&&(ct=3);let te,J,rt,St;if(X){const ce=Dn[X];te=ce.vertexShader,J=ce.fragmentShader}else te=S.vertexShader,J=S.fragmentShader,l.update(S),rt=l.getVertexShaderID(S),St=l.getFragmentShaderID(S);const ot=r.getRenderTarget(),At=r.state.buffers.depth.getReversed(),kt=I.isInstancedMesh===!0,Lt=I.isBatchedMesh===!0,Kt=!!S.map,Q=!!S.matcap,at=!!Y,L=!!S.aoMap,Ct=!!S.lightMap,it=!!S.bumpMap,yt=!!S.normalMap,ht=!!S.displacementMap,Nt=!!S.emissiveMap,xt=!!S.metalnessMap,z=!!S.roughnessMap,T=S.anisotropy>0,H=S.clearcoat>0,K=S.dispersion>0,et=S.iridescence>0,j=S.sheen>0,Et=S.transmission>0,ft=T&&!!S.anisotropyMap,gt=H&&!!S.clearcoatMap,Xt=H&&!!S.clearcoatNormalMap,st=H&&!!S.clearcoatRoughnessMap,wt=et&&!!S.iridescenceMap,Ot=et&&!!S.iridescenceThicknessMap,Bt=j&&!!S.sheenColorMap,Tt=j&&!!S.sheenRoughnessMap,jt=!!S.specularMap,Vt=!!S.specularColorMap,se=!!S.specularIntensityMap,F=Et&&!!S.transmissionMap,pt=Et&&!!S.thicknessMap,q=!!S.gradientMap,tt=!!S.alphaMap,Mt=S.alphaTest>0,vt=!!S.alphaHash,Yt=!!S.extensions;let ve=pi;S.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(ve=r.toneMapping);const Fe={shaderID:X,shaderType:S.type,shaderName:S.name,vertexShader:te,fragmentShader:J,defines:S.defines,customVertexShaderID:rt,customFragmentShaderID:St,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Lt,batchingColor:Lt&&I._colorsTexture!==null,instancing:kt,instancingColor:kt&&I.instanceColor!==null,instancingMorph:kt&&I.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ot===null?r.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:Ms,alphaToCoverage:!!S.alphaToCoverage,map:Kt,matcap:Q,envMap:at,envMapMode:at&&Y.mapping,envMapCubeUVHeight:k,aoMap:L,lightMap:Ct,bumpMap:it,normalMap:yt,displacementMap:d&&ht,emissiveMap:Nt,normalMapObjectSpace:yt&&S.normalMapType===Zf,normalMapTangentSpace:yt&&S.normalMapType===Fi,metalnessMap:xt,roughnessMap:z,anisotropy:T,anisotropyMap:ft,clearcoat:H,clearcoatMap:gt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:st,dispersion:K,iridescence:et,iridescenceMap:wt,iridescenceThicknessMap:Ot,sheen:j,sheenColorMap:Bt,sheenRoughnessMap:Tt,specularMap:jt,specularColorMap:Vt,specularIntensityMap:se,transmission:Et,transmissionMap:F,thicknessMap:pt,gradientMap:q,opaque:S.transparent===!1&&S.blending===ds&&S.alphaToCoverage===!1,alphaMap:tt,alphaTest:Mt,alphaHash:vt,combine:S.combine,mapUv:Kt&&x(S.map.channel),aoMapUv:L&&x(S.aoMap.channel),lightMapUv:Ct&&x(S.lightMap.channel),bumpMapUv:it&&x(S.bumpMap.channel),normalMapUv:yt&&x(S.normalMap.channel),displacementMapUv:ht&&x(S.displacementMap.channel),emissiveMapUv:Nt&&x(S.emissiveMap.channel),metalnessMapUv:xt&&x(S.metalnessMap.channel),roughnessMapUv:z&&x(S.roughnessMap.channel),anisotropyMapUv:ft&&x(S.anisotropyMap.channel),clearcoatMapUv:gt&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:st&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:wt&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ot&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:Bt&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:Tt&&x(S.sheenRoughnessMap.channel),specularMapUv:jt&&x(S.specularMap.channel),specularColorMapUv:Vt&&x(S.specularColorMap.channel),specularIntensityMapUv:se&&x(S.specularIntensityMap.channel),transmissionMapUv:F&&x(S.transmissionMap.channel),thicknessMapUv:pt&&x(S.thicknessMap.channel),alphaMapUv:tt&&x(S.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(yt||T),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!O.attributes.uv&&(Kt||tt),fog:!!D,useFog:S.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:At,skinning:I.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:ct,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:r.shadowMap.enabled&&P.length>0,shadowMapType:r.shadowMap.type,toneMapping:ve,decodeVideoTexture:Kt&&S.map.isVideoTexture===!0&&Jt.getTransfer(S.map.colorSpace)===le,decodeVideoTextureEmissive:Nt&&S.emissiveMap.isVideoTexture===!0&&Jt.getTransfer(S.emissiveMap.colorSpace)===le,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===yn,flipSided:S.side===We,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Yt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Yt&&S.extensions.multiDraw===!0||Lt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Fe.vertexUv1s=c.has(1),Fe.vertexUv2s=c.has(2),Fe.vertexUv3s=c.has(3),c.clear(),Fe}function g(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)M.push(P),M.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(y(M,S),v(M,S),M.push(r.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function y(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function v(S,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),S.push(a.mask)}function _(S){const M=p[S.type];let P;if(M){const N=Dn[M];P=bn.clone(N.uniforms)}else P=S.uniforms;return P}function E(S,M){let P;for(let N=0,I=h.length;N<I;N++){const D=h[N];if(D.cacheKey===M){P=D,++P.usedTimes;break}}return P===void 0&&(P=new oy(r,M,S,s),h.push(P)),P}function b(S){if(--S.usedTimes===0){const M=h.indexOf(S);h[M]=h[h.length-1],h.pop(),S.destroy()}}function w(S){l.remove(S)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:g,getUniforms:_,acquireProgram:E,releaseProgram:b,releaseShaderCache:w,programs:h,dispose:C}}function uy(){let r=new WeakMap;function t(o){return r.has(o)}function e(o){let a=r.get(o);return a===void 0&&(a={},r.set(o,a)),a}function n(o){r.delete(o)}function i(o,a,l){r.get(o)[a]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:s}}function dy(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function xd(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function vd(){const r=[];let t=0;const e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,f,p,x,m){let g=r[t];return g===void 0?(g={id:u.id,object:u,geometry:d,material:f,groupOrder:p,renderOrder:u.renderOrder,z:x,group:m},r[t]=g):(g.id=u.id,g.object=u,g.geometry=d,g.material=f,g.groupOrder=p,g.renderOrder=u.renderOrder,g.z=x,g.group=m),t++,g}function a(u,d,f,p,x,m){const g=o(u,d,f,p,x,m);f.transmission>0?n.push(g):f.transparent===!0?i.push(g):e.push(g)}function l(u,d,f,p,x,m){const g=o(u,d,f,p,x,m);f.transmission>0?n.unshift(g):f.transparent===!0?i.unshift(g):e.unshift(g)}function c(u,d){e.length>1&&e.sort(u||dy),n.length>1&&n.sort(d||xd),i.length>1&&i.sort(d||xd)}function h(){for(let u=t,d=r.length;u<d;u++){const f=r[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:a,unshift:l,finish:h,sort:c}}function fy(){let r=new WeakMap;function t(n,i){const s=r.get(n);let o;return s===void 0?(o=new vd,r.set(n,[o])):i>=s.length?(o=new vd,s.push(o)):o=s[i],o}function e(){r=new WeakMap}return{get:t,dispose:e}}function py(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new dt};break;case"SpotLight":e={position:new R,direction:new R,color:new dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new dt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new dt,groundColor:new dt};break;case"RectAreaLight":e={color:new dt,position:new R,halfWidth:new R,halfHeight:new R};break}return r[t.id]=e,e}}}function my(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Z};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Z};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Z,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let gy=0;function xy(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function vy(r){const t=new py,e=my(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);const i=new R,s=new Ut,o=new Ut;function a(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,p=0,x=0,m=0,g=0,y=0,v=0,_=0,E=0,b=0,w=0;c.sort(xy);for(let S=0,M=c.length;S<M;S++){const P=c[S],N=P.color,I=P.intensity,D=P.distance,O=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=N.r*I,u+=N.g*I,d+=N.b*I;else if(P.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(P.sh.coefficients[U],I);w++}else if(P.isDirectionalLight){const U=t.get(P);if(U.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Y=P.shadow,k=e.get(P);k.shadowIntensity=Y.intensity,k.shadowBias=Y.bias,k.shadowNormalBias=Y.normalBias,k.shadowRadius=Y.radius,k.shadowMapSize=Y.mapSize,n.directionalShadow[f]=k,n.directionalShadowMap[f]=O,n.directionalShadowMatrix[f]=P.shadow.matrix,y++}n.directional[f]=U,f++}else if(P.isSpotLight){const U=t.get(P);U.position.setFromMatrixPosition(P.matrixWorld),U.color.copy(N).multiplyScalar(I),U.distance=D,U.coneCos=Math.cos(P.angle),U.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),U.decay=P.decay,n.spot[x]=U;const Y=P.shadow;if(P.map&&(n.spotLightMap[E]=P.map,E++,Y.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[x]=Y.matrix,P.castShadow){const k=e.get(P);k.shadowIntensity=Y.intensity,k.shadowBias=Y.bias,k.shadowNormalBias=Y.normalBias,k.shadowRadius=Y.radius,k.shadowMapSize=Y.mapSize,n.spotShadow[x]=k,n.spotShadowMap[x]=O,_++}x++}else if(P.isRectAreaLight){const U=t.get(P);U.color.copy(N).multiplyScalar(I),U.halfWidth.set(P.width*.5,0,0),U.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=U,m++}else if(P.isPointLight){const U=t.get(P);if(U.color.copy(P.color).multiplyScalar(P.intensity),U.distance=P.distance,U.decay=P.decay,P.castShadow){const Y=P.shadow,k=e.get(P);k.shadowIntensity=Y.intensity,k.shadowBias=Y.bias,k.shadowNormalBias=Y.normalBias,k.shadowRadius=Y.radius,k.shadowMapSize=Y.mapSize,k.shadowCameraNear=Y.camera.near,k.shadowCameraFar=Y.camera.far,n.pointShadow[p]=k,n.pointShadowMap[p]=O,n.pointShadowMatrix[p]=P.shadow.matrix,v++}n.point[p]=U,p++}else if(P.isHemisphereLight){const U=t.get(P);U.skyColor.copy(P.color).multiplyScalar(I),U.groundColor.copy(P.groundColor).multiplyScalar(I),n.hemi[g]=U,g++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=mt.LTC_FLOAT_1,n.rectAreaLTC2=mt.LTC_FLOAT_2):(n.rectAreaLTC1=mt.LTC_HALF_1,n.rectAreaLTC2=mt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==f||C.pointLength!==p||C.spotLength!==x||C.rectAreaLength!==m||C.hemiLength!==g||C.numDirectionalShadows!==y||C.numPointShadows!==v||C.numSpotShadows!==_||C.numSpotMaps!==E||C.numLightProbes!==w)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=_+E-b,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=w,C.directionalLength=f,C.pointLength=p,C.spotLength=x,C.rectAreaLength=m,C.hemiLength=g,C.numDirectionalShadows=y,C.numPointShadows=v,C.numSpotShadows=_,C.numSpotMaps=E,C.numLightProbes=w,n.version=gy++)}function l(c,h){let u=0,d=0,f=0,p=0,x=0;const m=h.matrixWorldInverse;for(let g=0,y=c.length;g<y;g++){const v=c[g];if(v.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(m),u++}else if(v.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(m),f++}else if(v.isRectAreaLight){const _=n.rectArea[p];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),o.identity(),s.copy(v.matrixWorld),s.premultiply(m),o.extractRotation(s),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),p++}else if(v.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){const _=n.hemi[x];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function _d(r){const t=new vy(r),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function _y(r){let t=new WeakMap;function e(i,s=0){const o=t.get(i);let a;return o===void 0?(a=new _d(r),t.set(i,[a])):s>=o.length?(a=new _d(r),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Kh extends qe{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Yf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class jh extends qe{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const yy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,My=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function by(r,t,e){let n=new go;const i=new Z,s=new Z,o=new ne,a=new Kh({depthPacking:$f}),l=new jh,c={},h=e.maxTextureSize,u={[gi]:We,[We]:gi,[yn]:yn},d=new ge({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Z},radius:{value:4}},vertexShader:yy,fragmentShader:My}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new Ft;p.setAttribute("position",new Qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ue(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Th;let g=this.type;this.render=function(b,w,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const S=r.getRenderTarget(),M=r.getActiveCubeFace(),P=r.getActiveMipmapLevel(),N=r.state;N.setBlending(Le),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const I=g!==Wn&&this.type===Wn,D=g===Wn&&this.type!==Wn;for(let O=0,U=b.length;O<U;O++){const Y=b[O],k=Y.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;i.copy(k.mapSize);const X=k.getFrameExtents();if(i.multiply(X),s.copy(k.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/X.x),i.x=s.x*X.x,k.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/X.y),i.y=s.y*X.y,k.mapSize.y=s.y)),k.map===null||I===!0||D===!0){const nt=this.type!==Wn?{minFilter:Ce,magFilter:Ce}:{};k.map!==null&&k.map.dispose(),k.map=new ke(i.x,i.y,nt),k.map.texture.name=Y.name+".shadowMap",k.camera.updateProjectionMatrix()}r.setRenderTarget(k.map),r.clear();const $=k.getViewportCount();for(let nt=0;nt<$;nt++){const ct=k.getViewport(nt);o.set(s.x*ct.x,s.y*ct.y,s.x*ct.z,s.y*ct.w),N.viewport(o),k.updateMatrices(Y,nt),n=k.getFrustum(),_(w,C,k.camera,Y,this.type)}k.isPointLightShadow!==!0&&this.type===Wn&&y(k,C),k.needsUpdate=!1}g=this.type,m.needsUpdate=!1,r.setRenderTarget(S,M,P)};function y(b,w){const C=t.update(x);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new ke(i.x,i.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,r.setRenderTarget(b.mapPass),r.clear(),r.renderBufferDirect(w,null,C,d,x,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,r.setRenderTarget(b.map),r.clear(),r.renderBufferDirect(w,null,C,f,x,null)}function v(b,w,C,S){let M=null;const P=C.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)M=P;else if(M=C.isPointLight===!0?l:a,r.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const N=M.uuid,I=w.uuid;let D=c[N];D===void 0&&(D={},c[N]=D);let O=D[I];O===void 0&&(O=M.clone(),D[I]=O,w.addEventListener("dispose",E)),M=O}if(M.visible=w.visible,M.wireframe=w.wireframe,S===Wn?M.side=w.shadowSide!==null?w.shadowSide:w.side:M.side=w.shadowSide!==null?w.shadowSide:u[w.side],M.alphaMap=w.alphaMap,M.alphaTest=w.alphaTest,M.map=w.map,M.clipShadows=w.clipShadows,M.clippingPlanes=w.clippingPlanes,M.clipIntersection=w.clipIntersection,M.displacementMap=w.displacementMap,M.displacementScale=w.displacementScale,M.displacementBias=w.displacementBias,M.wireframeLinewidth=w.wireframeLinewidth,M.linewidth=w.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const N=r.properties.get(M);N.light=C}return M}function _(b,w,C,S,M){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===Wn)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,b.matrixWorld);const I=t.update(b),D=b.material;if(Array.isArray(D)){const O=I.groups;for(let U=0,Y=O.length;U<Y;U++){const k=O[U],X=D[k.materialIndex];if(X&&X.visible){const $=v(b,X,S,M);b.onBeforeShadow(r,b,w,C,I,$,k),r.renderBufferDirect(C,null,I,$,b,k),b.onAfterShadow(r,b,w,C,I,$,k)}}}else if(D.visible){const O=v(b,D,S,M);b.onBeforeShadow(r,b,w,C,I,O,null),r.renderBufferDirect(C,null,I,O,b,null),b.onAfterShadow(r,b,w,C,I,O,null)}}const N=b.children;for(let I=0,D=N.length;I<D;I++)_(N[I],w,C,S,M)}function E(b){b.target.removeEventListener("dispose",E);for(const C in c){const S=c[C],M=b.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}const Sy={[Fa]:Oa,[Ba]:Ga,[Va]:Wa,[vs]:Ha,[Oa]:Fa,[Ga]:Ba,[Wa]:Va,[Ha]:vs};function wy(r,t){function e(){let F=!1;const pt=new ne;let q=null;const tt=new ne(0,0,0,0);return{setMask:function(Mt){q!==Mt&&!F&&(r.colorMask(Mt,Mt,Mt,Mt),q=Mt)},setLocked:function(Mt){F=Mt},setClear:function(Mt,vt,Yt,ve,Fe){Fe===!0&&(Mt*=ve,vt*=ve,Yt*=ve),pt.set(Mt,vt,Yt,ve),tt.equals(pt)===!1&&(r.clearColor(Mt,vt,Yt,ve),tt.copy(pt))},reset:function(){F=!1,q=null,tt.set(-1,0,0,0)}}}function n(){let F=!1,pt=!1,q=null,tt=null,Mt=null;return{setReversed:function(vt){if(pt!==vt){const Yt=t.get("EXT_clip_control");pt?Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.ZERO_TO_ONE_EXT):Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.NEGATIVE_ONE_TO_ONE_EXT);const ve=Mt;Mt=null,this.setClear(ve)}pt=vt},getReversed:function(){return pt},setTest:function(vt){vt?ot(r.DEPTH_TEST):At(r.DEPTH_TEST)},setMask:function(vt){q!==vt&&!F&&(r.depthMask(vt),q=vt)},setFunc:function(vt){if(pt&&(vt=Sy[vt]),tt!==vt){switch(vt){case Fa:r.depthFunc(r.NEVER);break;case Oa:r.depthFunc(r.ALWAYS);break;case Ba:r.depthFunc(r.LESS);break;case vs:r.depthFunc(r.LEQUAL);break;case Va:r.depthFunc(r.EQUAL);break;case Ha:r.depthFunc(r.GEQUAL);break;case Ga:r.depthFunc(r.GREATER);break;case Wa:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}tt=vt}},setLocked:function(vt){F=vt},setClear:function(vt){Mt!==vt&&(pt&&(vt=1-vt),r.clearDepth(vt),Mt=vt)},reset:function(){F=!1,q=null,tt=null,Mt=null,pt=!1}}}function i(){let F=!1,pt=null,q=null,tt=null,Mt=null,vt=null,Yt=null,ve=null,Fe=null;return{setTest:function(ce){F||(ce?ot(r.STENCIL_TEST):At(r.STENCIL_TEST))},setMask:function(ce){pt!==ce&&!F&&(r.stencilMask(ce),pt=ce)},setFunc:function(ce,En,ti){(q!==ce||tt!==En||Mt!==ti)&&(r.stencilFunc(ce,En,ti),q=ce,tt=En,Mt=ti)},setOp:function(ce,En,ti){(vt!==ce||Yt!==En||ve!==ti)&&(r.stencilOp(ce,En,ti),vt=ce,Yt=En,ve=ti)},setLocked:function(ce){F=ce},setClear:function(ce){Fe!==ce&&(r.clearStencil(ce),Fe=ce)},reset:function(){F=!1,pt=null,q=null,tt=null,Mt=null,vt=null,Yt=null,ve=null,Fe=null}}}const s=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],p=null,x=!1,m=null,g=null,y=null,v=null,_=null,E=null,b=null,w=new dt(0,0,0),C=0,S=!1,M=null,P=null,N=null,I=null,D=null;const O=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,Y=0;const k=r.getParameter(r.VERSION);k.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(k)[1]),U=Y>=1):k.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),U=Y>=2);let X=null,$={};const nt=r.getParameter(r.SCISSOR_BOX),ct=r.getParameter(r.VIEWPORT),te=new ne().fromArray(nt),J=new ne().fromArray(ct);function rt(F,pt,q,tt){const Mt=new Uint8Array(4),vt=r.createTexture();r.bindTexture(F,vt),r.texParameteri(F,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(F,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Yt=0;Yt<q;Yt++)F===r.TEXTURE_3D||F===r.TEXTURE_2D_ARRAY?r.texImage3D(pt,0,r.RGBA,1,1,tt,0,r.RGBA,r.UNSIGNED_BYTE,Mt):r.texImage2D(pt+Yt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Mt);return vt}const St={};St[r.TEXTURE_2D]=rt(r.TEXTURE_2D,r.TEXTURE_2D,1),St[r.TEXTURE_CUBE_MAP]=rt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),St[r.TEXTURE_2D_ARRAY]=rt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),St[r.TEXTURE_3D]=rt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ot(r.DEPTH_TEST),o.setFunc(vs),it(!1),yt(ch),ot(r.CULL_FACE),L(Le);function ot(F){h[F]!==!0&&(r.enable(F),h[F]=!0)}function At(F){h[F]!==!1&&(r.disable(F),h[F]=!1)}function kt(F,pt){return u[F]!==pt?(r.bindFramebuffer(F,pt),u[F]=pt,F===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=pt),F===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=pt),!0):!1}function Lt(F,pt){let q=f,tt=!1;if(F){q=d.get(pt),q===void 0&&(q=[],d.set(pt,q));const Mt=F.textures;if(q.length!==Mt.length||q[0]!==r.COLOR_ATTACHMENT0){for(let vt=0,Yt=Mt.length;vt<Yt;vt++)q[vt]=r.COLOR_ATTACHMENT0+vt;q.length=Mt.length,tt=!0}}else q[0]!==r.BACK&&(q[0]=r.BACK,tt=!0);tt&&r.drawBuffers(q)}function Kt(F){return p!==F?(r.useProgram(F),p=F,!0):!1}const Q={[Mn]:r.FUNC_ADD,[Ef]:r.FUNC_SUBTRACT,[Af]:r.FUNC_REVERSE_SUBTRACT};Q[Cf]=r.MIN,Q[Rf]=r.MAX;const at={[Zs]:r.ZERO,[Pf]:r.ONE,[If]:r.SRC_COLOR,[Da]:r.SRC_ALPHA,[Uf]:r.SRC_ALPHA_SATURATE,[Na]:r.DST_COLOR,[ka]:r.DST_ALPHA,[zf]:r.ONE_MINUS_SRC_COLOR,[Ua]:r.ONE_MINUS_SRC_ALPHA,[Df]:r.ONE_MINUS_DST_COLOR,[Lf]:r.ONE_MINUS_DST_ALPHA,[kf]:r.CONSTANT_COLOR,[Nf]:r.ONE_MINUS_CONSTANT_COLOR,[Ff]:r.CONSTANT_ALPHA,[Of]:r.ONE_MINUS_CONSTANT_ALPHA};function L(F,pt,q,tt,Mt,vt,Yt,ve,Fe,ce){if(F===Le){x===!0&&(At(r.BLEND),x=!1);return}if(x===!1&&(ot(r.BLEND),x=!0),F!==Ah){if(F!==m||ce!==S){if((g!==Mn||_!==Mn)&&(r.blendEquation(r.FUNC_ADD),g=Mn,_=Mn),ce)switch(F){case ds:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case La:r.blendFunc(r.ONE,r.ONE);break;case hh:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case uh:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case ds:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case La:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case hh:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case uh:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}y=null,v=null,E=null,b=null,w.set(0,0,0),C=0,m=F,S=ce}return}Mt=Mt||pt,vt=vt||q,Yt=Yt||tt,(pt!==g||Mt!==_)&&(r.blendEquationSeparate(Q[pt],Q[Mt]),g=pt,_=Mt),(q!==y||tt!==v||vt!==E||Yt!==b)&&(r.blendFuncSeparate(at[q],at[tt],at[vt],at[Yt]),y=q,v=tt,E=vt,b=Yt),(ve.equals(w)===!1||Fe!==C)&&(r.blendColor(ve.r,ve.g,ve.b,Fe),w.copy(ve),C=Fe),m=F,S=!1}function Ct(F,pt){F.side===yn?At(r.CULL_FACE):ot(r.CULL_FACE);let q=F.side===We;pt&&(q=!q),it(q),F.blending===ds&&F.transparent===!1?L(Le):L(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),s.setMask(F.colorWrite);const tt=F.stencilWrite;a.setTest(tt),tt&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Nt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ot(r.SAMPLE_ALPHA_TO_COVERAGE):At(r.SAMPLE_ALPHA_TO_COVERAGE)}function it(F){M!==F&&(F?r.frontFace(r.CW):r.frontFace(r.CCW),M=F)}function yt(F){F!==wf?(ot(r.CULL_FACE),F!==P&&(F===ch?r.cullFace(r.BACK):F===Tf?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):At(r.CULL_FACE),P=F}function ht(F){F!==N&&(U&&r.lineWidth(F),N=F)}function Nt(F,pt,q){F?(ot(r.POLYGON_OFFSET_FILL),(I!==pt||D!==q)&&(r.polygonOffset(pt,q),I=pt,D=q)):At(r.POLYGON_OFFSET_FILL)}function xt(F){F?ot(r.SCISSOR_TEST):At(r.SCISSOR_TEST)}function z(F){F===void 0&&(F=r.TEXTURE0+O-1),X!==F&&(r.activeTexture(F),X=F)}function T(F,pt,q){q===void 0&&(X===null?q=r.TEXTURE0+O-1:q=X);let tt=$[q];tt===void 0&&(tt={type:void 0,texture:void 0},$[q]=tt),(tt.type!==F||tt.texture!==pt)&&(X!==q&&(r.activeTexture(q),X=q),r.bindTexture(F,pt||St[F]),tt.type=F,tt.texture=pt)}function H(){const F=$[X];F!==void 0&&F.type!==void 0&&(r.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function K(){try{r.compressedTexImage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function et(){try{r.compressedTexImage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function j(){try{r.texSubImage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Et(){try{r.texSubImage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ft(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function gt(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Xt(){try{r.texStorage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function st(){try{r.texStorage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function wt(){try{r.texImage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ot(){try{r.texImage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Bt(F){te.equals(F)===!1&&(r.scissor(F.x,F.y,F.z,F.w),te.copy(F))}function Tt(F){J.equals(F)===!1&&(r.viewport(F.x,F.y,F.z,F.w),J.copy(F))}function jt(F,pt){let q=c.get(pt);q===void 0&&(q=new WeakMap,c.set(pt,q));let tt=q.get(F);tt===void 0&&(tt=r.getUniformBlockIndex(pt,F.name),q.set(F,tt))}function Vt(F,pt){const tt=c.get(pt).get(F);l.get(pt)!==tt&&(r.uniformBlockBinding(pt,tt,F.__bindingPointIndex),l.set(pt,tt))}function se(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),o.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},X=null,$={},u={},d=new WeakMap,f=[],p=null,x=!1,m=null,g=null,y=null,v=null,_=null,E=null,b=null,w=new dt(0,0,0),C=0,S=!1,M=null,P=null,N=null,I=null,D=null,te.set(0,0,r.canvas.width,r.canvas.height),J.set(0,0,r.canvas.width,r.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ot,disable:At,bindFramebuffer:kt,drawBuffers:Lt,useProgram:Kt,setBlending:L,setMaterial:Ct,setFlipSided:it,setCullFace:yt,setLineWidth:ht,setPolygonOffset:Nt,setScissorTest:xt,activeTexture:z,bindTexture:T,unbindTexture:H,compressedTexImage2D:K,compressedTexImage3D:et,texImage2D:wt,texImage3D:Ot,updateUBOMapping:jt,uniformBlockBinding:Vt,texStorage2D:Xt,texStorage3D:st,texSubImage2D:j,texSubImage3D:Et,compressedTexSubImage2D:ft,compressedTexSubImage3D:gt,scissor:Bt,viewport:Tt,reset:se}}function Ty(r,t){const e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2):(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0),r}function Ey(r,t){const e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0):(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2),r}function Ay(r){return r.repeat.x=1,r.repeat.y=1,r.offset.x=0,r.offset.y=0,r}function gh(r,t,e,n){const i=Cy(n);switch(e){case Nh:return r*t;case Oh:return r*t;case Bh:return r*t*2;case Dl:return r*t/i.components*i.byteLength;case fo:return r*t/i.components*i.byteLength;case Vh:return r*t*2/i.components*i.byteLength;case Ul:return r*t*2/i.components*i.byteLength;case Fh:return r*t*3/i.components*i.byteLength;case Ne:return r*t*4/i.components*i.byteLength;case kl:return r*t*4/i.components*i.byteLength;case kr:case Nr:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Fr:case Or:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case qa:case $a:return Math.max(r,16)*Math.max(t,8)/4;case Xa:case Ya:return Math.max(r,8)*Math.max(t,8)/2;case Za:case Ka:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case ja:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Ja:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Qa:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case tl:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case el:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case nl:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case il:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case sl:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case rl:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case ol:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case al:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case ll:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case cl:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case hl:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case ul:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Br:case dl:case fl:return Math.ceil(r/4)*Math.ceil(t/4)*16;case Hh:case pl:return Math.ceil(r/4)*Math.ceil(t/4)*8;case ml:case gl:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Cy(r){switch(r){case Tn:case Dh:return{byteLength:1,components:1};case sr:case Uh:case pn:return{byteLength:2,components:1};case zl:case Ll:return{byteLength:2,components:4};case vi:case Il:case an:return{byteLength:4,components:1};case kh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}const Ry={contain:Ty,cover:Ey,fill:Ay,getByteLength:gh};function Py(r,t,e,n,i,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Z,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(z,T){return f?new OffscreenCanvas(z,T):to("canvas")}function x(z,T,H){let K=1;const et=xt(z);if((et.width>H||et.height>H)&&(K=H/Math.max(et.width,et.height)),K<1)if(typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&z instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&z instanceof ImageBitmap||typeof VideoFrame<"u"&&z instanceof VideoFrame){const j=Math.floor(K*et.width),Et=Math.floor(K*et.height);u===void 0&&(u=p(j,Et));const ft=T?p(j,Et):u;return ft.width=j,ft.height=Et,ft.getContext("2d").drawImage(z,0,0,j,Et),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+j+"x"+Et+")."),ft}else return"data"in z&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),z;return z}function m(z){return z.generateMipmaps}function g(z){r.generateMipmap(z)}function y(z){return z.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:z.isWebGL3DRenderTarget?r.TEXTURE_3D:z.isWebGLArrayRenderTarget||z.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function v(z,T,H,K,et=!1){if(z!==null){if(r[z]!==void 0)return r[z];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+z+"'")}let j=T;if(T===r.RED&&(H===r.FLOAT&&(j=r.R32F),H===r.HALF_FLOAT&&(j=r.R16F),H===r.UNSIGNED_BYTE&&(j=r.R8)),T===r.RED_INTEGER&&(H===r.UNSIGNED_BYTE&&(j=r.R8UI),H===r.UNSIGNED_SHORT&&(j=r.R16UI),H===r.UNSIGNED_INT&&(j=r.R32UI),H===r.BYTE&&(j=r.R8I),H===r.SHORT&&(j=r.R16I),H===r.INT&&(j=r.R32I)),T===r.RG&&(H===r.FLOAT&&(j=r.RG32F),H===r.HALF_FLOAT&&(j=r.RG16F),H===r.UNSIGNED_BYTE&&(j=r.RG8)),T===r.RG_INTEGER&&(H===r.UNSIGNED_BYTE&&(j=r.RG8UI),H===r.UNSIGNED_SHORT&&(j=r.RG16UI),H===r.UNSIGNED_INT&&(j=r.RG32UI),H===r.BYTE&&(j=r.RG8I),H===r.SHORT&&(j=r.RG16I),H===r.INT&&(j=r.RG32I)),T===r.RGB_INTEGER&&(H===r.UNSIGNED_BYTE&&(j=r.RGB8UI),H===r.UNSIGNED_SHORT&&(j=r.RGB16UI),H===r.UNSIGNED_INT&&(j=r.RGB32UI),H===r.BYTE&&(j=r.RGB8I),H===r.SHORT&&(j=r.RGB16I),H===r.INT&&(j=r.RGB32I)),T===r.RGBA_INTEGER&&(H===r.UNSIGNED_BYTE&&(j=r.RGBA8UI),H===r.UNSIGNED_SHORT&&(j=r.RGBA16UI),H===r.UNSIGNED_INT&&(j=r.RGBA32UI),H===r.BYTE&&(j=r.RGBA8I),H===r.SHORT&&(j=r.RGBA16I),H===r.INT&&(j=r.RGBA32I)),T===r.RGB&&H===r.UNSIGNED_INT_5_9_9_9_REV&&(j=r.RGB9_E5),T===r.RGBA){const Et=et?po:Jt.getTransfer(K);H===r.FLOAT&&(j=r.RGBA32F),H===r.HALF_FLOAT&&(j=r.RGBA16F),H===r.UNSIGNED_BYTE&&(j=Et===le?r.SRGB8_ALPHA8:r.RGBA8),H===r.UNSIGNED_SHORT_4_4_4_4&&(j=r.RGBA4),H===r.UNSIGNED_SHORT_5_5_5_1&&(j=r.RGB5_A1)}return(j===r.R16F||j===r.R32F||j===r.RG16F||j===r.RG32F||j===r.RGBA16F||j===r.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function _(z,T){let H;return z?T===null||T===vi||T===Ui?H=r.DEPTH24_STENCIL8:T===an?H=r.DEPTH32F_STENCIL8:T===sr&&(H=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===vi||T===Ui?H=r.DEPTH_COMPONENT24:T===an?H=r.DEPTH_COMPONENT32F:T===sr&&(H=r.DEPTH_COMPONENT16),H}function E(z,T){return m(z)===!0||z.isFramebufferTexture&&z.minFilter!==Ce&&z.minFilter!==Ee?Math.log2(Math.max(T.width,T.height))+1:z.mipmaps!==void 0&&z.mipmaps.length>0?z.mipmaps.length:z.isCompressedTexture&&Array.isArray(z.image)?T.mipmaps.length:1}function b(z){const T=z.target;T.removeEventListener("dispose",b),C(T),T.isVideoTexture&&h.delete(T)}function w(z){const T=z.target;T.removeEventListener("dispose",w),M(T)}function C(z){const T=n.get(z);if(T.__webglInit===void 0)return;const H=z.source,K=d.get(H);if(K){const et=K[T.__cacheKey];et.usedTimes--,et.usedTimes===0&&S(z),Object.keys(K).length===0&&d.delete(H)}n.remove(z)}function S(z){const T=n.get(z);r.deleteTexture(T.__webglTexture);const H=z.source,K=d.get(H);delete K[T.__cacheKey],o.memory.textures--}function M(z){const T=n.get(z);if(z.depthTexture&&(z.depthTexture.dispose(),n.remove(z.depthTexture)),z.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(T.__webglFramebuffer[K]))for(let et=0;et<T.__webglFramebuffer[K].length;et++)r.deleteFramebuffer(T.__webglFramebuffer[K][et]);else r.deleteFramebuffer(T.__webglFramebuffer[K]);T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer[K])}else{if(Array.isArray(T.__webglFramebuffer))for(let K=0;K<T.__webglFramebuffer.length;K++)r.deleteFramebuffer(T.__webglFramebuffer[K]);else r.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&r.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let K=0;K<T.__webglColorRenderbuffer.length;K++)T.__webglColorRenderbuffer[K]&&r.deleteRenderbuffer(T.__webglColorRenderbuffer[K]);T.__webglDepthRenderbuffer&&r.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const H=z.textures;for(let K=0,et=H.length;K<et;K++){const j=n.get(H[K]);j.__webglTexture&&(r.deleteTexture(j.__webglTexture),o.memory.textures--),n.remove(H[K])}n.remove(z)}let P=0;function N(){P=0}function I(){const z=P;return z>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+z+" texture units while this GPU supports only "+i.maxTextures),P+=1,z}function D(z){const T=[];return T.push(z.wrapS),T.push(z.wrapT),T.push(z.wrapR||0),T.push(z.magFilter),T.push(z.minFilter),T.push(z.anisotropy),T.push(z.internalFormat),T.push(z.format),T.push(z.type),T.push(z.generateMipmaps),T.push(z.premultiplyAlpha),T.push(z.flipY),T.push(z.unpackAlignment),T.push(z.colorSpace),T.join()}function O(z,T){const H=n.get(z);if(z.isVideoTexture&&ht(z),z.isRenderTargetTexture===!1&&z.version>0&&H.__version!==z.version){const K=z.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(H,z,T);return}}e.bindTexture(r.TEXTURE_2D,H.__webglTexture,r.TEXTURE0+T)}function U(z,T){const H=n.get(z);if(z.version>0&&H.__version!==z.version){J(H,z,T);return}e.bindTexture(r.TEXTURE_2D_ARRAY,H.__webglTexture,r.TEXTURE0+T)}function Y(z,T){const H=n.get(z);if(z.version>0&&H.__version!==z.version){J(H,z,T);return}e.bindTexture(r.TEXTURE_3D,H.__webglTexture,r.TEXTURE0+T)}function k(z,T){const H=n.get(z);if(z.version>0&&H.__version!==z.version){rt(H,z,T);return}e.bindTexture(r.TEXTURE_CUBE_MAP,H.__webglTexture,r.TEXTURE0+T)}const X={[Jn]:r.REPEAT,[Sn]:r.CLAMP_TO_EDGE,[Zr]:r.MIRRORED_REPEAT},$={[Ce]:r.NEAREST,[Lh]:r.NEAREST_MIPMAP_NEAREST,[Ks]:r.NEAREST_MIPMAP_LINEAR,[Ee]:r.LINEAR,[Ur]:r.LINEAR_MIPMAP_NEAREST,[kn]:r.LINEAR_MIPMAP_LINEAR},nt={[Kf]:r.NEVER,[np]:r.ALWAYS,[jf]:r.LESS,[Wh]:r.LEQUAL,[Jf]:r.EQUAL,[ep]:r.GEQUAL,[Qf]:r.GREATER,[tp]:r.NOTEQUAL};function ct(z,T){if(T.type===an&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===Ee||T.magFilter===Ur||T.magFilter===Ks||T.magFilter===kn||T.minFilter===Ee||T.minFilter===Ur||T.minFilter===Ks||T.minFilter===kn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(z,r.TEXTURE_WRAP_S,X[T.wrapS]),r.texParameteri(z,r.TEXTURE_WRAP_T,X[T.wrapT]),(z===r.TEXTURE_3D||z===r.TEXTURE_2D_ARRAY)&&r.texParameteri(z,r.TEXTURE_WRAP_R,X[T.wrapR]),r.texParameteri(z,r.TEXTURE_MAG_FILTER,$[T.magFilter]),r.texParameteri(z,r.TEXTURE_MIN_FILTER,$[T.minFilter]),T.compareFunction&&(r.texParameteri(z,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(z,r.TEXTURE_COMPARE_FUNC,nt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Ce||T.minFilter!==Ks&&T.minFilter!==kn||T.type===an&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");r.texParameterf(z,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function te(z,T){let H=!1;z.__webglInit===void 0&&(z.__webglInit=!0,T.addEventListener("dispose",b));const K=T.source;let et=d.get(K);et===void 0&&(et={},d.set(K,et));const j=D(T);if(j!==z.__cacheKey){et[j]===void 0&&(et[j]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,H=!0),et[j].usedTimes++;const Et=et[z.__cacheKey];Et!==void 0&&(et[z.__cacheKey].usedTimes--,Et.usedTimes===0&&S(T)),z.__cacheKey=j,z.__webglTexture=et[j].texture}return H}function J(z,T,H){let K=r.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(K=r.TEXTURE_2D_ARRAY),T.isData3DTexture&&(K=r.TEXTURE_3D);const et=te(z,T),j=T.source;e.bindTexture(K,z.__webglTexture,r.TEXTURE0+H);const Et=n.get(j);if(j.version!==Et.__version||et===!0){e.activeTexture(r.TEXTURE0+H);const ft=Jt.getPrimaries(Jt.workingColorSpace),gt=T.colorSpace===qn?null:Jt.getPrimaries(T.colorSpace),Xt=T.colorSpace===qn||ft===gt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let st=x(T.image,!1,i.maxTextureSize);st=Nt(T,st);const wt=s.convert(T.format,T.colorSpace),Ot=s.convert(T.type);let Bt=v(T.internalFormat,wt,Ot,T.colorSpace,T.isVideoTexture);ct(K,T);let Tt;const jt=T.mipmaps,Vt=T.isVideoTexture!==!0,se=Et.__version===void 0||et===!0,F=j.dataReady,pt=E(T,st);if(T.isDepthTexture)Bt=_(T.format===ki,T.type),se&&(Vt?e.texStorage2D(r.TEXTURE_2D,1,Bt,st.width,st.height):e.texImage2D(r.TEXTURE_2D,0,Bt,st.width,st.height,0,wt,Ot,null));else if(T.isDataTexture)if(jt.length>0){Vt&&se&&e.texStorage2D(r.TEXTURE_2D,pt,Bt,jt[0].width,jt[0].height);for(let q=0,tt=jt.length;q<tt;q++)Tt=jt[q],Vt?F&&e.texSubImage2D(r.TEXTURE_2D,q,0,0,Tt.width,Tt.height,wt,Ot,Tt.data):e.texImage2D(r.TEXTURE_2D,q,Bt,Tt.width,Tt.height,0,wt,Ot,Tt.data);T.generateMipmaps=!1}else Vt?(se&&e.texStorage2D(r.TEXTURE_2D,pt,Bt,st.width,st.height),F&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,st.width,st.height,wt,Ot,st.data)):e.texImage2D(r.TEXTURE_2D,0,Bt,st.width,st.height,0,wt,Ot,st.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Vt&&se&&e.texStorage3D(r.TEXTURE_2D_ARRAY,pt,Bt,jt[0].width,jt[0].height,st.depth);for(let q=0,tt=jt.length;q<tt;q++)if(Tt=jt[q],T.format!==Ne)if(wt!==null)if(Vt){if(F)if(T.layerUpdates.size>0){const Mt=gh(Tt.width,Tt.height,T.format,T.type);for(const vt of T.layerUpdates){const Yt=Tt.data.subarray(vt*Mt/Tt.data.BYTES_PER_ELEMENT,(vt+1)*Mt/Tt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,q,0,0,vt,Tt.width,Tt.height,1,wt,Yt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,q,0,0,0,Tt.width,Tt.height,st.depth,wt,Tt.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,q,Bt,Tt.width,Tt.height,st.depth,0,Tt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?F&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,q,0,0,0,Tt.width,Tt.height,st.depth,wt,Ot,Tt.data):e.texImage3D(r.TEXTURE_2D_ARRAY,q,Bt,Tt.width,Tt.height,st.depth,0,wt,Ot,Tt.data)}else{Vt&&se&&e.texStorage2D(r.TEXTURE_2D,pt,Bt,jt[0].width,jt[0].height);for(let q=0,tt=jt.length;q<tt;q++)Tt=jt[q],T.format!==Ne?wt!==null?Vt?F&&e.compressedTexSubImage2D(r.TEXTURE_2D,q,0,0,Tt.width,Tt.height,wt,Tt.data):e.compressedTexImage2D(r.TEXTURE_2D,q,Bt,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?F&&e.texSubImage2D(r.TEXTURE_2D,q,0,0,Tt.width,Tt.height,wt,Ot,Tt.data):e.texImage2D(r.TEXTURE_2D,q,Bt,Tt.width,Tt.height,0,wt,Ot,Tt.data)}else if(T.isDataArrayTexture)if(Vt){if(se&&e.texStorage3D(r.TEXTURE_2D_ARRAY,pt,Bt,st.width,st.height,st.depth),F)if(T.layerUpdates.size>0){const q=gh(st.width,st.height,T.format,T.type);for(const tt of T.layerUpdates){const Mt=st.data.subarray(tt*q/st.data.BYTES_PER_ELEMENT,(tt+1)*q/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,tt,st.width,st.height,1,wt,Ot,Mt)}T.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,wt,Ot,st.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Bt,st.width,st.height,st.depth,0,wt,Ot,st.data);else if(T.isData3DTexture)Vt?(se&&e.texStorage3D(r.TEXTURE_3D,pt,Bt,st.width,st.height,st.depth),F&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,wt,Ot,st.data)):e.texImage3D(r.TEXTURE_3D,0,Bt,st.width,st.height,st.depth,0,wt,Ot,st.data);else if(T.isFramebufferTexture){if(se)if(Vt)e.texStorage2D(r.TEXTURE_2D,pt,Bt,st.width,st.height);else{let q=st.width,tt=st.height;for(let Mt=0;Mt<pt;Mt++)e.texImage2D(r.TEXTURE_2D,Mt,Bt,q,tt,0,wt,Ot,null),q>>=1,tt>>=1}}else if(jt.length>0){if(Vt&&se){const q=xt(jt[0]);e.texStorage2D(r.TEXTURE_2D,pt,Bt,q.width,q.height)}for(let q=0,tt=jt.length;q<tt;q++)Tt=jt[q],Vt?F&&e.texSubImage2D(r.TEXTURE_2D,q,0,0,wt,Ot,Tt):e.texImage2D(r.TEXTURE_2D,q,Bt,wt,Ot,Tt);T.generateMipmaps=!1}else if(Vt){if(se){const q=xt(st);e.texStorage2D(r.TEXTURE_2D,pt,Bt,q.width,q.height)}F&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,wt,Ot,st)}else e.texImage2D(r.TEXTURE_2D,0,Bt,wt,Ot,st);m(T)&&g(K),Et.__version=j.version,T.onUpdate&&T.onUpdate(T)}z.__version=T.version}function rt(z,T,H){if(T.image.length!==6)return;const K=te(z,T),et=T.source;e.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture,r.TEXTURE0+H);const j=n.get(et);if(et.version!==j.__version||K===!0){e.activeTexture(r.TEXTURE0+H);const Et=Jt.getPrimaries(Jt.workingColorSpace),ft=T.colorSpace===qn?null:Jt.getPrimaries(T.colorSpace),gt=T.colorSpace===qn||Et===ft?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const Xt=T.isCompressedTexture||T.image[0].isCompressedTexture,st=T.image[0]&&T.image[0].isDataTexture,wt=[];for(let tt=0;tt<6;tt++)!Xt&&!st?wt[tt]=x(T.image[tt],!0,i.maxCubemapSize):wt[tt]=st?T.image[tt].image:T.image[tt],wt[tt]=Nt(T,wt[tt]);const Ot=wt[0],Bt=s.convert(T.format,T.colorSpace),Tt=s.convert(T.type),jt=v(T.internalFormat,Bt,Tt,T.colorSpace),Vt=T.isVideoTexture!==!0,se=j.__version===void 0||K===!0,F=et.dataReady;let pt=E(T,Ot);ct(r.TEXTURE_CUBE_MAP,T);let q;if(Xt){Vt&&se&&e.texStorage2D(r.TEXTURE_CUBE_MAP,pt,jt,Ot.width,Ot.height);for(let tt=0;tt<6;tt++){q=wt[tt].mipmaps;for(let Mt=0;Mt<q.length;Mt++){const vt=q[Mt];T.format!==Ne?Bt!==null?Vt?F&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt,0,0,vt.width,vt.height,Bt,vt.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt,jt,vt.width,vt.height,0,vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt,0,0,vt.width,vt.height,Bt,Tt,vt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt,jt,vt.width,vt.height,0,Bt,Tt,vt.data)}}}else{if(q=T.mipmaps,Vt&&se){q.length>0&&pt++;const tt=xt(wt[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,pt,jt,tt.width,tt.height)}for(let tt=0;tt<6;tt++)if(st){Vt?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,wt[tt].width,wt[tt].height,Bt,Tt,wt[tt].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,jt,wt[tt].width,wt[tt].height,0,Bt,Tt,wt[tt].data);for(let Mt=0;Mt<q.length;Mt++){const Yt=q[Mt].image[tt].image;Vt?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt+1,0,0,Yt.width,Yt.height,Bt,Tt,Yt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt+1,jt,Yt.width,Yt.height,0,Bt,Tt,Yt.data)}}else{Vt?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Bt,Tt,wt[tt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,jt,Bt,Tt,wt[tt]);for(let Mt=0;Mt<q.length;Mt++){const vt=q[Mt];Vt?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt+1,0,0,Bt,Tt,vt.image[tt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt+1,jt,Bt,Tt,vt.image[tt])}}}m(T)&&g(r.TEXTURE_CUBE_MAP),j.__version=et.version,T.onUpdate&&T.onUpdate(T)}z.__version=T.version}function St(z,T,H,K,et,j){const Et=s.convert(H.format,H.colorSpace),ft=s.convert(H.type),gt=v(H.internalFormat,Et,ft,H.colorSpace),Xt=n.get(T),st=n.get(H);if(st.__renderTarget=T,!Xt.__hasExternalTextures){const wt=Math.max(1,T.width>>j),Ot=Math.max(1,T.height>>j);et===r.TEXTURE_3D||et===r.TEXTURE_2D_ARRAY?e.texImage3D(et,j,gt,wt,Ot,T.depth,0,Et,ft,null):e.texImage2D(et,j,gt,wt,Ot,0,Et,ft,null)}e.bindFramebuffer(r.FRAMEBUFFER,z),yt(T)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,K,et,st.__webglTexture,0,it(T)):(et===r.TEXTURE_2D||et>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,K,et,st.__webglTexture,j),e.bindFramebuffer(r.FRAMEBUFFER,null)}function ot(z,T,H){if(r.bindRenderbuffer(r.RENDERBUFFER,z),T.depthBuffer){const K=T.depthTexture,et=K&&K.isDepthTexture?K.type:null,j=_(T.stencilBuffer,et),Et=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ft=it(T);yt(T)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ft,j,T.width,T.height):H?r.renderbufferStorageMultisample(r.RENDERBUFFER,ft,j,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,j,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Et,r.RENDERBUFFER,z)}else{const K=T.textures;for(let et=0;et<K.length;et++){const j=K[et],Et=s.convert(j.format,j.colorSpace),ft=s.convert(j.type),gt=v(j.internalFormat,Et,ft,j.colorSpace),Xt=it(T);H&&yt(T)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Xt,gt,T.width,T.height):yt(T)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Xt,gt,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,gt,T.width,T.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function At(z,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,z),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(T.depthTexture);K.__renderTarget=T,(!K.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),O(T.depthTexture,0);const et=K.__webglTexture,j=it(T);if(T.depthTexture.format===fs)yt(T)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,et,0,j):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,et,0);else if(T.depthTexture.format===ki)yt(T)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,et,0,j):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function kt(z){const T=n.get(z),H=z.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==z.depthTexture){const K=z.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),K){const et=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,K.removeEventListener("dispose",et)};K.addEventListener("dispose",et),T.__depthDisposeCallback=et}T.__boundDepthTexture=K}if(z.depthTexture&&!T.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");At(T.__webglFramebuffer,z)}else if(H){T.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[K]),T.__webglDepthbuffer[K]===void 0)T.__webglDepthbuffer[K]=r.createRenderbuffer(),ot(T.__webglDepthbuffer[K],z,!1);else{const et=z.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,j=T.__webglDepthbuffer[K];r.bindRenderbuffer(r.RENDERBUFFER,j),r.framebufferRenderbuffer(r.FRAMEBUFFER,et,r.RENDERBUFFER,j)}}else if(e.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=r.createRenderbuffer(),ot(T.__webglDepthbuffer,z,!1);else{const K=z.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,et=T.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,et),r.framebufferRenderbuffer(r.FRAMEBUFFER,K,r.RENDERBUFFER,et)}e.bindFramebuffer(r.FRAMEBUFFER,null)}function Lt(z,T,H){const K=n.get(z);T!==void 0&&St(K.__webglFramebuffer,z,z.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),H!==void 0&&kt(z)}function Kt(z){const T=z.texture,H=n.get(z),K=n.get(T);z.addEventListener("dispose",w);const et=z.textures,j=z.isWebGLCubeRenderTarget===!0,Et=et.length>1;if(Et||(K.__webglTexture===void 0&&(K.__webglTexture=r.createTexture()),K.__version=T.version,o.memory.textures++),j){H.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(T.mipmaps&&T.mipmaps.length>0){H.__webglFramebuffer[ft]=[];for(let gt=0;gt<T.mipmaps.length;gt++)H.__webglFramebuffer[ft][gt]=r.createFramebuffer()}else H.__webglFramebuffer[ft]=r.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){H.__webglFramebuffer=[];for(let ft=0;ft<T.mipmaps.length;ft++)H.__webglFramebuffer[ft]=r.createFramebuffer()}else H.__webglFramebuffer=r.createFramebuffer();if(Et)for(let ft=0,gt=et.length;ft<gt;ft++){const Xt=n.get(et[ft]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=r.createTexture(),o.memory.textures++)}if(z.samples>0&&yt(z)===!1){H.__webglMultisampledFramebuffer=r.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ft=0;ft<et.length;ft++){const gt=et[ft];H.__webglColorRenderbuffer[ft]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,H.__webglColorRenderbuffer[ft]);const Xt=s.convert(gt.format,gt.colorSpace),st=s.convert(gt.type),wt=v(gt.internalFormat,Xt,st,gt.colorSpace,z.isXRRenderTarget===!0),Ot=it(z);r.renderbufferStorageMultisample(r.RENDERBUFFER,Ot,wt,z.width,z.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ft,r.RENDERBUFFER,H.__webglColorRenderbuffer[ft])}r.bindRenderbuffer(r.RENDERBUFFER,null),z.depthBuffer&&(H.__webglDepthRenderbuffer=r.createRenderbuffer(),ot(H.__webglDepthRenderbuffer,z,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(j){e.bindTexture(r.TEXTURE_CUBE_MAP,K.__webglTexture),ct(r.TEXTURE_CUBE_MAP,T);for(let ft=0;ft<6;ft++)if(T.mipmaps&&T.mipmaps.length>0)for(let gt=0;gt<T.mipmaps.length;gt++)St(H.__webglFramebuffer[ft][gt],z,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ft,gt);else St(H.__webglFramebuffer[ft],z,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);m(T)&&g(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Et){for(let ft=0,gt=et.length;ft<gt;ft++){const Xt=et[ft],st=n.get(Xt);e.bindTexture(r.TEXTURE_2D,st.__webglTexture),ct(r.TEXTURE_2D,Xt),St(H.__webglFramebuffer,z,Xt,r.COLOR_ATTACHMENT0+ft,r.TEXTURE_2D,0),m(Xt)&&g(r.TEXTURE_2D)}e.unbindTexture()}else{let ft=r.TEXTURE_2D;if((z.isWebGL3DRenderTarget||z.isWebGLArrayRenderTarget)&&(ft=z.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(ft,K.__webglTexture),ct(ft,T),T.mipmaps&&T.mipmaps.length>0)for(let gt=0;gt<T.mipmaps.length;gt++)St(H.__webglFramebuffer[gt],z,T,r.COLOR_ATTACHMENT0,ft,gt);else St(H.__webglFramebuffer,z,T,r.COLOR_ATTACHMENT0,ft,0);m(T)&&g(ft),e.unbindTexture()}z.depthBuffer&&kt(z)}function Q(z){const T=z.textures;for(let H=0,K=T.length;H<K;H++){const et=T[H];if(m(et)){const j=y(z),Et=n.get(et).__webglTexture;e.bindTexture(j,Et),g(j),e.unbindTexture()}}}const at=[],L=[];function Ct(z){if(z.samples>0){if(yt(z)===!1){const T=z.textures,H=z.width,K=z.height;let et=r.COLOR_BUFFER_BIT;const j=z.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Et=n.get(z),ft=T.length>1;if(ft)for(let gt=0;gt<T.length;gt++)e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+gt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+gt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let gt=0;gt<T.length;gt++){if(z.resolveDepthBuffer&&(z.depthBuffer&&(et|=r.DEPTH_BUFFER_BIT),z.stencilBuffer&&z.resolveStencilBuffer&&(et|=r.STENCIL_BUFFER_BIT)),ft){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Et.__webglColorRenderbuffer[gt]);const Xt=n.get(T[gt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Xt,0)}r.blitFramebuffer(0,0,H,K,0,0,H,K,et,r.NEAREST),l===!0&&(at.length=0,L.length=0,at.push(r.COLOR_ATTACHMENT0+gt),z.depthBuffer&&z.resolveDepthBuffer===!1&&(at.push(j),L.push(j),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,L)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,at))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ft)for(let gt=0;gt<T.length;gt++){e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+gt,r.RENDERBUFFER,Et.__webglColorRenderbuffer[gt]);const Xt=n.get(T[gt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+gt,r.TEXTURE_2D,Xt,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}else if(z.depthBuffer&&z.resolveDepthBuffer===!1&&l){const T=z.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[T])}}}function it(z){return Math.min(i.maxSamples,z.samples)}function yt(z){const T=n.get(z);return z.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function ht(z){const T=o.render.frame;h.get(z)!==T&&(h.set(z,T),z.update())}function Nt(z,T){const H=z.colorSpace,K=z.format,et=z.type;return z.isCompressedTexture===!0||z.isVideoTexture===!0||H!==Ms&&H!==qn&&(Jt.getTransfer(H)===le?(K!==Ne||et!==Tn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),T}function xt(z){return typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement?(c.width=z.naturalWidth||z.width,c.height=z.naturalHeight||z.height):typeof VideoFrame<"u"&&z instanceof VideoFrame?(c.width=z.displayWidth,c.height=z.displayHeight):(c.width=z.width,c.height=z.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=N,this.setTexture2D=O,this.setTexture2DArray=U,this.setTexture3D=Y,this.setTextureCube=k,this.rebindTextures=Lt,this.setupRenderTarget=Kt,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=Ct,this.setupDepthRenderbuffer=kt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=yt}function gp(r,t){function e(n,i=qn){let s;const o=Jt.getTransfer(i);if(n===Tn)return r.UNSIGNED_BYTE;if(n===zl)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Ll)return r.UNSIGNED_SHORT_5_5_5_1;if(n===kh)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Dh)return r.BYTE;if(n===Uh)return r.SHORT;if(n===sr)return r.UNSIGNED_SHORT;if(n===Il)return r.INT;if(n===vi)return r.UNSIGNED_INT;if(n===an)return r.FLOAT;if(n===pn)return r.HALF_FLOAT;if(n===Nh)return r.ALPHA;if(n===Fh)return r.RGB;if(n===Ne)return r.RGBA;if(n===Oh)return r.LUMINANCE;if(n===Bh)return r.LUMINANCE_ALPHA;if(n===fs)return r.DEPTH_COMPONENT;if(n===ki)return r.DEPTH_STENCIL;if(n===Dl)return r.RED;if(n===fo)return r.RED_INTEGER;if(n===Vh)return r.RG;if(n===Ul)return r.RG_INTEGER;if(n===kl)return r.RGBA_INTEGER;if(n===kr||n===Nr||n===Fr||n===Or)if(o===le)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===kr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Nr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Fr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Or)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===kr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Nr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Fr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Or)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Xa||n===qa||n===Ya||n===$a)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Xa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===qa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ya)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===$a)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Za||n===Ka||n===ja)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Za||n===Ka)return o===le?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===ja)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ja||n===Qa||n===tl||n===el||n===nl||n===il||n===sl||n===rl||n===ol||n===al||n===ll||n===cl||n===hl||n===ul)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Ja)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Qa)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===tl)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===el)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===nl)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===il)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===sl)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===rl)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ol)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===al)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ll)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===cl)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===hl)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ul)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Br||n===dl||n===fl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Br)return o===le?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===dl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===fl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Hh||n===pl||n===ml||n===gl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Br)return s.COMPRESSED_RED_RGTC1_EXT;if(n===pl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ml)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===gl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ui?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:e}}class xp extends Ue{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Zn extends ie{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Iy={type:"move"};class Oc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),g=this._getHandJoint(c,x);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Iy)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Zn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const zy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ly=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Dy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new Me,s=t.properties.get(i);s.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new ge({vertexShader:zy,fragmentShader:Ly,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ue(new bs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Uy extends Qn{constructor(t,e){super();const n=this;let i=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null;const x=new Dy,m=e.getContextAttributes();let g=null,y=null;const v=[],_=[],E=new Z;let b=null;const w=new Ue;w.viewport=new ne;const C=new Ue;C.viewport=new ne;const S=[w,C],M=new xp;let P=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let rt=v[J];return rt===void 0&&(rt=new Oc,v[J]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(J){let rt=v[J];return rt===void 0&&(rt=new Oc,v[J]=rt),rt.getGripSpace()},this.getHand=function(J){let rt=v[J];return rt===void 0&&(rt=new Oc,v[J]=rt),rt.getHandSpace()};function I(J){const rt=_.indexOf(J.inputSource);if(rt===-1)return;const St=v[rt];St!==void 0&&(St.update(J.inputSource,J.frame,c||o),St.dispatchEvent({type:J.type,data:J.inputSource}))}function D(){i.removeEventListener("select",I),i.removeEventListener("selectstart",I),i.removeEventListener("selectend",I),i.removeEventListener("squeeze",I),i.removeEventListener("squeezestart",I),i.removeEventListener("squeezeend",I),i.removeEventListener("end",D),i.removeEventListener("inputsourceschange",O);for(let J=0;J<v.length;J++){const rt=_[J];rt!==null&&(_[J]=null,v[J].disconnect(rt))}P=null,N=null,x.reset(),t.setRenderTarget(g),f=null,d=null,u=null,i=null,y=null,te.stop(),n.isPresenting=!1,t.setPixelRatio(b),t.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(g=t.getRenderTarget(),i.addEventListener("select",I),i.addEventListener("selectstart",I),i.addEventListener("selectend",I),i.addEventListener("squeeze",I),i.addEventListener("squeezestart",I),i.addEventListener("squeezeend",I),i.addEventListener("end",D),i.addEventListener("inputsourceschange",O),m.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(E),i.renderState.layers===void 0){const rt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,e,rt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new ke(f.framebufferWidth,f.framebufferHeight,{format:Ne,type:Tn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let rt=null,St=null,ot=null;m.depth&&(ot=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,rt=m.stencil?ki:fs,St=m.stencil?Ui:vi);const At={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:s};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(At),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new ke(d.textureWidth,d.textureHeight,{format:Ne,type:Tn,depthTexture:new Vl(d.textureWidth,d.textureHeight,St,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),te.setContext(i),te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function O(J){for(let rt=0;rt<J.removed.length;rt++){const St=J.removed[rt],ot=_.indexOf(St);ot>=0&&(_[ot]=null,v[ot].disconnect(St))}for(let rt=0;rt<J.added.length;rt++){const St=J.added[rt];let ot=_.indexOf(St);if(ot===-1){for(let kt=0;kt<v.length;kt++)if(kt>=_.length){_.push(St),ot=kt;break}else if(_[kt]===null){_[kt]=St,ot=kt;break}if(ot===-1)break}const At=v[ot];At&&At.connect(St)}}const U=new R,Y=new R;function k(J,rt,St){U.setFromMatrixPosition(rt.matrixWorld),Y.setFromMatrixPosition(St.matrixWorld);const ot=U.distanceTo(Y),At=rt.projectionMatrix.elements,kt=St.projectionMatrix.elements,Lt=At[14]/(At[10]-1),Kt=At[14]/(At[10]+1),Q=(At[9]+1)/At[5],at=(At[9]-1)/At[5],L=(At[8]-1)/At[0],Ct=(kt[8]+1)/kt[0],it=Lt*L,yt=Lt*Ct,ht=ot/(-L+Ct),Nt=ht*-L;if(rt.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Nt),J.translateZ(ht),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),At[10]===-1)J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const xt=Lt+ht,z=Kt+ht,T=it-Nt,H=yt+(ot-Nt),K=Q*Kt/z*xt,et=at*Kt/z*xt;J.projectionMatrix.makePerspective(T,H,K,et,xt,z),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function X(J,rt){rt===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(rt.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;let rt=J.near,St=J.far;x.texture!==null&&(x.depthNear>0&&(rt=x.depthNear),x.depthFar>0&&(St=x.depthFar)),M.near=C.near=w.near=rt,M.far=C.far=w.far=St,(P!==M.near||N!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,N=M.far),w.layers.mask=J.layers.mask|2,C.layers.mask=J.layers.mask|4,M.layers.mask=w.layers.mask|C.layers.mask;const ot=J.parent,At=M.cameras;X(M,ot);for(let kt=0;kt<At.length;kt++)X(At[kt],ot);At.length===2?k(M,w,C):M.projectionMatrix.copy(w.projectionMatrix),$(J,M,ot)};function $(J,rt,St){St===null?J.matrix.copy(rt.matrixWorld):(J.matrix.copy(St.matrixWorld),J.matrix.invert(),J.matrix.multiply(rt.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=rr*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(M)};let nt=null;function ct(J,rt){if(h=rt.getViewerPose(c||o),p=rt,h!==null){const St=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let ot=!1;St.length!==M.cameras.length&&(M.cameras.length=0,ot=!0);for(let kt=0;kt<St.length;kt++){const Lt=St[kt];let Kt=null;if(f!==null)Kt=f.getViewport(Lt);else{const at=u.getViewSubImage(d,Lt);Kt=at.viewport,kt===0&&(t.setRenderTargetTextures(y,at.colorTexture,d.ignoreDepthValues?void 0:at.depthStencilTexture),t.setRenderTarget(y))}let Q=S[kt];Q===void 0&&(Q=new Ue,Q.layers.enable(kt),Q.viewport=new ne,S[kt]=Q),Q.matrix.fromArray(Lt.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(Lt.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(Kt.x,Kt.y,Kt.width,Kt.height),kt===0&&(M.matrix.copy(Q.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ot===!0&&M.cameras.push(Q)}const At=i.enabledFeatures;if(At&&At.includes("depth-sensing")){const kt=u.getDepthInformation(St[0]);kt&&kt.isValid&&kt.texture&&x.init(t,kt,i.renderState)}}for(let St=0;St<v.length;St++){const ot=_[St],At=v[St];ot!==null&&At!==void 0&&At.update(ot,rt,c||o)}nt&&nt(J,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),p=null}const te=new up;te.setAnimationLoop(ct),this.setAnimationLoop=function(J){nt=J},this.dispose=function(){}}}const $i=new xn,ky=new Ut;function Ny(r,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,lp(r)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,y,v,_){g.isMeshBasicMaterial||g.isMeshLambertMaterial?s(m,g):g.isMeshToonMaterial?(s(m,g),u(m,g)):g.isMeshPhongMaterial?(s(m,g),h(m,g)):g.isMeshStandardMaterial?(s(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,_)):g.isMeshMatcapMaterial?(s(m,g),p(m,g)):g.isMeshDepthMaterial?s(m,g):g.isMeshDistanceMaterial?(s(m,g),x(m,g)):g.isMeshNormalMaterial?s(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?l(m,g,y,v):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===We&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===We&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const y=t.get(g),v=y.envMap,_=y.envMapRotation;v&&(m.envMap.value=v,$i.copy(_),$i.x*=-1,$i.y*=-1,$i.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&($i.y*=-1,$i.z*=-1),m.envMapRotation.value.setFromMatrix4(ky.makeRotationFromEuler($i)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,y,v){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*y,m.scale.value=v*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,y){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===We&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function x(m,g){const y=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Fy(r,t,e,n){let i={},s={},o=[];const a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,v){const _=v.program;n.uniformBlockBinding(y,_)}function c(y,v){let _=i[y.id];_===void 0&&(p(y),_=h(y),i[y.id]=_,y.addEventListener("dispose",m));const E=v.program;n.updateUBOMapping(y,E);const b=t.render.frame;s[y.id]!==b&&(d(y),s[y.id]=b)}function h(y){const v=u();y.__bindingPointIndex=v;const _=r.createBuffer(),E=y.__size,b=y.usage;return r.bindBuffer(r.UNIFORM_BUFFER,_),r.bufferData(r.UNIFORM_BUFFER,E,b),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,v,_),_}function u(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const v=i[y.id],_=y.uniforms,E=y.__cache;r.bindBuffer(r.UNIFORM_BUFFER,v);for(let b=0,w=_.length;b<w;b++){const C=Array.isArray(_[b])?_[b]:[_[b]];for(let S=0,M=C.length;S<M;S++){const P=C[S];if(f(P,b,S,E)===!0){const N=P.__offset,I=Array.isArray(P.value)?P.value:[P.value];let D=0;for(let O=0;O<I.length;O++){const U=I[O],Y=x(U);typeof U=="number"||typeof U=="boolean"?(P.__data[0]=U,r.bufferSubData(r.UNIFORM_BUFFER,N+D,P.__data)):U.isMatrix3?(P.__data[0]=U.elements[0],P.__data[1]=U.elements[1],P.__data[2]=U.elements[2],P.__data[3]=0,P.__data[4]=U.elements[3],P.__data[5]=U.elements[4],P.__data[6]=U.elements[5],P.__data[7]=0,P.__data[8]=U.elements[6],P.__data[9]=U.elements[7],P.__data[10]=U.elements[8],P.__data[11]=0):(U.toArray(P.__data,D),D+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,N,P.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(y,v,_,E){const b=y.value,w=v+"_"+_;if(E[w]===void 0)return typeof b=="number"||typeof b=="boolean"?E[w]=b:E[w]=b.clone(),!0;{const C=E[w];if(typeof b=="number"||typeof b=="boolean"){if(C!==b)return E[w]=b,!0}else if(C.equals(b)===!1)return C.copy(b),!0}return!1}function p(y){const v=y.uniforms;let _=0;const E=16;for(let w=0,C=v.length;w<C;w++){const S=Array.isArray(v[w])?v[w]:[v[w]];for(let M=0,P=S.length;M<P;M++){const N=S[M],I=Array.isArray(N.value)?N.value:[N.value];for(let D=0,O=I.length;D<O;D++){const U=I[D],Y=x(U),k=_%E,X=k%Y.boundary,$=k+X;_+=X,$!==0&&E-$<Y.storage&&(_+=E-$),N.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=_,_+=Y.storage}}}const b=_%E;return b>0&&(_+=E-b),y.__size=_,y.__cache={},this}function x(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function m(y){const v=y.target;v.removeEventListener("dispose",m);const _=o.indexOf(v.__bindingPointIndex);o.splice(_,1),r.deleteBuffer(i[v.id]),delete i[v.id],delete s[v.id]}function g(){for(const y in i)r.deleteBuffer(i[y]);o=[],i={},s={}}return{bind:l,update:c,dispose:g}}class vp{constructor(t={}){const{canvas:e=sp(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const p=new Uint32Array(4),x=new Int32Array(4);let m=null,g=null;const y=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=De,this.toneMapping=pi,this.toneMappingExposure=1;const _=this;let E=!1,b=0,w=0,C=null,S=-1,M=null;const P=new ne,N=new ne;let I=null;const D=new dt(0);let O=0,U=e.width,Y=e.height,k=1,X=null,$=null;const nt=new ne(0,0,U,Y),ct=new ne(0,0,U,Y);let te=!1;const J=new go;let rt=!1,St=!1;const ot=new Ut,At=new Ut,kt=new R,Lt=new ne,Kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Q=!1;function at(){return C===null?k:1}let L=n;function Ct(A,B){return e.getContext(A,B)}try{const A={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Cl}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",Mt,!1),e.addEventListener("webglcontextcreationerror",vt,!1),L===null){const B="webgl2";if(L=Ct(B,A),L===null)throw Ct(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let it,yt,ht,Nt,xt,z,T,H,K,et,j,Et,ft,gt,Xt,st,wt,Ot,Bt,Tt,jt,Vt,se,F;function pt(){it=new Wv(L),it.init(),Vt=new gp(L,it),yt=new Fv(L,it,t,Vt),ht=new wy(L,it),yt.reverseDepthBuffer&&d&&ht.buffers.depth.setReversed(!0),Nt=new Yv(L),xt=new uy,z=new Py(L,it,ht,xt,yt,Vt,Nt),T=new Bv(_),H=new Gv(_),K=new t0(L),se=new kv(L,K),et=new Xv(L,K,Nt,se),j=new Zv(L,et,K,Nt),Bt=new $v(L,yt,z),st=new Ov(xt),Et=new hy(_,T,H,it,yt,se,st),ft=new Ny(_,xt),gt=new fy,Xt=new _y(it),Ot=new Uv(_,T,H,ht,j,f,l),wt=new by(_,j,yt),F=new Fy(L,Nt,yt,ht),Tt=new Nv(L,it,Nt),jt=new qv(L,it,Nt),Nt.programs=Et.programs,_.capabilities=yt,_.extensions=it,_.properties=xt,_.renderLists=gt,_.shadowMap=wt,_.state=ht,_.info=Nt}pt();const q=new Uy(_,L);this.xr=q,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const A=it.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=it.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(A){A!==void 0&&(k=A,this.setSize(U,Y,!1))},this.getSize=function(A){return A.set(U,Y)},this.setSize=function(A,B,G=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=A,Y=B,e.width=Math.floor(A*k),e.height=Math.floor(B*k),G===!0&&(e.style.width=A+"px",e.style.height=B+"px"),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(U*k,Y*k).floor()},this.setDrawingBufferSize=function(A,B,G){U=A,Y=B,k=G,e.width=Math.floor(A*G),e.height=Math.floor(B*G),this.setViewport(0,0,A,B)},this.getCurrentViewport=function(A){return A.copy(P)},this.getViewport=function(A){return A.copy(nt)},this.setViewport=function(A,B,G,W){A.isVector4?nt.set(A.x,A.y,A.z,A.w):nt.set(A,B,G,W),ht.viewport(P.copy(nt).multiplyScalar(k).round())},this.getScissor=function(A){return A.copy(ct)},this.setScissor=function(A,B,G,W){A.isVector4?ct.set(A.x,A.y,A.z,A.w):ct.set(A,B,G,W),ht.scissor(N.copy(ct).multiplyScalar(k).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(A){ht.setScissorTest(te=A)},this.setOpaqueSort=function(A){X=A},this.setTransparentSort=function(A){$=A},this.getClearColor=function(A){return A.copy(Ot.getClearColor())},this.setClearColor=function(){Ot.setClearColor.apply(Ot,arguments)},this.getClearAlpha=function(){return Ot.getClearAlpha()},this.setClearAlpha=function(){Ot.setClearAlpha.apply(Ot,arguments)},this.clear=function(A=!0,B=!0,G=!0){let W=0;if(A){let V=!1;if(C!==null){const lt=C.texture.format;V=lt===kl||lt===Ul||lt===fo}if(V){const lt=C.texture.type,_t=lt===Tn||lt===vi||lt===sr||lt===Ui||lt===zl||lt===Ll,Pt=Ot.getClearColor(),It=Ot.getClearAlpha(),Ht=Pt.r,$t=Pt.g,zt=Pt.b;_t?(p[0]=Ht,p[1]=$t,p[2]=zt,p[3]=It,L.clearBufferuiv(L.COLOR,0,p)):(x[0]=Ht,x[1]=$t,x[2]=zt,x[3]=It,L.clearBufferiv(L.COLOR,0,x))}else W|=L.COLOR_BUFFER_BIT}B&&(W|=L.DEPTH_BUFFER_BIT),G&&(W|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",Mt,!1),e.removeEventListener("webglcontextcreationerror",vt,!1),gt.dispose(),Xt.dispose(),xt.dispose(),T.dispose(),H.dispose(),j.dispose(),se.dispose(),F.dispose(),Et.dispose(),q.dispose(),q.removeEventListener("sessionstart",bu),q.removeEventListener("sessionend",Su),Hi.stop()};function tt(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function Mt(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const A=Nt.autoReset,B=wt.enabled,G=wt.autoUpdate,W=wt.needsUpdate,V=wt.type;pt(),Nt.autoReset=A,wt.enabled=B,wt.autoUpdate=G,wt.needsUpdate=W,wt.type=V}function vt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Yt(A){const B=A.target;B.removeEventListener("dispose",Yt),ve(B)}function ve(A){Fe(A),xt.remove(A)}function Fe(A){const B=xt.get(A).programs;B!==void 0&&(B.forEach(function(G){Et.releaseProgram(G)}),A.isShaderMaterial&&Et.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,G,W,V,lt){B===null&&(B=Kt);const _t=V.isMesh&&V.matrixWorld.determinant()<0,Pt=Mm(A,B,G,W,V);ht.setMaterial(W,_t);let It=G.index,Ht=1;if(W.wireframe===!0){if(It=et.getWireframeAttribute(G),It===void 0)return;Ht=2}const $t=G.drawRange,zt=G.attributes.position;let re=$t.start*Ht,de=($t.start+$t.count)*Ht;lt!==null&&(re=Math.max(re,lt.start*Ht),de=Math.min(de,(lt.start+lt.count)*Ht)),It!==null?(re=Math.max(re,0),de=Math.min(de,It.count)):zt!=null&&(re=Math.max(re,0),de=Math.min(de,zt.count));const fe=de-re;if(fe<0||fe===1/0)return;se.setup(V,W,Pt,G,It);let en,oe=Tt;if(It!==null&&(en=K.get(It),oe=jt,oe.setIndex(en)),V.isMesh)W.wireframe===!0?(ht.setLineWidth(W.wireframeLinewidth*at()),oe.setMode(L.LINES)):oe.setMode(L.TRIANGLES);else if(V.isLine){let Dt=W.linewidth;Dt===void 0&&(Dt=1),ht.setLineWidth(Dt*at()),V.isLineSegments?oe.setMode(L.LINES):V.isLineLoop?oe.setMode(L.LINE_LOOP):oe.setMode(L.LINE_STRIP)}else V.isPoints?oe.setMode(L.POINTS):V.isSprite&&oe.setMode(L.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)oe.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(it.get("WEBGL_multi_draw"))oe.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Dt=V._multiDrawStarts,ei=V._multiDrawCounts,ae=V._multiDrawCount,An=It?K.get(It).bytesPerElement:1,Cs=xt.get(W).currentProgram.getUniforms();for(let hn=0;hn<ae;hn++)Cs.setValue(L,"_gl_DrawID",hn),oe.render(Dt[hn]/An,ei[hn])}else if(V.isInstancedMesh)oe.renderInstances(re,fe,V.count);else if(G.isInstancedBufferGeometry){const Dt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,ei=Math.min(G.instanceCount,Dt);oe.renderInstances(re,fe,ei)}else oe.render(re,fe)};function ce(A,B,G){A.transparent===!0&&A.side===yn&&A.forceSinglePass===!1?(A.side=We,A.needsUpdate=!0,Ao(A,B,G),A.side=gi,A.needsUpdate=!0,Ao(A,B,G),A.side=yn):Ao(A,B,G)}this.compile=function(A,B,G=null){G===null&&(G=A),g=Xt.get(G),g.init(B),v.push(g),G.traverseVisible(function(V){V.isLight&&V.layers.test(B.layers)&&(g.pushLight(V),V.castShadow&&g.pushShadow(V))}),A!==G&&A.traverseVisible(function(V){V.isLight&&V.layers.test(B.layers)&&(g.pushLight(V),V.castShadow&&g.pushShadow(V))}),g.setupLights();const W=new Set;return A.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const lt=V.material;if(lt)if(Array.isArray(lt))for(let _t=0;_t<lt.length;_t++){const Pt=lt[_t];ce(Pt,G,V),W.add(Pt)}else ce(lt,G,V),W.add(lt)}),v.pop(),g=null,W},this.compileAsync=function(A,B,G=null){const W=this.compile(A,B,G);return new Promise(V=>{function lt(){if(W.forEach(function(_t){xt.get(_t).currentProgram.isReady()&&W.delete(_t)}),W.size===0){V(A);return}setTimeout(lt,10)}it.get("KHR_parallel_shader_compile")!==null?lt():setTimeout(lt,10)})};let En=null;function ti(A){En&&En(A)}function bu(){Hi.stop()}function Su(){Hi.start()}const Hi=new up;Hi.setAnimationLoop(ti),typeof self<"u"&&Hi.setContext(self),this.setAnimationLoop=function(A){En=A,q.setAnimationLoop(A),A===null?Hi.stop():Hi.start()},q.addEventListener("sessionstart",bu),q.addEventListener("sessionend",Su),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(B),B=q.getCamera()),A.isScene===!0&&A.onBeforeRender(_,A,B,C),g=Xt.get(A,v.length),g.init(B),v.push(g),At.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),J.setFromProjectionMatrix(At),St=this.localClippingEnabled,rt=st.init(this.clippingPlanes,St),m=gt.get(A,y.length),m.init(),y.push(m),q.enabled===!0&&q.isPresenting===!0){const lt=_.xr.getDepthSensingMesh();lt!==null&&dc(lt,B,-1/0,_.sortObjects)}dc(A,B,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(X,$),Q=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Q&&Ot.addToRenderList(m,A),this.info.render.frame++,rt===!0&&st.beginShadows();const G=g.state.shadowsArray;wt.render(G,A,B),rt===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,V=m.transmissive;if(g.setupLights(),B.isArrayCamera){const lt=B.cameras;if(V.length>0)for(let _t=0,Pt=lt.length;_t<Pt;_t++){const It=lt[_t];Tu(W,V,A,It)}Q&&Ot.render(A);for(let _t=0,Pt=lt.length;_t<Pt;_t++){const It=lt[_t];wu(m,A,It,It.viewport)}}else V.length>0&&Tu(W,V,A,B),Q&&Ot.render(A),wu(m,A,B);C!==null&&(z.updateMultisampleRenderTarget(C),z.updateRenderTargetMipmap(C)),A.isScene===!0&&A.onAfterRender(_,A,B),se.resetDefaultState(),S=-1,M=null,v.pop(),v.length>0?(g=v[v.length-1],rt===!0&&st.setGlobalState(_.clippingPlanes,g.state.camera)):g=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function dc(A,B,G,W){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)G=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLight)g.pushLight(A),A.castShadow&&g.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||J.intersectsSprite(A)){W&&Lt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(At);const _t=j.update(A),Pt=A.material;Pt.visible&&m.push(A,_t,Pt,G,Lt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||J.intersectsObject(A))){const _t=j.update(A),Pt=A.material;if(W&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Lt.copy(A.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),Lt.copy(_t.boundingSphere.center)),Lt.applyMatrix4(A.matrixWorld).applyMatrix4(At)),Array.isArray(Pt)){const It=_t.groups;for(let Ht=0,$t=It.length;Ht<$t;Ht++){const zt=It[Ht],re=Pt[zt.materialIndex];re&&re.visible&&m.push(A,_t,re,G,Lt.z,zt)}}else Pt.visible&&m.push(A,_t,Pt,G,Lt.z,null)}}const lt=A.children;for(let _t=0,Pt=lt.length;_t<Pt;_t++)dc(lt[_t],B,G,W)}function wu(A,B,G,W){const V=A.opaque,lt=A.transmissive,_t=A.transparent;g.setupLightsView(G),rt===!0&&st.setGlobalState(_.clippingPlanes,G),W&&ht.viewport(P.copy(W)),V.length>0&&Eo(V,B,G),lt.length>0&&Eo(lt,B,G),_t.length>0&&Eo(_t,B,G),ht.buffers.depth.setTest(!0),ht.buffers.depth.setMask(!0),ht.buffers.color.setMask(!0),ht.setPolygonOffset(!1)}function Tu(A,B,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[W.id]===void 0&&(g.state.transmissionRenderTarget[W.id]=new ke(1,1,{generateMipmaps:!0,type:it.has("EXT_color_buffer_half_float")||it.has("EXT_color_buffer_float")?pn:Tn,minFilter:kn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Jt.workingColorSpace}));const lt=g.state.transmissionRenderTarget[W.id],_t=W.viewport||P;lt.setSize(_t.z,_t.w);const Pt=_.getRenderTarget();_.setRenderTarget(lt),_.getClearColor(D),O=_.getClearAlpha(),O<1&&_.setClearColor(16777215,.5),_.clear(),Q&&Ot.render(G);const It=_.toneMapping;_.toneMapping=pi;const Ht=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),g.setupLightsView(W),rt===!0&&st.setGlobalState(_.clippingPlanes,W),Eo(A,G,W),z.updateMultisampleRenderTarget(lt),z.updateRenderTargetMipmap(lt),it.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let zt=0,re=B.length;zt<re;zt++){const de=B[zt],fe=de.object,en=de.geometry,oe=de.material,Dt=de.group;if(oe.side===yn&&fe.layers.test(W.layers)){const ei=oe.side;oe.side=We,oe.needsUpdate=!0,Eu(fe,G,W,en,oe,Dt),oe.side=ei,oe.needsUpdate=!0,$t=!0}}$t===!0&&(z.updateMultisampleRenderTarget(lt),z.updateRenderTargetMipmap(lt))}_.setRenderTarget(Pt),_.setClearColor(D,O),Ht!==void 0&&(W.viewport=Ht),_.toneMapping=It}function Eo(A,B,G){const W=B.isScene===!0?B.overrideMaterial:null;for(let V=0,lt=A.length;V<lt;V++){const _t=A[V],Pt=_t.object,It=_t.geometry,Ht=W===null?_t.material:W,$t=_t.group;Pt.layers.test(G.layers)&&Eu(Pt,B,G,It,Ht,$t)}}function Eu(A,B,G,W,V,lt){A.onBeforeRender(_,B,G,W,V,lt),A.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),V.onBeforeRender(_,B,G,W,A,lt),V.transparent===!0&&V.side===yn&&V.forceSinglePass===!1?(V.side=We,V.needsUpdate=!0,_.renderBufferDirect(G,B,W,V,A,lt),V.side=gi,V.needsUpdate=!0,_.renderBufferDirect(G,B,W,V,A,lt),V.side=yn):_.renderBufferDirect(G,B,W,V,A,lt),A.onAfterRender(_,B,G,W,V,lt)}function Ao(A,B,G){B.isScene!==!0&&(B=Kt);const W=xt.get(A),V=g.state.lights,lt=g.state.shadowsArray,_t=V.state.version,Pt=Et.getParameters(A,V.state,lt,B,G),It=Et.getProgramCacheKey(Pt);let Ht=W.programs;W.environment=A.isMeshStandardMaterial?B.environment:null,W.fog=B.fog,W.envMap=(A.isMeshStandardMaterial?H:T).get(A.envMap||W.environment),W.envMapRotation=W.environment!==null&&A.envMap===null?B.environmentRotation:A.envMapRotation,Ht===void 0&&(A.addEventListener("dispose",Yt),Ht=new Map,W.programs=Ht);let $t=Ht.get(It);if($t!==void 0){if(W.currentProgram===$t&&W.lightsStateVersion===_t)return Cu(A,Pt),$t}else Pt.uniforms=Et.getUniforms(A),A.onBeforeCompile(Pt,_),$t=Et.acquireProgram(Pt,It),Ht.set(It,$t),W.uniforms=Pt.uniforms;const zt=W.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(zt.clippingPlanes=st.uniform),Cu(A,Pt),W.needsLights=Sm(A),W.lightsStateVersion=_t,W.needsLights&&(zt.ambientLightColor.value=V.state.ambient,zt.lightProbe.value=V.state.probe,zt.directionalLights.value=V.state.directional,zt.directionalLightShadows.value=V.state.directionalShadow,zt.spotLights.value=V.state.spot,zt.spotLightShadows.value=V.state.spotShadow,zt.rectAreaLights.value=V.state.rectArea,zt.ltc_1.value=V.state.rectAreaLTC1,zt.ltc_2.value=V.state.rectAreaLTC2,zt.pointLights.value=V.state.point,zt.pointLightShadows.value=V.state.pointShadow,zt.hemisphereLights.value=V.state.hemi,zt.directionalShadowMap.value=V.state.directionalShadowMap,zt.directionalShadowMatrix.value=V.state.directionalShadowMatrix,zt.spotShadowMap.value=V.state.spotShadowMap,zt.spotLightMatrix.value=V.state.spotLightMatrix,zt.spotLightMap.value=V.state.spotLightMap,zt.pointShadowMap.value=V.state.pointShadowMap,zt.pointShadowMatrix.value=V.state.pointShadowMatrix),W.currentProgram=$t,W.uniformsList=null,$t}function Au(A){if(A.uniformsList===null){const B=A.currentProgram.getUniforms();A.uniformsList=Aa.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function Cu(A,B){const G=xt.get(A);G.outputColorSpace=B.outputColorSpace,G.batching=B.batching,G.batchingColor=B.batchingColor,G.instancing=B.instancing,G.instancingColor=B.instancingColor,G.instancingMorph=B.instancingMorph,G.skinning=B.skinning,G.morphTargets=B.morphTargets,G.morphNormals=B.morphNormals,G.morphColors=B.morphColors,G.morphTargetsCount=B.morphTargetsCount,G.numClippingPlanes=B.numClippingPlanes,G.numIntersection=B.numClipIntersection,G.vertexAlphas=B.vertexAlphas,G.vertexTangents=B.vertexTangents,G.toneMapping=B.toneMapping}function Mm(A,B,G,W,V){B.isScene!==!0&&(B=Kt),z.resetTextureUnits();const lt=B.fog,_t=W.isMeshStandardMaterial?B.environment:null,Pt=C===null?_.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Ms,It=(W.isMeshStandardMaterial?H:T).get(W.envMap||_t),Ht=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,$t=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),zt=!!G.morphAttributes.position,re=!!G.morphAttributes.normal,de=!!G.morphAttributes.color;let fe=pi;W.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(fe=_.toneMapping);const en=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,oe=en!==void 0?en.length:0,Dt=xt.get(W),ei=g.state.lights;if(rt===!0&&(St===!0||A!==M)){const vn=A===M&&W.id===S;st.setState(W,A,vn)}let ae=!1;W.version===Dt.__version?(Dt.needsLights&&Dt.lightsStateVersion!==ei.state.version||Dt.outputColorSpace!==Pt||V.isBatchedMesh&&Dt.batching===!1||!V.isBatchedMesh&&Dt.batching===!0||V.isBatchedMesh&&Dt.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Dt.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Dt.instancing===!1||!V.isInstancedMesh&&Dt.instancing===!0||V.isSkinnedMesh&&Dt.skinning===!1||!V.isSkinnedMesh&&Dt.skinning===!0||V.isInstancedMesh&&Dt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Dt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Dt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Dt.instancingMorph===!1&&V.morphTexture!==null||Dt.envMap!==It||W.fog===!0&&Dt.fog!==lt||Dt.numClippingPlanes!==void 0&&(Dt.numClippingPlanes!==st.numPlanes||Dt.numIntersection!==st.numIntersection)||Dt.vertexAlphas!==Ht||Dt.vertexTangents!==$t||Dt.morphTargets!==zt||Dt.morphNormals!==re||Dt.morphColors!==de||Dt.toneMapping!==fe||Dt.morphTargetsCount!==oe)&&(ae=!0):(ae=!0,Dt.__version=W.version);let An=Dt.currentProgram;ae===!0&&(An=Ao(W,B,V));let Cs=!1,hn=!1,mr=!1;const pe=An.getUniforms(),Gn=Dt.uniforms;if(ht.useProgram(An.program)&&(Cs=!0,hn=!0,mr=!0),W.id!==S&&(S=W.id,hn=!0),Cs||M!==A){ht.buffers.depth.getReversed()?(ot.copy(A.projectionMatrix),Tg(ot),Eg(ot),pe.setValue(L,"projectionMatrix",ot)):pe.setValue(L,"projectionMatrix",A.projectionMatrix),pe.setValue(L,"viewMatrix",A.matrixWorldInverse);const yi=pe.map.cameraPosition;yi!==void 0&&yi.setValue(L,kt.setFromMatrixPosition(A.matrixWorld)),yt.logarithmicDepthBuffer&&pe.setValue(L,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&pe.setValue(L,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,hn=!0,mr=!0)}if(V.isSkinnedMesh){pe.setOptional(L,V,"bindMatrix"),pe.setOptional(L,V,"bindMatrixInverse");const vn=V.skeleton;vn&&(vn.boneTexture===null&&vn.computeBoneTexture(),pe.setValue(L,"boneTexture",vn.boneTexture,z))}V.isBatchedMesh&&(pe.setOptional(L,V,"batchingTexture"),pe.setValue(L,"batchingTexture",V._matricesTexture,z),pe.setOptional(L,V,"batchingIdTexture"),pe.setValue(L,"batchingIdTexture",V._indirectTexture,z),pe.setOptional(L,V,"batchingColorTexture"),V._colorsTexture!==null&&pe.setValue(L,"batchingColorTexture",V._colorsTexture,z));const gr=G.morphAttributes;if((gr.position!==void 0||gr.normal!==void 0||gr.color!==void 0)&&Bt.update(V,G,An),(hn||Dt.receiveShadow!==V.receiveShadow)&&(Dt.receiveShadow=V.receiveShadow,pe.setValue(L,"receiveShadow",V.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Gn.envMap.value=It,Gn.flipEnvMap.value=It.isCubeTexture&&It.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&B.environment!==null&&(Gn.envMapIntensity.value=B.environmentIntensity),hn&&(pe.setValue(L,"toneMappingExposure",_.toneMappingExposure),Dt.needsLights&&bm(Gn,mr),lt&&W.fog===!0&&ft.refreshFogUniforms(Gn,lt),ft.refreshMaterialUniforms(Gn,W,k,Y,g.state.transmissionRenderTarget[A.id]),Aa.upload(L,Au(Dt),Gn,z)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Aa.upload(L,Au(Dt),Gn,z),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&pe.setValue(L,"center",V.center),pe.setValue(L,"modelViewMatrix",V.modelViewMatrix),pe.setValue(L,"normalMatrix",V.normalMatrix),pe.setValue(L,"modelMatrix",V.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const vn=W.uniformsGroups;for(let yi=0,Mi=vn.length;yi<Mi;yi++){const Ru=vn[yi];F.update(Ru,An),F.bind(Ru,An)}}return An}function bm(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function Sm(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(A,B,G){xt.get(A.texture).__webglTexture=B,xt.get(A.depthTexture).__webglTexture=G;const W=xt.get(A);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||it.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,B){const G=xt.get(A);G.__webglFramebuffer=B,G.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(A,B=0,G=0){C=A,b=B,w=G;let W=!0,V=null,lt=!1,_t=!1;if(A){const It=xt.get(A);if(It.__useDefaultFramebuffer!==void 0)ht.bindFramebuffer(L.FRAMEBUFFER,null),W=!1;else if(It.__webglFramebuffer===void 0)z.setupRenderTarget(A);else if(It.__hasExternalTextures)z.rebindTextures(A,xt.get(A.texture).__webglTexture,xt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const zt=A.depthTexture;if(It.__boundDepthTexture!==zt){if(zt!==null&&xt.has(zt)&&(A.width!==zt.image.width||A.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(A)}}const Ht=A.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(_t=!0);const $t=xt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray($t[B])?V=$t[B][G]:V=$t[B],lt=!0):A.samples>0&&z.useMultisampledRTT(A)===!1?V=xt.get(A).__webglMultisampledFramebuffer:Array.isArray($t)?V=$t[G]:V=$t,P.copy(A.viewport),N.copy(A.scissor),I=A.scissorTest}else P.copy(nt).multiplyScalar(k).floor(),N.copy(ct).multiplyScalar(k).floor(),I=te;if(ht.bindFramebuffer(L.FRAMEBUFFER,V)&&W&&ht.drawBuffers(A,V),ht.viewport(P),ht.scissor(N),ht.setScissorTest(I),lt){const It=xt.get(A.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+B,It.__webglTexture,G)}else if(_t){const It=xt.get(A.texture),Ht=B||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,It.__webglTexture,G||0,Ht)}S=-1},this.readRenderTargetPixels=function(A,B,G,W,V,lt,_t){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=xt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&_t!==void 0&&(Pt=Pt[_t]),Pt){ht.bindFramebuffer(L.FRAMEBUFFER,Pt);try{const It=A.texture,Ht=It.format,$t=It.type;if(!yt.textureFormatReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!yt.textureTypeReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-W&&G>=0&&G<=A.height-V&&L.readPixels(B,G,W,V,Vt.convert(Ht),Vt.convert($t),lt)}finally{const It=C!==null?xt.get(C).__webglFramebuffer:null;ht.bindFramebuffer(L.FRAMEBUFFER,It)}}},this.readRenderTargetPixelsAsync=async function(A,B,G,W,V,lt,_t){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=xt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&_t!==void 0&&(Pt=Pt[_t]),Pt){const It=A.texture,Ht=It.format,$t=It.type;if(!yt.textureFormatReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!yt.textureTypeReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=A.width-W&&G>=0&&G<=A.height-V){ht.bindFramebuffer(L.FRAMEBUFFER,Pt);const zt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,zt),L.bufferData(L.PIXEL_PACK_BUFFER,lt.byteLength,L.STREAM_READ),L.readPixels(B,G,W,V,Vt.convert(Ht),Vt.convert($t),0);const re=C!==null?xt.get(C).__webglFramebuffer:null;ht.bindFramebuffer(L.FRAMEBUFFER,re);const de=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await wg(L,de,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,zt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,lt),L.deleteBuffer(zt),L.deleteSync(de),lt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,B=null,G=0){A.isTexture!==!0&&(Ir("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,A=arguments[1]);const W=Math.pow(2,-G),V=Math.floor(A.image.width*W),lt=Math.floor(A.image.height*W),_t=B!==null?B.x:0,Pt=B!==null?B.y:0;z.setTexture2D(A,0),L.copyTexSubImage2D(L.TEXTURE_2D,G,0,0,_t,Pt,V,lt),ht.unbindTexture()},this.copyTextureToTexture=function(A,B,G=null,W=null,V=0){A.isTexture!==!0&&(Ir("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,A=arguments[1],B=arguments[2],V=arguments[3]||0,G=null);let lt,_t,Pt,It,Ht,$t,zt,re,de;const fe=A.isCompressedTexture?A.mipmaps[V]:A.image;G!==null?(lt=G.max.x-G.min.x,_t=G.max.y-G.min.y,Pt=G.isBox3?G.max.z-G.min.z:1,It=G.min.x,Ht=G.min.y,$t=G.isBox3?G.min.z:0):(lt=fe.width,_t=fe.height,Pt=fe.depth||1,It=0,Ht=0,$t=0),W!==null?(zt=W.x,re=W.y,de=W.z):(zt=0,re=0,de=0);const en=Vt.convert(B.format),oe=Vt.convert(B.type);let Dt;B.isData3DTexture?(z.setTexture3D(B,0),Dt=L.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(z.setTexture2DArray(B,0),Dt=L.TEXTURE_2D_ARRAY):(z.setTexture2D(B,0),Dt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,B.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,B.unpackAlignment);const ei=L.getParameter(L.UNPACK_ROW_LENGTH),ae=L.getParameter(L.UNPACK_IMAGE_HEIGHT),An=L.getParameter(L.UNPACK_SKIP_PIXELS),Cs=L.getParameter(L.UNPACK_SKIP_ROWS),hn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,fe.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,fe.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,It),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ht),L.pixelStorei(L.UNPACK_SKIP_IMAGES,$t);const mr=A.isDataArrayTexture||A.isData3DTexture,pe=B.isDataArrayTexture||B.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const Gn=xt.get(A),gr=xt.get(B),vn=xt.get(Gn.__renderTarget),yi=xt.get(gr.__renderTarget);ht.bindFramebuffer(L.READ_FRAMEBUFFER,vn.__webglFramebuffer),ht.bindFramebuffer(L.DRAW_FRAMEBUFFER,yi.__webglFramebuffer);for(let Mi=0;Mi<Pt;Mi++)mr&&L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,xt.get(A).__webglTexture,V,$t+Mi),A.isDepthTexture?(pe&&L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,xt.get(B).__webglTexture,V,de+Mi),L.blitFramebuffer(It,Ht,lt,_t,zt,re,lt,_t,L.DEPTH_BUFFER_BIT,L.NEAREST)):pe?L.copyTexSubImage3D(Dt,V,zt,re,de+Mi,It,Ht,lt,_t):L.copyTexSubImage2D(Dt,V,zt,re,de+Mi,It,Ht,lt,_t);ht.bindFramebuffer(L.READ_FRAMEBUFFER,null),ht.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else pe?A.isDataTexture||A.isData3DTexture?L.texSubImage3D(Dt,V,zt,re,de,lt,_t,Pt,en,oe,fe.data):B.isCompressedArrayTexture?L.compressedTexSubImage3D(Dt,V,zt,re,de,lt,_t,Pt,en,fe.data):L.texSubImage3D(Dt,V,zt,re,de,lt,_t,Pt,en,oe,fe):A.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,V,zt,re,lt,_t,en,oe,fe.data):A.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,V,zt,re,fe.width,fe.height,en,fe.data):L.texSubImage2D(L.TEXTURE_2D,V,zt,re,lt,_t,en,oe,fe);L.pixelStorei(L.UNPACK_ROW_LENGTH,ei),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ae),L.pixelStorei(L.UNPACK_SKIP_PIXELS,An),L.pixelStorei(L.UNPACK_SKIP_ROWS,Cs),L.pixelStorei(L.UNPACK_SKIP_IMAGES,hn),V===0&&B.generateMipmaps&&L.generateMipmap(Dt),ht.unbindTexture()},this.copyTextureToTexture3D=function(A,B,G=null,W=null,V=0){return A.isTexture!==!0&&(Ir("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,A=arguments[2],B=arguments[3],V=arguments[4]||0),Ir('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,B,G,W,V)},this.initRenderTarget=function(A){xt.get(A).__webglFramebuffer===void 0&&z.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?z.setTextureCube(A,0):A.isData3DTexture?z.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?z.setTexture2DArray(A,0):z.setTexture2D(A,0),ht.unbindTexture()},this.resetState=function(){b=0,w=0,C=null,ht.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return $n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Jt._getUnpackColorSpace()}}class Gl{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new dt(t),this.density=e}clone(){return new Gl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class vo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new dt(t),this.near=e,this.far=n}clone(){return new vo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class _l extends ie{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xn,this.environmentIntensity=1,this.environmentRotation=new xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Wl{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Jr,this.updateRanges=[],this.version=0,this.uuid=mn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,s=this.stride;i<s;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const $e=new R;class _s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyMatrix4(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyNormalMatrix(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.transformDirection(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=je(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=qt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=qt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=je(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=je(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=je(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=je(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=qt(e,this.array),n=qt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=qt(e,this.array),n=qt(n,this.array),i=qt(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=qt(e,this.array),n=qt(n,this.array),i=qt(i,this.array),s=qt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[i+s])}return new Qt(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new _s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Jh extends qe{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new dt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Hs;const Mr=new R,Gs=new R,Ws=new R,Xs=new Z,br=new Z,_p=new Ut,$o=new R,Sr=new R,Zo=new R,yd=new Z,Bc=new Z,Md=new Z;class yp extends ie{constructor(t=new Jh){if(super(),this.isSprite=!0,this.type="Sprite",Hs===void 0){Hs=new Ft;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Wl(e,5);Hs.setIndex([0,1,2,0,2,3]),Hs.setAttribute("position",new _s(n,3,0,!1)),Hs.setAttribute("uv",new _s(n,2,3,!1))}this.geometry=Hs,this.material=t,this.center=new Z(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Gs.setFromMatrixScale(this.matrixWorld),_p.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ws.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Gs.multiplyScalar(-Ws.z);const n=this.material.rotation;let i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));const o=this.center;Ko($o.set(-.5,-.5,0),Ws,o,Gs,i,s),Ko(Sr.set(.5,-.5,0),Ws,o,Gs,i,s),Ko(Zo.set(.5,.5,0),Ws,o,Gs,i,s),yd.set(0,0),Bc.set(1,0),Md.set(1,1);let a=t.ray.intersectTriangle($o,Sr,Zo,!1,Mr);if(a===null&&(Ko(Sr.set(-.5,.5,0),Ws,o,Gs,i,s),Bc.set(0,1),a=t.ray.intersectTriangle($o,Zo,Sr,!1,Mr),a===null))return;const l=t.ray.origin.distanceTo(Mr);l<t.near||l>t.far||e.push({distance:l,point:Mr.clone(),uv:on.getInterpolation(Mr,$o,Sr,Zo,yd,Bc,Md,new Z),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ko(r,t,e,n,i,s){Xs.subVectors(r,e).addScalar(.5).multiply(n),i!==void 0?(br.x=s*Xs.x-i*Xs.y,br.y=i*Xs.x+s*Xs.y):br.copy(Xs),r.copy(t),r.x+=br.x,r.y+=br.y,r.applyMatrix4(_p)}const jo=new R,bd=new R;class Mp extends ie{constructor(){super(),this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(t){super.copy(t,!1);const e=t.levels;for(let n=0,i=e.length;n<i;n++){const s=e[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=t.autoUpdate,this}addLevel(t,e=0,n=0){e=Math.abs(e);const i=this.levels;let s;for(s=0;s<i.length&&!(e<i[s].distance);s++);return i.splice(s,0,{distance:e,hysteresis:n,object:t}),this.add(t),this}removeLevel(t){const e=this.levels;for(let n=0;n<e.length;n++)if(e[n].distance===t){const i=e.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(t){const e=this.levels;if(e.length>0){let n,i;for(n=1,i=e.length;n<i;n++){let s=e[n].distance;if(e[n].object.visible&&(s-=s*e[n].hysteresis),t<s)break}return e[n-1].object}return null}raycast(t,e){if(this.levels.length>0){jo.setFromMatrixPosition(this.matrixWorld);const i=t.ray.origin.distanceTo(jo);this.getObjectForDistance(i).raycast(t,e)}}update(t){const e=this.levels;if(e.length>1){jo.setFromMatrixPosition(t.matrixWorld),bd.setFromMatrixPosition(this.matrixWorld);const n=jo.distanceTo(bd)/t.zoom;e[0].object.visible=!0;let i,s;for(i=1,s=e.length;i<s;i++){let o=e[i].distance;if(e[i].object.visible&&(o-=o*e[i].hysteresis),n>=o)e[i-1].object.visible=!1,e[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)e[i].object.visible=!1}}toJSON(t){const e=super.toJSON(t);this.autoUpdate===!1&&(e.object.autoUpdate=!1),e.object.levels=[];const n=this.levels;for(let i=0,s=n.length;i<s;i++){const o=n[i];e.object.levels.push({object:o.object.uuid,distance:o.distance,hysteresis:o.hysteresis})}return e}}const Sd=new R,wd=new ne,Td=new ne,Oy=new R,Ed=new Ut,Jo=new R,Vc=new Xe,Ad=new Ut,Hc=new ur;class bp extends ue{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=dh,this.bindMatrix=new Ut,this.bindMatrixInverse=new Ut,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new tn),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Jo),this.boundingBox.expandByPoint(Jo)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Xe),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Jo),this.boundingSphere.expandByPoint(Jo)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vc.copy(this.boundingSphere),Vc.applyMatrix4(i),t.ray.intersectsSphere(Vc)!==!1&&(Ad.copy(i).invert(),Hc.copy(t.ray).applyMatrix4(Ad),!(this.boundingBox!==null&&Hc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Hc)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new ne,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);const s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===dh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Gf?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,i=this.geometry;wd.fromBufferAttribute(i.attributes.skinIndex,t),Td.fromBufferAttribute(i.attributes.skinWeight,t),Sd.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let s=0;s<4;s++){const o=Td.getComponent(s);if(o!==0){const a=wd.getComponent(s);Ed.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(Oy.copy(Sd).applyMatrix4(Ed),o)}}return e.applyMatrix4(this.bindMatrixInverse)}}class Qh extends ie{constructor(){super(),this.isBone=!0,this.type="Bone"}}class gn extends Me{constructor(t=null,e=1,n=1,i,s,o,a,l,c=Ce,h=Ce,u,d){super(null,o,a,l,c,h,i,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Cd=new Ut,By=new Ut;class Xl{constructor(t=[],e=[]){this.uuid=mn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ut)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new Ut;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,o=t.length;s<o;s++){const a=t[s]?t[s].matrixWorld:By;Cd.multiplyMatrices(a,e[s]),Cd.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Xl(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new gn(e,t,t,Ne,an);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){const s=t.bones[n];let o=e[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new Qh),this.bones.push(o),this.boneInverses.push(new Ut().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let i=0,s=e.length;i<s;i++){const o=e[i];t.bones.push(o.uuid);const a=n[i];t.boneInverses.push(a.toArray())}return t}}class ar extends Qt{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const qs=new Ut,Rd=new Ut,Qo=[],Pd=new tn,Vy=new Ut,wr=new ue,Tr=new Xe;class ql extends ue{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ar(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Vy)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new tn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,qs),Pd.copy(t.boundingBox).applyMatrix4(qs),this.boundingBox.union(Pd)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Xe),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,qs),Tr.copy(t.boundingSphere).applyMatrix4(qs),this.boundingSphere.union(Tr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,o=t*s+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(wr.geometry=this.geometry,wr.material=this.material,wr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Tr.copy(this.boundingSphere),Tr.applyMatrix4(n),t.ray.intersectsSphere(Tr)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,qs),Rd.multiplyMatrices(n,qs),wr.matrixWorld=Rd,wr.raycast(t,Qo);for(let o=0,a=Qo.length;o<a;o++){const l=Qo[o];l.instanceId=s,l.object=this,e.push(l)}Qo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new ar(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new gn(new Float32Array(i*this.count),i,this.count,Dl,an));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;s[l]=a,s.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}function Gc(r,t){return r-t}function Hy(r,t){return r.z-t.z}function Gy(r,t){return t.z-r.z}class Wy{constructor(){this.index=0,this.pool=[],this.list=[]}push(t,e,n,i){const s=this.pool,o=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});const a=s[this.index];o.push(a),this.index++,a.start=t,a.count=e,a.z=n,a.index=i}reset(){this.list.length=0,this.index=0}}const nn=new Ut,Xy=new dt(1,1,1),Wc=new go,ta=new tn,Zi=new Xe,Er=new R,Id=new R,qy=new R,Xc=new Wy,Ve=new ue,ea=[];function Yy(r,t,e=0){const n=t.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==t.array.constructor){const i=r.count;for(let s=0;s<i;s++)for(let o=0;o<n;o++)t.setComponent(s+e,o,r.getComponent(s,o))}else t.array.set(r.array,e*n);t.needsUpdate=!0}function Ki(r,t){if(r.constructor!==t.constructor){const e=Math.min(r.length,t.length);for(let n=0;n<e;n++)t[n]=r[n]}else{const e=Math.min(r.length,t.length);t.set(new r.constructor(r.buffer,0,e))}}class Sp extends ue{get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}constructor(t,e,n=e*2,i){super(new Ft,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=t,this._maxVertexCount=e,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(t),this._multiDrawStarts=new Int32Array(t),this._multiDrawCount=0,this._multiDrawInstances=null,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}_initMatricesTexture(){let t=Math.sqrt(this._maxInstanceCount*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4),n=new gn(e,t,t,Ne,an);this._matricesTexture=n}_initIndirectTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Uint32Array(t*t),n=new gn(e,t,t,fo,vi);this._indirectTexture=n}_initColorsTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Float32Array(t*t*4).fill(1),n=new gn(e,t,t,Ne,an);n.colorSpace=Jt.workingColorSpace,this._colorsTexture=n}_initializeGeometry(t){const e=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(const s in t.attributes){const o=t.getAttribute(s),{array:a,itemSize:l,normalized:c}=o,h=new a.constructor(n*l),u=new Qt(h,l,c);e.setAttribute(s,u)}if(t.getIndex()!==null){const s=n>65535?new Uint32Array(i):new Uint16Array(i);e.setIndex(new Qt(s,1))}this._geometryInitialized=!0}}_validateGeometry(t){const e=this.geometry;if(!!t.getIndex()!=!!e.getIndex())throw new Error('BatchedMesh: All geometries must consistently have "index".');for(const n in e.attributes){if(!t.hasAttribute(n))throw new Error(`BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const i=t.getAttribute(n),s=e.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}setCustomSort(t){return this.customSort=t,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tn);const t=this.boundingBox,e=this._instanceInfo;t.makeEmpty();for(let n=0,i=e.length;n<i;n++){if(e[n].active===!1)continue;const s=e[n].geometryIndex;this.getMatrixAt(n,nn),this.getBoundingBoxAt(s,ta).applyMatrix4(nn),t.union(ta)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xe);const t=this.boundingSphere,e=this._instanceInfo;t.makeEmpty();for(let n=0,i=e.length;n<i;n++){if(e[n].active===!1)continue;const s=e[n].geometryIndex;this.getMatrixAt(n,nn),this.getBoundingSphereAt(s,Zi).applyMatrix4(nn),t.union(Zi)}}addInstance(t){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:t};let i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Gc),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));const s=this._matricesTexture;nn.identity().toArray(s.image.data,i*16),s.needsUpdate=!0;const o=this._colorsTexture;return o&&(Xy.toArray(o.image.data,i*4),o.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(t,e=-1,n=-1){this._initializeGeometry(t),this._validateGeometry(t);const i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},s=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=e===-1?t.getAttribute("position").count:e;const o=t.getIndex();if(o!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?o.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Gc),l=this._availableGeometryIds.shift(),s[l]=i):(l=this._geometryCount,this._geometryCount++,s.push(i)),this.setGeometryAt(l,t),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,l}setGeometryAt(t,e){if(t>=this._geometryCount)throw new Error("BatchedMesh: Maximum geometry count reached.");this._validateGeometry(e);const n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),o=e.getIndex(),a=this._geometryInfo[t];if(i&&o.count>a.reservedIndexCount||e.attributes.position.count>a.reservedVertexCount)throw new Error("BatchedMesh: Reserved space not large enough for provided geometry.");const l=a.vertexStart,c=a.reservedVertexCount;a.vertexCount=e.getAttribute("position").count;for(const h in n.attributes){const u=e.getAttribute(h),d=n.getAttribute(h);Yy(u,d,l);const f=u.itemSize;for(let p=u.count,x=c;p<x;p++){const m=l+p;for(let g=0;g<f;g++)d.setComponent(m,g,0)}d.needsUpdate=!0,d.addUpdateRange(l*f,c*f)}if(i){const h=a.indexStart,u=a.reservedIndexCount;a.indexCount=e.getIndex().count;for(let d=0;d<o.count;d++)s.setX(h+d,l+o.getX(d));for(let d=o.count,f=u;d<f;d++)s.setX(h+d,l);s.needsUpdate=!0,s.addUpdateRange(h,a.reservedIndexCount)}return a.start=i?a.indexStart:a.vertexStart,a.count=i?a.indexCount:a.vertexCount,a.boundingBox=null,e.boundingBox!==null&&(a.boundingBox=e.boundingBox.clone()),a.boundingSphere=null,e.boundingSphere!==null&&(a.boundingSphere=e.boundingSphere.clone()),this._visibilityChanged=!0,t}deleteGeometry(t){const e=this._geometryInfo;if(t>=e.length||e[t].active===!1)return this;const n=this._instanceInfo;for(let i=0,s=n.length;i<s;i++)n[i].geometryIndex===t&&this.deleteInstance(i);return e[t].active=!1,this._availableGeometryIds.push(t),this._visibilityChanged=!0,this}deleteInstance(t){const e=this._instanceInfo;return t>=e.length||e[t].active===!1?this:(e[t].active=!1,this._availableInstanceIds.push(t),this._visibilityChanged=!0,this)}optimize(){let t=0,e=0;const n=this._geometryInfo,i=n.map((o,a)=>a).sort((o,a)=>n[o].vertexStart-n[a].vertexStart),s=this.geometry;for(let o=0,a=n.length;o<a;o++){const l=i[o],c=n[l];if(c.active!==!1){if(s.index!==null){if(c.indexStart!==e){const{indexStart:h,vertexStart:u,reservedIndexCount:d}=c,f=s.index,p=f.array,x=t-u;for(let m=h;m<h+d;m++)p[m]=p[m]+x;f.array.copyWithin(e,h,h+d),f.addUpdateRange(e,d),c.indexStart=e}e+=c.reservedIndexCount}if(c.vertexStart!==t){const{vertexStart:h,reservedVertexCount:u}=c,d=s.attributes;for(const f in d){const p=d[f],{array:x,itemSize:m}=p;x.copyWithin(t*m,h*m,(h+u)*m),p.addUpdateRange(t*m,u*m)}c.vertexStart=t}t+=c.reservedVertexCount,c.start=s.index?c.indexStart:c.vertexStart,this._nextIndexStart=s.index?c.indexStart+c.reservedIndexCount:0,this._nextVertexStart=c.vertexStart+c.reservedVertexCount}}return this}getBoundingBoxAt(t,e){if(t>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[t];if(i.boundingBox===null){const s=new tn,o=n.index,a=n.attributes.position;for(let l=i.start,c=i.start+i.count;l<c;l++){let h=l;o&&(h=o.getX(h)),s.expandByPoint(Er.fromBufferAttribute(a,h))}i.boundingBox=s}return e.copy(i.boundingBox),e}getBoundingSphereAt(t,e){if(t>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[t];if(i.boundingSphere===null){const s=new Xe;this.getBoundingBoxAt(t,ta),ta.getCenter(s.center);const o=n.index,a=n.attributes.position;let l=0;for(let c=i.start,h=i.start+i.count;c<h;c++){let u=c;o&&(u=o.getX(u)),Er.fromBufferAttribute(a,u),l=Math.max(l,s.center.distanceToSquared(Er))}s.radius=Math.sqrt(l),i.boundingSphere=s}return e.copy(i.boundingSphere),e}setMatrixAt(t,e){const n=this._instanceInfo,i=this._matricesTexture,s=this._matricesTexture.image.data;return t>=n.length||n[t].active===!1?this:(e.toArray(s,t*16),i.needsUpdate=!0,this)}getMatrixAt(t,e){const n=this._instanceInfo,i=this._matricesTexture.image.data;return t>=n.length||n[t].active===!1?null:e.fromArray(i,t*16)}setColorAt(t,e){this._colorsTexture===null&&this._initColorsTexture();const n=this._colorsTexture,i=this._colorsTexture.image.data,s=this._instanceInfo;return t>=s.length||s[t].active===!1?this:(e.toArray(i,t*4),n.needsUpdate=!0,this)}getColorAt(t,e){const n=this._colorsTexture.image.data,i=this._instanceInfo;return t>=i.length||i[t].active===!1?null:e.fromArray(n,t*4)}setVisibleAt(t,e){const n=this._instanceInfo;return t>=n.length||n[t].active===!1||n[t].visible===e?this:(n[t].visible=e,this._visibilityChanged=!0,this)}getVisibleAt(t){const e=this._instanceInfo;return t>=e.length||e[t].active===!1?!1:e[t].visible}setGeometryIdAt(t,e){const n=this._instanceInfo,i=this._geometryInfo;return t>=n.length||n[t].active===!1||e>=i.length||i[e].active===!1?null:(n[t].geometryIndex=e,this)}getGeometryIdAt(t){const e=this._instanceInfo;return t>=e.length||e[t].active===!1?-1:e[t].geometryIndex}getGeometryRangeAt(t,e={}){if(t<0||t>=this._geometryCount)return null;const n=this._geometryInfo[t];return e.vertexStart=n.vertexStart,e.vertexCount=n.vertexCount,e.reservedVertexCount=n.reservedVertexCount,e.indexStart=n.indexStart,e.indexCount=n.indexCount,e.reservedIndexCount=n.reservedIndexCount,e.start=n.start,e.count=n.count,e}setInstanceCount(t){const e=this._availableInstanceIds,n=this._instanceInfo;for(e.sort(Gc);e[e.length-1]===n.length;)n.pop(),e.pop();if(t<n.length)throw new Error(`BatchedMesh: Instance ids outside the range ${t} are being used. Cannot shrink instance count.`);const i=new Int32Array(t),s=new Int32Array(t);Ki(this._multiDrawCounts,i),Ki(this._multiDrawStarts,s),this._multiDrawCounts=i,this._multiDrawStarts=s,this._maxInstanceCount=t;const o=this._indirectTexture,a=this._matricesTexture,l=this._colorsTexture;o.dispose(),this._initIndirectTexture(),Ki(o.image.data,this._indirectTexture.image.data),a.dispose(),this._initMatricesTexture(),Ki(a.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),Ki(l.image.data,this._colorsTexture.image.data))}setGeometrySize(t,e){const n=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...n.map(a=>a.vertexStart+a.reservedVertexCount))>t)throw new Error(`BatchedMesh: Geometry vertex values are being used outside the range ${e}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>e)throw new Error(`BatchedMesh: Geometry index values are being used outside the range ${e}. Cannot shrink further.`);const s=this.geometry;s.dispose(),this._maxVertexCount=t,this._maxIndexCount=e,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new Ft,this._initializeGeometry(s));const o=this.geometry;s.index&&Ki(s.index.array,o.index.array);for(const a in s.attributes)Ki(s.attributes[a].array,o.attributes[a].array)}raycast(t,e){const n=this._instanceInfo,i=this._geometryInfo,s=this.matrixWorld,o=this.geometry;Ve.material=this.material,Ve.geometry.index=o.index,Ve.geometry.attributes=o.attributes,Ve.geometry.boundingBox===null&&(Ve.geometry.boundingBox=new tn),Ve.geometry.boundingSphere===null&&(Ve.geometry.boundingSphere=new Xe);for(let a=0,l=n.length;a<l;a++){if(!n[a].visible||!n[a].active)continue;const c=n[a].geometryIndex,h=i[c];Ve.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(a,Ve.matrixWorld).premultiply(s),this.getBoundingBoxAt(c,Ve.geometry.boundingBox),this.getBoundingSphereAt(c,Ve.geometry.boundingSphere),Ve.raycast(t,ea);for(let u=0,d=ea.length;u<d;u++){const f=ea[u];f.object=this,f.batchId=a,e.push(f)}ea.length=0}Ve.material=null,Ve.geometry.index=null,Ve.geometry.attributes={},Ve.geometry.setDrawRange(0,1/0)}copy(t){return super.copy(t),this.geometry=t.geometry.clone(),this.perObjectFrustumCulled=t.perObjectFrustumCulled,this.sortObjects=t.sortObjects,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this._geometryInfo=t._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox!==null?e.boundingBox.clone():null,boundingSphere:e.boundingSphere!==null?e.boundingSphere.clone():null})),this._instanceInfo=t._instanceInfo.map(e=>({...e})),this._maxInstanceCount=t._maxInstanceCount,this._maxVertexCount=t._maxVertexCount,this._maxIndexCount=t._maxIndexCount,this._geometryInitialized=t._geometryInitialized,this._geometryCount=t._geometryCount,this._multiDrawCounts=t._multiDrawCounts.slice(),this._multiDrawStarts=t._multiDrawStarts.slice(),this._matricesTexture=t._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=t._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){return this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this}onBeforeRender(t,e,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const o=i.getIndex(),a=o===null?1:o.array.BYTES_PER_ELEMENT,l=this._instanceInfo,c=this._multiDrawStarts,h=this._multiDrawCounts,u=this._geometryInfo,d=this.perObjectFrustumCulled,f=this._indirectTexture,p=f.image.data;d&&(nn.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),Wc.setFromProjectionMatrix(nn,t.coordinateSystem));let x=0;if(this.sortObjects){nn.copy(this.matrixWorld).invert(),Er.setFromMatrixPosition(n.matrixWorld).applyMatrix4(nn),Id.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(nn);for(let y=0,v=l.length;y<v;y++)if(l[y].visible&&l[y].active){const _=l[y].geometryIndex;this.getMatrixAt(y,nn),this.getBoundingSphereAt(_,Zi).applyMatrix4(nn);let E=!1;if(d&&(E=!Wc.intersectsSphere(Zi)),!E){const b=u[_],w=qy.subVectors(Zi.center,Er).dot(Id);Xc.push(b.start,b.count,w,y)}}const m=Xc.list,g=this.customSort;g===null?m.sort(s.transparent?Gy:Hy):g.call(this,m,n);for(let y=0,v=m.length;y<v;y++){const _=m[y];c[x]=_.start*a,h[x]=_.count,p[x]=_.index,x++}Xc.reset()}else for(let m=0,g=l.length;m<g;m++)if(l[m].visible&&l[m].active){const y=l[m].geometryIndex;let v=!1;if(d&&(this.getMatrixAt(m,nn),this.getBoundingSphereAt(y,Zi).applyMatrix4(nn),v=!Wc.intersectsSphere(Zi)),!v){const _=u[y];c[x]=_.start*a,h[x]=_.count,p[x]=m,x++}}f.needsUpdate=!0,this._multiDrawCount=x,this._visibilityChanged=!1}onBeforeShadow(t,e,n,i,s,o){this.onBeforeRender(t,null,i,s,o)}}class Ye extends qe{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new dt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const yl=new R,Ml=new R,zd=new Ut,Ar=new ur,na=new Xe,qc=new R,Ld=new R;class Ni extends ie{constructor(t=new Ft,e=new Ye){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,s=e.count;i<s;i++)yl.fromBufferAttribute(e,i-1),Ml.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=yl.distanceTo(Ml);t.setAttribute("lineDistance",new bt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,s=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),na.copy(n.boundingSphere),na.applyMatrix4(i),na.radius+=s,t.ray.intersectsSphere(na)===!1)return;zd.copy(i).invert(),Ar.copy(t.ray).applyMatrix4(zd);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let x=f,m=p-1;x<m;x+=c){const g=h.getX(x),y=h.getX(x+1),v=ia(this,t,Ar,l,g,y);v&&e.push(v)}if(this.isLineLoop){const x=h.getX(p-1),m=h.getX(f),g=ia(this,t,Ar,l,x,m);g&&e.push(g)}}else{const f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let x=f,m=p-1;x<m;x+=c){const g=ia(this,t,Ar,l,x,x+1);g&&e.push(g)}if(this.isLineLoop){const x=ia(this,t,Ar,l,p-1,f);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function ia(r,t,e,n,i,s){const o=r.geometry.attributes.position;if(yl.fromBufferAttribute(o,i),Ml.fromBufferAttribute(o,s),e.distanceSqToSegment(yl,Ml,qc,Ld)>n)return;qc.applyMatrix4(r.matrixWorld);const l=t.ray.origin.distanceTo(qc);if(!(l<t.near||l>t.far))return{distance:l,point:Ld.clone().applyMatrix4(r.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:r}}const Dd=new R,Ud=new R;class Bn extends Ni{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,s=e.count;i<s;i+=2)Dd.fromBufferAttribute(e,i),Ud.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Dd.distanceTo(Ud);t.setAttribute("lineDistance",new bt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class wp extends Ni{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class tu extends qe{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new dt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const kd=new Ut,xh=new ur,sa=new Xe,ra=new R;class Tp extends ie{constructor(t=new Ft,e=new tu){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),sa.copy(n.boundingSphere),sa.applyMatrix4(i),sa.radius+=s,t.ray.intersectsSphere(sa)===!1)return;kd.copy(i).invert(),xh.copy(t.ray).applyMatrix4(kd);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=d,x=f;p<x;p++){const m=c.getX(p);ra.fromBufferAttribute(u,m),Nd(ra,m,l,i,t,e,this)}}else{const d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let p=d,x=f;p<x;p++)ra.fromBufferAttribute(u,p),Nd(ra,p,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Nd(r,t,e,n,i,s,o){const a=xh.distanceSqToPoint(r);if(a<e){const l=new R;xh.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class $y extends Me{constructor(t,e,n,i,s,o,a,l,c){super(t,e,n,i,s,o,a,l,c),this.isVideoTexture=!0,this.minFilter=o!==void 0?o:Ee,this.magFilter=s!==void 0?s:Ee,this.generateMipmaps=!1;const h=this;function u(){h.needsUpdate=!0,t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&t.requestVideoFrameCallback(u)}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}class Zy extends Me{constructor(t,e){super({width:t,height:e}),this.isFramebufferTexture=!0,this.magFilter=Ce,this.minFilter=Ce,this.generateMipmaps=!1,this.needsUpdate=!0}}class Yl extends Me{constructor(t,e,n,i,s,o,a,l,c,h,u,d){super(null,o,a,l,c,h,i,s,u,d),this.isCompressedTexture=!0,this.image={width:e,height:n},this.mipmaps=t,this.flipY=!1,this.generateMipmaps=!1}}class Ky extends Yl{constructor(t,e,n,i,s,o){super(t,e,n,s,o),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=Sn,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class jy extends Yl{constructor(t,e,n){super(void 0,t[0].width,t[0].height,e,n,xi),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=t}}class Jy extends Me{constructor(t,e,n,i,s,o,a,l,c){super(t,e,n,i,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Vn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(i),e.push(s),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let i=0;const s=n.length;let o;e?o=e:o=t*n[s-1];let a=0,l=s-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(s-1);const h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(s-1)}getTangent(t,e){let i=t-1e-4,s=t+1e-4;i<0&&(i=0),s>1&&(s=1);const o=this.getPoint(i),a=this.getPoint(s),l=e||(o.isVector2?new Z:new R);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new R,i=[],s=[],o=[],a=new R,l=new Ut;for(let f=0;f<=t;f++){const p=f/t;i[f]=this.getTangentAt(p,new R)}s[0]=new R,o[0]=new R;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],a),o[0].crossVectors(i[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(ye(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(i[f],s[f])}if(e===!0){let f=Math.acos(ye(s[0].dot(s[t]),-1,1));f/=t,i[0].dot(a.crossVectors(s[0],s[t]))>0&&(f=-f);for(let p=1;p<=t;p++)s[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],s[p])}return{tangents:i,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class $l extends Vn{constructor(t=0,e=0,n=1,i=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new Z){const n=e,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(o?s=0:s=i),this.aClockwise===!0&&!o&&(s===i?s=-i:s=s-i);const a=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Ep extends $l{constructor(t,e,n,i,s,o){super(t,e,n,n,i,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function eu(){let r=0,t=0,e=0,n=0;function i(s,o,a,l){r=s,t=a,e=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){i(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,h,u){let d=(o-s)/c-(a-s)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return r+t*s+e*o+n*a}}}const oa=new R,Yc=new eu,$c=new eu,Zc=new eu;class Ap extends Vn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new R){const n=e,i=this.points,s=i.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%s]:(oa.subVectors(i[0],i[1]).add(i[0]),c=oa);const u=i[a%s],d=i[(a+1)%s];if(this.closed||a+2<s?h=i[(a+2)%s]:(oa.subVectors(i[s-1],i[s-2]).add(i[s-1]),h=oa),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),p<1e-4&&(p=x),m<1e-4&&(m=x),Yc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,p,x,m),$c.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,p,x,m),Zc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,p,x,m)}else this.curveType==="catmullrom"&&(Yc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),$c.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Zc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Yc.calc(l),$c.calc(l),Zc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new R().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Fd(r,t,e,n,i){const s=(n-t)*.5,o=(i-e)*.5,a=r*r,l=r*a;return(2*e-2*n+s+o)*l+(-3*e+3*n-2*s-o)*a+s*r+e}function Qy(r,t){const e=1-r;return e*e*t}function tM(r,t){return 2*(1-r)*r*t}function eM(r,t){return r*r*t}function Hr(r,t,e,n){return Qy(r,t)+tM(r,e)+eM(r,n)}function nM(r,t){const e=1-r;return e*e*e*t}function iM(r,t){const e=1-r;return 3*e*e*r*t}function sM(r,t){return 3*(1-r)*r*r*t}function rM(r,t){return r*r*r*t}function Gr(r,t,e,n,i){return nM(r,t)+iM(r,e)+sM(r,n)+rM(r,i)}class nu extends Vn{constructor(t=new Z,e=new Z,n=new Z,i=new Z){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new Z){const n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Gr(t,i.x,s.x,o.x,a.x),Gr(t,i.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Cp extends Vn{constructor(t=new R,e=new R,n=new R,i=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new R){const n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Gr(t,i.x,s.x,o.x,a.x),Gr(t,i.y,s.y,o.y,a.y),Gr(t,i.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class iu extends Vn{constructor(t=new Z,e=new Z){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Z){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Z){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rp extends Vn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class su extends Vn{constructor(t=new Z,e=new Z,n=new Z){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Z){const n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(Hr(t,i.x,s.x,o.x),Hr(t,i.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ru extends Vn{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){const n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(Hr(t,i.x,s.x,o.x),Hr(t,i.y,s.y,o.y),Hr(t,i.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ou extends Vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Z){const n=e,i=this.points,s=(i.length-1)*t,o=Math.floor(s),a=s-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Fd(a,l.x,c.x,h.x,u.x),Fd(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new Z().fromArray(i))}return this}}var bl=Object.freeze({__proto__:null,ArcCurve:Ep,CatmullRomCurve3:Ap,CubicBezierCurve:nu,CubicBezierCurve3:Cp,EllipseCurve:$l,LineCurve:iu,LineCurve3:Rp,QuadraticBezierCurve:su,QuadraticBezierCurve3:ru,SplineCurve:ou});class Pp extends Vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new bl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let s=0;for(;s<i.length;){if(i[s]>=n){const o=i[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const o=s[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new bl[i.type]().fromJSON(i))}return this}}class eo extends Pp{constructor(t){super(),this.type="Path",this.currentPoint=new Z,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new iu(this.currentPoint.clone(),new Z(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const s=new su(this.currentPoint.clone(),new Z(t,e),new Z(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,s,o){const a=new nu(this.currentPoint.clone(),new Z(t,e),new Z(n,i),new Z(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new ou(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,s,o),this}absarc(t,e,n,i,s,o){return this.absellipse(t,e,n,n,i,s,o),this}ellipse(t,e,n,i,s,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,s,o,a,l),this}absellipse(t,e,n,i,s,o,a,l){const c=new $l(t,e,n,i,s,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class _o extends Ft{constructor(t=[new Z(0,-.5),new Z(.5,0),new Z(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=ye(i,0,Math.PI*2);const s=[],o=[],a=[],l=[],c=[],h=1/e,u=new R,d=new Z,f=new R,p=new R,x=new R;let m=0,g=0;for(let y=0;y<=t.length-1;y++)switch(y){case 0:m=t[y+1].x-t[y].x,g=t[y+1].y-t[y].y,f.x=g*1,f.y=-m,f.z=g*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:m=t[y+1].x-t[y].x,g=t[y+1].y-t[y].y,f.x=g*1,f.y=-m,f.z=g*0,p.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(p)}for(let y=0;y<=e;y++){const v=n+y*h*i,_=Math.sin(v),E=Math.cos(v);for(let b=0;b<=t.length-1;b++){u.x=t[b].x*_,u.y=t[b].y,u.z=t[b].x*E,o.push(u.x,u.y,u.z),d.x=y/e,d.y=b/(t.length-1),a.push(d.x,d.y);const w=l[3*b+0]*_,C=l[3*b+1],S=l[3*b+0]*E;c.push(w,C,S)}}for(let y=0;y<e;y++)for(let v=0;v<t.length-1;v++){const _=v+y*t.length,E=_,b=_+t.length,w=_+t.length+1,C=_+1;s.push(E,b,C),s.push(w,C,b)}this.setIndex(s),this.setAttribute("position",new bt(o,3)),this.setAttribute("uv",new bt(a,2)),this.setAttribute("normal",new bt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _o(t.points,t.segments,t.phiStart,t.phiLength)}}class Zl extends _o{constructor(t=1,e=1,n=4,i=8){const s=new eo;s.absarc(0,-e/2,t,Math.PI*1.5,0),s.absarc(0,e/2,t,0,Math.PI*.5),super(s.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:i}}static fromJSON(t){return new Zl(t.radius,t.length,t.capSegments,t.radialSegments)}}class Kl extends Ft{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const s=[],o=[],a=[],l=[],c=new R,h=new Z;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new bt(o,3)),this.setAttribute("normal",new bt(a,3)),this.setAttribute("uv",new bt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Kl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ss extends Ft{constructor(t=1,e=1,n=1,i=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const h=[],u=[],d=[],f=[];let p=0;const x=[],m=n/2;let g=0;y(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new bt(u,3)),this.setAttribute("normal",new bt(d,3)),this.setAttribute("uv",new bt(f,2));function y(){const _=new R,E=new R;let b=0;const w=(e-t)/n;for(let C=0;C<=s;C++){const S=[],M=C/s,P=M*(e-t)+t;for(let N=0;N<=i;N++){const I=N/i,D=I*l+a,O=Math.sin(D),U=Math.cos(D);E.x=P*O,E.y=-M*n+m,E.z=P*U,u.push(E.x,E.y,E.z),_.set(O,w,U).normalize(),d.push(_.x,_.y,_.z),f.push(I,1-M),S.push(p++)}x.push(S)}for(let C=0;C<i;C++)for(let S=0;S<s;S++){const M=x[S][C],P=x[S+1][C],N=x[S+1][C+1],I=x[S][C+1];(t>0||S!==0)&&(h.push(M,P,I),b+=3),(e>0||S!==s-1)&&(h.push(P,N,I),b+=3)}c.addGroup(g,b,0),g+=b}function v(_){const E=p,b=new Z,w=new R;let C=0;const S=_===!0?t:e,M=_===!0?1:-1;for(let N=1;N<=i;N++)u.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),p++;const P=p;for(let N=0;N<=i;N++){const D=N/i*l+a,O=Math.cos(D),U=Math.sin(D);w.x=S*U,w.y=m*M,w.z=S*O,u.push(w.x,w.y,w.z),d.push(0,M,0),b.x=O*.5+.5,b.y=U*.5*M+.5,f.push(b.x,b.y),p++}for(let N=0;N<i;N++){const I=E+N,D=P+N;_===!0?h.push(D,D+1,I):h.push(D+1,D,I),C+=3}c.addGroup(g,C,_===!0?1:2),g+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ss(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class jl extends Ss{constructor(t=1,e=1,n=32,i=1,s=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,s,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(t){return new jl(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Bi extends Ft{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const s=[],o=[];a(i),c(n),h(),this.setAttribute("position",new bt(s,3)),this.setAttribute("normal",new bt(s.slice(),3)),this.setAttribute("uv",new bt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(y){const v=new R,_=new R,E=new R;for(let b=0;b<e.length;b+=3)f(e[b+0],v),f(e[b+1],_),f(e[b+2],E),l(v,_,E,y)}function l(y,v,_,E){const b=E+1,w=[];for(let C=0;C<=b;C++){w[C]=[];const S=y.clone().lerp(_,C/b),M=v.clone().lerp(_,C/b),P=b-C;for(let N=0;N<=P;N++)N===0&&C===b?w[C][N]=S:w[C][N]=S.clone().lerp(M,N/P)}for(let C=0;C<b;C++)for(let S=0;S<2*(b-C)-1;S++){const M=Math.floor(S/2);S%2===0?(d(w[C][M+1]),d(w[C+1][M]),d(w[C][M])):(d(w[C][M+1]),d(w[C+1][M+1]),d(w[C+1][M]))}}function c(y){const v=new R;for(let _=0;_<s.length;_+=3)v.x=s[_+0],v.y=s[_+1],v.z=s[_+2],v.normalize().multiplyScalar(y),s[_+0]=v.x,s[_+1]=v.y,s[_+2]=v.z}function h(){const y=new R;for(let v=0;v<s.length;v+=3){y.x=s[v+0],y.y=s[v+1],y.z=s[v+2];const _=m(y)/2/Math.PI+.5,E=g(y)/Math.PI+.5;o.push(_,1-E)}p(),u()}function u(){for(let y=0;y<o.length;y+=6){const v=o[y+0],_=o[y+2],E=o[y+4],b=Math.max(v,_,E),w=Math.min(v,_,E);b>.9&&w<.1&&(v<.2&&(o[y+0]+=1),_<.2&&(o[y+2]+=1),E<.2&&(o[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function f(y,v){const _=y*3;v.x=t[_+0],v.y=t[_+1],v.z=t[_+2]}function p(){const y=new R,v=new R,_=new R,E=new R,b=new Z,w=new Z,C=new Z;for(let S=0,M=0;S<s.length;S+=9,M+=6){y.set(s[S+0],s[S+1],s[S+2]),v.set(s[S+3],s[S+4],s[S+5]),_.set(s[S+6],s[S+7],s[S+8]),b.set(o[M+0],o[M+1]),w.set(o[M+2],o[M+3]),C.set(o[M+4],o[M+5]),E.copy(y).add(v).add(_).divideScalar(3);const P=m(E);x(b,M+0,y,P),x(w,M+2,v,P),x(C,M+4,_,P)}}function x(y,v,_,E){E<0&&y.x===1&&(o[v]=y.x-1),_.x===0&&_.z===0&&(o[v]=E/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function g(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bi(t.vertices,t.indices,t.radius,t.details)}}class Jl extends Bi{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Jl(t.radius,t.detail)}}const aa=new R,la=new R,Kc=new R,ca=new on;class Ip extends Ft{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const i=Math.pow(10,4),s=Math.cos(ps*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:x,b:m,c:g}=ca;if(x.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),g.fromBufferAttribute(a,c[2]),ca.getNormal(Kc),u[0]=`${Math.round(x.x*i)},${Math.round(x.y*i)},${Math.round(x.z*i)}`,u[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,u[2]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const v=(y+1)%3,_=u[y],E=u[v],b=ca[h[y]],w=ca[h[v]],C=`${_}_${E}`,S=`${E}_${_}`;S in d&&d[S]?(Kc.dot(d[S].normal)<=s&&(f.push(b.x,b.y,b.z),f.push(w.x,w.y,w.z)),d[S]=null):C in d||(d[C]={index0:c[y],index1:c[v],normal:Kc.clone()})}}for(const p in d)if(d[p]){const{index0:x,index1:m}=d[p];aa.fromBufferAttribute(a,x),la.fromBufferAttribute(a,m),f.push(aa.x,aa.y,aa.z),f.push(la.x,la.y,la.z)}this.setAttribute("position",new bt(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class ms extends eo{constructor(t){super(t),this.uuid=mn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(new eo().fromJSON(i))}return this}}const oM={triangulate:function(r,t,e=2){const n=t&&t.length,i=n?t[0]*e:r.length;let s=zp(r,0,i,e,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c,h,u,d,f;if(n&&(s=uM(r,t,s,e)),r.length>80*e){a=c=r[0],l=h=r[1];for(let p=e;p<i;p+=e)u=r[p],d=r[p+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return no(s,o,e,a,l,f,0),o}};function zp(r,t,e,n,i){let s,o;if(i===bM(r,t,e,n)>0)for(s=t;s<e;s+=n)o=Od(s,r[s],r[s+1],o);else for(s=e-n;s>=t;s-=n)o=Od(s,r[s],r[s+1],o);return o&&Ql(o,o.next)&&(so(o),o=o.next),o}function ys(r,t){if(!r)return r;t||(t=r);let e=r,n;do if(n=!1,!e.steiner&&(Ql(e,e.next)||xe(e.prev,e,e.next)===0)){if(so(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function no(r,t,e,n,i,s,o){if(!r)return;!o&&s&&gM(r,n,i,s);let a=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?lM(r,n,i,s):aM(r)){t.push(l.i/e|0),t.push(r.i/e|0),t.push(c.i/e|0),so(r),r=c.next,a=c.next;continue}if(r=c,r===a){o?o===1?(r=cM(ys(r),t,e),no(r,t,e,n,i,s,2)):o===2&&hM(r,t,e,n,i,s):no(ys(r),t,e,n,i,s,1);break}}}function aM(r){const t=r.prev,e=r,n=r.next;if(xe(t,e,n)>=0)return!1;const i=t.x,s=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=i<s?i<o?i:o:s<o?s:o,u=a<l?a<c?a:c:l<c?l:c,d=i>s?i>o?i:o:s>o?s:o,f=a>l?a>c?a:c:l>c?l:c;let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&Qs(i,a,s,l,o,c,p.x,p.y)&&xe(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function lM(r,t,e,n){const i=r.prev,s=r,o=r.next;if(xe(i,s,o)>=0)return!1;const a=i.x,l=s.x,c=o.x,h=i.y,u=s.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,p=h<u?h<d?h:d:u<d?u:d,x=a>l?a>c?a:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,g=vh(f,p,t,e,n),y=vh(x,m,t,e,n);let v=r.prevZ,_=r.nextZ;for(;v&&v.z>=g&&_&&_.z<=y;){if(v.x>=f&&v.x<=x&&v.y>=p&&v.y<=m&&v!==i&&v!==o&&Qs(a,h,l,u,c,d,v.x,v.y)&&xe(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=f&&_.x<=x&&_.y>=p&&_.y<=m&&_!==i&&_!==o&&Qs(a,h,l,u,c,d,_.x,_.y)&&xe(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=g;){if(v.x>=f&&v.x<=x&&v.y>=p&&v.y<=m&&v!==i&&v!==o&&Qs(a,h,l,u,c,d,v.x,v.y)&&xe(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=y;){if(_.x>=f&&_.x<=x&&_.y>=p&&_.y<=m&&_!==i&&_!==o&&Qs(a,h,l,u,c,d,_.x,_.y)&&xe(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function cM(r,t,e){let n=r;do{const i=n.prev,s=n.next.next;!Ql(i,s)&&Lp(i,n,n.next,s)&&io(i,s)&&io(s,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(s.i/e|0),so(n),so(n.next),n=r=s),n=n.next}while(n!==r);return ys(n)}function hM(r,t,e,n,i,s){let o=r;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&_M(o,a)){let l=Dp(o,a);o=ys(o,o.next),l=ys(l,l.next),no(o,t,e,n,i,s,0),no(l,t,e,n,i,s,0);return}a=a.next}o=o.next}while(o!==r)}function uM(r,t,e,n){const i=[];let s,o,a,l,c;for(s=0,o=t.length;s<o;s++)a=t[s]*n,l=s<o-1?t[s+1]*n:r.length,c=zp(r,a,l,n,!1),c===c.next&&(c.steiner=!0),i.push(vM(c));for(i.sort(dM),s=0;s<i.length;s++)e=fM(i[s],e);return e}function dM(r,t){return r.x-t.x}function fM(r,t){const e=pM(r,t);if(!e)return t;const n=Dp(e,r);return ys(n,n.next),ys(e,e.next)}function pM(r,t){let e=t,n=-1/0,i;const s=r.x,o=r.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>n&&(n=d,i=e.x<e.next.x?e:e.next,d===s))return i}e=e.next}while(e!==t);if(!i)return null;const a=i,l=i.x,c=i.y;let h=1/0,u;e=i;do s>=e.x&&e.x>=l&&s!==e.x&&Qs(o<c?s:n,o,l,c,o<c?n:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),io(e,r)&&(u<h||u===h&&(e.x>i.x||e.x===i.x&&mM(i,e)))&&(i=e,h=u)),e=e.next;while(e!==a);return i}function mM(r,t){return xe(r.prev,r,t.prev)<0&&xe(t.next,r,r.next)<0}function gM(r,t,e,n){let i=r;do i.z===0&&(i.z=vh(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,xM(i)}function xM(r){let t,e,n,i,s,o,a,l,c=1;do{for(e=r,r=null,s=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;e=n}s.nextZ=null,c*=2}while(o>1);return r}function vh(r,t,e,n,i){return r=(r-e)*i|0,t=(t-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function vM(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e}function Qs(r,t,e,n,i,s,o,a){return(i-o)*(t-a)>=(r-o)*(s-a)&&(r-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(i-o)*(n-a)}function _M(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!yM(r,t)&&(io(r,t)&&io(t,r)&&MM(r,t)&&(xe(r.prev,r,t.prev)||xe(r,t.prev,t))||Ql(r,t)&&xe(r.prev,r,r.next)>0&&xe(t.prev,t,t.next)>0)}function xe(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y)}function Ql(r,t){return r.x===t.x&&r.y===t.y}function Lp(r,t,e,n){const i=ua(xe(r,t,e)),s=ua(xe(r,t,n)),o=ua(xe(e,n,r)),a=ua(xe(e,n,t));return!!(i!==s&&o!==a||i===0&&ha(r,e,t)||s===0&&ha(r,n,t)||o===0&&ha(e,r,n)||a===0&&ha(e,t,n))}function ha(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y)}function ua(r){return r>0?1:r<0?-1:0}function yM(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&Lp(e,e.next,r,t))return!0;e=e.next}while(e!==r);return!1}function io(r,t){return xe(r.prev,r,r.next)<0?xe(r,t,r.next)>=0&&xe(r,r.prev,t)>=0:xe(r,t,r.prev)<0||xe(r,r.next,t)<0}function MM(r,t){let e=r,n=!1;const i=(r.x+t.x)/2,s=(r.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&i<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==r);return n}function Dp(r,t){const e=new _h(r.i,r.x,r.y),n=new _h(t.i,t.x,t.y),i=r.next,s=t.prev;return r.next=t,t.prev=r,e.next=i,i.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function Od(r,t,e,n){const i=new _h(r,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function so(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function _h(r,t,e){this.i=r,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function bM(r,t,e,n){let i=0;for(let s=t,o=e-n;s<e;s+=n)i+=(r[o]-r[s])*(r[s+1]+r[o+1]),o=s;return i}class jn{static area(t){const e=t.length;let n=0;for(let i=e-1,s=0;s<e;i=s++)n+=t[i].x*t[s].y-t[s].x*t[i].y;return n*.5}static isClockWise(t){return jn.area(t)<0}static triangulateShape(t,e){const n=[],i=[],s=[];Bd(t),Vd(n,t);let o=t.length;e.forEach(Bd);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,Vd(n,e[l]);const a=oM.triangulate(n,i);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function Bd(r){const t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function Vd(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y)}class tc extends Ft{constructor(t=new ms([new Z(.5,.5),new Z(-.5,.5),new Z(-.5,-.5),new Z(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,i=[],s=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new bt(i,3)),this.setAttribute("uv",new bt(s,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const g=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:SM;let v,_=!1,E,b,w,C;g&&(v=g.getSpacedPoints(h),_=!0,d=!1,E=g.computeFrenetFrames(h,!1),b=new R,w=new R,C=new R),d||(m=0,f=0,p=0,x=0);const S=a.extractPoints(c);let M=S.shape;const P=S.holes;if(!jn.isClockWise(M)){M=M.reverse();for(let Q=0,at=P.length;Q<at;Q++){const L=P[Q];jn.isClockWise(L)&&(P[Q]=L.reverse())}}const I=jn.triangulateShape(M,P),D=M;for(let Q=0,at=P.length;Q<at;Q++){const L=P[Q];M=M.concat(L)}function O(Q,at,L){return at||console.error("THREE.ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(at,L)}const U=M.length,Y=I.length;function k(Q,at,L){let Ct,it,yt;const ht=Q.x-at.x,Nt=Q.y-at.y,xt=L.x-Q.x,z=L.y-Q.y,T=ht*ht+Nt*Nt,H=ht*z-Nt*xt;if(Math.abs(H)>Number.EPSILON){const K=Math.sqrt(T),et=Math.sqrt(xt*xt+z*z),j=at.x-Nt/K,Et=at.y+ht/K,ft=L.x-z/et,gt=L.y+xt/et,Xt=((ft-j)*z-(gt-Et)*xt)/(ht*z-Nt*xt);Ct=j+ht*Xt-Q.x,it=Et+Nt*Xt-Q.y;const st=Ct*Ct+it*it;if(st<=2)return new Z(Ct,it);yt=Math.sqrt(st/2)}else{let K=!1;ht>Number.EPSILON?xt>Number.EPSILON&&(K=!0):ht<-Number.EPSILON?xt<-Number.EPSILON&&(K=!0):Math.sign(Nt)===Math.sign(z)&&(K=!0),K?(Ct=-Nt,it=ht,yt=Math.sqrt(T)):(Ct=ht,it=Nt,yt=Math.sqrt(T/2))}return new Z(Ct/yt,it/yt)}const X=[];for(let Q=0,at=D.length,L=at-1,Ct=Q+1;Q<at;Q++,L++,Ct++)L===at&&(L=0),Ct===at&&(Ct=0),X[Q]=k(D[Q],D[L],D[Ct]);const $=[];let nt,ct=X.concat();for(let Q=0,at=P.length;Q<at;Q++){const L=P[Q];nt=[];for(let Ct=0,it=L.length,yt=it-1,ht=Ct+1;Ct<it;Ct++,yt++,ht++)yt===it&&(yt=0),ht===it&&(ht=0),nt[Ct]=k(L[Ct],L[yt],L[ht]);$.push(nt),ct=ct.concat(nt)}for(let Q=0;Q<m;Q++){const at=Q/m,L=f*Math.cos(at*Math.PI/2),Ct=p*Math.sin(at*Math.PI/2)+x;for(let it=0,yt=D.length;it<yt;it++){const ht=O(D[it],X[it],Ct);ot(ht.x,ht.y,-L)}for(let it=0,yt=P.length;it<yt;it++){const ht=P[it];nt=$[it];for(let Nt=0,xt=ht.length;Nt<xt;Nt++){const z=O(ht[Nt],nt[Nt],Ct);ot(z.x,z.y,-L)}}}const te=p+x;for(let Q=0;Q<U;Q++){const at=d?O(M[Q],ct[Q],te):M[Q];_?(w.copy(E.normals[0]).multiplyScalar(at.x),b.copy(E.binormals[0]).multiplyScalar(at.y),C.copy(v[0]).add(w).add(b),ot(C.x,C.y,C.z)):ot(at.x,at.y,0)}for(let Q=1;Q<=h;Q++)for(let at=0;at<U;at++){const L=d?O(M[at],ct[at],te):M[at];_?(w.copy(E.normals[Q]).multiplyScalar(L.x),b.copy(E.binormals[Q]).multiplyScalar(L.y),C.copy(v[Q]).add(w).add(b),ot(C.x,C.y,C.z)):ot(L.x,L.y,u/h*Q)}for(let Q=m-1;Q>=0;Q--){const at=Q/m,L=f*Math.cos(at*Math.PI/2),Ct=p*Math.sin(at*Math.PI/2)+x;for(let it=0,yt=D.length;it<yt;it++){const ht=O(D[it],X[it],Ct);ot(ht.x,ht.y,u+L)}for(let it=0,yt=P.length;it<yt;it++){const ht=P[it];nt=$[it];for(let Nt=0,xt=ht.length;Nt<xt;Nt++){const z=O(ht[Nt],nt[Nt],Ct);_?ot(z.x,z.y+v[h-1].y,v[h-1].x+L):ot(z.x,z.y,u+L)}}}J(),rt();function J(){const Q=i.length/3;if(d){let at=0,L=U*at;for(let Ct=0;Ct<Y;Ct++){const it=I[Ct];At(it[2]+L,it[1]+L,it[0]+L)}at=h+m*2,L=U*at;for(let Ct=0;Ct<Y;Ct++){const it=I[Ct];At(it[0]+L,it[1]+L,it[2]+L)}}else{for(let at=0;at<Y;at++){const L=I[at];At(L[2],L[1],L[0])}for(let at=0;at<Y;at++){const L=I[at];At(L[0]+U*h,L[1]+U*h,L[2]+U*h)}}n.addGroup(Q,i.length/3-Q,0)}function rt(){const Q=i.length/3;let at=0;St(D,at),at+=D.length;for(let L=0,Ct=P.length;L<Ct;L++){const it=P[L];St(it,at),at+=it.length}n.addGroup(Q,i.length/3-Q,1)}function St(Q,at){let L=Q.length;for(;--L>=0;){const Ct=L;let it=L-1;it<0&&(it=Q.length-1);for(let yt=0,ht=h+m*2;yt<ht;yt++){const Nt=U*yt,xt=U*(yt+1),z=at+Ct+Nt,T=at+it+Nt,H=at+it+xt,K=at+Ct+xt;kt(z,T,H,K)}}}function ot(Q,at,L){l.push(Q),l.push(at),l.push(L)}function At(Q,at,L){Lt(Q),Lt(at),Lt(L);const Ct=i.length/3,it=y.generateTopUV(n,i,Ct-3,Ct-2,Ct-1);Kt(it[0]),Kt(it[1]),Kt(it[2])}function kt(Q,at,L,Ct){Lt(Q),Lt(at),Lt(Ct),Lt(at),Lt(L),Lt(Ct);const it=i.length/3,yt=y.generateSideWallUV(n,i,it-6,it-3,it-2,it-1);Kt(yt[0]),Kt(yt[1]),Kt(yt[3]),Kt(yt[1]),Kt(yt[2]),Kt(yt[3])}function Lt(Q){i.push(l[Q*3+0]),i.push(l[Q*3+1]),i.push(l[Q*3+2])}function Kt(Q){s.push(Q.x),s.push(Q.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return wM(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];n.push(a)}const i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new bl[i.type]().fromJSON(i)),new tc(n,t.options)}}const SM={generateTopUV:function(r,t,e,n,i){const s=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new Z(s,o),new Z(a,l),new Z(c,h)]},generateSideWallUV:function(r,t,e,n,i,s){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[i*3],f=t[i*3+1],p=t[i*3+2],x=t[s*3],m=t[s*3+1],g=t[s*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new Z(o,1-l),new Z(c,1-u),new Z(d,1-p),new Z(x,1-g)]:[new Z(a,1-l),new Z(h,1-u),new Z(f,1-p),new Z(m,1-g)]}};function wM(r,t,e){if(e.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){const s=r[n];e.shapes.push(s.uuid)}else e.shapes.push(r.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ec extends Bi{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ec(t.radius,t.detail)}}class yo extends Bi{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new yo(t.radius,t.detail)}}class nc extends Ft{constructor(t=.5,e=1,n=32,i=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);const a=[],l=[],c=[],h=[];let u=t;const d=(e-t)/i,f=new R,p=new Z;for(let x=0;x<=i;x++){for(let m=0;m<=n;m++){const g=s+m/n*o;f.x=u*Math.cos(g),f.y=u*Math.sin(g),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}u+=d}for(let x=0;x<i;x++){const m=x*(n+1);for(let g=0;g<n;g++){const y=g+m,v=y,_=y+n+1,E=y+n+2,b=y+1;a.push(v,_,b),a.push(_,E,b)}}this.setIndex(a),this.setAttribute("position",new bt(l,3)),this.setAttribute("normal",new bt(c,3)),this.setAttribute("uv",new bt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nc(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ic extends Ft{constructor(t=new ms([new Z(0,.5),new Z(-.5,-.5),new Z(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],i=[],s=[],o=[];let a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new bt(i,3)),this.setAttribute("normal",new bt(s,3)),this.setAttribute("uv",new bt(o,2));function c(h){const u=i.length/3,d=h.extractPoints(e);let f=d.shape;const p=d.holes;jn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){const y=p[m];jn.isClockWise(y)===!0&&(p[m]=y.reverse())}const x=jn.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){const y=p[m];f=f.concat(y)}for(let m=0,g=f.length;m<g;m++){const y=f[m];i.push(y.x,y.y,0),s.push(0,0,1),o.push(y.x,y.y)}for(let m=0,g=x.length;m<g;m++){const y=x[m],v=y[0]+u,_=y[1]+u,E=y[2]+u;n.push(v,_,E),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return TM(e,t)}static fromJSON(t,e){const n=[];for(let i=0,s=t.shapes.length;i<s;i++){const o=e[t.shapes[i]];n.push(o)}return new ic(n,t.curveSegments)}}function TM(r,t){if(t.shapes=[],Array.isArray(r))for(let e=0,n=r.length;e<n;e++){const i=r[e];t.shapes.push(i.uuid)}else t.shapes.push(r.uuid);return t}class Mo extends Ft{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new R,d=new R,f=[],p=[],x=[],m=[];for(let g=0;g<=n;g++){const y=[],v=g/n;let _=0;g===0&&o===0?_=.5/e:g===n&&l===Math.PI&&(_=-.5/e);for(let E=0;E<=e;E++){const b=E/e;u.x=-t*Math.cos(i+b*s)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(i+b*s)*Math.sin(o+v*a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(b+_,1-v),y.push(c++)}h.push(y)}for(let g=0;g<n;g++)for(let y=0;y<e;y++){const v=h[g][y+1],_=h[g][y],E=h[g+1][y],b=h[g+1][y+1];(g!==0||o>0)&&f.push(v,_,b),(g!==n-1||l<Math.PI)&&f.push(_,E,b)}this.setIndex(f),this.setAttribute("position",new bt(p,3)),this.setAttribute("normal",new bt(x,3)),this.setAttribute("uv",new bt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mo(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class sc extends Bi{constructor(t=1,e=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new sc(t.radius,t.detail)}}class rc extends Ft{constructor(t=1,e=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],c=[],h=new R,u=new R,d=new R;for(let f=0;f<=n;f++)for(let p=0;p<=i;p++){const x=p/i*s,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(x),u.y=(t+e*Math.cos(m))*Math.sin(x),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(p/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let p=1;p<=i;p++){const x=(i+1)*f+p-1,m=(i+1)*(f-1)+p-1,g=(i+1)*(f-1)+p,y=(i+1)*f+p;o.push(x,m,y),o.push(m,g,y)}this.setIndex(o),this.setAttribute("position",new bt(a,3)),this.setAttribute("normal",new bt(l,3)),this.setAttribute("uv",new bt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class oc extends Ft{constructor(t=1,e=.4,n=64,i=8,s=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:e,tubularSegments:n,radialSegments:i,p:s,q:o},n=Math.floor(n),i=Math.floor(i);const a=[],l=[],c=[],h=[],u=new R,d=new R,f=new R,p=new R,x=new R,m=new R,g=new R;for(let v=0;v<=n;++v){const _=v/n*s*Math.PI*2;y(_,s,o,t,f),y(_+.01,s,o,t,p),m.subVectors(p,f),g.addVectors(p,f),x.crossVectors(m,g),g.crossVectors(x,m),x.normalize(),g.normalize();for(let E=0;E<=i;++E){const b=E/i*Math.PI*2,w=-e*Math.cos(b),C=e*Math.sin(b);u.x=f.x+(w*g.x+C*x.x),u.y=f.y+(w*g.y+C*x.y),u.z=f.z+(w*g.z+C*x.z),l.push(u.x,u.y,u.z),d.subVectors(u,f).normalize(),c.push(d.x,d.y,d.z),h.push(v/n),h.push(E/i)}}for(let v=1;v<=n;v++)for(let _=1;_<=i;_++){const E=(i+1)*(v-1)+(_-1),b=(i+1)*v+(_-1),w=(i+1)*v+_,C=(i+1)*(v-1)+_;a.push(E,b,C),a.push(b,w,C)}this.setIndex(a),this.setAttribute("position",new bt(l,3)),this.setAttribute("normal",new bt(c,3)),this.setAttribute("uv",new bt(h,2));function y(v,_,E,b,w){const C=Math.cos(v),S=Math.sin(v),M=E/_*v,P=Math.cos(M);w.x=b*(2+P)*.5*C,w.y=b*(2+P)*S*.5,w.z=b*Math.sin(M)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oc(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}}class ac extends Ft{constructor(t=new ru(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),e=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:s};const o=t.computeFrenetFrames(e,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new R,l=new R,c=new Z;let h=new R;const u=[],d=[],f=[],p=[];x(),this.setIndex(p),this.setAttribute("position",new bt(u,3)),this.setAttribute("normal",new bt(d,3)),this.setAttribute("uv",new bt(f,2));function x(){for(let v=0;v<e;v++)m(v);m(s===!1?e:0),y(),g()}function m(v){h=t.getPointAt(v/e,h);const _=o.normals[v],E=o.binormals[v];for(let b=0;b<=i;b++){const w=b/i*Math.PI*2,C=Math.sin(w),S=-Math.cos(w);l.x=S*_.x+C*E.x,l.y=S*_.y+C*E.y,l.z=S*_.z+C*E.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function g(){for(let v=1;v<=e;v++)for(let _=1;_<=i;_++){const E=(i+1)*(v-1)+(_-1),b=(i+1)*v+(_-1),w=(i+1)*v+_,C=(i+1)*(v-1)+_;p.push(E,b,C),p.push(b,w,C)}}function y(){for(let v=0;v<=e;v++)for(let _=0;_<=i;_++)c.x=v/e,c.y=_/i,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new ac(new bl[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Up extends Ft{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,i=new R,s=new R;if(t.index!==null){const o=t.attributes.position,a=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const u=l[c],d=u.start,f=u.count;for(let p=d,x=d+f;p<x;p+=3)for(let m=0;m<3;m++){const g=a.getX(p+m),y=a.getX(p+(m+1)%3);i.fromBufferAttribute(o,g),s.fromBufferAttribute(o,y),Hd(i,s,n)===!0&&(e.push(i.x,i.y,i.z),e.push(s.x,s.y,s.z))}}}else{const o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const h=3*a+c,u=3*a+(c+1)%3;i.fromBufferAttribute(o,h),s.fromBufferAttribute(o,u),Hd(i,s,n)===!0&&(e.push(i.x,i.y,i.z),e.push(s.x,s.y,s.z))}}this.setAttribute("position",new bt(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function Hd(r,t,e){const n=`${r.x},${r.y},${r.z}-${t.x},${t.y},${t.z}`,i=`${t.x},${t.y},${t.z}-${r.x},${r.y},${r.z}`;return e.has(n)===!0||e.has(i)===!0?!1:(e.add(n),e.add(i),!0)}var Gd=Object.freeze({__proto__:null,BoxGeometry:Oi,CapsuleGeometry:Zl,CircleGeometry:Kl,ConeGeometry:jl,CylinderGeometry:Ss,DodecahedronGeometry:Jl,EdgesGeometry:Ip,ExtrudeGeometry:tc,IcosahedronGeometry:ec,LatheGeometry:_o,OctahedronGeometry:yo,PlaneGeometry:bs,PolyhedronGeometry:Bi,RingGeometry:nc,ShapeGeometry:ic,SphereGeometry:Mo,TetrahedronGeometry:sc,TorusGeometry:rc,TorusKnotGeometry:oc,TubeGeometry:ac,WireframeGeometry:Up});class kp extends qe{static get type(){return"ShadowMaterial"}constructor(t){super(),this.isShadowMaterial=!0,this.color=new dt(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}}class au extends ge{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class fr extends qe{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new dt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fi,this.normalScale=new Z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Np extends fr{static get type(){return"MeshPhysicalMaterial"}constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Z(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ye(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new dt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new dt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new dt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Fp extends qe{static get type(){return"MeshPhongMaterial"}constructor(t){super(),this.isMeshPhongMaterial=!0,this.color=new dt(16777215),this.specular=new dt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fi,this.normalScale=new Z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=uo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Op extends qe{static get type(){return"MeshToonMaterial"}constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.color=new dt(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fi,this.normalScale=new Z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class lu extends qe{static get type(){return"MeshNormalMaterial"}constructor(t){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fi,this.normalScale=new Z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Bp extends qe{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fi,this.normalScale=new Z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=uo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Vp extends qe{static get type(){return"MeshMatcapMaterial"}constructor(t){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.color=new dt(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fi,this.normalScale=new Z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={MATCAP:""},this.color.copy(t.color),this.matcap=t.matcap,this.map=t.map,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Hp extends Ye{static get type(){return"LineDashedMaterial"}constructor(t){super(),this.isLineDashedMaterial=!0,this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}function us(r,t,e){return!r||!e&&r.constructor===t?r:typeof t.BYTES_PER_ELEMENT=="number"?new t(r):Array.prototype.slice.call(r)}function Gp(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Wp(r){function t(i,s){return r[i]-r[s]}const e=r.length,n=new Array(e);for(let i=0;i!==e;++i)n[i]=i;return n.sort(t),n}function yh(r,t,e){const n=r.length,i=new r.constructor(n);for(let s=0,o=0;o!==n;++s){const a=e[s]*t;for(let l=0;l!==t;++l)i[o++]=r[a+l]}return i}function cu(r,t,e,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(t.push(s.time),e.push.apply(e,o)),s=r[i++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(t.push(s.time),o.toArray(e,e.length)),s=r[i++];while(s!==void 0);else do o=s[n],o!==void 0&&(t.push(s.time),e.push(o)),s=r[i++];while(s!==void 0)}function EM(r,t,e,n,i=30){const s=r.clone();s.name=t;const o=[];for(let l=0;l<s.tracks.length;++l){const c=s.tracks[l],h=c.getValueSize(),u=[],d=[];for(let f=0;f<c.times.length;++f){const p=c.times[f]*i;if(!(p<e||p>=n)){u.push(c.times[f]);for(let x=0;x<h;++x)d.push(c.values[f*h+x])}}u.length!==0&&(c.times=us(u,c.times.constructor),c.values=us(d,c.values.constructor),o.push(c))}s.tracks=o;let a=1/0;for(let l=0;l<s.tracks.length;++l)a>s.tracks[l].times[0]&&(a=s.tracks[l].times[0]);for(let l=0;l<s.tracks.length;++l)s.tracks[l].shift(-1*a);return s.resetDuration(),s}function AM(r,t=0,e=r,n=30){n<=0&&(n=30);const i=e.tracks.length,s=t/n;for(let o=0;o<i;++o){const a=e.tracks[o],l=a.ValueTypeName;if(l==="bool"||l==="string")continue;const c=r.tracks.find(function(g){return g.name===a.name&&g.ValueTypeName===l});if(c===void 0)continue;let h=0;const u=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=u/3);let d=0;const f=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=f/3);const p=a.times.length-1;let x;if(s<=a.times[0]){const g=h,y=u-h;x=a.values.slice(g,y)}else if(s>=a.times[p]){const g=p*u+h,y=g+u-h;x=a.values.slice(g,y)}else{const g=a.createInterpolant(),y=h,v=u-h;g.evaluate(s),x=g.resultBuffer.slice(y,v)}l==="quaternion"&&new Qe().fromArray(x).normalize().conjugate().toArray(x);const m=c.times.length;for(let g=0;g<m;++g){const y=g*f+d;if(l==="quaternion")Qe.multiplyQuaternionsFlat(c.values,y,x,0,c.values,y);else{const v=f-d*2;for(let _=0;_<v;++_)c.values[y+_]-=x[_]}}}return r.blendMode=Gh,r}const CM={convertArray:us,isTypedArray:Gp,getKeyframeOrder:Wp,sortedArray:yh,flattenJSON:cu,subclip:EM,makeClipAdditive:AM};class bo{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,i=e[n],s=e[n-1];t:{e:{let o;n:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<s)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=e[++n],t<i)break e}o=e.length;break n}if(!(t>=s)){const a=e[1];t<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=e[--n-1],t>=s)break e}o=n,n=0;break n}break t}for(;n<o;){const a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],s=e[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=t*i;for(let o=0;o!==i;++o)e[o]=n[s+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Xp extends bo{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ls,endingEnd:ls}}intervalChanged_(t,e,n){const i=this.parameterPositions;let s=t-2,o=t+1,a=i[s],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case cs:s=t,a=2*e-n;break;case jr:s=i.length-2,a=e+i[s]-i[s+1];break;default:s=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case cs:o=t,l=2*n-e;break;case jr:o=1,l=n+i[1]-i[0];break;default:o=t-1,l=e}const c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(t,e,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-e)/(i-e),x=p*p,m=x*p,g=-d*m+2*d*x-d*p,y=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*p+1,v=(-1-f)*m+(1.5+f)*x+.5*p,_=f*m-f*x;for(let E=0;E!==a;++E)s[E]=g*o[h+E]+y*o[c+E]+v*o[l+E]+_*o[u+E];return s}}class hu extends bo{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(i-e),u=1-h;for(let d=0;d!==a;++d)s[d]=o[c+d]*u+o[l+d]*h;return s}}class qp extends bo{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}}class Hn{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=us(e,this.TimeBufferType),this.values=us(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:us(t.times,Array),values:us(t.values,Array)};const i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new qp(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new hu(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Xp(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Kr:e=this.InterpolantFactoryMethodDiscrete;break;case xl:e=this.InterpolantFactoryMethodLinear;break;case Ea:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Kr;case this.InterpolantFactoryMethodLinear:return xl;case this.InterpolantFactoryMethodSmooth:return Ea}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){const n=this.times,i=n.length;let s=0,o=i-1;for(;s!==i&&n[s]<t;)++s;for(;o!==-1&&n[o]>e;)--o;if(++o,s!==0||o!==i){s>=o&&(o=Math.max(o,1),s=o-1);const a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==s;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(i!==void 0&&Gp(i))for(let a=0,l=i.length;a!==l;++a){const c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ea,s=t.length-1;let o=1;for(let a=1;a<s;++a){let l=!1;const c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(i)l=!0;else{const u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){const x=e[u+p];if(x!==e[d+p]||x!==e[f+p]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];const u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(s>0){t[o]=t[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}}Hn.prototype.TimeBufferType=Float32Array;Hn.prototype.ValueBufferType=Float32Array;Hn.prototype.DefaultInterpolation=xl;class ws extends Hn{constructor(t,e,n){super(t,e,n)}}ws.prototype.ValueTypeName="bool";ws.prototype.ValueBufferType=Array;ws.prototype.DefaultInterpolation=Kr;ws.prototype.InterpolantFactoryMethodLinear=void 0;ws.prototype.InterpolantFactoryMethodSmooth=void 0;class uu extends Hn{}uu.prototype.ValueTypeName="color";class ro extends Hn{}ro.prototype.ValueTypeName="number";class Yp extends bo{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(i-e);let c=t*a;for(let h=c+a;c!==h;c+=4)Qe.slerpFlat(s,0,o,c-a,o,c,l);return s}}class So extends Hn{InterpolantFactoryMethodLinear(t){return new Yp(this.times,this.values,this.getValueSize(),t)}}So.prototype.ValueTypeName="quaternion";So.prototype.InterpolantFactoryMethodSmooth=void 0;class Ts extends Hn{constructor(t,e,n){super(t,e,n)}}Ts.prototype.ValueTypeName="string";Ts.prototype.ValueBufferType=Array;Ts.prototype.DefaultInterpolation=Kr;Ts.prototype.InterpolantFactoryMethodLinear=void 0;Ts.prototype.InterpolantFactoryMethodSmooth=void 0;class oo extends Hn{}oo.prototype.ValueTypeName="vector";class ao{constructor(t="",e=-1,n=[],i=Nl){this.name=t,this.tracks=n,this.duration=e,this.blendMode=i,this.uuid=mn(),this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,i=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(PM(n[o]).scale(i));const s=new this(t.name,t.duration,e,t.blendMode);return s.uuid=t.uuid,s}static toJSON(t){const e=[],n=t.tracks,i={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode};for(let s=0,o=n.length;s!==o;++s)e.push(Hn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(t,e,n,i){const s=e.length,o=[];for(let a=0;a<s;a++){let l=[],c=[];l.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);const h=Wp(l);l=yh(l,1,h),c=yh(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),o.push(new ro(".morphTargetInfluences["+e[a].name+"]",l,c).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const i=t;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===e)return n[i];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,l=t.length;a<l;a++){const c=t[a],h=c.name.match(s);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const o=[];for(const a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],e,n));return o}static parseAnimation(t,e){if(!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,p,x){if(f.length!==0){const m=[],g=[];cu(f,m,g,p),m.length!==0&&x.push(new u(d,m,g))}},i=[],s=t.name||"default",o=t.fps||30,a=t.blendMode;let l=t.length||-1;const c=t.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let p;for(p=0;p<d.length;p++)if(d[p].morphTargets)for(let x=0;x<d[p].morphTargets.length;x++)f[d[p].morphTargets[x]]=-1;for(const x in f){const m=[],g=[];for(let y=0;y!==d[p].morphTargets.length;++y){const v=d[p];m.push(v.time),g.push(v.morphTarget===x?1:0)}i.push(new ro(".morphTargetInfluence["+x+"]",m,g))}l=f.length*o}else{const f=".bones["+e[u].name+"]";n(oo,f+".position",d,"pos",i),n(So,f+".quaternion",d,"rot",i),n(oo,f+".scale",d,"scl",i)}}return i.length===0?null:new this(s,l,i,a)}resetDuration(){const t=this.tracks;let e=0;for(let n=0,i=t.length;n!==i;++n){const s=this.tracks[n];e=Math.max(e,s.times[s.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let e=0;e<this.tracks.length;e++)t.push(this.tracks[e].clone());return new this.constructor(this.name,this.duration,t,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function RM(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ro;case"vector":case"vector2":case"vector3":case"vector4":return oo;case"color":return uu;case"quaternion":return So;case"bool":case"boolean":return ws;case"string":return Ts}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function PM(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=RM(r.type);if(r.times===void 0){const e=[],n=[];cu(r.keys,e,n,"value"),r.times=e,r.values=n}return t.parse!==void 0?t.parse(r):new t(r.name,r.times,r.values,r.interpolation)}const fi={enabled:!1,files:{},add:function(r,t){this.enabled!==!1&&(this.files[r]=t)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class du{constructor(t,e,n){const i=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,s===!1&&i.onStart!==void 0&&i.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null}}}const $p=new du;class cn{constructor(t){this.manager=t!==void 0?t:$p,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(i,s){n.load(t,i,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}}cn.DEFAULT_MATERIAL_NAME="__DEFAULT";const ai={};class IM extends Error{constructor(t,e){super(t),this.response=e}}class _i extends cn{constructor(t){super(t)}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=fi.get(t);if(s!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(s),this.manager.itemEnd(t)},0),s;if(ai[t]!==void 0){ai[t].push({onLoad:e,onProgress:n,onError:i});return}ai[t]=[],ai[t].push({onLoad:e,onProgress:n,onError:i});const o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=ai[t],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0;let x=0;const m=new ReadableStream({start(g){y();function y(){u.read().then(({done:v,value:_})=>{if(v)g.close();else{x+=_.byteLength;const E=new ProgressEvent("progress",{lengthComputable:p,loaded:x,total:f});for(let b=0,w=h.length;b<w;b++){const C=h[b];C.onProgress&&C.onProgress(E)}g.enqueue(_),y()}},v=>{g.error(v)})}}});return new Response(m)}else throw new IM(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a===void 0)return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{fi.add(t,c);const h=ai[t];delete ai[t];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=ai[t];if(h===void 0)throw this.manager.itemError(t),c;delete ai[t];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}}class zM extends cn{constructor(t){super(t)}load(t,e,n,i){const s=this,o=new _i(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(a){try{e(s.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),s.manager.itemError(t)}},n,i)}parse(t){const e=[];for(let n=0;n<t.length;n++){const i=ao.parse(t[n]);e.push(i)}return e}}class LM extends cn{constructor(t){super(t)}load(t,e,n,i){const s=this,o=[],a=new Yl,l=new _i(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(s.withCredentials);let c=0;function h(u){l.load(t[u],function(d){const f=s.parse(d,!0);o[u]={width:f.width,height:f.height,format:f.format,mipmaps:f.mipmaps},c+=1,c===6&&(f.mipmapCount===1&&(a.minFilter=Ee),a.image=o,a.format=f.format,a.needsUpdate=!0,e&&e(a))},n,i)}if(Array.isArray(t))for(let u=0,d=t.length;u<d;++u)h(u);else l.load(t,function(u){const d=s.parse(u,!0);if(d.isCubemap){const f=d.mipmaps.length/d.mipmapCount;for(let p=0;p<f;p++){o[p]={mipmaps:[]};for(let x=0;x<d.mipmapCount;x++)o[p].mipmaps.push(d.mipmaps[p*d.mipmapCount+x]),o[p].format=d.format,o[p].width=d.width,o[p].height=d.height}a.image=o}else a.image.width=d.width,a.image.height=d.height,a.mipmaps=d.mipmaps;d.mipmapCount===1&&(a.minFilter=Ee),a.format=d.format,a.needsUpdate=!0,e&&e(a)},n,i);return a}}class lo extends cn{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=this,o=fi.get(t);if(o!==void 0)return s.manager.itemStart(t),setTimeout(function(){e&&e(o),s.manager.itemEnd(t)},0),o;const a=to("img");function l(){h(),fi.add(t,this),e&&e(this),s.manager.itemEnd(t)}function c(u){h(),i&&i(u),s.manager.itemError(t),s.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(t),a.src=t,a}}class DM extends cn{constructor(t){super(t)}load(t,e,n,i){const s=new mo;s.colorSpace=De;const o=new lo(this.manager);o.setCrossOrigin(this.crossOrigin),o.setPath(this.path);let a=0;function l(c){o.load(t[c],function(h){s.images[c]=h,a++,a===6&&(s.needsUpdate=!0,e&&e(s))},void 0,i)}for(let c=0;c<t.length;++c)l(c);return s}}class UM extends cn{constructor(t){super(t)}load(t,e,n,i){const s=this,o=new gn,a=new _i(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(s.withCredentials),a.load(t,function(l){let c;try{c=s.parse(l)}catch(h){if(i!==void 0)i(h);else{console.error(h);return}}c.image!==void 0?o.image=c.image:c.data!==void 0&&(o.image.width=c.width,o.image.height=c.height,o.image.data=c.data),o.wrapS=c.wrapS!==void 0?c.wrapS:Sn,o.wrapT=c.wrapT!==void 0?c.wrapT:Sn,o.magFilter=c.magFilter!==void 0?c.magFilter:Ee,o.minFilter=c.minFilter!==void 0?c.minFilter:Ee,o.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(o.colorSpace=c.colorSpace),c.flipY!==void 0&&(o.flipY=c.flipY),c.format!==void 0&&(o.format=c.format),c.type!==void 0&&(o.type=c.type),c.mipmaps!==void 0&&(o.mipmaps=c.mipmaps,o.minFilter=kn),c.mipmapCount===1&&(o.minFilter=Ee),c.generateMipmaps!==void 0&&(o.generateMipmaps=c.generateMipmaps),o.needsUpdate=!0,e&&e(o,c)},n,i),o}}class kM extends cn{constructor(t){super(t)}load(t,e,n,i){const s=new Me,o=new lo(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){s.image=a,s.needsUpdate=!0,e!==void 0&&e(s)},n,i),s}}class Vi extends ie{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new dt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class fu extends Vi{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ie.DEFAULT_UP),this.updateMatrix(),this.groundColor=new dt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const jc=new Ut,Wd=new R,Xd=new R;class pu{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Z(512,512),this.map=null,this.mapPass=null,this.matrix=new Ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new go,this._frameExtents=new Z(1,1),this._viewportCount=1,this._viewports=[new ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Wd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Wd),Xd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Xd),e.updateMatrixWorld(),jc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(jc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class NM extends pu{constructor(){super(new Ue(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=rr*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=t.distance||e.far;(n!==e.fov||i!==e.aspect||s!==e.far)&&(e.fov=n,e.aspect=i,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class Zp extends Vi{constructor(t,e,n=0,i=Math.PI/3,s=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ie.DEFAULT_UP),this.updateMatrix(),this.target=new ie,this.distance=n,this.angle=i,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new NM}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const qd=new Ut,Cr=new R,Jc=new R;class FM extends pu{constructor(){super(new Ue(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Z(4,2),this._viewportCount=6,this._viewports=[new ne(2,1,1,1),new ne(0,1,1,1),new ne(3,1,1,1),new ne(1,1,1,1),new ne(3,0,1,1),new ne(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Cr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Cr),Jc.copy(n.position),Jc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Jc),n.updateMatrixWorld(),i.makeTranslation(-Cr.x,-Cr.y,-Cr.z),qd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qd)}}class Kp extends Vi{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new FM}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class OM extends pu{constructor(){super(new xo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class mu extends Vi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ie.DEFAULT_UP),this.updateMatrix(),this.target=new ie,this.shadow=new OM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class jp extends Vi{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Jp extends Vi{constructor(t,e,n=10,i=10){super(t,e),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(t){this.intensity=t/(this.width*this.height*Math.PI)}copy(t){return super.copy(t),this.width=t.width,this.height=t.height,this}toJSON(t){const e=super.toJSON(t);return e.object.width=this.width,e.object.height=this.height,e}}class Qp{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let t=0;t<9;t++)this.coefficients.push(new R)}set(t){for(let e=0;e<9;e++)this.coefficients[e].copy(t[e]);return this}zero(){for(let t=0;t<9;t++)this.coefficients[t].set(0,0,0);return this}getAt(t,e){const n=t.x,i=t.y,s=t.z,o=this.coefficients;return e.copy(o[0]).multiplyScalar(.282095),e.addScaledVector(o[1],.488603*i),e.addScaledVector(o[2],.488603*s),e.addScaledVector(o[3],.488603*n),e.addScaledVector(o[4],1.092548*(n*i)),e.addScaledVector(o[5],1.092548*(i*s)),e.addScaledVector(o[6],.315392*(3*s*s-1)),e.addScaledVector(o[7],1.092548*(n*s)),e.addScaledVector(o[8],.546274*(n*n-i*i)),e}getIrradianceAt(t,e){const n=t.x,i=t.y,s=t.z,o=this.coefficients;return e.copy(o[0]).multiplyScalar(.886227),e.addScaledVector(o[1],2*.511664*i),e.addScaledVector(o[2],2*.511664*s),e.addScaledVector(o[3],2*.511664*n),e.addScaledVector(o[4],2*.429043*n*i),e.addScaledVector(o[5],2*.429043*i*s),e.addScaledVector(o[6],.743125*s*s-.247708),e.addScaledVector(o[7],2*.429043*n*s),e.addScaledVector(o[8],.429043*(n*n-i*i)),e}add(t){for(let e=0;e<9;e++)this.coefficients[e].add(t.coefficients[e]);return this}addScaledSH(t,e){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(t.coefficients[n],e);return this}scale(t){for(let e=0;e<9;e++)this.coefficients[e].multiplyScalar(t);return this}lerp(t,e){for(let n=0;n<9;n++)this.coefficients[n].lerp(t.coefficients[n],e);return this}equals(t){for(let e=0;e<9;e++)if(!this.coefficients[e].equals(t.coefficients[e]))return!1;return!0}copy(t){return this.set(t.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(t,e=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(t,e+i*3);return this}toArray(t=[],e=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(t,e+i*3);return t}static getBasisAt(t,e){const n=t.x,i=t.y,s=t.z;e[0]=.282095,e[1]=.488603*i,e[2]=.488603*s,e[3]=.488603*n,e[4]=1.092548*n*i,e[5]=1.092548*i*s,e[6]=.315392*(3*s*s-1),e[7]=1.092548*n*s,e[8]=.546274*(n*n-i*i)}}class tm extends Vi{constructor(t=new Qp,e=1){super(void 0,e),this.isLightProbe=!0,this.sh=t}copy(t){return super.copy(t),this.sh.copy(t.sh),this}fromJSON(t){return this.intensity=t.intensity,this.sh.fromArray(t.sh),this}toJSON(t){const e=super.toJSON(t);return e.object.sh=this.sh.toArray(),e}}class lc extends cn{constructor(t){super(t),this.textures={}}load(t,e,n,i){const s=this,o=new _i(s.manager);o.setPath(s.path),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(t,function(a){try{e(s.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),s.manager.itemError(t)}},n,i)}parse(t){const e=this.textures;function n(s){return e[s]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",s),e[s]}const i=this.createMaterialFromType(t.type);if(t.uuid!==void 0&&(i.uuid=t.uuid),t.name!==void 0&&(i.name=t.name),t.color!==void 0&&i.color!==void 0&&i.color.setHex(t.color),t.roughness!==void 0&&(i.roughness=t.roughness),t.metalness!==void 0&&(i.metalness=t.metalness),t.sheen!==void 0&&(i.sheen=t.sheen),t.sheenColor!==void 0&&(i.sheenColor=new dt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(i.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(t.emissive),t.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(t.specular),t.specularIntensity!==void 0&&(i.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(i.shininess=t.shininess),t.clearcoat!==void 0&&(i.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(i.dispersion=t.dispersion),t.iridescence!==void 0&&(i.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(i.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(i.transmission=t.transmission),t.thickness!==void 0&&(i.thickness=t.thickness),t.attenuationDistance!==void 0&&(i.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(i.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(i.fog=t.fog),t.flatShading!==void 0&&(i.flatShading=t.flatShading),t.blending!==void 0&&(i.blending=t.blending),t.combine!==void 0&&(i.combine=t.combine),t.side!==void 0&&(i.side=t.side),t.shadowSide!==void 0&&(i.shadowSide=t.shadowSide),t.opacity!==void 0&&(i.opacity=t.opacity),t.transparent!==void 0&&(i.transparent=t.transparent),t.alphaTest!==void 0&&(i.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(i.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(i.depthFunc=t.depthFunc),t.depthTest!==void 0&&(i.depthTest=t.depthTest),t.depthWrite!==void 0&&(i.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(i.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(i.blendSrc=t.blendSrc),t.blendDst!==void 0&&(i.blendDst=t.blendDst),t.blendEquation!==void 0&&(i.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(i.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(i.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(i.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&i.blendColor!==void 0&&i.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(i.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(i.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(i.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(i.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(i.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(i.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(i.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(i.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(i.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(i.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(i.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(i.rotation=t.rotation),t.linewidth!==void 0&&(i.linewidth=t.linewidth),t.dashSize!==void 0&&(i.dashSize=t.dashSize),t.gapSize!==void 0&&(i.gapSize=t.gapSize),t.scale!==void 0&&(i.scale=t.scale),t.polygonOffset!==void 0&&(i.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(i.dithering=t.dithering),t.alphaToCoverage!==void 0&&(i.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(i.forceSinglePass=t.forceSinglePass),t.visible!==void 0&&(i.visible=t.visible),t.toneMapped!==void 0&&(i.toneMapped=t.toneMapped),t.userData!==void 0&&(i.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?i.vertexColors=t.vertexColors>0:i.vertexColors=t.vertexColors),t.uniforms!==void 0)for(const s in t.uniforms){const o=t.uniforms[s];switch(i.uniforms[s]={},o.type){case"t":i.uniforms[s].value=n(o.value);break;case"c":i.uniforms[s].value=new dt().setHex(o.value);break;case"v2":i.uniforms[s].value=new Z().fromArray(o.value);break;case"v3":i.uniforms[s].value=new R().fromArray(o.value);break;case"v4":i.uniforms[s].value=new ne().fromArray(o.value);break;case"m3":i.uniforms[s].value=new Wt().fromArray(o.value);break;case"m4":i.uniforms[s].value=new Ut().fromArray(o.value);break;default:i.uniforms[s].value=o.value}}if(t.defines!==void 0&&(i.defines=t.defines),t.vertexShader!==void 0&&(i.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(i.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(i.glslVersion=t.glslVersion),t.extensions!==void 0)for(const s in t.extensions)i.extensions[s]=t.extensions[s];if(t.lights!==void 0&&(i.lights=t.lights),t.clipping!==void 0&&(i.clipping=t.clipping),t.size!==void 0&&(i.size=t.size),t.sizeAttenuation!==void 0&&(i.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(i.map=n(t.map)),t.matcap!==void 0&&(i.matcap=n(t.matcap)),t.alphaMap!==void 0&&(i.alphaMap=n(t.alphaMap)),t.bumpMap!==void 0&&(i.bumpMap=n(t.bumpMap)),t.bumpScale!==void 0&&(i.bumpScale=t.bumpScale),t.normalMap!==void 0&&(i.normalMap=n(t.normalMap)),t.normalMapType!==void 0&&(i.normalMapType=t.normalMapType),t.normalScale!==void 0){let s=t.normalScale;Array.isArray(s)===!1&&(s=[s,s]),i.normalScale=new Z().fromArray(s)}return t.displacementMap!==void 0&&(i.displacementMap=n(t.displacementMap)),t.displacementScale!==void 0&&(i.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(i.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(i.roughnessMap=n(t.roughnessMap)),t.metalnessMap!==void 0&&(i.metalnessMap=n(t.metalnessMap)),t.emissiveMap!==void 0&&(i.emissiveMap=n(t.emissiveMap)),t.emissiveIntensity!==void 0&&(i.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(i.specularMap=n(t.specularMap)),t.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(t.specularIntensityMap)),t.specularColorMap!==void 0&&(i.specularColorMap=n(t.specularColorMap)),t.envMap!==void 0&&(i.envMap=n(t.envMap)),t.envMapRotation!==void 0&&i.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(i.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(i.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(i.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(i.lightMap=n(t.lightMap)),t.lightMapIntensity!==void 0&&(i.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(i.aoMap=n(t.aoMap)),t.aoMapIntensity!==void 0&&(i.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(i.gradientMap=n(t.gradientMap)),t.clearcoatMap!==void 0&&(i.clearcoatMap=n(t.clearcoatMap)),t.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(t.clearcoatRoughnessMap)),t.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(t.clearcoatNormalMap)),t.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new Z().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(i.iridescenceMap=n(t.iridescenceMap)),t.iridescenceThicknessMap!==void 0&&(i.iridescenceThicknessMap=n(t.iridescenceThicknessMap)),t.transmissionMap!==void 0&&(i.transmissionMap=n(t.transmissionMap)),t.thicknessMap!==void 0&&(i.thicknessMap=n(t.thicknessMap)),t.anisotropyMap!==void 0&&(i.anisotropyMap=n(t.anisotropyMap)),t.sheenColorMap!==void 0&&(i.sheenColorMap=n(t.sheenColorMap)),t.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(t.sheenRoughnessMap)),i}setTextures(t){return this.textures=t,this}createMaterialFromType(t){return lc.createMaterialFromType(t)}static createMaterialFromType(t){const e={ShadowMaterial:kp,SpriteMaterial:Jh,RawShaderMaterial:au,ShaderMaterial:ge,PointsMaterial:tu,MeshPhysicalMaterial:Np,MeshStandardMaterial:fr,MeshPhongMaterial:Fp,MeshToonMaterial:Op,MeshNormalMaterial:lu,MeshLambertMaterial:Bp,MeshDepthMaterial:Kh,MeshDistanceMaterial:jh,MeshBasicMaterial:wn,MeshMatcapMaterial:Vp,LineDashedMaterial:Hp,LineBasicMaterial:Ye,Material:qe};return new e[t]}}class Mh{static decodeText(t){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(t);let e="";for(let n=0,i=t.length;n<i;n++)e+=String.fromCharCode(t[n]);try{return decodeURIComponent(escape(e))}catch{return e}}static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}}class em extends Ft{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class nm extends cn{constructor(t){super(t)}load(t,e,n,i){const s=this,o=new _i(s.manager);o.setPath(s.path),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(t,function(a){try{e(s.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),s.manager.itemError(t)}},n,i)}parse(t){const e={},n={};function i(f,p){if(e[p]!==void 0)return e[p];const m=f.interleavedBuffers[p],g=s(f,m.buffer),y=js(m.type,g),v=new Wl(y,m.stride);return v.uuid=m.uuid,e[p]=v,v}function s(f,p){if(n[p]!==void 0)return n[p];const m=f.arrayBuffers[p],g=new Uint32Array(m).buffer;return n[p]=g,g}const o=t.isInstancedBufferGeometry?new em:new Ft,a=t.data.index;if(a!==void 0){const f=js(a.type,a.array);o.setIndex(new Qt(f,1))}const l=t.data.attributes;for(const f in l){const p=l[f];let x;if(p.isInterleavedBufferAttribute){const m=i(t.data,p.data);x=new _s(m,p.itemSize,p.offset,p.normalized)}else{const m=js(p.type,p.array),g=p.isInstancedBufferAttribute?ar:Qt;x=new g(m,p.itemSize,p.normalized)}p.name!==void 0&&(x.name=p.name),p.usage!==void 0&&x.setUsage(p.usage),o.setAttribute(f,x)}const c=t.data.morphAttributes;if(c)for(const f in c){const p=c[f],x=[];for(let m=0,g=p.length;m<g;m++){const y=p[m];let v;if(y.isInterleavedBufferAttribute){const _=i(t.data,y.data);v=new _s(_,y.itemSize,y.offset,y.normalized)}else{const _=js(y.type,y.array);v=new Qt(_,y.itemSize,y.normalized)}y.name!==void 0&&(v.name=y.name),x.push(v)}o.morphAttributes[f]=x}t.data.morphTargetsRelative&&(o.morphTargetsRelative=!0);const u=t.data.groups||t.data.drawcalls||t.data.offsets;if(u!==void 0)for(let f=0,p=u.length;f!==p;++f){const x=u[f];o.addGroup(x.start,x.count,x.materialIndex)}const d=t.data.boundingSphere;if(d!==void 0){const f=new R;d.center!==void 0&&f.fromArray(d.center),o.boundingSphere=new Xe(f,d.radius)}return t.name&&(o.name=t.name),t.userData&&(o.userData=t.userData),o}}class BM extends cn{constructor(t){super(t)}load(t,e,n,i){const s=this,o=this.path===""?Mh.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||o;const a=new _i(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(l){let c=null;try{c=JSON.parse(l)}catch(u){i!==void 0&&i(u),console.error("THREE:ObjectLoader: Can't parse "+t+".",u.message);return}const h=c.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+t)),console.error("THREE.ObjectLoader: Can't load "+t);return}s.parse(c,e)},n,i)}async loadAsync(t,e){const n=this,i=this.path===""?Mh.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||i;const s=new _i(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials);const o=await s.loadAsync(t,e),a=JSON.parse(o),l=a.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+t);return await n.parseAsync(a)}parse(t,e){const n=this.parseAnimations(t.animations),i=this.parseShapes(t.shapes),s=this.parseGeometries(t.geometries,i),o=this.parseImages(t.images,function(){e!==void 0&&e(c)}),a=this.parseTextures(t.textures,o),l=this.parseMaterials(t.materials,a),c=this.parseObject(t.object,s,l,a,n),h=this.parseSkeletons(t.skeletons,c);if(this.bindSkeletons(c,h),this.bindLightTargets(c),e!==void 0){let u=!1;for(const d in o)if(o[d].data instanceof HTMLImageElement){u=!0;break}u===!1&&e(c)}return c}async parseAsync(t){const e=this.parseAnimations(t.animations),n=this.parseShapes(t.shapes),i=this.parseGeometries(t.geometries,n),s=await this.parseImagesAsync(t.images),o=this.parseTextures(t.textures,s),a=this.parseMaterials(t.materials,o),l=this.parseObject(t.object,i,a,o,e),c=this.parseSkeletons(t.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}parseShapes(t){const e={};if(t!==void 0)for(let n=0,i=t.length;n<i;n++){const s=new ms().fromJSON(t[n]);e[s.uuid]=s}return e}parseSkeletons(t,e){const n={},i={};if(e.traverse(function(s){s.isBone&&(i[s.uuid]=s)}),t!==void 0)for(let s=0,o=t.length;s<o;s++){const a=new Xl().fromJSON(t[s],i);n[a.uuid]=a}return n}parseGeometries(t,e){const n={};if(t!==void 0){const i=new nm;for(let s=0,o=t.length;s<o;s++){let a;const l=t[s];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":a=i.parse(l);break;default:l.type in Gd?a=Gd[l.type].fromJSON(l,e):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${l.type}"`)}a.uuid=l.uuid,l.name!==void 0&&(a.name=l.name),l.userData!==void 0&&(a.userData=l.userData),n[l.uuid]=a}}return n}parseMaterials(t,e){const n={},i={};if(t!==void 0){const s=new lc;s.setTextures(e);for(let o=0,a=t.length;o<a;o++){const l=t[o];n[l.uuid]===void 0&&(n[l.uuid]=s.parse(l)),i[l.uuid]=n[l.uuid]}}return i}parseAnimations(t){const e={};if(t!==void 0)for(let n=0;n<t.length;n++){const i=t[n],s=ao.parse(i);e[s.uuid]=s}return e}parseImages(t,e){const n=this,i={};let s;function o(l){return n.manager.itemStart(l),s.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function a(l){if(typeof l=="string"){const c=l,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return o(h)}else return l.data?{data:js(l.type,l.data),width:l.width,height:l.height}:null}if(t!==void 0&&t.length>0){const l=new du(e);s=new lo(l),s.setCrossOrigin(this.crossOrigin);for(let c=0,h=t.length;c<h;c++){const u=t[c],d=u.url;if(Array.isArray(d)){const f=[];for(let p=0,x=d.length;p<x;p++){const m=d[p],g=a(m);g!==null&&(g instanceof HTMLImageElement?f.push(g):f.push(new gn(g.data,g.width,g.height)))}i[u.uuid]=new hs(f)}else{const f=a(u.url);i[u.uuid]=new hs(f)}}}return i}async parseImagesAsync(t){const e=this,n={};let i;async function s(o){if(typeof o=="string"){const a=o,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(a)?a:e.resourcePath+a;return await i.loadAsync(l)}else return o.data?{data:js(o.type,o.data),width:o.width,height:o.height}:null}if(t!==void 0&&t.length>0){i=new lo(this.manager),i.setCrossOrigin(this.crossOrigin);for(let o=0,a=t.length;o<a;o++){const l=t[o],c=l.url;if(Array.isArray(c)){const h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u],p=await s(f);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new gn(p.data,p.width,p.height)))}n[l.uuid]=new hs(h)}else{const h=await s(l.url);n[l.uuid]=new hs(h)}}}return n}parseTextures(t,e){function n(s,o){return typeof s=="number"?s:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",s),o[s])}const i={};if(t!==void 0)for(let s=0,o=t.length;s<o;s++){const a=t[s];a.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',a.uuid),e[a.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",a.image);const l=e[a.image],c=l.data;let h;Array.isArray(c)?(h=new mo,c.length===6&&(h.needsUpdate=!0)):(c&&c.data?h=new gn:h=new Me,c&&(h.needsUpdate=!0)),h.source=l,h.uuid=a.uuid,a.name!==void 0&&(h.name=a.name),a.mapping!==void 0&&(h.mapping=n(a.mapping,VM)),a.channel!==void 0&&(h.channel=a.channel),a.offset!==void 0&&h.offset.fromArray(a.offset),a.repeat!==void 0&&h.repeat.fromArray(a.repeat),a.center!==void 0&&h.center.fromArray(a.center),a.rotation!==void 0&&(h.rotation=a.rotation),a.wrap!==void 0&&(h.wrapS=n(a.wrap[0],Yd),h.wrapT=n(a.wrap[1],Yd)),a.format!==void 0&&(h.format=a.format),a.internalFormat!==void 0&&(h.internalFormat=a.internalFormat),a.type!==void 0&&(h.type=a.type),a.colorSpace!==void 0&&(h.colorSpace=a.colorSpace),a.minFilter!==void 0&&(h.minFilter=n(a.minFilter,$d)),a.magFilter!==void 0&&(h.magFilter=n(a.magFilter,$d)),a.anisotropy!==void 0&&(h.anisotropy=a.anisotropy),a.flipY!==void 0&&(h.flipY=a.flipY),a.generateMipmaps!==void 0&&(h.generateMipmaps=a.generateMipmaps),a.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=a.premultiplyAlpha),a.unpackAlignment!==void 0&&(h.unpackAlignment=a.unpackAlignment),a.compareFunction!==void 0&&(h.compareFunction=a.compareFunction),a.userData!==void 0&&(h.userData=a.userData),i[a.uuid]=h}return i}parseObject(t,e,n,i,s){let o;function a(d){return e[d]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",d),e[d]}function l(d){if(d!==void 0){if(Array.isArray(d)){const f=[];for(let p=0,x=d.length;p<x;p++){const m=d[p];n[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",m),f.push(n[m])}return f}return n[d]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",d),n[d]}}function c(d){return i[d]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",d),i[d]}let h,u;switch(t.type){case"Scene":o=new _l,t.background!==void 0&&(Number.isInteger(t.background)?o.background=new dt(t.background):o.background=c(t.background)),t.environment!==void 0&&(o.environment=c(t.environment)),t.fog!==void 0&&(t.fog.type==="Fog"?o.fog=new vo(t.fog.color,t.fog.near,t.fog.far):t.fog.type==="FogExp2"&&(o.fog=new Gl(t.fog.color,t.fog.density)),t.fog.name!==""&&(o.fog.name=t.fog.name)),t.backgroundBlurriness!==void 0&&(o.backgroundBlurriness=t.backgroundBlurriness),t.backgroundIntensity!==void 0&&(o.backgroundIntensity=t.backgroundIntensity),t.backgroundRotation!==void 0&&o.backgroundRotation.fromArray(t.backgroundRotation),t.environmentIntensity!==void 0&&(o.environmentIntensity=t.environmentIntensity),t.environmentRotation!==void 0&&o.environmentRotation.fromArray(t.environmentRotation);break;case"PerspectiveCamera":o=new Ue(t.fov,t.aspect,t.near,t.far),t.focus!==void 0&&(o.focus=t.focus),t.zoom!==void 0&&(o.zoom=t.zoom),t.filmGauge!==void 0&&(o.filmGauge=t.filmGauge),t.filmOffset!==void 0&&(o.filmOffset=t.filmOffset),t.view!==void 0&&(o.view=Object.assign({},t.view));break;case"OrthographicCamera":o=new xo(t.left,t.right,t.top,t.bottom,t.near,t.far),t.zoom!==void 0&&(o.zoom=t.zoom),t.view!==void 0&&(o.view=Object.assign({},t.view));break;case"AmbientLight":o=new jp(t.color,t.intensity);break;case"DirectionalLight":o=new mu(t.color,t.intensity),o.target=t.target||"";break;case"PointLight":o=new Kp(t.color,t.intensity,t.distance,t.decay);break;case"RectAreaLight":o=new Jp(t.color,t.intensity,t.width,t.height);break;case"SpotLight":o=new Zp(t.color,t.intensity,t.distance,t.angle,t.penumbra,t.decay),o.target=t.target||"";break;case"HemisphereLight":o=new fu(t.color,t.groundColor,t.intensity);break;case"LightProbe":o=new tm().fromJSON(t);break;case"SkinnedMesh":h=a(t.geometry),u=l(t.material),o=new bp(h,u),t.bindMode!==void 0&&(o.bindMode=t.bindMode),t.bindMatrix!==void 0&&o.bindMatrix.fromArray(t.bindMatrix),t.skeleton!==void 0&&(o.skeleton=t.skeleton);break;case"Mesh":h=a(t.geometry),u=l(t.material),o=new ue(h,u);break;case"InstancedMesh":h=a(t.geometry),u=l(t.material);const d=t.count,f=t.instanceMatrix,p=t.instanceColor;o=new ql(h,u,d),o.instanceMatrix=new ar(new Float32Array(f.array),16),p!==void 0&&(o.instanceColor=new ar(new Float32Array(p.array),p.itemSize));break;case"BatchedMesh":h=a(t.geometry),u=l(t.material),o=new Sp(t.maxInstanceCount,t.maxVertexCount,t.maxIndexCount,u),o.geometry=h,o.perObjectFrustumCulled=t.perObjectFrustumCulled,o.sortObjects=t.sortObjects,o._drawRanges=t.drawRanges,o._reservedRanges=t.reservedRanges,o._visibility=t.visibility,o._active=t.active,o._bounds=t.bounds.map(x=>{const m=new tn;m.min.fromArray(x.boxMin),m.max.fromArray(x.boxMax);const g=new Xe;return g.radius=x.sphereRadius,g.center.fromArray(x.sphereCenter),{boxInitialized:x.boxInitialized,box:m,sphereInitialized:x.sphereInitialized,sphere:g}}),o._maxInstanceCount=t.maxInstanceCount,o._maxVertexCount=t.maxVertexCount,o._maxIndexCount=t.maxIndexCount,o._geometryInitialized=t.geometryInitialized,o._geometryCount=t.geometryCount,o._matricesTexture=c(t.matricesTexture.uuid),t.colorsTexture!==void 0&&(o._colorsTexture=c(t.colorsTexture.uuid));break;case"LOD":o=new Mp;break;case"Line":o=new Ni(a(t.geometry),l(t.material));break;case"LineLoop":o=new wp(a(t.geometry),l(t.material));break;case"LineSegments":o=new Bn(a(t.geometry),l(t.material));break;case"PointCloud":case"Points":o=new Tp(a(t.geometry),l(t.material));break;case"Sprite":o=new yp(l(t.material));break;case"Group":o=new Zn;break;case"Bone":o=new Qh;break;default:o=new ie}if(o.uuid=t.uuid,t.name!==void 0&&(o.name=t.name),t.matrix!==void 0?(o.matrix.fromArray(t.matrix),t.matrixAutoUpdate!==void 0&&(o.matrixAutoUpdate=t.matrixAutoUpdate),o.matrixAutoUpdate&&o.matrix.decompose(o.position,o.quaternion,o.scale)):(t.position!==void 0&&o.position.fromArray(t.position),t.rotation!==void 0&&o.rotation.fromArray(t.rotation),t.quaternion!==void 0&&o.quaternion.fromArray(t.quaternion),t.scale!==void 0&&o.scale.fromArray(t.scale)),t.up!==void 0&&o.up.fromArray(t.up),t.castShadow!==void 0&&(o.castShadow=t.castShadow),t.receiveShadow!==void 0&&(o.receiveShadow=t.receiveShadow),t.shadow&&(t.shadow.intensity!==void 0&&(o.shadow.intensity=t.shadow.intensity),t.shadow.bias!==void 0&&(o.shadow.bias=t.shadow.bias),t.shadow.normalBias!==void 0&&(o.shadow.normalBias=t.shadow.normalBias),t.shadow.radius!==void 0&&(o.shadow.radius=t.shadow.radius),t.shadow.mapSize!==void 0&&o.shadow.mapSize.fromArray(t.shadow.mapSize),t.shadow.camera!==void 0&&(o.shadow.camera=this.parseObject(t.shadow.camera))),t.visible!==void 0&&(o.visible=t.visible),t.frustumCulled!==void 0&&(o.frustumCulled=t.frustumCulled),t.renderOrder!==void 0&&(o.renderOrder=t.renderOrder),t.userData!==void 0&&(o.userData=t.userData),t.layers!==void 0&&(o.layers.mask=t.layers),t.children!==void 0){const d=t.children;for(let f=0;f<d.length;f++)o.add(this.parseObject(d[f],e,n,i,s))}if(t.animations!==void 0){const d=t.animations;for(let f=0;f<d.length;f++){const p=d[f];o.animations.push(s[p])}}if(t.type==="LOD"){t.autoUpdate!==void 0&&(o.autoUpdate=t.autoUpdate);const d=t.levels;for(let f=0;f<d.length;f++){const p=d[f],x=o.getObjectByProperty("uuid",p.object);x!==void 0&&o.addLevel(x,p.distance,p.hysteresis)}}return o}bindSkeletons(t,e){Object.keys(e).length!==0&&t.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const i=e[n.skeleton];i===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(t){t.traverse(function(e){if(e.isDirectionalLight||e.isSpotLight){const n=e.target,i=t.getObjectByProperty("uuid",n);i!==void 0?e.target=i:e.target=new ie}})}}const VM={UVMapping:Pl,CubeReflectionMapping:xi,CubeRefractionMapping:Di,EquirectangularReflectionMapping:Yr,EquirectangularRefractionMapping:$r,CubeUVReflectionMapping:hr},Yd={RepeatWrapping:Jn,ClampToEdgeWrapping:Sn,MirroredRepeatWrapping:Zr},$d={NearestFilter:Ce,NearestMipmapNearestFilter:Lh,NearestMipmapLinearFilter:Ks,LinearFilter:Ee,LinearMipmapNearestFilter:Ur,LinearMipmapLinearFilter:kn};class HM extends cn{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(t){return this.options=t,this}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=this,o=fi.get(t);if(o!==void 0){if(s.manager.itemStart(t),o.then){o.then(c=>{e&&e(c),s.manager.itemEnd(t)}).catch(c=>{i&&i(c)});return}return setTimeout(function(){e&&e(o),s.manager.itemEnd(t)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const l=fetch(t,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return fi.add(t,c),e&&e(c),s.manager.itemEnd(t),c}).catch(function(c){i&&i(c),fi.remove(t),s.manager.itemError(t),s.manager.itemEnd(t)});fi.add(t,l),s.manager.itemStart(t)}}let da;class gu{static getContext(){return da===void 0&&(da=new(window.AudioContext||window.webkitAudioContext)),da}static setContext(t){da=t}}class GM extends cn{constructor(t){super(t)}load(t,e,n,i){const s=this,o=new _i(this.manager);o.setResponseType("arraybuffer"),o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(l){try{const c=l.slice(0);gu.getContext().decodeAudioData(c,function(u){e(u)}).catch(a)}catch(c){a(c)}},n,i);function a(l){i?i(l):console.error(l),s.manager.itemError(t)}}}const Zd=new Ut,Kd=new Ut,ji=new Ut;class WM{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new Ue,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new Ue,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(t){const e=this._cache;if(e.focus!==t.focus||e.fov!==t.fov||e.aspect!==t.aspect*this.aspect||e.near!==t.near||e.far!==t.far||e.zoom!==t.zoom||e.eyeSep!==this.eyeSep){e.focus=t.focus,e.fov=t.fov,e.aspect=t.aspect*this.aspect,e.near=t.near,e.far=t.far,e.zoom=t.zoom,e.eyeSep=this.eyeSep,ji.copy(t.projectionMatrix);const i=e.eyeSep/2,s=i*e.near/e.focus,o=e.near*Math.tan(ps*e.fov*.5)/e.zoom;let a,l;Kd.elements[12]=-i,Zd.elements[12]=i,a=-o*e.aspect+s,l=o*e.aspect+s,ji.elements[0]=2*e.near/(l-a),ji.elements[8]=(l+a)/(l-a),this.cameraL.projectionMatrix.copy(ji),a=-o*e.aspect-s,l=o*e.aspect-s,ji.elements[0]=2*e.near/(l-a),ji.elements[8]=(l+a)/(l-a),this.cameraR.projectionMatrix.copy(ji)}this.cameraL.matrixWorld.copy(t.matrixWorld).multiply(Kd),this.cameraR.matrixWorld.copy(t.matrixWorld).multiply(Zd)}}class xu{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=jd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=jd();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function jd(){return performance.now()}const Ji=new R,Jd=new Qe,XM=new R,Qi=new R;class qM extends ie{constructor(){super(),this.type="AudioListener",this.context=gu.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new xu}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(t){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=t,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}updateMatrixWorld(t){super.updateMatrixWorld(t);const e=this.context.listener,n=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(Ji,Jd,XM),Qi.set(0,0,-1).applyQuaternion(Jd),e.positionX){const i=this.context.currentTime+this.timeDelta;e.positionX.linearRampToValueAtTime(Ji.x,i),e.positionY.linearRampToValueAtTime(Ji.y,i),e.positionZ.linearRampToValueAtTime(Ji.z,i),e.forwardX.linearRampToValueAtTime(Qi.x,i),e.forwardY.linearRampToValueAtTime(Qi.y,i),e.forwardZ.linearRampToValueAtTime(Qi.z,i),e.upX.linearRampToValueAtTime(n.x,i),e.upY.linearRampToValueAtTime(n.y,i),e.upZ.linearRampToValueAtTime(n.z,i)}else e.setPosition(Ji.x,Ji.y,Ji.z),e.setOrientation(Qi.x,Qi.y,Qi.z,n.x,n.y,n.z)}}class im extends ie{constructor(t){super(),this.type="Audio",this.listener=t,this.context=t.context,this.gain=this.context.createGain(),this.gain.connect(t.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(t){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=t,this.connect(),this}setMediaElementSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(t),this.connect(),this}setMediaStreamSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(t),this.connect(),this}setBuffer(t){return this.buffer=t,this.sourceType="buffer",this.autoplay&&this.play(),this}play(t=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+t;const e=this.context.createBufferSource();return e.buffer=this.buffer,e.loop=this.loop,e.loopStart=this.loopStart,e.loopEnd=this.loopEnd,e.onended=this.onEnded.bind(this),e.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=e,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(t=0){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+t),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].connect(this.filters[t]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].disconnect(this.filters[t]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(t){return t||(t=[]),this._connected===!0?(this.disconnect(),this.filters=t.slice(),this.connect()):this.filters=t.slice(),this}setDetune(t){return this.detune=t,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(t){return this.setFilters(t?[t]:[])}setPlaybackRate(t){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=t,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(t){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=t,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(t){return this.loopStart=t,this}setLoopEnd(t){return this.loopEnd=t,this}getVolume(){return this.gain.gain.value}setVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}}const ts=new R,Qd=new Qe,YM=new R,es=new R;class $M extends im{constructor(t){super(t),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){super.connect(),this.panner.connect(this.gain)}disconnect(){super.disconnect(),this.panner.disconnect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(t){return this.panner.refDistance=t,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(t){return this.panner.rolloffFactor=t,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(t){return this.panner.distanceModel=t,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(t){return this.panner.maxDistance=t,this}setDirectionalCone(t,e,n){return this.panner.coneInnerAngle=t,this.panner.coneOuterAngle=e,this.panner.coneOuterGain=n,this}updateMatrixWorld(t){if(super.updateMatrixWorld(t),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(ts,Qd,YM),es.set(0,0,1).applyQuaternion(Qd);const e=this.panner;if(e.positionX){const n=this.context.currentTime+this.listener.timeDelta;e.positionX.linearRampToValueAtTime(ts.x,n),e.positionY.linearRampToValueAtTime(ts.y,n),e.positionZ.linearRampToValueAtTime(ts.z,n),e.orientationX.linearRampToValueAtTime(es.x,n),e.orientationY.linearRampToValueAtTime(es.y,n),e.orientationZ.linearRampToValueAtTime(es.z,n)}else e.setPosition(ts.x,ts.y,ts.z),e.setOrientation(es.x,es.y,es.z)}}class ZM{constructor(t,e=2048){this.analyser=t.context.createAnalyser(),this.analyser.fftSize=e,this.data=new Uint8Array(this.analyser.frequencyBinCount),t.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let t=0;const e=this.getFrequencyData();for(let n=0;n<e.length;n++)t+=e[n];return t/e.length}}class sm{constructor(t,e,n){this.binding=t,this.valueSize=n;let i,s,o;switch(e){case"quaternion":i=this._slerp,s=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){const n=this.buffer,i=this.valueSize,s=t*i+i;let o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[s+a]=n[a];o=e}else{o+=e;const a=e/o;this._mixBufferRegion(n,s,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(t){const e=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,i,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){const e=this.valueSize,n=this.buffer,i=t*e+e,s=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const l=e*this._origIndex;this._mixBufferRegion(n,i,l,1-s,e)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*e,1,e);for(let l=e,c=e+e;l!==c;++l)if(n[l]!==n[l+e]){a.setValue(n,i);break}}saveOriginalState(){const t=this.binding,e=this.buffer,n=this.valueSize,i=n*this._origIndex;t.getValue(e,i);for(let s=n,o=i;s!==o;++s)e[s]=e[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){const t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,i,s){if(i>=.5)for(let o=0;o!==s;++o)t[e+o]=t[n+o]}_slerp(t,e,n,i){Qe.slerpFlat(t,e,t,e,t,n,i)}_slerpAdditive(t,e,n,i,s){const o=this._workIndex*s;Qe.multiplyQuaternionsFlat(t,o,t,e,t,n),Qe.slerpFlat(t,e,t,e,t,o,i)}_lerp(t,e,n,i,s){const o=1-i;for(let a=0;a!==s;++a){const l=e+a;t[l]=t[l]*o+t[n+a]*i}}_lerpAdditive(t,e,n,i,s){for(let o=0;o!==s;++o){const a=e+o;t[a]=t[a]+t[n+o]*i}}}const vu="\\[\\]\\.:\\/",KM=new RegExp("["+vu+"]","g"),_u="[^"+vu+"]",jM="[^"+vu.replace("\\.","")+"]",JM=/((?:WC+[\/:])*)/.source.replace("WC",_u),QM=/(WCOD+)?/.source.replace("WCOD",jM),t1=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_u),e1=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_u),n1=new RegExp("^"+JM+QM+t1+e1+"$"),i1=["material","materials","bones","map"];class s1{constructor(t,e,n){const i=n||ee.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class ee{constructor(t,e,n){this.path=e,this.parsedPath=n||ee.parseTrackName(e),this.node=ee.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new ee.Composite(t,e,n):new ee(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(KM,"")}static parseTrackName(t){const e=n1.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);i1.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(s){for(let o=0;o<s.length;o++){const a=s[o];if(a.name===e||a.uuid===e)return a;const l=n(a.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,i=e.propertyName;let s=e.propertyIndex;if(t||(t=ee.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}const o=t[i];if(o===void 0){const c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ee.Composite=s1;ee.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ee.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ee.prototype.GetterByBindingType=[ee.prototype._getValue_direct,ee.prototype._getValue_array,ee.prototype._getValue_arrayElement,ee.prototype._getValue_toArray];ee.prototype.SetterByBindingTypeAndVersioning=[[ee.prototype._setValue_direct,ee.prototype._setValue_direct_setNeedsUpdate,ee.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ee.prototype._setValue_array,ee.prototype._setValue_array_setNeedsUpdate,ee.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ee.prototype._setValue_arrayElement,ee.prototype._setValue_arrayElement_setNeedsUpdate,ee.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ee.prototype._setValue_fromArray,ee.prototype._setValue_fromArray_setNeedsUpdate,ee.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class r1{constructor(){this.isAnimationObjectGroup=!0,this.uuid=mn(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const t={};this._indicesByUUID=t;for(let n=0,i=arguments.length;n!==i;++n)t[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const e=this;this.stats={objects:{get total(){return e._objects.length},get inUse(){return this.total-e.nCachedObjects_}},get bindingsPerObject(){return e._bindings.length}}}add(){const t=this._objects,e=this._indicesByUUID,n=this._paths,i=this._parsedPaths,s=this._bindings,o=s.length;let a,l=t.length,c=this.nCachedObjects_;for(let h=0,u=arguments.length;h!==u;++h){const d=arguments[h],f=d.uuid;let p=e[f];if(p===void 0){p=l++,e[f]=p,t.push(d);for(let x=0,m=o;x!==m;++x)s[x].push(new ee(d,n[x],i[x]))}else if(p<c){a=t[p];const x=--c,m=t[x];e[m.uuid]=p,t[p]=m,e[f]=x,t[x]=d;for(let g=0,y=o;g!==y;++g){const v=s[g],_=v[x];let E=v[p];v[p]=_,E===void 0&&(E=new ee(d,n[g],i[g])),v[x]=E}}else t[p]!==a&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){const t=this._objects,e=this._indicesByUUID,n=this._bindings,i=n.length;let s=this.nCachedObjects_;for(let o=0,a=arguments.length;o!==a;++o){const l=arguments[o],c=l.uuid,h=e[c];if(h!==void 0&&h>=s){const u=s++,d=t[u];e[d.uuid]=h,t[h]=d,e[c]=u,t[u]=l;for(let f=0,p=i;f!==p;++f){const x=n[f],m=x[u],g=x[h];x[h]=m,x[u]=g}}}this.nCachedObjects_=s}uncache(){const t=this._objects,e=this._indicesByUUID,n=this._bindings,i=n.length;let s=this.nCachedObjects_,o=t.length;for(let a=0,l=arguments.length;a!==l;++a){const c=arguments[a],h=c.uuid,u=e[h];if(u!==void 0)if(delete e[h],u<s){const d=--s,f=t[d],p=--o,x=t[p];e[f.uuid]=u,t[u]=f,e[x.uuid]=d,t[d]=x,t.pop();for(let m=0,g=i;m!==g;++m){const y=n[m],v=y[d],_=y[p];y[u]=v,y[d]=_,y.pop()}}else{const d=--o,f=t[d];d>0&&(e[f.uuid]=u),t[u]=f,t.pop();for(let p=0,x=i;p!==x;++p){const m=n[p];m[u]=m[d],m.pop()}}}this.nCachedObjects_=s}subscribe_(t,e){const n=this._bindingsIndicesByPath;let i=n[t];const s=this._bindings;if(i!==void 0)return s[i];const o=this._paths,a=this._parsedPaths,l=this._objects,c=l.length,h=this.nCachedObjects_,u=new Array(c);i=s.length,n[t]=i,o.push(t),a.push(e),s.push(u);for(let d=h,f=l.length;d!==f;++d){const p=l[d];u[d]=new ee(p,t,e)}return u}unsubscribe_(t){const e=this._bindingsIndicesByPath,n=e[t];if(n!==void 0){const i=this._paths,s=this._parsedPaths,o=this._bindings,a=o.length-1,l=o[a],c=t[a];e[c]=n,o[n]=l,o.pop(),s[n]=s[a],s.pop(),i[n]=i[a],i.pop()}}}class rm{constructor(t,e,n=null,i=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=i;const s=e.tracks,o=s.length,a=new Array(o),l={endingStart:ls,endingEnd:ls};for(let c=0;c!==o;++c){const h=s[c].createInterpolant(null);a[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Xf,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n){if(t.fadeOut(e),this.fadeIn(e),n){const i=this._clip.duration,s=t._clip.duration,o=s/i,a=i/s;t.warp(1,o,e),this.warp(a,1,e)}return this}crossFadeTo(t,e,n){return t.crossFadeFrom(this,e,n)}stopFading(){const t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){const i=this._mixer,s=i.time,o=this.timeScale;let a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);const l=a.parameterPositions,c=a.sampleValues;return l[0]=s,l[1]=s+n,c[0]=t/o,c[1]=e/o,this}stopWarping(){const t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,i){if(!this.enabled){this._updateWeight(t);return}const s=this._startTime;if(s!==null){const l=(t-s)*n;l<0||n===0?e=0:(this._startTime=null,e=n*l)}e*=this._updateTimeScale(t);const o=this._updateTime(e),a=this._updateWeight(t);if(a>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Gh:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulateAdditive(a);break;case Nl:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulate(i,a)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopWarping(),e===0?this.paused=!0:this.timeScale=e)}}return this._effectiveTimeScale=e,e}_updateTime(t){const e=this._clip.duration,n=this.loop;let i=this.time+t,s=this._loopCount;const o=n===qf;if(t===0)return s===-1?i:o&&(s&1)===1?e-i:i;if(n===Wf){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(i>=e)i=e;else if(i<0)i=0;else{this.time=i;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(s===-1&&(t>=0?(s=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=e||i<0){const a=Math.floor(i/e);i-=e*a,s+=Math.abs(a);const l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=t>0?e:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(l===1){const c=t<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(s&1)===1)return e-i}return i}_setEndings(t,e,n){const i=this._interpolantSettings;n?(i.endingStart=cs,i.endingEnd=cs):(t?i.endingStart=this.zeroSlopeAtStart?cs:ls:i.endingStart=jr,e?i.endingEnd=this.zeroSlopeAtEnd?cs:ls:i.endingEnd=jr)}_scheduleFading(t,e,n){const i=this._mixer,s=i.time;let o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);const a=o.parameterPositions,l=o.sampleValues;return a[0]=s,l[0]=e,a[1]=s+t,l[1]=n,this}}const o1=new Float32Array(1);class a1 extends Qn{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(t,e){const n=t._localRoot||this._root,i=t._clip.tracks,s=i.length,o=t._propertyBindings,a=t._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==s;++u){const d=i[u],f=d.name;let p=h[f];if(p!==void 0)++p.referenceCount,o[u]=p;else{if(p=o[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,f));continue}const x=e&&e._propertyBindings[u].binding.parsedPath;p=new sm(ee.create(n,f,x),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,f),o[u]=p}a[u].resultBuffer=p.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){const n=(t._localRoot||this._root).uuid,i=t._clip.uuid,s=this._actionsByClip[i];this._bindAction(t,s&&s.knownActions[0]),this._addInactiveAction(t,i,n)}const e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){const s=e[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){const e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){const s=e[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){const e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){const i=this._actions,s=this._actionsByClip;let o=s[e];if(o===void 0)o={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,s[e]=o;else{const a=o.knownActions;t._byClipCacheIndex=a.length,a.push(t)}t._cacheIndex=i.length,i.push(t),o.actionByRoot[n]=t}_removeInactiveAction(t){const e=this._actions,n=e[e.length-1],i=t._cacheIndex;n._cacheIndex=i,e[i]=n,e.pop(),t._cacheIndex=null;const s=t._clip.uuid,o=this._actionsByClip,a=o[s],l=a.knownActions,c=l[l.length-1],h=t._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),t._byClipCacheIndex=null;const u=a.actionByRoot,d=(t._localRoot||this._root).uuid;delete u[d],l.length===0&&delete o[s],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){const e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){const s=e[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(t){const e=this._actions,n=t._cacheIndex,i=this._nActiveActions++,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_takeBackAction(t){const e=this._actions,n=t._cacheIndex,i=--this._nActiveActions,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_addInactiveBinding(t,e,n){const i=this._bindingsByRootAndName,s=this._bindings;let o=i[e];o===void 0&&(o={},i[e]=o),o[n]=t,t._cacheIndex=s.length,s.push(t)}_removeInactiveBinding(t){const e=this._bindings,n=t.binding,i=n.rootNode.uuid,s=n.path,o=this._bindingsByRootAndName,a=o[i],l=e[e.length-1],c=t._cacheIndex;l._cacheIndex=c,e[c]=l,e.pop(),delete a[s],Object.keys(a).length===0&&delete o[i]}_lendBinding(t){const e=this._bindings,n=t._cacheIndex,i=this._nActiveBindings++,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_takeBackBinding(t){const e=this._bindings,n=t._cacheIndex,i=--this._nActiveBindings,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_lendControlInterpolant(){const t=this._controlInterpolants,e=this._nActiveControlInterpolants++;let n=t[e];return n===void 0&&(n=new hu(new Float32Array(2),new Float32Array(2),1,o1),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){const e=this._controlInterpolants,n=t.__cacheIndex,i=--this._nActiveControlInterpolants,s=e[i];t.__cacheIndex=i,e[i]=t,s.__cacheIndex=n,e[n]=s}clipAction(t,e,n){const i=e||this._root,s=i.uuid;let o=typeof t=="string"?ao.findByName(i,t):t;const a=o!==null?o.uuid:t,l=this._actionsByClip[a];let c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=Nl),l!==void 0){const u=l.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;const h=new rm(this,o,e,n);return this._bindAction(h,c),this._addInactiveAction(h,a,s),h}existingAction(t,e){const n=e||this._root,i=n.uuid,s=typeof t=="string"?ao.findByName(n,t):t,o=s?s.uuid:t,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){const t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;const e=this._actions,n=this._nActiveActions,i=this.time+=t,s=Math.sign(t),o=this._accuIndex^=1;for(let c=0;c!==n;++c)e[c]._update(i,t,s,o);const a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){const e=this._actions,n=t.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){const o=s.knownActions;for(let a=0,l=o.length;a!==l;++a){const c=o[a];this._deactivateAction(c);const h=c._cacheIndex,u=e[e.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,e[h]=u,e.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(t){const e=t.uuid,n=this._actionsByClip;for(const o in n){const a=n[o].actionByRoot,l=a[e];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,s=i[e];if(s!==void 0)for(const o in s){const a=s[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(t,e){const n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class yu{constructor(t){this.value=t}clone(){return new yu(this.value.clone===void 0?this.value:this.value.clone())}}let l1=0;class c1 extends Qn{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:l1++}),this.name="",this.usage=Jr,this.uniforms=[]}add(t){return this.uniforms.push(t),this}remove(t){const e=this.uniforms.indexOf(t);return e!==-1&&this.uniforms.splice(e,1),this}setName(t){return this.name=t,this}setUsage(t){return this.usage=t,this}dispose(){return this.dispatchEvent({type:"dispose"}),this}copy(t){this.name=t.name,this.usage=t.usage;const e=t.uniforms;this.uniforms.length=0;for(let n=0,i=e.length;n<i;n++){const s=Array.isArray(e[n])?e[n]:[e[n]];for(let o=0;o<s.length;o++)this.uniforms.push(s[o].clone())}return this}clone(){return new this.constructor().copy(this)}}class h1 extends Wl{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}class u1{constructor(t,e,n,i,s){this.isGLBufferAttribute=!0,this.name="",this.buffer=t,this.type=e,this.itemSize=n,this.elementSize=i,this.count=s,this.version=0}set needsUpdate(t){t===!0&&this.version++}setBuffer(t){return this.buffer=t,this}setType(t,e){return this.type=t,this.elementSize=e,this}setItemSize(t){return this.itemSize=t,this}setCount(t){return this.count=t,this}}const tf=new Ut;class om{constructor(t,e,n=0,i=1/0){this.ray=new ur(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Ol,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return tf.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(tf),this}intersectObject(t,e=!0,n=[]){return bh(t,this,n,e),n.sort(ef),n}intersectObjects(t,e=!0,n=[]){for(let i=0,s=t.length;i<s;i++)bh(t[i],this,n,e);return n.sort(ef),n}}function ef(r,t){return r.distance-t.distance}function bh(r,t,e,n){let i=!0;if(r.layers.test(t.layers)&&r.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let o=0,a=s.length;o<a;o++)bh(s[o],t,e,!0)}}class d1{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(ye(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class f1{constructor(t=1,e=0,n=0){return this.radius=t,this.theta=e,this.y=n,this}set(t,e,n){return this.radius=t,this.theta=e,this.y=n,this}copy(t){return this.radius=t.radius,this.theta=t.theta,this.y=t.y,this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+n*n),this.theta=Math.atan2(t,n),this.y=e,this}clone(){return new this.constructor().copy(this)}}class Mu{constructor(t,e,n,i){Mu.prototype.isMatrix2=!0,this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){const s=this.elements;return s[0]=t,s[2]=e,s[1]=n,s[3]=i,this}}const nf=new Z;class p1{constructor(t=new Z(1/0,1/0),e=new Z(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=nf.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,nf).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const sf=new R,fa=new R;class m1{constructor(t=new R,e=new R){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){sf.subVectors(t,this.start),fa.subVectors(this.end,this.start);const n=fa.dot(fa);let s=fa.dot(sf)/n;return e&&(s=ye(s,0,1)),s}closestPointToPoint(t,e,n){const i=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(i).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const rf=new R;class g1 extends ie{constructor(t,e){super(),this.light=t,this.matrixAutoUpdate=!1,this.color=e,this.type="SpotLightHelper";const n=new Ft,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let o=0,a=1,l=32;o<l;o++,a++){const c=o/l*Math.PI*2,h=a/l*Math.PI*2;i.push(Math.cos(c),Math.sin(c),1,Math.cos(h),Math.sin(h),1)}n.setAttribute("position",new bt(i,3));const s=new Ye({fog:!1,toneMapped:!1});this.cone=new Bn(n,s),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorld.copy(this.light.matrixWorld);const t=this.light.distance?this.light.distance:1e3,e=t*Math.tan(this.light.angle);this.cone.scale.set(e,e,t),rf.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(rf),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const Ci=new R,pa=new Ut,Qc=new Ut;class x1 extends Bn{constructor(t){const e=am(t),n=new Ft,i=[],s=[],o=new dt(0,0,1),a=new dt(0,1,0);for(let c=0;c<e.length;c++){const h=e[c];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(o.r,o.g,o.b),s.push(a.r,a.g,a.b))}n.setAttribute("position",new bt(i,3)),n.setAttribute("color",new bt(s,3));const l=new Ye({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,l),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=t,this.bones=e,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(t){const e=this.bones,n=this.geometry,i=n.getAttribute("position");Qc.copy(this.root.matrixWorld).invert();for(let s=0,o=0;s<e.length;s++){const a=e[s];a.parent&&a.parent.isBone&&(pa.multiplyMatrices(Qc,a.matrixWorld),Ci.setFromMatrixPosition(pa),i.setXYZ(o,Ci.x,Ci.y,Ci.z),pa.multiplyMatrices(Qc,a.parent.matrixWorld),Ci.setFromMatrixPosition(pa),i.setXYZ(o+1,Ci.x,Ci.y,Ci.z),o+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(t)}dispose(){this.geometry.dispose(),this.material.dispose()}}function am(r){const t=[];r.isBone===!0&&t.push(r);for(let e=0;e<r.children.length;e++)t.push.apply(t,am(r.children[e]));return t}class v1 extends ue{constructor(t,e,n){const i=new Mo(e,4,2),s=new wn({wireframe:!0,fog:!1,toneMapped:!1});super(i,s),this.light=t,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const _1=new R,of=new dt,af=new dt;class y1 extends ie{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const i=new yo(e);i.rotateY(Math.PI*.5),this.material=new wn({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const s=i.getAttribute("position"),o=new Float32Array(s.count*3);i.setAttribute("color",new Qt(o,3)),this.add(new ue(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const t=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const e=t.geometry.getAttribute("color");of.copy(this.light.color),af.copy(this.light.groundColor);for(let n=0,i=e.count;n<i;n++){const s=n<i/2?of:af;e.setXYZ(n,s.r,s.g,s.b)}e.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),t.lookAt(_1.setFromMatrixPosition(this.light.matrixWorld).negate())}}class M1 extends Bn{constructor(t=10,e=10,n=4473924,i=8947848){n=new dt(n),i=new dt(i);const s=e/2,o=t/e,a=t/2,l=[],c=[];for(let d=0,f=0,p=-a;d<=e;d++,p+=o){l.push(-a,0,p,a,0,p),l.push(p,0,-a,p,0,a);const x=d===s?n:i;x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3}const h=new Ft;h.setAttribute("position",new bt(l,3)),h.setAttribute("color",new bt(c,3));const u=new Ye({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class b1 extends Bn{constructor(t=10,e=16,n=8,i=64,s=4473924,o=8947848){s=new dt(s),o=new dt(o);const a=[],l=[];if(e>1)for(let u=0;u<e;u++){const d=u/e*(Math.PI*2),f=Math.sin(d)*t,p=Math.cos(d)*t;a.push(0,0,0),a.push(f,0,p);const x=u&1?s:o;l.push(x.r,x.g,x.b),l.push(x.r,x.g,x.b)}for(let u=0;u<n;u++){const d=u&1?s:o,f=t-t/n*u;for(let p=0;p<i;p++){let x=p/i*(Math.PI*2),m=Math.sin(x)*f,g=Math.cos(x)*f;a.push(m,0,g),l.push(d.r,d.g,d.b),x=(p+1)/i*(Math.PI*2),m=Math.sin(x)*f,g=Math.cos(x)*f,a.push(m,0,g),l.push(d.r,d.g,d.b)}}const c=new Ft;c.setAttribute("position",new bt(a,3)),c.setAttribute("color",new bt(l,3));const h=new Ye({vertexColors:!0,toneMapped:!1});super(c,h),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const lf=new R,ma=new R,cf=new R;class S1 extends ie{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",e===void 0&&(e=1);let i=new Ft;i.setAttribute("position",new bt([-e,e,0,e,e,0,e,-e,0,-e,-e,0,-e,e,0],3));const s=new Ye({fog:!1,toneMapped:!1});this.lightPlane=new Ni(i,s),this.add(this.lightPlane),i=new Ft,i.setAttribute("position",new bt([0,0,0,0,0,1],3)),this.targetLine=new Ni(i,s),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),lf.setFromMatrixPosition(this.light.matrixWorld),ma.setFromMatrixPosition(this.light.target.matrixWorld),cf.subVectors(ma,lf),this.lightPlane.lookAt(ma),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(ma),this.targetLine.scale.z=cf.length()}}const ga=new R,_e=new Bl;class w1 extends Bn{constructor(t){const e=new Ft,n=new Ye({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],s=[],o={};a("n1","n2"),a("n2","n4"),a("n4","n3"),a("n3","n1"),a("f1","f2"),a("f2","f4"),a("f4","f3"),a("f3","f1"),a("n1","f1"),a("n2","f2"),a("n3","f3"),a("n4","f4"),a("p","n1"),a("p","n2"),a("p","n3"),a("p","n4"),a("u1","u2"),a("u2","u3"),a("u3","u1"),a("c","t"),a("p","c"),a("cn1","cn2"),a("cn3","cn4"),a("cf1","cf2"),a("cf3","cf4");function a(p,x){l(p),l(x)}function l(p){i.push(0,0,0),s.push(0,0,0),o[p]===void 0&&(o[p]=[]),o[p].push(i.length/3-1)}e.setAttribute("position",new bt(i,3)),e.setAttribute("color",new bt(s,3)),super(e,n),this.type="CameraHelper",this.camera=t,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=o,this.update();const c=new dt(16755200),h=new dt(16711680),u=new dt(43775),d=new dt(16777215),f=new dt(3355443);this.setColors(c,h,u,d,f)}setColors(t,e,n,i,s){const a=this.geometry.getAttribute("color");a.setXYZ(0,t.r,t.g,t.b),a.setXYZ(1,t.r,t.g,t.b),a.setXYZ(2,t.r,t.g,t.b),a.setXYZ(3,t.r,t.g,t.b),a.setXYZ(4,t.r,t.g,t.b),a.setXYZ(5,t.r,t.g,t.b),a.setXYZ(6,t.r,t.g,t.b),a.setXYZ(7,t.r,t.g,t.b),a.setXYZ(8,t.r,t.g,t.b),a.setXYZ(9,t.r,t.g,t.b),a.setXYZ(10,t.r,t.g,t.b),a.setXYZ(11,t.r,t.g,t.b),a.setXYZ(12,t.r,t.g,t.b),a.setXYZ(13,t.r,t.g,t.b),a.setXYZ(14,t.r,t.g,t.b),a.setXYZ(15,t.r,t.g,t.b),a.setXYZ(16,t.r,t.g,t.b),a.setXYZ(17,t.r,t.g,t.b),a.setXYZ(18,t.r,t.g,t.b),a.setXYZ(19,t.r,t.g,t.b),a.setXYZ(20,t.r,t.g,t.b),a.setXYZ(21,t.r,t.g,t.b),a.setXYZ(22,t.r,t.g,t.b),a.setXYZ(23,t.r,t.g,t.b),a.setXYZ(24,e.r,e.g,e.b),a.setXYZ(25,e.r,e.g,e.b),a.setXYZ(26,e.r,e.g,e.b),a.setXYZ(27,e.r,e.g,e.b),a.setXYZ(28,e.r,e.g,e.b),a.setXYZ(29,e.r,e.g,e.b),a.setXYZ(30,e.r,e.g,e.b),a.setXYZ(31,e.r,e.g,e.b),a.setXYZ(32,n.r,n.g,n.b),a.setXYZ(33,n.r,n.g,n.b),a.setXYZ(34,n.r,n.g,n.b),a.setXYZ(35,n.r,n.g,n.b),a.setXYZ(36,n.r,n.g,n.b),a.setXYZ(37,n.r,n.g,n.b),a.setXYZ(38,i.r,i.g,i.b),a.setXYZ(39,i.r,i.g,i.b),a.setXYZ(40,s.r,s.g,s.b),a.setXYZ(41,s.r,s.g,s.b),a.setXYZ(42,s.r,s.g,s.b),a.setXYZ(43,s.r,s.g,s.b),a.setXYZ(44,s.r,s.g,s.b),a.setXYZ(45,s.r,s.g,s.b),a.setXYZ(46,s.r,s.g,s.b),a.setXYZ(47,s.r,s.g,s.b),a.setXYZ(48,s.r,s.g,s.b),a.setXYZ(49,s.r,s.g,s.b),a.needsUpdate=!0}update(){const t=this.geometry,e=this.pointMap,n=1,i=1;_e.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),be("c",e,t,_e,0,0,-1),be("t",e,t,_e,0,0,1),be("n1",e,t,_e,-n,-i,-1),be("n2",e,t,_e,n,-i,-1),be("n3",e,t,_e,-n,i,-1),be("n4",e,t,_e,n,i,-1),be("f1",e,t,_e,-n,-i,1),be("f2",e,t,_e,n,-i,1),be("f3",e,t,_e,-n,i,1),be("f4",e,t,_e,n,i,1),be("u1",e,t,_e,n*.7,i*1.1,-1),be("u2",e,t,_e,-n*.7,i*1.1,-1),be("u3",e,t,_e,0,i*2,-1),be("cf1",e,t,_e,-n,0,1),be("cf2",e,t,_e,n,0,1),be("cf3",e,t,_e,0,-i,1),be("cf4",e,t,_e,0,i,1),be("cn1",e,t,_e,-n,0,-1),be("cn2",e,t,_e,n,0,-1),be("cn3",e,t,_e,0,-i,-1),be("cn4",e,t,_e,0,i,-1),t.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function be(r,t,e,n,i,s,o){ga.set(i,s,o).unproject(n);const a=t[r];if(a!==void 0){const l=e.getAttribute("position");for(let c=0,h=a.length;c<h;c++)l.setXYZ(a[c],ga.x,ga.y,ga.z)}}const xa=new tn;class T1 extends Bn{constructor(t,e=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(8*3),s=new Ft;s.setIndex(new Qt(n,1)),s.setAttribute("position",new Qt(i,3)),super(s,new Ye({color:e,toneMapped:!1})),this.object=t,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(t){if(t!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&xa.setFromObject(this.object),xa.isEmpty())return;const e=xa.min,n=xa.max,i=this.geometry.attributes.position,s=i.array;s[0]=n.x,s[1]=n.y,s[2]=n.z,s[3]=e.x,s[4]=n.y,s[5]=n.z,s[6]=e.x,s[7]=e.y,s[8]=n.z,s[9]=n.x,s[10]=e.y,s[11]=n.z,s[12]=n.x,s[13]=n.y,s[14]=e.z,s[15]=e.x,s[16]=n.y,s[17]=e.z,s[18]=e.x,s[19]=e.y,s[20]=e.z,s[21]=n.x,s[22]=e.y,s[23]=e.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(t){return this.object=t,this.update(),this}copy(t,e){return super.copy(t,e),this.object=t.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class E1 extends Bn{constructor(t,e=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],s=new Ft;s.setIndex(new Qt(n,1)),s.setAttribute("position",new bt(i,3)),super(s,new Ye({color:e,toneMapped:!1})),this.box=t,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(t){const e=this.box;e.isEmpty()||(e.getCenter(this.position),e.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(t))}dispose(){this.geometry.dispose(),this.material.dispose()}}class A1 extends Ni{constructor(t,e=1,n=16776960){const i=n,s=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],o=new Ft;o.setAttribute("position",new bt(s,3)),o.computeBoundingSphere(),super(o,new Ye({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=t,this.size=e;const a=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new Ft;l.setAttribute("position",new bt(a,3)),l.computeBoundingSphere(),this.add(new ue(l,new wn({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(t){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(t)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const hf=new R;let va,th;class C1 extends ie{constructor(t=new R(0,0,1),e=new R(0,0,0),n=1,i=16776960,s=n*.2,o=s*.2){super(),this.type="ArrowHelper",va===void 0&&(va=new Ft,va.setAttribute("position",new bt([0,0,0,0,1,0],3)),th=new Ss(0,.5,1,5,1),th.translate(0,-.5,0)),this.position.copy(e),this.line=new Ni(va,new Ye({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new ue(th,new wn({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(n,s,o)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{hf.set(t.z,0,-t.x).normalize();const e=Math.acos(t.y);this.quaternion.setFromAxisAngle(hf,e)}}setLength(t,e=t*.2,n=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(n,e,n),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class R1 extends Bn{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new Ft;i.setAttribute("position",new bt(e,3)),i.setAttribute("color",new bt(n,3));const s=new Ye({vertexColors:!0,toneMapped:!1});super(i,s),this.type="AxesHelper"}setColors(t,e,n){const i=new dt,s=this.geometry.attributes.color.array;return i.set(t),i.toArray(s,0),i.toArray(s,3),i.set(e),i.toArray(s,6),i.toArray(s,9),i.set(n),i.toArray(s,12),i.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class P1{constructor(){this.type="ShapePath",this.color=new dt,this.subPaths=[],this.currentPath=null}moveTo(t,e){return this.currentPath=new eo,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,n,i){return this.currentPath.quadraticCurveTo(t,e,n,i),this}bezierCurveTo(t,e,n,i,s,o){return this.currentPath.bezierCurveTo(t,e,n,i,s,o),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(t){function e(g){const y=[];for(let v=0,_=g.length;v<_;v++){const E=g[v],b=new ms;b.curves=E.curves,y.push(b)}return y}function n(g,y){const v=y.length;let _=!1;for(let E=v-1,b=0;b<v;E=b++){let w=y[E],C=y[b],S=C.x-w.x,M=C.y-w.y;if(Math.abs(M)>Number.EPSILON){if(M<0&&(w=y[b],S=-S,C=y[E],M=-M),g.y<w.y||g.y>C.y)continue;if(g.y===w.y){if(g.x===w.x)return!0}else{const P=M*(g.x-w.x)-S*(g.y-w.y);if(P===0)return!0;if(P<0)continue;_=!_}}else{if(g.y!==w.y)continue;if(C.x<=g.x&&g.x<=w.x||w.x<=g.x&&g.x<=C.x)return!0}}return _}const i=jn.isClockWise,s=this.subPaths;if(s.length===0)return[];let o,a,l;const c=[];if(s.length===1)return a=s[0],l=new ms,l.curves=a.curves,c.push(l),c;let h=!i(s[0].getPoints());h=t?!h:h;const u=[],d=[];let f=[],p=0,x;d[p]=void 0,f[p]=[];for(let g=0,y=s.length;g<y;g++)a=s[g],x=a.getPoints(),o=i(x),o=t?!o:o,o?(!h&&d[p]&&p++,d[p]={s:new ms,p:x},d[p].s.curves=a.curves,h&&p++,f[p]=[]):f[p].push({h:a,p:x[0]});if(!d[0])return e(s);if(d.length>1){let g=!1,y=0;for(let v=0,_=d.length;v<_;v++)u[v]=[];for(let v=0,_=d.length;v<_;v++){const E=f[v];for(let b=0;b<E.length;b++){const w=E[b];let C=!0;for(let S=0;S<d.length;S++)n(w.p,d[S].p)&&(v!==S&&y++,C?(C=!1,u[S].push(w)):g=!0);C&&u[v].push(w)}}y>0&&g===!1&&(f=u)}let m;for(let g=0,y=d.length;g<y;g++){l=d[g].s,c.push(l),m=f[g];for(let v=0,_=m.length;v<_;v++)l.holes.push(m[v].h)}return c}}class I1 extends Qn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}class z1 extends ke{constructor(t=1,e=1,n=1,i={}){console.warn('THREE.WebGLMultipleRenderTargets has been deprecated and will be removed in r172. Use THREE.WebGLRenderTarget and set the "count" parameter to enable MRT.'),super(t,e,{...i,count:n}),this.isWebGLMultipleRenderTargets=!0}get texture(){return this.textures}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cl);const L1=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:Rl,AddEquation:Mn,AddOperation:Vf,AdditiveAnimationBlendMode:Gh,AdditiveBlending:La,AgXToneMapping:Ih,AlphaFormat:Nh,AlwaysCompare:np,AlwaysDepth:Oa,AlwaysStencilFunc:fh,AmbientLight:jp,AnimationAction:rm,AnimationClip:ao,AnimationLoader:zM,AnimationMixer:a1,AnimationObjectGroup:r1,AnimationUtils:CM,ArcCurve:Ep,ArrayCamera:xp,ArrowHelper:C1,AttachedBindMode:dh,Audio:im,AudioAnalyser:ZM,AudioContext:gu,AudioListener:qM,AudioLoader:GM,AxesHelper:R1,BackSide:We,BasicDepthPacking:Yf,BasicShadowMap:Am,BatchedMesh:Sp,Bone:Qh,BooleanKeyframeTrack:ws,Box2:p1,Box3:tn,Box3Helper:E1,BoxGeometry:Oi,BoxHelper:T1,BufferAttribute:Qt,BufferGeometry:Ft,BufferGeometryLoader:nm,ByteType:Dh,Cache:fi,Camera:Bl,CameraHelper:w1,CanvasTexture:Jy,CapsuleGeometry:Zl,CatmullRomCurve3:Ap,CineonToneMapping:Ph,CircleGeometry:Kl,ClampToEdgeWrapping:Sn,Clock:xu,Color:dt,ColorKeyframeTrack:uu,ColorManagement:Jt,CompressedArrayTexture:Ky,CompressedCubeTexture:jy,CompressedTexture:Yl,CompressedTextureLoader:LM,ConeGeometry:jl,ConstantAlphaFactor:Ff,ConstantColorFactor:kf,Controls:I1,CubeCamera:cp,CubeReflectionMapping:xi,CubeRefractionMapping:Di,CubeTexture:mo,CubeTextureLoader:DM,CubeUVReflectionMapping:hr,CubicBezierCurve:nu,CubicBezierCurve3:Cp,CubicInterpolant:Xp,CullFaceBack:ch,CullFaceFront:Tf,CullFaceFrontBack:Em,CullFaceNone:wf,Curve:Vn,CurvePath:Pp,CustomBlending:Ah,CustomToneMapping:Hf,CylinderGeometry:Ss,Cylindrical:f1,Data3DTexture:qh,DataArrayTexture:Fl,DataTexture:gn,DataTextureLoader:UM,DataUtils:Bg,DecrementStencilOp:Vm,DecrementWrapStencilOp:Gm,DefaultLoadingManager:$p,DepthFormat:fs,DepthStencilFormat:ki,DepthTexture:Vl,DetachedBindMode:Gf,DirectionalLight:mu,DirectionalLightHelper:S1,DiscreteInterpolant:qp,DodecahedronGeometry:Jl,DoubleSide:yn,DstAlphaFactor:ka,DstColorFactor:Na,DynamicCopyUsage:sg,DynamicDrawUsage:Jm,DynamicReadUsage:eg,EdgesGeometry:Ip,EllipseCurve:$l,EqualCompare:Jf,EqualDepth:Va,EqualStencilFunc:Ym,EquirectangularReflectionMapping:Yr,EquirectangularRefractionMapping:$r,Euler:xn,EventDispatcher:Qn,ExtrudeGeometry:tc,FileLoader:_i,Float16BufferAttribute:qg,Float32BufferAttribute:bt,FloatType:an,Fog:vo,FogExp2:Gl,FramebufferTexture:Zy,FrontSide:gi,Frustum:go,GLBufferAttribute:u1,GLSL1:og,GLSL3:ph,GreaterCompare:Qf,GreaterDepth:Ga,GreaterEqualCompare:ep,GreaterEqualDepth:Ha,GreaterEqualStencilFunc:jm,GreaterStencilFunc:Zm,GridHelper:M1,Group:Zn,HalfFloatType:pn,HemisphereLight:fu,HemisphereLightHelper:y1,IcosahedronGeometry:ec,ImageBitmapLoader:HM,ImageLoader:lo,ImageUtils:rp,IncrementStencilOp:Bm,IncrementWrapStencilOp:Hm,InstancedBufferAttribute:ar,InstancedBufferGeometry:em,InstancedInterleavedBuffer:h1,InstancedMesh:ql,Int16BufferAttribute:Wg,Int32BufferAttribute:Xg,Int8BufferAttribute:Vg,IntType:Il,InterleavedBuffer:Wl,InterleavedBufferAttribute:_s,Interpolant:bo,InterpolateDiscrete:Kr,InterpolateLinear:xl,InterpolateSmooth:Ea,InvertStencilOp:Wm,KeepStencilOp:rs,KeyframeTrack:Hn,LOD:Mp,LatheGeometry:_o,Layers:Ol,LessCompare:jf,LessDepth:Ba,LessEqualCompare:Wh,LessEqualDepth:vs,LessEqualStencilFunc:$m,LessStencilFunc:qm,Light:Vi,LightProbe:tm,Line:Ni,Line3:m1,LineBasicMaterial:Ye,LineCurve:iu,LineCurve3:Rp,LineDashedMaterial:Hp,LineLoop:wp,LineSegments:Bn,LinearFilter:Ee,LinearInterpolant:hu,LinearMipMapLinearFilter:Im,LinearMipMapNearestFilter:Pm,LinearMipmapLinearFilter:kn,LinearMipmapNearestFilter:Ur,LinearSRGBColorSpace:Ms,LinearToneMapping:Ch,LinearTransfer:po,Loader:cn,LoaderUtils:Mh,LoadingManager:du,LoopOnce:Wf,LoopPingPong:qf,LoopRepeat:Xf,LuminanceAlphaFormat:Bh,LuminanceFormat:Oh,MOUSE:wm,Material:qe,MaterialLoader:lc,MathUtils:ze,Matrix2:Mu,Matrix3:Wt,Matrix4:Ut,MaxEquation:Rf,Mesh:ue,MeshBasicMaterial:wn,MeshDepthMaterial:Kh,MeshDistanceMaterial:jh,MeshLambertMaterial:Bp,MeshMatcapMaterial:Vp,MeshNormalMaterial:lu,MeshPhongMaterial:Fp,MeshPhysicalMaterial:Np,MeshStandardMaterial:fr,MeshToonMaterial:Op,MinEquation:Cf,MirroredRepeatWrapping:Zr,MixOperation:Bf,MultiplyBlending:uh,MultiplyOperation:uo,NearestFilter:Ce,NearestMipMapLinearFilter:Rm,NearestMipMapNearestFilter:Cm,NearestMipmapLinearFilter:Ks,NearestMipmapNearestFilter:Lh,NeutralToneMapping:zh,NeverCompare:Kf,NeverDepth:Fa,NeverStencilFunc:Xm,NoBlending:Le,NoColorSpace:qn,NoToneMapping:pi,NormalAnimationBlendMode:Nl,NormalBlending:ds,NotEqualCompare:tp,NotEqualDepth:Wa,NotEqualStencilFunc:Km,NumberKeyframeTrack:ro,Object3D:ie,ObjectLoader:BM,ObjectSpaceNormalMap:Zf,OctahedronGeometry:yo,OneFactor:Pf,OneMinusConstantAlphaFactor:Of,OneMinusConstantColorFactor:Nf,OneMinusDstAlphaFactor:Lf,OneMinusDstColorFactor:Df,OneMinusSrcAlphaFactor:Ua,OneMinusSrcColorFactor:zf,OrthographicCamera:xo,PCFShadowMap:Th,PCFSoftShadowMap:Eh,PMREMGenerator:vl,Path:eo,PerspectiveCamera:Ue,Plane:zi,PlaneGeometry:bs,PlaneHelper:A1,PointLight:Kp,PointLightHelper:v1,Points:Tp,PointsMaterial:tu,PolarGridHelper:b1,PolyhedronGeometry:Bi,PositionalAudio:$M,PropertyBinding:ee,PropertyMixer:sm,QuadraticBezierCurve:su,QuadraticBezierCurve3:ru,Quaternion:Qe,QuaternionKeyframeTrack:So,QuaternionLinearInterpolant:Yp,RED_GREEN_RGTC2_Format:ml,RED_RGTC1_Format:Hh,REVISION:Cl,RGBADepthPacking:$f,RGBAFormat:Ne,RGBAIntegerFormat:kl,RGBA_ASTC_10x10_Format:cl,RGBA_ASTC_10x5_Format:ol,RGBA_ASTC_10x6_Format:al,RGBA_ASTC_10x8_Format:ll,RGBA_ASTC_12x10_Format:hl,RGBA_ASTC_12x12_Format:ul,RGBA_ASTC_4x4_Format:Ja,RGBA_ASTC_5x4_Format:Qa,RGBA_ASTC_5x5_Format:tl,RGBA_ASTC_6x5_Format:el,RGBA_ASTC_6x6_Format:nl,RGBA_ASTC_8x5_Format:il,RGBA_ASTC_8x6_Format:sl,RGBA_ASTC_8x8_Format:rl,RGBA_BPTC_Format:Br,RGBA_ETC2_EAC_Format:ja,RGBA_PVRTC_2BPPV1_Format:$a,RGBA_PVRTC_4BPPV1_Format:Ya,RGBA_S3TC_DXT1_Format:Nr,RGBA_S3TC_DXT3_Format:Fr,RGBA_S3TC_DXT5_Format:Or,RGBDepthPacking:km,RGBFormat:Fh,RGBIntegerFormat:zm,RGB_BPTC_SIGNED_Format:dl,RGB_BPTC_UNSIGNED_Format:fl,RGB_ETC1_Format:Za,RGB_ETC2_Format:Ka,RGB_PVRTC_2BPPV1_Format:qa,RGB_PVRTC_4BPPV1_Format:Xa,RGB_S3TC_DXT1_Format:kr,RGDepthPacking:Nm,RGFormat:Vh,RGIntegerFormat:Ul,RawShaderMaterial:au,Ray:ur,Raycaster:om,RectAreaLight:Jp,RedFormat:Dl,RedIntegerFormat:fo,ReinhardToneMapping:Rh,RenderTarget:op,RepeatWrapping:Jn,ReplaceStencilOp:Om,ReverseSubtractEquation:Af,RingGeometry:nc,SIGNED_RED_GREEN_RGTC2_Format:gl,SIGNED_RED_RGTC1_Format:pl,SRGBColorSpace:De,SRGBTransfer:le,Scene:_l,ShaderChunk:Zt,ShaderLib:Dn,ShaderMaterial:ge,ShadowMaterial:kp,Shape:ms,ShapeGeometry:ic,ShapePath:P1,ShapeUtils:jn,ShortType:Uh,Skeleton:Xl,SkeletonHelper:x1,SkinnedMesh:bp,Source:hs,Sphere:Xe,SphereGeometry:Mo,Spherical:d1,SphericalHarmonics3:Qp,SplineCurve:ou,SpotLight:Zp,SpotLightHelper:g1,Sprite:yp,SpriteMaterial:Jh,SrcAlphaFactor:Da,SrcAlphaSaturateFactor:Uf,SrcColorFactor:If,StaticCopyUsage:ig,StaticDrawUsage:Jr,StaticReadUsage:tg,StereoCamera:WM,StreamCopyUsage:rg,StreamDrawUsage:Qm,StreamReadUsage:ng,StringKeyframeTrack:Ts,SubtractEquation:Ef,SubtractiveBlending:hh,TOUCH:Tm,TangentSpaceNormalMap:Fi,TetrahedronGeometry:sc,Texture:Me,TextureLoader:kM,TextureUtils:Ry,TorusGeometry:rc,TorusKnotGeometry:oc,Triangle:on,TriangleFanDrawMode:Um,TriangleStripDrawMode:Dm,TrianglesDrawMode:Lm,TubeGeometry:ac,UVMapping:Pl,Uint16BufferAttribute:Yh,Uint32BufferAttribute:$h,Uint8BufferAttribute:Hg,Uint8ClampedBufferAttribute:Gg,Uniform:yu,UniformsGroup:c1,UniformsLib:mt,UniformsUtils:bn,UnsignedByteType:Tn,UnsignedInt248Type:Ui,UnsignedInt5999Type:kh,UnsignedIntType:vi,UnsignedShort4444Type:zl,UnsignedShort5551Type:Ll,UnsignedShortType:sr,VSMShadowMap:Wn,Vector2:Z,Vector3:R,Vector4:ne,VectorKeyframeTrack:oo,VideoTexture:$y,WebGL3DRenderTarget:Pg,WebGLArrayRenderTarget:Rg,WebGLCoordinateSystem:$n,WebGLCubeRenderTarget:hp,WebGLMultipleRenderTargets:z1,WebGLRenderTarget:ke,WebGLRenderer:vp,WebGLUtils:gp,WebGPUCoordinateSystem:Qr,WireframeGeometry:Up,WrapAroundEnding:jr,ZeroCurvatureEnding:ls,ZeroFactor:Zs,ZeroSlopeEnding:cs,ZeroStencilOp:Fm,createCanvasElement:sp},Symbol.toStringTag,{value:"Module"})),ln=(r,t)=>({x:r.x-t.x,z:r.z-t.z}),Sl=(r,t)=>r.x*t.x+r.z*t.z,eh=(r,t)=>r.x*t.z-r.z*t.x,me=(r,t)=>Math.hypot(r.x-t.x,r.z-t.z),fn=(r,t,e)=>({x:r.x+(t.x-r.x)*e,z:r.z+(t.z-r.z)*e}),Kn=r=>{const t=Math.hypot(r.x,r.z);return t>1e-9?{x:r.x/t,z:r.z/t}:{x:1,z:0}},Ze=(r,t)=>({x:r.x-t.x,y:r.y-t.y,z:r.z-t.z}),nh=(r,t)=>r.x*t.x+r.y*t.y+r.z*t.z,ns=(r,t)=>({x:r.y*t.z-r.z*t.y,y:r.z*t.x-r.x*t.z,z:r.x*t.y-r.y*t.x}),di=r=>{const t=Math.hypot(r.x,r.y,r.z);return t>1e-9?{x:r.x/t,y:r.y/t,z:r.z/t}:{x:0,y:1,z:0}},Dr=(r,t,e)=>r<t?t:r>e?e:r,Li=r=>Dr(r,0,1),he=(r,t,e)=>r+(t-r)*e,In=(r,t,e)=>{const n=Li((e-r)/(t-r));return n*n*(3-2*n)};function Wr(r,t,e,n){const i=1-n;return{x:i*i*r.x+2*i*n*t.x+n*n*e.x,z:i*i*r.z+2*i*n*t.z+n*n*e.z}}function ih(r,t,e){const n=ln(e,t),i=Sl(n,n),s=i>1e-9?Li(Sl(ln(r,t),n)/i):0;return{d:me(r,fn(t,e,s)),t:s}}function D1(r,t,e,n){const i=ln(t,r),s=ln(n,e),o=eh(i,s);if(Math.abs(o)<1e-9)return null;const a=eh(ln(e,r),s)/o,l=eh(ln(e,r),i)/o;return a>=0&&a<1&&l>=0&&l<1?a:null}function ir(r,t){let e=!1;for(let n=0,i=t.length-1;n<t.length;i=n++){const s=t[n],o=t[i];s.z>r.z!=o.z>r.z&&r.x<(o.x-s.x)*(r.z-s.z)/(o.z-s.z)+s.x&&(e=!e)}return e}function lm(r,t=0,e=0){let n=Math.imul(r|0,668265261)^Math.imul(t|0,374761393)^Math.imul(e|0,2654435761);return n=Math.imul(n^n>>>15,2246822507),n=Math.imul(n^n>>>13,3266489909),(n^n>>>16)>>>0}const Pi=(r,t=0,e=0)=>lm(r,t,e)/4294967296;class lr{s;constructor(t){this.s=t>>>0||1}next(){let t=this.s=this.s+1831565813>>>0;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}range(t,e){return t+(e-t)*this.next()}int(t,e){return t+Math.floor(this.next()*(e-t+1))}kies(t){return t[Math.floor(this.next()*t.length)]}kans(t){return this.next()<t}get staat(){return this.s}set staat(t){this.s=t>>>0}}const uf=r=>r*r*r*(r*(r*6-15)+10);function _a(r,t,e,n,i){const o=(lm(r,t,e)&7)/8*Math.PI*2;return Math.cos(o)*n+Math.sin(o)*i}function Ca(r,t,e=0,n=0){const i=Math.floor(r),s=Math.floor(t),o=r-i,a=t-s,l=x=>e>0?(x%e+e)%e:x,c=_a(l(i),l(s),n,o,a),h=_a(l(i+1),l(s),n,o-1,a),u=_a(l(i),l(s+1),n,o,a-1),d=_a(l(i+1),l(s+1),n,o-1,a-1),f=uf(o),p=uf(a);return c+(h-c)*f+(u+(d-u)*f-(c+(h-c)*f))*p}function Ra(r,t,e,n,i=0,s=.5,o=!0){let a=0,l=1,c=0,h=e;for(let u=0;u<n;u++)a+=Ca(r*h,t*h,o?h:0,i+u*101)*l,c+=l,l*=s,h*=2;return Math.min(1,Math.max(0,a/c*.85+.5))}const hi=0;class wl{grootte;stap;n;h;h0;vuil=[];constructor(t=2048,e=4,n=1){this.grootte=t,this.stap=e,this.n=Math.round(t/e)+1,this.h=new Float32Array(this.n*this.n);for(let i=0;i<this.n;i++)for(let s=0;s<this.n;s++){const o=-t/2+s*e,a=-t/2+i*e;this.h[i*this.n+s]=wl.natuurlijk(o,a,n,t)}this.h0=this.h.slice()}static rivierX(t){return 260+150*Math.sin(t/310)+60*Math.sin(t/97+1.3)}static natuurlijk(t,e,n,i){const s=Math.hypot(t,e)/(i/2),o=Ra(t/1400,e/1400,1,5,n,.5,!1),a=Ca(t/90,e/90,0,n+9)*1.2;let l=7+(o-.5)*he(8,46,In(.25,1,s))+a;l+=In(.55,1,s)*18*Ra(t/600,e/600,1,3,n+3,.5,!1);const c=700+Ca(t/260,.5,0,n+5)*90;l=he(l,-9,In(c-120,c+60,e));const h=Math.abs(t-wl.rivierX(e)),u=1-In(18,140,h);return l=he(l,Math.min(l,2.5),u),l=he(l,-3.5,1-In(12,34,h)),l}idx(t,e){return Dr(e,0,this.n-1)*this.n+Dr(t,0,this.n-1)}rasterX(t){return(t+this.grootte/2)/this.stap}wereldX(t){return-this.grootte/2+t*this.stap}binnen(t,e,n=0){const i=this.grootte/2-n;return t>=-i&&t<=i&&e>=-i&&e<=i}hoogte(t,e){const n=Dr(this.rasterX(t),0,this.n-1.0001),i=Dr(this.rasterX(e),0,this.n-1.0001),s=Math.floor(n),o=Math.floor(i),a=n-s,l=i-o,c=this.h[o*this.n+s],h=this.h[o*this.n+s+1],u=this.h[(o+1)*this.n+s],d=this.h[(o+1)*this.n+s+1];return a>=l?c+(h-c)*a+(d-h)*l:c+(d-u)*a+(u-c)*l}normaal(t,e){const n=this.stap,i=this.hoogte(t+n,e)-this.hoogte(t-n,e),s=this.hoogte(t,e+n)-this.hoogte(t,e-n),o=Math.hypot(i,2*n,s);return{x:-i/o,y:2*n/o,z:-s/o}}egaliseer(t,e,n,i,s,o,a){const l=Math.max(0,Math.floor(this.rasterX(e))),c=Math.min(this.n-1,Math.ceil(this.rasterX(i))),h=Math.max(0,Math.floor(this.rasterX(n))),u=Math.min(this.n-1,Math.ceil(this.rasterX(s)));for(let d=h;d<=u;d++)for(let f=l;f<=c;f++){const p=this.wereldX(f),x=this.wereldX(d),m=t(p,x);if(!m||m.d>o+a)continue;const g=d*this.n+f,y=1-In(o,o+a,m.d);this.h[g]=he(this.h[g],m.h,y)}this.markeer(e,n,i,s)}markeer(t,e,n,i){this.vuil.push({x0:t,z0:e,x1:n,z1:i})}haalVuil(){const t=this.vuil;return this.vuil=[],t}straal(t,e,n=6e3){let i=0,s=t.y-this.hoogte(t.x,t.z);if(s<0)return null;const o=2;for(;i<n;){const a=i+o*Math.max(1,i/400),l=t.x+e.x*a,c=t.y+e.y*a,h=t.z+e.z*a,u=c-this.hoogte(l,h);if(u<0){let d=i,f=a;for(let x=0;x<20;x++){const m=(d+f)/2;t.y+e.y*m-this.hoogte(t.x+e.x*m,t.z+e.z*m)>0?d=m:f=m}const p=(d+f)/2;return{x:t.x+e.x*p,y:this.hoogte(t.x+e.x*p,t.z+e.z*p),z:t.z+e.z*p}}s=u,i=a}return null}bodem(t,e,n){const i=this.hoogte(t,e),s=this.normaal(t,e),o=1-In(.6,2.6,i+Ca(t/30,e/30,0,77)*1.2),a=In(.86,.7,s.y),l=In(.45,.62,Ra(t/500,e/500,1,3,31,.5,!1))*(1-o);let c=Math.max(n,a*.6)*(1-o),h=Math.max(0,1-o-l-c);const u=h+l+c+o||1;return h/=u,c/=u,[h,l/u,c,o/u]}}function cm(r,t,e){if(e.hoogte(r,t)<1.5)return 0;const i=Ra(r/700,t/700,1,4,555,.55,!1),s=Math.hypot(r,t)/(e.grootte/2);return In(.5,.6,i+In(.35,1,s)*.08)}const Rt=(r,t,e)=>({soort:r,richting:t,breedte:e}),Te={voetpad:{id:"voetpad",naam:"Voetpad",stroken:[Rt("stoep","T",2.5)],snelheid:5,erf:!1,dek:"tegels",kosten:150,bomen:!1},fietspad:{id:"fietspad",naam:"Fietspad",stroken:[Rt("fiets","T",3)],snelheid:20,erf:!1,dek:"rood",kosten:250,bomen:!1},woonstraat:{id:"woonstraat",naam:"Woonstraat (30)",snelheid:30,erf:!0,dek:"klinkers",kosten:900,bomen:!0,stroken:[Rt("stoep","T",1.8),Rt("gedeeld","B",2.75),Rt("gedeeld","A",2.75),Rt("stoep","T",1.8)]},straat:{id:"straat",naam:"Straat (50)",snelheid:50,erf:!0,dek:"asfalt",kosten:1400,bomen:!0,stroken:[Rt("stoep","T",2),Rt("fiets","B",1.75),Rt("auto","B",3),Rt("auto","A",3),Rt("fiets","A",1.75),Rt("stoep","T",2)]},straatBus:{id:"straatBus",naam:"Straat met busbaan",snelheid:50,erf:!0,dek:"asfalt",kosten:1900,bomen:!0,stroken:[Rt("stoep","T",2.2),Rt("fiets","B",1.75),Rt("bus","B",3.25),Rt("auto","B",3),Rt("auto","A",3),Rt("bus","A",3.25),Rt("fiets","A",1.75),Rt("stoep","T",2.2)]},laan:{id:"laan",naam:"Stadslaan 2x2",snelheid:50,erf:!0,dek:"asfalt",kosten:3200,bomen:!0,stroken:[Rt("stoep","T",3),Rt("fiets","B",2),Rt("berm","T",1),Rt("auto","B",3.25),Rt("auto","B",3.25),Rt("middenberm","T",3.5),Rt("auto","A",3.25),Rt("auto","A",3.25),Rt("berm","T",1),Rt("fiets","A",2),Rt("stoep","T",3)]},tramstraat:{id:"tramstraat",naam:"Tramstraat",snelheid:50,erf:!0,dek:"asfalt",kosten:4200,bomen:!1,stroken:[Rt("stoep","T",2.5),Rt("fiets","B",1.75),Rt("auto","B",3),Rt("tram","B",3),Rt("tram","A",3),Rt("auto","A",3),Rt("fiets","A",1.75),Rt("stoep","T",2.5)]},gow:{id:"gow",naam:"Ontsluitingsweg (70)",snelheid:70,erf:!1,dek:"asfalt",kosten:3500,bomen:!0,stroken:[Rt("fiets","B",2.5),Rt("berm","T",2.5),Rt("auto","B",3.25),Rt("auto","B",3.25),Rt("middenberm","T",3),Rt("auto","A",3.25),Rt("auto","A",3.25),Rt("berm","T",2.5),Rt("fiets","A",2.5)]},snelweg:{id:"snelweg",naam:"Snelweg 2x3",snelheid:100,erf:!1,dek:"asfalt",kosten:9e3,bomen:!1,stroken:[Rt("berm","T",1.5),Rt("vluchtstrook","B",3.5),Rt("auto","B",3.5),Rt("auto","B",3.5),Rt("auto","B",3.5),Rt("middenberm","T",4),Rt("auto","A",3.5),Rt("auto","A",3.5),Rt("auto","A",3.5),Rt("vluchtstrook","A",3.5),Rt("berm","T",1.5)]}},sh=["woonstraat","straat","straatBus","laan","tramstraat","gow","snelweg","fietspad","voetpad"];function Es(r){return r.reduce((t,e)=>t+e.breedte,0)}function Ge(r){return Es(Te[r].stroken)/2}function cc(r){let e=-Es(r)/2;return r.map(n=>{const i={a:e,b:e+n.breedte,s:n};return e+=n.breedte,i})}function Tl(r){const t=cc(r),e=Es(r),n=a=>a.soort==="auto"||a.soort==="bus"||a.soort==="tram"||a.soort==="gedeeld"||a.soort==="vluchtstrook",i=t.findIndex(a=>n(a.s)),s=t.length-1-[...t].reverse().findIndex(a=>n(a.s)),o=i>=0;return{binnenL:o?t[i].a:-e/2,binnenR:o?t[s].b:e/2,buitenL:-e/2,buitenR:e/2,stoep:o&&i>0&&t.slice(0,i).some(a=>a.s.soort==="stoep")}}const U1={voetpad:1,fietspad:2,woonstraat:3.5,straat:4.5,straatBus:6,laan:7,tramstraat:6,gow:9,snelweg:14},k1=4,Ys=6;class Xn{constructor(t){this.terrein=t}knopen=new Map;segmenten=new Map;volgende=1;events=[];naamGever=t=>t;static curve(t,e,n,i=48){const s=[];for(let o=0;o<=i;o++)s.push(Wr(t,e,n,o/i));return s}static bemonster(t,e,n,i=k1){const o=[],a=[0];for(let d=0;d<=96;d++)o.push(Wr(t,e,n,d/96));for(let d=1;d<=96;d++)a.push(a[d-1]+me(o[d-1],o[d]));const l=a[96],c=Math.max(1,Math.round(l/i)),h=[];let u=0;for(let d=0;d<=c;d++){const f=d/c*l;for(;u<95&&a[u+1]<f;)u++;const p=a[u+1]-a[u],x=p>1e-9?(f-a[u])/p:0,m=(u+x)/96,g=fn(o[u],o[u+1],x),y=Kn({x:(1-m)*(e.x-t.x)+m*(n.x-e.x),z:(1-m)*(e.z-t.z)+m*(n.z-e.z)});h.push({p:g,d:y,s:f,t:m})}return h}knoopHoogte(t){const e=this.terrein;let n=0,i=0;for(const[s,o]of[[0,0],[6,0],[-6,0],[0,6],[0,-6]])n+=e.hoogte(t.x+s,t.z+o),i++;return n/=i,n<hi+.8?hi+7:n}berekenPad(t){const e=this.knopen.get(t.a),n=this.knopen.get(t.b),i=Xn.bemonster(e.p,t.c,n.p),s=this.terrein,o=i.map(u=>{const d=s.hoogte(u.p.x,u.p.z);return d<hi+.8?hi+7:d});let a=o.slice();for(let u=0;u<4;u++){const d=a.slice();for(let f=1;f<a.length-1;f++){let p=0,x=0;for(let m=-3;m<=3;m++){const g=Math.min(a.length-1,Math.max(0,f+m));p+=a[g],x++}d[f]=Math.max(p/x,o[f]<hi+.8?hi+7:-1e9)}a=d}const l=i.length-1,c=a[0],h=a[l];t.pad=i.map((u,d)=>{const f=l?d/l:0,p=a[d]+(e.y-c)*(1-f)+(n.y-h)*f,x=s.hoogte(u.p.x,u.p.z);return{x:u.p.x,y:p,z:u.p.z,dx:u.d.x,dz:u.d.z,s:u.s,brug:x<p-2.2}});for(let u=0;u<t.pad.length;u++){if(!t.pad[u].brug)continue;let d=u;for(;d<t.pad.length&&t.pad[d].brug;)d++;if(d-u<3)for(let f=u;f<d;f++)t.pad[f].brug=!1;u=d}t.lengte=i[l].s}egaliseer(t){const e=Ge(t.type),n=t.pad;let i=1/0,s=1/0,o=-1/0,a=-1/0;for(const c of n)i=Math.min(i,c.x),s=Math.min(s,c.z),o=Math.max(o,c.x),a=Math.max(a,c.z);const l=e+14;this.terrein.egaliseer((c,h)=>{let u=1/0,d=0,f=!1;for(let p=0;p<n.length-1;p++){const x=n[p],m=n[p+1],g=ih({x:c,z:h},x,m);g.d<u&&(u=g.d,d=he(x.y,m.y,g.t),f=x.brug||m.brug)}return f?null:{h:d-.08,d:u}},i-l,s-l,o+l,a+l,e+.8,12)}graad(t){return this.knopen.get(t)?.segs.length??0}kruispuntStraal(t){const e=this.knopen.get(t);if(!e)return 0;let n=0;for(const i of e.segs)n=Math.max(n,Ge(this.segmenten.get(i).type));return n+1.5}isKruispunt(t){const e=this.knopen.get(t);if(!e)return!1;if(e.segs.length>=3)return!0;if(e.segs.length===2){const[n,i]=e.segs.map(s=>this.segmenten.get(s));return!!n&&!!i&&n.type!==i.type}return!1}eindKnip(t,e){const n=e==="a"?t.a:t.b,i=this.knopen.get(n);if(!i||i.segs.length<2||!t.pad.length)return{links:0,rechts:0};const s=this.isKruispunt(n),o=this.wegVan(t,n),a=Tl(Te[t.type].stroken),l=d=>Math.atan2(d.z,d.x),c={links:0,rechts:0};for(const d of[1,-1]){let f=null,p=1/0;for(const g of i.segs){if(g===t.id)continue;const y=this.segmenten.get(g);if(!y||!y.pad.length)continue;let v=(l(this.wegVan(y,n))-l(o))*d;v=(v%(2*Math.PI)+2*Math.PI)%(2*Math.PI),v>.001&&v<p&&(p=v,f=y)}const x=e==="a"==(d===1);let m=0;if(f){const g=this.wegVan(f,n),y=Tl(Te[f.type].stroken),v=x?a.binnenR:-a.binnenL,E=f.a===n==(d===-1)?y.binnenR:-y.binnenL,b={x:-o.z*d,z:o.x*d},w={x:g.z*d,z:-g.x*d},C={x:i.p.x+b.x*v,z:i.p.z+b.z*v},S={x:i.p.x+w.x*E,z:i.p.z+w.z*E},M=o.x*g.z-o.z*g.x;Math.abs(M)>.03&&(m=((S.x-C.x)*g.z-(S.z-C.z)*g.x)/M),s?m=Math.max(1.5,m+U1[t.type]):m=Math.max(-v*3,m)}c[x?"rechts":"links"]=Math.min(m,t.lengte*.45)}const h=Es(Te[t.type].stroken),u=(c.rechts-c.links)/Math.max(.1,a.binnenR-a.binnenL);return{links:c.links+u*(-h/2-a.binnenL),rechts:c.rechts+u*(h/2-a.binnenR)}}wegVan(t,e){const n=t.a===e?t.pad[0]:t.pad[t.pad.length-1];return t.a===e?{x:n.dx,z:n.dz}:{x:-n.dx,z:-n.dz}}knoopBij(t,e){let n=null,i=e;for(const s of this.knopen.values()){const o=me(s.p,t);o<i&&(i=o,n=s)}return n}segmentBij(t,e=0){let n=null;for(const i of this.segmenten.values()){const s=Ge(i.type)+e,o=this.knopen.get(i.a),a=this.knopen.get(i.b),l=Xn.curve(o.p,i.c,a.p,32);for(let c=0;c<l.length-1;c++){const h=ih(t,l[c],l[c+1]);h.d<=s&&(!n||h.d<n.d)&&(n={seg:i,t:(c+h.t)/(l.length-1),d:h.d})}}return n}nieuweKnoop(t){const e={id:this.volgende++,p:{...t},y:this.knoopHoogte(t),segs:[]};return this.knopen.set(e.id,e),e}nieuwSegment(t,e,n,i,s=""){const o={id:this.volgende++,a:t.id,b:n.id,c:{...e},type:i,naam:s,lengte:0,pad:[]};return this.segmenten.set(o.id,o),t.segs.push(o.id),n.segs.push(o.id),this.berekenPad(o),this.egaliseer(o),this.events.push({soort:"seg+",id:o.id}),this.meldKnoop(t.id),this.meldKnoop(n.id),o}meldKnoop(t){this.events.push({soort:"knoop~",id:t});for(const e of this.knopen.get(t)?.segs??[])this.events.push({soort:"seg+",id:e})}verwijderSegment(t){const e=this.segmenten.get(t);if(e){this.segmenten.delete(t),this.events.push({soort:"seg-",id:t});for(const n of[e.a,e.b]){const i=this.knopen.get(n);i&&(i.segs=i.segs.filter(s=>s!==t),i.segs.length===0?(this.knopen.delete(n),this.events.push({soort:"knoop~",id:n})):this.meldKnoop(n))}}}splits(t,e){const n=this.segmenten.get(t);if(!n)return null;const i=this.knopen.get(n.a),s=this.knopen.get(n.b),o=fn(i.p,n.c,e),a=fn(n.c,s.p,e),l=fn(o,a,e);if(me(l,i.p)<Ys||me(l,s.p)<Ys)return null;const c=n.type,h=n.naam;let u=this.knoopHoogte(l),d=1/0;for(const m of n.pad){const g=Math.hypot(m.x-l.x,m.z-l.z);g<d&&(d=g,u=m.y)}this.verwijderSegment(t);for(const m of[i,s])this.knopen.has(m.id)||(m.segs=[],this.knopen.set(m.id,m));const f=this.nieuweKnoop(l);f.y=u;const p=this.nieuwSegment(i,o,f,c,h),x=this.nieuwSegment(f,a,s,c,h);return{knoop:f,delen:[p,x]}}knoopOp(t,e){const n=this.knoopBij(t,Math.max(5,Ge(e)));if(n)return n;const i=this.segmentBij(t);if(i){const s=this.splits(i.seg.id,i.t);if(s)return s.knoop;const o=this.knopen.get(i.seg.a),a=this.knopen.get(i.seg.b);return me(o.p,t)<me(a.p,t)?o:a}return this.nieuweKnoop(t)}static minStraal(t,e,n){const i={x:2*(n.x-2*e.x+t.x),z:2*(n.z-2*e.z+t.z)};let s=1/0;for(let o=0;o<=24;o++){const a=o/24,l={x:2*((1-a)*(e.x-t.x)+a*(n.x-e.x)),z:2*((1-a)*(e.z-t.z)+a*(n.z-e.z))},c=Math.abs(l.x*i.z-l.z*i.x);c>1e-9&&(s=Math.min(s,Math.hypot(l.x,l.z)**3/c))}return s}controleer(t,e,n,i){if(me(t,e)+me(e,n)<Ys*1.5)return"Te kort";const o=this.terrein;for(const c of Xn.curve(t,e,n,24))if(!o.binnen(c.x,c.z,20))return"Buiten de kaart";if(Xn.minStraal(t,e,n)<Ge(i)+3)return"Bocht te krap";const a=Kn(ln(e,t)),l=Kn(ln(n,e));return a.x*l.x+a.z*l.z<-.5?"Bocht te krap":null}leg(t,e,n,i){if(this.controleer(t,e,n,i))return[];const s=this.knoopOp(t,i),o=this.knoopOp(n,i);if(s.id===o.id)return[];const l=Math.abs(e.x-(t.x+n.x)/2)<1e-6&&Math.abs(e.z-(t.z+n.z)/2)<1e-6?fn(s.p,o.p,.5):{x:e.x+(s.p.x-t.x+(o.p.x-n.x))/2,z:e.z+(s.p.z-t.z+(o.p.z-n.z))/2};let c="";for(const v of[s,o])for(const _ of v.segs){const E=this.segmenten.get(_);if(c||E.type!==i||v.segs.length!==1)continue;const b=this.wegVan(E,v.id),w=Kn(ln(l,v.p));b.x*w.x+b.z*w.z<-.85&&(c=E.naam)}c||(c=this.naamGever(i));const h=Xn.curve(s.p,l,o.p,64),u=[];for(const v of this.segmenten.values()){if(v.a===s.id||v.b===s.id||v.a===o.id||v.b===o.id)continue;const _=this.knopen.get(v.a),E=this.knopen.get(v.b),b=Xn.curve(_.p,v.c,E.p,32);for(let w=0;w<h.length-1;w++)for(let C=0;C<b.length-1;C++){const S=D1(h[w],h[w+1],b[C],b[C+1]);if(S===null)continue;const M=fn(h[w],h[w+1],S),P=ih(M,b[C],b[C+1]);u.push({tNieuw:(w+S)/(h.length-1),seg:v.id,tOud:(C+P.t)/(b.length-1)})}}u.sort((v,_)=>v.tNieuw-_.tNieuw);const d=[s],f=[0];for(const v of u){if(!this.segmenten.has(v.seg))continue;const _=Wr(s.p,l,o.p,v.tNieuw);if(me(_,s.p)<Ys||me(_,o.p)<Ys||me(_,d[d.length-1].p)<Ys)continue;const E=this.splits(v.seg,v.tOud);E&&(d.push(E.knoop),f.push(v.tNieuw))}d.push(o),f.push(1);const p=[];let x=s.p,m=l,g=o.p,y=0;for(let v=1;v<d.length;v++){const _=f[v],E=v===d.length-1?1:(_-y)/(1-y),b=fn(x,m,E),w=fn(m,g,E),C=d[v-1],S=d[v];C.id!==S.id&&!this.bestaatVerbinding(C.id,S.id)&&p.push(this.nieuwSegment(C,E>=1?m:b,S,i,c)),x=S.p,m=w,y=_}return p}bestaatVerbinding(t,e){for(const n of this.knopen.get(t)?.segs??[]){const i=this.segmenten.get(n);if(i.a===t&&i.b===e||i.a===e&&i.b===t)return!0}return!1}wijzigType(t,e){const n=this.segmenten.get(t);return!n||n.type===e?!1:(n.type=e,this.berekenPad(n),this.egaliseer(n),this.events.push({soort:"seg+",id:t}),this.meldKnoop(n.a),this.meldKnoop(n.b),!0)}haalEvents(){const t=this.events;return this.events=[],t}naarJson(){return{knopen:[...this.knopen.values()].map(t=>({id:t.id,x:t.p.x,z:t.p.z,y:t.y})),segmenten:[...this.segmenten.values()].map(t=>({id:t.id,a:t.a,b:t.b,cx:t.c.x,cz:t.c.z,type:t.type,naam:t.naam})),volgende:this.volgende}}vanJson(t){this.knopen.clear(),this.segmenten.clear();for(const e of t.knopen)this.knopen.set(e.id,{id:e.id,p:{x:e.x,z:e.z},y:e.y,segs:[]});for(const e of t.segmenten){const n={id:e.id,a:e.a,b:e.b,c:{x:e.cx,z:e.cz},type:e.type,naam:e.naam??"",lengte:0,pad:[]};this.segmenten.set(n.id,n),this.knopen.get(e.a).segs.push(n.id),this.knopen.get(e.b).segs.push(n.id),this.berekenPad(n),this.egaliseer(n),this.events.push({soort:"seg+",id:n.id})}for(const e of this.knopen.values())this.events.push({soort:"knoop~",id:e.id});this.volgende=t.volgende}}const N1=["eik","linde","berk","den","plataan"];class li{constructor(t,e=4242){this.terrein=t;const n=t.grootte/2-10,i=6.5,s=Math.ceil((n*2/i)**2);this.x=new Float32Array(s),this.z=new Float32Array(s),this.schaal=new Float32Array(s),this.rot=new Float32Array(s),this.soort=new Uint8Array(s),this.variant=new Uint8Array(s),this.levend=new Uint8Array(s);let o=0,a=0;for(let l=-n;l<n;l+=i,a++){let c=0;for(let h=-n;h<n;h+=i,c++){const u=l+(Pi(a,c,e)-.5)*i*.9,d=h+(Pi(a,c,e+1)-.5)*i*.9,f=cm(u,d,t),p=f*.8+.006;if(Pi(a,c,e+2)>p)continue;const x=t.hoogte(u,d);if(x<1.2||t.normaal(u,d).y<.8)continue;const m=Pi(a,c,e+3),y=x>22?m<.7?3:2:f<.4?m<.5?2:0:m<.45?0:m<.75?1:m<.9?2:3;this.x[o]=u,this.z[o]=d,this.schaal[o]=.75+Pi(a,c,e+4)*.55,this.rot[o]=Pi(a,c,e+5)*Math.PI*2,this.soort[o]=y,this.variant[o]=Pi(a,c,e+6)<.5?0:1,this.levend[o]=1;const v=this.cel(u,d);let _=this.raster.get(v);_||this.raster.set(v,_=[]),_.push(o),o++}}this.n=o}static VAK=256;x;z;schaal;rot;soort;variant;levend;n=0;raster=new Map;vuileVakken=new Set;cel(t,e){return(Math.floor(t/16)+1e3)*4096+(Math.floor(e/16)+1e3)}vak(t,e){return(Math.floor(t/li.VAK)+100)*1e3+(Math.floor(e/li.VAK)+100)}static vakOorsprong(t){return{x:(Math.floor(t/1e3)-100)*li.VAK,z:(t%1e3-100)*li.VAK}}wis(t,e,n,i,s){for(let o=Math.floor(t/16);o<=Math.floor(n/16);o++)for(let a=Math.floor(e/16);a<=Math.floor(i/16);a++){const l=this.raster.get((o+1e3)*4096+(a+1e3));if(l)for(const c of l)!this.levend[c]||!s(this.x[c],this.z[c])||(this.levend[c]=0,this.vuileVakken.add(this.vak(this.x[c],this.z[c])))}}wisInPolygoon(t,e=0){let n=1/0,i=1/0,s=-1/0,o=-1/0;for(const h of t)n=Math.min(n,h.x),i=Math.min(i,h.z),s=Math.max(s,h.x),o=Math.max(o,h.z);const a=(n+s)/2,l=(i+o)/2,c=e>0?t.map(h=>{const u=h.x-a,d=h.z-l,f=Math.hypot(u,d)||1;return{x:h.x+u/f*e,z:h.z+d/f*e}}):t;this.wis(n-e,i-e,s+e,o+e,(h,u)=>ir({x:h,z:u},c))}haalVuileVakken(){const t=[...this.vuileVakken];return this.vuileVakken.clear(),t}alleVakken(){const t=new Set;for(let e=0;e<this.n;e++)t.add(this.vak(this.x[e],this.z[e]));return[...t]}inVak(t){const e=li.vakOorsprong(t),n=[];for(let i=Math.floor(e.x/16);i<Math.floor((e.x+li.VAK)/16);i++)for(let s=Math.floor(e.z/16);s<Math.floor((e.z+li.VAK)/16);s++){const o=this.raster.get((i+1e3)*4096+(s+1e3));if(o)for(const a of o)this.levend[a]&&n.push(a)}return n}}const Pa=[{id:"wonenLaag",naam:"Wonen laag",kleur:"#5fcf5a",toets:"1"},{id:"wonenHoog",naam:"Wonen hoog",kleur:"#2f9e44",toets:"2"},{id:"gemengd",naam:"Gemengd (winkels + wonen)",kleur:"#4dabf7",toets:"3"},{id:"kantoor",naam:"Kantoren",kleur:"#9775fa",toets:"4"},{id:"industrie",naam:"Industrie",kleur:"#f59f00",toets:"5"},{id:"geen",naam:"Zone weghalen",kleur:"#adb5bd",toets:"6"}],hm=r=>Pa.find(t=>t.id===r)?.kleur??"#888",$s={beroepsbevolking:.52,woningBvo:{rijwoningen:125,winkelsMetWonen:85,anders:80},huishouden:{rijwoningen:2.6,winkelsMetWonen:1.7,anders:1.8},bvoPerBaan:{detailhandel:45,horeca:30,kantoor:24,industrie:95,maatschappelijk:40,wonen:0}};function F1(r,t){switch(r){case"wonen":return t?3:2.9;case"detailhandel":return 4.4;case"horeca":return 4.2;case"kantoor":return t?4.8:3.7;case"industrie":return 9;default:return 3.5}}function O1(r,t,e,n){const i={vloer:0,woningen:0,bewoners:0,banen:{detailhandel:0,horeca:0,kantoor:0,industrie:0,overig:0}},s=.82;let o=0;for(const a of e)if(i.vloer+=t,a==="wonen")o+=t;else{const l=Math.round(t*s/$s.bvoPerBaan[a]);a==="detailhandel"||a==="horeca"||a==="kantoor"||a==="industrie"?i.banen[a]+=l:i.banen.overig+=l}return o>0&&(i.woningen=r==="rijwoningen"?n:Math.max(1,Math.round(o/($s.woningBvo[r]??$s.woningBvo.anders))),i.bewoners=Math.round(i.woningen*($s.huishouden[r]??$s.huishouden.anders))),i}function Un(r){let t=0;for(let e=0;e<r.length;e++){const n=r[e],i=r[(e+1)%r.length];t+=n.x*i.z-i.x*n.z}return t/2}function rh(r,t,e){const n=[],i=s=>(s.x-t.x)*e.x+(s.z-t.z)*e.z;for(let s=0;s<r.length;s++){const o=r[s],a=r[(s+1)%r.length],l=i(o),c=i(a);if(l>=0&&n.push(o),l>=0!=c>=0){const h=l/(l-c);n.push({x:o.x+(a.x-o.x)*h,z:o.z+(a.z-o.z)*h})}}return um(n)}function um(r,t=.05){const e=[];for(const n of r)(!e.length||me(e[e.length-1],n)>t)&&e.push(n);for(;e.length>1&&me(e[0],e[e.length-1])<=t;)e.pop();return e}function hc(r){const t=r.length;if(t<3)return[];const e=[...Array(t).keys()];Un(r)<0&&e.reverse();const n=[],i=(a,l,c)=>(l.x-a.x)*(c.z-a.z)-(l.z-a.z)*(c.x-a.x),s=(a,l,c,h)=>i(l,c,a)>=-1e-9&&i(c,h,a)>=-1e-9&&i(h,l,a)>=-1e-9;let o=0;for(;e.length>3&&o++<5e3;){let a=!1;for(let l=0;l<e.length;l++){const c=e[(l+e.length-1)%e.length],h=e[l],u=e[(l+1)%e.length],d=r[c],f=r[h],p=r[u];if(i(d,f,p)<=1e-9)continue;let x=!0;for(const m of e)if(!(m===c||m===h||m===u)&&s(r[m],d,f,p)){x=!1;break}if(x){n.push(c,h,u),e.splice(l,1),a=!0;break}}if(!a){for(let l=1;l<e.length-1;l++)n.push(e[0],e[l],e[l+1]);return n}}return e.length===3&&n.push(e[0],e[1],e[2]),n}function Fn(r,t,e){let n=1/0,i=0;for(let s=0;s<t.length-1;s++){const o=t[s],a=t[s+1],l=ln(a,o),c=Sl(l,l),h=c>0?Math.max(0,Math.min(1,Sl(ln(r,o),l)/c)):0,u=Math.hypot(r.x-(o.x+l.x*h),r.z-(o.z+l.z*h));u<n&&(n=u,i=e?e[s]+(e[s+1]-e[s])*h:0)}return{d:n,s:i}}function gs(r){let t=0,e=0,n=0;for(let i=0;i<r.length;i++){const s=r[i],o=r[(i+1)%r.length],a=s.x*o.z-o.x*s.z;t+=a,e+=(s.x+o.x)*a,n+=(s.z+o.z)*a}if(Math.abs(t)<1e-9){const i=r.reduce((s,o)=>({x:s.x+o.x,z:s.z+o.z}),{x:0,z:0});return{x:i.x/r.length,z:i.z/r.length}}return{x:e/(3*t),z:n/(3*t)}}function dm(r,t,e){const n=r.slice();let i=t.slice();for(let s=0;s<6;s++){const o=[];let a=!1;const l=new Map,c=(h,u)=>{const d=h<u?`${h},${u}`:`${u},${h}`;let f=l.get(d);return f===void 0&&(f=n.length,n.push({x:(n[h].x+n[u].x)/2,z:(n[h].z+n[u].z)/2}),l.set(d,f)),f};for(let h=0;h<i.length;h+=3){const u=i[h],d=i[h+1],f=i[h+2],p=me(n[u],n[d]),x=me(n[d],n[f]),m=me(n[f],n[u]),g=Math.max(p,x,m);if(g<=e){o.push(u,d,f);continue}if(a=!0,g===p){const y=c(u,d);o.push(u,y,f,y,d,f)}else if(g===x){const y=c(d,f);o.push(u,d,y,u,y,f)}else{const y=c(f,u);o.push(u,d,y,y,d,f)}}if(i=o,!a)break}return{p:n,tri:i}}const Yn=50,B1=12,ya=40;function df(r,t){const e=r.a===t?r.pad[0]:r.pad[r.pad.length-1];return r.a===t?{x:e.dx,z:e.dz}:{x:-e.dx,z:-e.dz}}function ff(r,t,e,n){const i=r.knopen.get(e),s=df(t,e),o=t.a===e==(n===1);if(i.segs.length>1){const a=d=>Math.atan2(d.z,d.x),l=a(s);let c=null,h=1/0,u=null;for(const d of i.segs){if(d===t.id)continue;const f=r.segmenten.get(d);if(!f||!f.pad.length)continue;const p=df(f,e);let x=a(p)-l;o||(x=-x),x=(x%(2*Math.PI)+2*Math.PI)%(2*Math.PI),x>.001&&x<h&&(h=x,c=p,u=f)}if(c&&u&&Math.abs(s.x+c.x)+Math.abs(s.z+c.z)>.05){const d=Kn({x:s.x+c.x,z:s.z+c.z});let f={x:-d.z,z:d.x};f.x*s.x+f.z*s.z<0&&(f={x:-f.x,z:-f.z});const p=o?{x:-s.z,z:s.x}:{x:s.z,z:-s.x};let x={x:-c.z,z:c.x};x.x*s.x+x.z*s.z<0&&(x={x:-x.x,z:-x.z});const m=Ge(t.type)+.05,g=Ge(u.type)+.05,y={x:i.p.x+p.x*m,z:i.p.z+p.z*m},v={x:i.p.x+x.x*g,z:i.p.z+x.z*g},_=s.x*c.z-s.z*c.x;let E={...i.p};if(Math.abs(_)>.05){const b=((v.x-y.x)*c.z-(v.z-y.z)*c.x)/_;Math.abs(b)<60&&(E={x:y.x+s.x*b,z:y.z+s.z*b})}return{o:E,n:f}}}return{o:{...i.p},n:s}}function V1(r,t,e,n){if(!Te[e.type].erf||e.pad.length<2)return null;const i=Ge(e.type)+.05,s=e.pad,o=[],a=[],l=[],c=s[0],h=s[s.length-1],u=(y,v)=>{const _={x:-y.dz*n,z:y.dx*n};return{v:{x:y.x+y.dx*v+_.x*i,z:y.z+y.dz*v+_.z*i},n:_}};for(const y of[-ya,-ya/2]){const v=u(c,y);o.push(v.v),a.push(v.n),l.push(y)}for(const y of s){y.brug;const v={x:-y.dz*n,z:y.dx*n};o.push({x:y.x+v.x*i,z:y.z+v.z*i}),a.push(v),l.push(y.s)}for(const y of[ya/2,ya]){const v=u(h,y);o.push(v.v),a.push(v.n),l.push(e.lengte+y)}const d=[ff(r,e,e.a,n),ff(r,e,e.b,n)],f=o.map((y,v)=>H1(r,t,e,y,a[v])),p=f.map((y,v)=>Math.min(...f.slice(Math.max(0,v-2),v+3)));for(let y=0;y<p.length;y++)f[y]=(p[Math.max(0,y-1)]+p[y]*2+p[Math.min(p.length-1,y+1)])/4;for(let y=0;y<s.length;y++)s[y].brug&&(f[y+2]=0);const x=y=>d.every(v=>(y.x-v.o.x)*v.n.x+(y.z-v.o.z)*v.n.z>=0);let m=1/0,g=-1/0;for(let y=0;y<o.length-1;y++)for(let v=0;v<=1;v+=.125){const _={x:he(o[y].x,o[y+1].x,v),z:he(o[y].z,o[y+1].z,v)};if(!x(_))continue;const E=he(l[y],l[y+1],v);m=Math.min(m,E),g=Math.max(g,E)}return g-m>4?{seg:e.id,zijde:n,voor:o,s:l,binnen:a,diepte:f,knippen:d,s0:m,s1:g}:null}function H1(r,t,e,n,i){let s=Yn;for(let a=2;a<=Yn;a+=2){const l=n.x+i.x*a,c=n.z+i.z*a;if(!t.binnen(l,c,6)||t.hoogte(l,c)<hi+.6){s=Math.max(0,a-2);break}}const o={x:n.x+i.x*(Yn*2+30),z:n.z+i.z*(Yn*2+30)};for(const a of r.segmenten.values()){if(a.id===e.id)continue;const l=Ge(a.type);let c=1/0,h=1/0,u=-1/0,d=-1/0;for(const f of a.pad)c=Math.min(c,f.x),h=Math.min(h,f.z),u=Math.max(u,f.x),d=Math.max(d,f.z);if(!(Math.max(n.x,o.x)<c-l||Math.min(n.x,o.x)>u+l||Math.max(n.z,o.z)<h-l||Math.min(n.z,o.z)>d+l))for(let f=1;f<=Yn*2+30;f+=1.5){const p={x:n.x+i.x*f,z:n.z+i.z*f};if(f/2>=s)break;let x=!1;for(let m=0;m<a.pad.length-1&&!x;m++){const g=a.pad[m],y=a.pad[m+1],v=y.x-g.x,_=y.z-g.z,E=v*v+_*_,b=E>0?Li(((p.x-g.x)*v+(p.z-g.z)*_)/E):0;Math.hypot(p.x-(g.x+v*b),p.z-(g.z+_*b))<l+.3&&(x=!0)}if(x){s=Math.min(s,Math.max(0,(f-.3)/2));break}}}return s}function zn(r,t){const e=r.s;let n=0;for(;n<e.length-2&&e[n+1]<t;)n++;const i=Li((t-e[n])/Math.max(1e-6,e[n+1]-e[n])),s={x:he(r.voor[n].x,r.voor[n+1].x,i),z:he(r.voor[n].z,r.voor[n+1].z,i)},o=Kn({x:he(r.binnen[n].x,r.binnen[n+1].x,i),z:he(r.binnen[n].z,r.binnen[n+1].z,i)}),a=Kn({x:r.voor[n+1].x-r.voor[n].x,z:r.voor[n+1].z-r.voor[n].z});return{p:s,n:o,d:he(r.diepte[n],r.diepte[n+1],i),t:a}}function is(r,t,e,n,i,s=!0){const a=t-(s?6:0),l=e+(s?6:0),c=[a];for(const p of r.s)p>a&&p<l&&c.push(p);c.push(l);const h=[];for(let p=0;p<c.length;p++)if(h.push(c[p]),p<c.length-1&&c[p+1]-c[p]>2.5){const x=Math.ceil((c[p+1]-c[p])/2.5);for(let m=1;m<x;m++)h.push(he(c[p],c[p+1],m/x))}const u=[],d=[];for(const p of h){const x=zn(r,p),m=typeof i=="number"?Math.min(i,x.d):i(x.d),g=Math.min(n,m);u.push({x:x.p.x+x.n.x*g,z:x.p.z+x.n.z*g}),d.push({x:x.p.x+x.n.x*m,z:x.p.z+x.n.z*m})}let f=um([...u,...d.reverse()]);if(s){const p=zn(r,t),x=zn(r,e);f=rh(f,p.p,p.t),f=rh(f,x.p,{x:-x.t.x,z:-x.t.z})}for(const p of r.knippen)f=rh(f,p.o,p.n);return f}function G1(r,t,e=B1){const n=t-r,i=Math.max(1,Math.round(n/e)),s=[];for(let o=0;o<i;o++)s.push([r+n*o/i,r+n*(o+1)/i]);return s}const Ma=(r,t)=>`${r}:${t}`,W1=["Linden","Eiken","Beuken","Kastanje","Esdoorn","Wilgen","Populieren","Berken","Iepen","Platanen","Essen","Elzen","Hazelaar","Meidoorn","Lijsterbes"],X1=["Tulpen","Rozen","Narcissen","Krokus","Hyacinten","Lelie","Dahlia","Klaver","Madelief","Zonnebloem","Viooltjes","Irissen"],q1=["Merel","Lijster","Spreeuw","Mussen","Kievit","Reiger","Zwaluw","Specht","Ooievaar","Grutto","Fazant","Uilen"],Y1=["Molen","Smids","Bakkers","Brouwers","Schippers","Kerk","Haven","Dijk","Sluis","Gasthuis","Raadhuis","Markt"],$1=["Erasmus","Rembrandt","Vondel","Spinoza","Huygens","Mondriaan","Escher","Annie M.G. Schmidt","Aletta Jacobs","Multatuli","Van Gogh","Lorentz","Thorbecke","Drees"],Z1={woonstraat:["straat","hof","erf","pad","plein","gaarde"],straat:["straat","weg","straat","singel"],straatBus:["straat","weg"],laan:["laan","laan","boulevard","singel"],tramstraat:["straat","weg","laan"],gow:["weg","ring","baan"],snelweg:[""],fietspad:["pad","fietspad"],voetpad:["pad","steeg","gang"]};class K1{rng;gebruikt=new Set;snelweg=1;constructor(t){this.rng=new lr(t*31+7)}straat(t){if(t==="snelweg")return`A${[1,2,4,12,27,28,50][this.snelweg++%7]}`;for(let e=0;e<40;e++){const n=this.rng.next(),i=this.rng.kies(Z1[t]);let s;if(n<.3?s=this.rng.kies(W1)+i:n<.5?s=this.rng.kies(X1)+i:n<.68?s=this.rng.kies(q1)+i:n<.85?s=this.rng.kies(Y1)+i:s=this.rng.kies($1)+(i==="straat"||i==="laan"||i==="weg"?i:"straat"),t==="gow"&&i==="ring"&&(s=`Ring ${this.rng.kies(["Noord","Oost","Zuid","West"])}`),(/^[A-Z][a-z]+ [A-Z]/.test(s)||s.includes(" "))&&(s=s.replace(/(straat|laan|weg)$/," $1").replace(/  /g," ")),!this.gebruikt.has(s))return this.gebruikt.add(s),s}return`Weg ${this.gebruikt.size+1}`}}const j1=["Nieuw","Oud","Groot","Hoog","Klein","West","Oost",""],J1=["Vliet","Brug","Haven","Molen","Linde","Eiken","Water","Zand","Heide","Bree","Dijk","Gouw","Rijn","Berg","Lee","Wester"],Q1=["dam","dorp","hoven","wijk","veen","drecht","stede","kerk","burg","mond","horst","loo"];function tb(r){const t=new lr(r*101+3),e=t.kies(j1),n=t.kies(J1),i=t.kies(Q1);return(e?e+"-":"")+n+i}const eb=4,oh=[100,500,1e3,2500,5e3,1e4,25e3,5e4,1e5,25e4,5e5,1e6],pr=r=>r.reduce((t,e)=>t+e.hoogte,0),ba=(r,t=0)=>{let e=1/0,n=1/0,i=-1/0,s=-1/0;for(const o of r)e=Math.min(e,o.x),n=Math.min(n,o.z),i=Math.max(i,o.x),s=Math.max(s,o.z);return{x0:e-t,z0:n-t,x1:i+t,z1:s+t}},ah=(r,t)=>r.x0<=t.x1&&t.x0<=r.x1&&r.z0<=t.z1&&t.z0<=r.z1;class nb{constructor(t=1){this.seed=t,this.terrein=new wl(2048,4,t),this.net=new Xn(this.terrein),this.bomen=new li(this.terrein,t*7+4242),this.rng=new lr(t*977+13),this.naam=tb(t),this.namen=new K1(t),this.net.naamGever=e=>this.namen.straat(e)}terrein;net;bomen;stroken=new Map;kavels=new Map;gebouwen=new Map;events=[];snelheid=1;dagen=0;geld=5e6;stat={inwoners:0,woningen:0,beroeps:0,werkenden:0,werkloosheid:0,banen:0,banenD:0,banenH:0,banenK:0,banenI:0,banenO:0,gebouwenKlaar:0,inAanbouw:0};vraag={wonen:.6,detailhandel:.1,kantoor:.05,industrie:.15};volgende=1;rng;bouwKlok=0;statKlok=0;segBox=new Map;naam;namen;nieuws=[];nieuwsId=1;gemeld=new Set;opgeleverd=new Map;nieuwsKlok=0;mijlpaal=0;waarschuwKlok=0;meld(t,e){this.nieuws.push({id:this.nieuwsId++,dag:this.dagen,tekst:t,soort:e}),this.nieuws.length>40&&this.nieuws.shift()}straatVan(t){const e=this.kavels.get(t.kavel);return e&&this.net.segmenten.get(e.seg)?.naam||""}haalEvents(){const t=this.events;return this.events=[],t}legWeg(t,e,n,i){const s=this.net.controleer(t,e,n,i);if(s)return{ok:!1,fout:s};const o=Te[i].kosten*(me(t,e)+me(e,n));if(o>this.geld)return{ok:!1,fout:"Niet genoeg geld"};const a=this.net.leg(t,e,n,i);if(!a.length)return{ok:!1,fout:"Kan hier geen weg leggen"};this.geld-=o;for(const c of a)this.wisBomenLangs(c);this.verwerkNet();const l=a[0].naam;return l&&!this.gemeld.has(l)&&(this.gemeld.add(l),this.meld(i==="snelweg"?`De ${l} is aangesloten op ${this.naam}`:`De ${l} is aangelegd`,"weg")),{ok:!0}}sloopWeg(t){const e=this.net.segmenten.get(t);e&&(this.net.verwijderSegment(t),this.geld+=Te[e.type].kosten*e.lengte*.25,this.verwerkNet())}wijzigWeg(t,e){const n=this.net.segmenten.get(t);if(!n||n.type===e)return!1;const i=(Te[e].kosten-Te[n.type].kosten*.5)*n.lengte;return i>this.geld?!1:(this.net.wijzigType(t,e),this.geld-=Math.max(0,i),this.wisBomenLangs(n),this.verwerkNet(),!0)}verwerkNet(){const t=this.net.haalEvents(),e=new Set,n=[];for(const a of t)if(this.events.push(a),a.soort==="seg+"&&e.add(a.id),a.soort==="seg-"){const l=this.segBox.get(a.id);l&&n.push(l),this.segBox.delete(a.id)}for(const a of e){const l=this.net.segmenten.get(a);if(!l)continue;const c=ba(l.pad,Ge(l.type));this.segBox.set(a,c),n.push(c)}if(!n.length)return;const i=Yn*2+20,s=n.map(a=>({x0:a.x0-i,z0:a.z0-i,x1:a.x1+i,z1:a.z1+i})),o=new Set;for(const[a,l]of this.segBox)s.some(c=>ah(c,l))&&o.add(a);this.herbouwStroken(o,n)}wisBomenLangs(t){const e=Ge(t.type)+2.5,n=ba(t.pad,e);this.bomen.wis(n.x0,n.z0,n.x1,n.z1,(i,s)=>Fn({x:i,z:s},t.pad).d<e)}wegRaakt(t,e=-.2){const n=ba(t);for(const i of this.net.segmenten.values()){const s=Ge(i.type)+e,o=this.segBox.get(i.id);if(!(o&&!ah(o,n)))for(let a=0;a<i.pad.length-1;a++){const l=i.pad[a],c=i.pad[a+1];for(let h=0;h<=1;h+=.25){const u={x:l.x+(c.x-l.x)*h,z:l.z+(c.z-l.z)*h};if(!(u.x<n.x0-s||u.x>n.x1+s||u.z<n.z0-s||u.z>n.z1+s)&&(ir(u,t)||ib(u,t)<s))return!0}}}return!1}herbouwStroken(t,e){const n=[];for(const[o,a]of this.stroken)if(t.has(a.seg)||!this.net.segmenten.has(a.seg)){this.stroken.delete(o);for(const l of this.kavels.values())l.strook===o&&n.push(l)}const i=[];for(const o of t){const a=this.net.segmenten.get(o);if(a)for(const l of[1,-1]){const c=V1(this.net,this.terrein,a,l);c&&(this.stroken.set(Ma(o,l),c),i.push(c))}}const s=new Map;for(const o of n){let a=null,l=0,c=0;for(const f of i){if(f.zijde!==o.zijde&&this.net.segmenten.get(f.seg)?.id===o.seg)continue;const p=Fn(o.voorA,f.voor,f.s),x=Fn(o.voorB,f.voor,f.s);if(p.d<.8&&x.d<.8){const m=zn(f,(p.s+x.s)/2);if(m.n.x*o.binnen.x+m.n.z*o.binnen.z<.7)continue;a=f,l=Math.min(p.s,x.s),c=Math.max(p.s,x.s);break}}if(!a||c-l<3){this.verwijderKavel(o.id);continue}l=Math.max(l,a.s0),c=Math.min(c,a.s1);const h=is(a,l,c,0,Yn),u=Math.abs(Un(h));if(h.length<3||u<o.oppervlak*.85||this.wegRaakt(h)){this.verwijderKavel(o.id);continue}this.zetKavel(o,a,l,c,h);const d=Ma(a.seg,a.zijde);(s.get(d)??s.set(d,[]).get(d)).push([l,c]),this.events.push({soort:"kavel~",id:o.id})}for(const o of[...this.kavels.values()])s.has(o.strook)&&this.stroken.has(o.strook)||e.some(a=>ah(a,ba(o.poly)))&&this.wegRaakt(o.poly)&&this.verwijderKavel(o.id);for(const o of i){const a=Ma(o.seg,o.zijde),l=(s.get(a)??[]).sort((u,d)=>u[0]-d[0]),c=[];let h=o.s0;for(const[u,d]of l)u-h>.5&&c.push([h,u]),h=Math.max(h,d);o.s1-h>.5&&c.push([h,o.s1]);for(const[u,d]of c){if(d-u<4){const f=[...this.kavels.values()].find(p=>p.strook===a&&!p.gebouw&&(Math.abs(p.s1-u)<.6||Math.abs(p.s0-d)<.6));if(f){const p=Math.min(f.s0,u),x=Math.max(f.s1,d),m=is(o,p,x,0,Yn);m.length>=3&&(this.zetKavel(f,o,p,x,m),this.events.push({soort:"kavel~",id:f.id}))}continue}for(const[f,p]of G1(u,d))this.nieuweKavel(o,f,p)}}}zetKavel(t,e,n,i,s){const o=zn(e,(n+i)/2);t.strook=Ma(e.seg,e.zijde),t.seg=e.seg,t.zijde=e.zijde,t.s0=n,t.s1=i,t.poly=s,t.voorA=zn(e,n).p,t.voorB=zn(e,i).p,t.voor=o.p,t.binnen=o.n,t.langs=o.t,t.breedte=i-n,t.diepte=o.d,t.oppervlak=Math.abs(Un(s))}nieuweKavel(t,e,n){const i=is(t,e,n,0,Yn);if(i.length<3||Math.abs(Un(i))<50)return;let o=1/0,a=-1/0;for(const c of i){const h=this.terrein.hoogte(c.x,c.z);o=Math.min(o,h),a=Math.max(a,h)}if(a-o>7||this.wegRaakt(i))return;const l={id:this.volgende++,zone:"geen",gebouw:0};this.zetKavel(l,t,e,n,i),this.kavels.set(l.id,l),this.events.push({soort:"kavel+",id:l.id})}verwijderKavel(t){const e=this.kavels.get(t);e&&(e.gebouw&&this.verwijderGebouw(e.gebouw),this.kavels.delete(t),this.events.push({soort:"kavel-",id:t}))}zoneer(t,e,n){let i=0;for(const s of this.kavels.values()){const o=gs(s.poly);if(!(!(me(o,t)<=e||me(s.voor,t)<=e||ir(t,s.poly))||s.zone===n)){if(s.gebouw){if(n!=="geen")continue;this.verwijderGebouw(s.gebouw)}s.zone=n,i++,this.events.push({soort:"kavel~",id:s.id})}}return i}ontwerp(t,e){const n=new lr(e),i=t[0],s=i.zone,o=this.stroken.get(i.strook);if(!o)return null;const a=Math.min(...t.map(M=>M.s0)),l=Math.max(...t.map(M=>M.s1)),c=l-a;let h,u,d,f,p=1;switch(s){case"wonenLaag":h="rijwoningen",u=n.next()<.65?2:3,p=Math.max(1,Math.round(c/5.4)),d=n.range(9,10.5),f=n.range(3,5);break;case"wonenHoog":h="appartementen",u=t.length>1?n.int(5,11):n.int(4,7),d=n.range(12,15),f=n.range(2.5,5);break;case"gemengd":h="winkelsMetWonen",u=n.int(3,5),d=n.range(12,16),f=.2;break;case"kantoor":h="kantoortoren",u=t.length>1?n.int(6,18):n.int(4,8),d=n.range(16,22),f=n.range(3,5);break;case"industrie":h="bedrijfshal",u=1,d=n.range(20,30),f=n.range(5,8);break;default:return null}const x=zn(o,(a+l)/2);if(d=Math.min(d,x.d-f-1.5),d<6)return null;const m=is(o,a,l,f,M=>Math.min(f+d,M-1));if(m.length<3||Math.abs(Un(m))<30)return null;const g=[];for(let M=0;M<u;M++){const P=M===0,N=h==="winkelsMetWonen"?P?n.next()<.25?"horeca":"detailhandel":"wonen":h==="kantoortoren"?"kantoor":h==="bedrijfshal"?"industrie":"wonen";g.push({functie:N,hoogte:F1(N,P)})}const y=[];for(let M=a-6;M<=l+6.01;M+=Math.min(2,(c+12)/4))y.push(zn(o,M).p);const v=h==="rijwoningen"?{voor:is(o,a,l,f,M=>Math.min(f+d/2,M-1)),achter:is(o,a,l,f+d/2,M=>Math.min(f+d,M-1))}:void 0,_=[],E=[];for(let M=0;M<p;M++){const P=zn(o,a+(M+.5)*c/p);_.push({p:{x:P.p.x+P.n.x*f,z:P.p.z+P.n.z*f},n:P.n,t:P.t,d:P.d})}for(let M=1;M<p;M++){const P=zn(o,a+M*c/p);E.push({p:P.p,n:P.n,t:P.t,d:P.d})}const b=is(o,a,l,0,Yn);let w=-1/0,C=1/0;for(const M of[...m,gs(m)]){const P=this.terrein.hoogte(M.x,M.z);w=Math.max(w,P),C=Math.min(C,P)}const S=Math.abs(Un(m));return{id:this.volgende++,kavel:i.id,kavels:t.map(M=>M.id),zone:s,vorm:h,voet:m,voorLijn:y,terug:f,diepte:d,dak:v,ankers:_,grenzen:E,perceel:b,centrum:gs(m),voor:{x:-x.n.x,z:-x.n.z},breedte:c,y:w+.15,yGrond:C,lagen:g,eenheden:p,seed:Math.floor(n.next()*2**31),voortgang:0,klaar:!1,bezetting:0,cap:O1(h,S,g.map(M=>M.functie),p)}}buur(t,e){for(const n of this.kavels.values())if(!(n===t||n.strook!==t.strook||n.zone!==t.zone||n.gebouw)&&(e?Math.abs(n.s0-t.s1)<.6:Math.abs(n.s1-t.s0)<.6))return n;return null}startBouw(t){const e={kantoor:.75,wonenHoog:.55,industrie:.65,wonenLaag:.35,gemengd:.25},n={kantoor:3,wonenHoog:3,industrie:3,wonenLaag:2,gemengd:2},i=[t];if(this.rng.next()<(e[t.zone]??0)){const o=2+(this.rng.next()<.4?1:0);for(;i.length<Math.min(o,n[t.zone]??1);){const a=this.buur(i[i.length-1],!0),l=a?null:this.buur(i[0],!1);if(a)i.push(a);else if(l)i.unshift(l);else break}}const s=this.ontwerp(i,Math.floor(this.rng.next()*2**31));if(s){this.gebouwen.set(s.id,s);for(const o of i)o.gebouw=s.id,this.events.push({soort:"kavel~",id:o.id});this.bomen.wisInPolygoon(s.perceel,1),this.events.push({soort:"gebouw+",id:s.id})}}verwijderGebouw(t){const e=this.gebouwen.get(t);if(e){this.gebouwen.delete(t);for(const n of e.kavels){const i=this.kavels.get(n);i&&i.gebouw===t&&(i.gebouw=0,this.events.push({soort:"kavel~",id:i.id}))}this.events.push({soort:"gebouw-",id:t})}}gebouwOp(t){for(const e of this.gebouwen.values())if(ir(t,e.voet))return e;return null}vraagVoor(t){const e=this.vraag;switch(t){case"wonenLaag":case"wonenHoog":return e.wonen;case"gemengd":return Math.max(e.wonen,e.detailhandel)*.9;case"kantoor":return e.kantoor;case"industrie":return e.industrie;default:return 0}}stap(t){const e=Math.min(.25,t)*this.snelheid;if(!(e<=0)){this.dagen+=e/eb;for(const n of this.gebouwen.values())if(n.klaar)n.bezetting<1&&(n.bezetting=Math.min(1,n.bezetting+e*.035*(.35+this.vraagVoor(n.zone))));else{const i=8+1.6*n.lagen.length,s=Math.floor(n.voortgang*n.lagen.length*2);if(n.voortgang=Math.min(1,n.voortgang+e/i),n.voortgang>=1){n.klaar=!0,this.events.push({soort:"gebouw~",id:n.id});const o=this.straatVan(n),a=this.opgeleverd.get(o)??{woningen:0,banen:0,n:0,vorm:n.vorm};a.woningen+=n.cap.woningen,a.banen+=n.cap.banen.detailhandel+n.cap.banen.horeca+n.cap.banen.kantoor+n.cap.banen.industrie+n.cap.banen.overig,a.n++,this.opgeleverd.set(o,a)}else Math.floor(n.voortgang*n.lagen.length*2)!==s&&this.events.push({soort:"gebouw~",id:n.id})}if(this.bouwKlok+=e,this.bouwKlok>=.3){this.bouwKlok=0;const n=new Map;for(const i of this.kavels.values()){if(i.zone==="geen"||i.gebouw)continue;let s=n.get(i.zone);s||n.set(i.zone,s=[]),s.push(i)}for(const[i,s]of n){const o=this.vraagVoor(i),a=1+Math.floor(o*2);for(let l=0;l<a&&s.length;l++){if(this.rng.next()>o)continue;const c=Math.floor(this.rng.next()*s.length),h=s[c];s.splice(c,1),h.gebouw||this.startBouw(h)}}}if(this.statKlok+=t,this.statKlok>=.5&&(this.statKlok=0,this.berekenStatistiek()),this.nieuwsKlok+=e,this.nieuwsKlok>30){this.nieuwsKlok=0;const n=[...this.opgeleverd.entries()].sort((i,s)=>s[1].woningen+s[1].banen-(i[1].woningen+i[1].banen)).slice(0,2);for(const[i,s]of n){const o=i?` aan de ${i}`:"";s.woningen&&s.banen?this.meld(`${s.woningen} woningen en ${s.banen} banen opgeleverd${o}`,"bouw"):s.woningen?this.meld(`${s.woningen} ${s.woningen===1?"woning":"nieuwe woningen"} opgeleverd${o}`,"bouw"):s.banen&&this.meld(`${s.vorm==="bedrijfshal"?"Nieuw bedrijf":s.vorm==="kantoortoren"?"Nieuw kantoor":"Nieuwe winkels"}${o}: ${s.banen} banen`,"bouw")}this.opgeleverd.clear()}for(;this.mijlpaal<oh.length&&this.stat.inwoners>=oh[this.mijlpaal];)this.meld(`${this.naam} telt nu ${oh[this.mijlpaal].toLocaleString("nl-NL")} inwoners!`,"mijlpaal"),this.mijlpaal++;this.waarschuwKlok+=e,this.waarschuwKlok>240&&this.stat.inwoners>200&&(this.stat.werkloosheid>.15?(this.meld(`Werkloosheid ${Math.round(this.stat.werkloosheid*100)}%: er is vraag naar kantoren en bedrijven`,"waarschuwing"),this.waarschuwKlok=0):this.vraag.wonen>.8&&![...this.kavels.values()].some(n=>(n.zone==="wonenLaag"||n.zone==="wonenHoog")&&!n.gebouw)&&(this.meld("Er is vraag naar woningen: wijs meer woonzones aan","waarschuwing"),this.waarschuwKlok=0))}}get tevredenheid(){const t=this.stat,e=this.vraag;if(t.inwoners<1)return 75;let n=82-t.werkloosheid*160-Math.max(0,e.detailhandel-.6)*25-Math.max(0,e.wonen-.85)*10;return Math.round(Math.max(5,Math.min(100,n)))}berekenStatistiek(){let t=0,e=0,n=0,i=0,s=0,o=0,a=0,l=0,c=0;for(const g of this.gebouwen.values()){if(!g.klaar){c++;continue}l++;const y=g.bezetting,v=g.cap;t+=v.bewoners*y,e+=v.woningen,n+=v.banen.detailhandel*y,i+=v.banen.horeca*y,s+=v.banen.kantoor*y,o+=v.banen.industrie*y,a+=v.banen.overig*y}const h=n+i+s+o+a,u=t*$s.beroepsbevolking,d=Math.min(u,h),f=u>1?(u-d)/u:0;this.stat={inwoners:Math.round(t),woningen:e,beroeps:Math.round(u),werkenden:Math.round(d),werkloosheid:f,banen:Math.round(h),banenD:Math.round(n),banenH:Math.round(i),banenK:Math.round(s),banenI:Math.round(o),banenO:Math.round(a),gebouwenKlaar:l,inAanbouw:c};const p=t/12,x=u*.3,m=u*.15;this.vraag={wonen:Li(.55+(h-u)/Math.max(150,u+h)*1.2-f*1.5),detailhandel:Li(.1+(p-(n+i))/Math.max(10,p)),kantoor:Li(.05+(x-s)/Math.max(25,x)+f),industrie:Li(.15+(m-o)/Math.max(25,m)+f)}}naarJson(){return{versie:2,seed:this.seed,dagen:this.dagen,geld:this.geld,volgende:this.volgende,net:this.net.naarJson(),kavels:[...this.kavels.values()],gebouwen:[...this.gebouwen.values()]}}}function fm(r){return gs(r.poly)}function ib(r,t){return Fn(r,[...t,t[0]]).d}class sb{constructor(t){this.wereld=t}modus="weg";wegtype="straat";bocht=!1;zone="wonenLaag";penseel=22;melding="";start=null;ctrl=null;raak=null;ref=null;muis=null;schilderen=!1;schilderKlok=0;meldingKlok=0;zetModus(t){this.modus=t,this.annuleer(),this.melding=""}annuleer(){this.start=null,this.ctrl=null,this.raak=null,this.ref=null,this.schilderen=!1}begin(t){this.start=t,this.raak=null,this.ref=null;const e=this.wereld.net,n=e.knoopBij(t,.5);if(!n||!n.segs.length)return;const i=e.segmenten.get(n.segs[0]),s=e.wegVan(i,n.id);this.ref=s,n.segs.length===1&&(this.raak={x:-s.x,z:-s.z})}vloeiend(t){if(!this.start||!this.raak)return null;const e=ln(t,this.start),n=e.x*e.x+e.z*e.z,i=this.raak.x*e.x+this.raak.z*e.z;if(n<1||i<Math.sqrt(n)*.15)return null;const s=Math.min(n/(2*i),Math.sqrt(n)*1.2);return{x:this.start.x+this.raak.x*s,z:this.start.z+this.raak.z*s}}snap(t){const e=this.wereld.net,n=e.knoopBij(t,Math.max(8,Ge(this.wegtype)+2));if(n)return{...n.p};const i=e.segmentBij(t,2);if(i){const s=e.knopen.get(i.seg.a),o=e.knopen.get(i.seg.b);return Wr(s.p,i.seg.c,o.p,i.t)}return{x:Math.round(t.x),z:Math.round(t.z)}}eindpunt(t){const e=this.snap(t);if(!this.start||e.x!==Math.round(t.x)||e.z!==Math.round(t.z))return e;const n=ln(e,this.start),i=Math.round(Math.hypot(n.x,n.z)/2)*2;let s=Kn(n);if(!(this.bocht&&this.raak)){const o=this.ref??{x:1,z:0},a=Math.atan2(s.z,s.x),l=Math.atan2(o.z,o.x),c=Math.PI/12,h=a-l,u=Math.round(h/c)*c;Math.abs(h-u)<.045&&(s={x:Math.cos(l+u),z:Math.sin(l+u)})}return{x:this.start.x+s.x*i,z:this.start.z+s.z*i}}beweeg(t){this.muis=t}klik(t){if(!t)return;const e={x:t.x,z:t.z},n=this.wereld;switch(this.modus){case"weg":{if(!this.start){this.begin(this.snap(e));return}const i=this.bocht?this.vloeiend(this.eindpunt(e)):null;if(this.bocht&&!this.ctrl&&!i){this.ctrl={...e};return}const s=this.eindpunt(e),o=this.ctrl??i??fn(this.start,s,.5),a=n.legWeg(this.start,o,s,this.wegtype);if(a.ok){const l=Kn(ln(s,o));this.begin(s),this.bocht&&(this.raak=l),this.ref=l,this.ctrl=null,this.melding=""}else this.melding=a.fout??"";return}case"zone":this.schilderen=!0,this.schilder(e);return;case"opwaarderen":{const i=n.net.segmentBij(e,1);i&&!n.wijzigWeg(i.seg.id,this.wegtype)&&(this.melding="Opwaarderen lukt niet (geld?)");return}case"sloop":{const i=n.gebouwOp(e);if(i){n.verwijderGebouw(i.id);return}const s=n.net.segmentBij(e,1);s&&n.sloopWeg(s.seg.id);return}}}los(){this.schilderen=!1}terug(){return this.start||this.ctrl?(this.annuleer(),!0):!1}schilder(t){this.wereld.zoneer(t,this.penseel,this.zone)}stap(t){this.melding?(this.meldingKlok+=t,this.meldingKlok>2.5&&(this.melding="",this.meldingKlok=0)):this.meldingKlok=0,this.modus==="zone"&&this.schilderen&&this.muis&&(this.schilderKlok+=t,this.schilderKlok>.05&&(this.schilderKlok=0,this.schilder({x:this.muis.x,z:this.muis.z})))}voorbeeld(){const t=this.muis,e=this.wereld;if(!t)return{soort:"geen"};const n={x:t.x,z:t.z};switch(this.modus){case"weg":{const i=e.terrein;if(!this.start){const m=this.snap(n);return{soort:"weg",as:[],breedte:Ge(this.wegtype)*2,geldig:!0,tekst:Te[this.wegtype].naam,punten:[{x:m.x,y:i.hoogte(m.x,m.z),z:m.z}]}}const s=this.eindpunt(n),o=this.bocht&&!this.ctrl?this.vloeiend(s):null,a=this.bocht&&!this.ctrl&&!o,l=a?{...n}:s,c=this.ctrl??o??fn(this.start,l,.5),h=e.net.controleer(this.start,c,l,this.wegtype),u=Xn.curve(this.start,c,l,24).reduce((m,g,y,v)=>y?m+me(v[y-1],g):0,0),d=u*Te[this.wegtype].kosten,f=d<=e.geld,p=Xn.curve(this.start,c,l,32).map(m=>({x:m.x,y:Math.max(i.hoogte(m.x,m.z),.5),z:m.z})),x=h??(f?`${Math.round(u)} m · € ${Math.round(d).toLocaleString("nl-NL")}`:"Niet genoeg geld");return{soort:"weg",as:p,breedte:Ge(this.wegtype)*2,geldig:!h&&f&&!a,tekst:a?"Klik het bochtpunt":x,punten:[this.start,...this.ctrl?[this.ctrl]:[],l].map(m=>({x:m.x,y:i.hoogte(m.x,m.z),z:m.z}))}}case"zone":return{soort:"penseel",m:t,r:this.penseel,kleur:hm(this.zone)};case"opwaarderen":{const i=e.net.segmentBij(n,1);return i?{soort:"markeer",segment:i.seg.id,kleur:"#4dabf7",tekst:`${Te[i.seg.type].naam} → ${Te[this.wegtype].naam}`}:{soort:"geen"}}case"sloop":{const i=e.gebouwOp(n);if(i)return{soort:"markeer",gebouw:i.id,kleur:"#ff6b6b",tekst:"Gebouw slopen"};const s=e.net.segmentBij(n,1);return s?{soort:"markeer",segment:s.seg.id,kleur:"#ff6b6b",tekst:`${Te[s.seg.type].naam} slopen`}:{soort:"geen"}}default:return{soort:"geen"}}}}function rb(r,t=1800){r.geld=1e9;const e=(n,i,s,o)=>r.legWeg(n,o??fn(n,i,.5),i,s);e({x:-700,z:40},{x:-200,z:40},"laan"),e({x:-200,z:40},{x:180,z:40},"laan"),e({x:180,z:40},{x:560,z:60},"laan",{x:380,z:30}),e({x:-700,z:40},{x:-520,z:-380},"gow",{x:-720,z:-300}),e({x:-520,z:-380},{x:120,z:-400},"gow",{x:-200,z:-440});for(let n=-560;n<=120;n+=112)e({x:n,z:40},{x:n,z:-360},n%224===0?"straat":"woonstraat");for(let n=-60;n>=-300;n-=96)e({x:-580,z:n},{x:140,z:n},n===-156?"straatBus":"woonstraat");for(let n=-560;n<=120;n+=112)e({x:n,z:40},{x:n,z:360},"straat");for(let n=140;n<=340;n+=100)e({x:-580,z:n},{x:140,z:n},n===240?"tramstraat":"woonstraat");e({x:-620,z:140},{x:-620,z:340},"woonstraat",{x:-700,z:240});for(const n of[...r.kavels.values()]){const i=fm(n),s=r.net.segmenten.get(n.seg);let o;s.type!=="gow"&&(i.z<-250?o=i.x>-200?"industrie":"kantoor":s.type==="laan"?o=Math.abs(i.x+220)<260?"kantoor":"gemengd":s.type==="tramstraat"?o="gemengd":s.type==="straatBus"?o="wonenHoog":i.z>260?o=i.x<-330?"industrie":"wonenHoog":s.type==="straat"&&i.z>40?o=i.z<140?"gemengd":"wonenHoog":o="wonenLaag",r.zoneer(i,.1,o))}r.snelheid=4;for(let n=0;n<t;n+=1)r.stap(.25);r.snelheid=1,r.geld=25e5}const pm={haaks:[-300,-200],t:[-100,-200],y:[100,-200],vijf:[-300,0],schuin:[-100,0],bochtIn:[100,0],breedte:[-300,200],knik:[-100,200],s:[100,200]};function ob(r){r.geld=1e9;const t=(i,s,o,a)=>{const l=r.legWeg(i,a??fn(i,s,.5),s,o);l.ok||console.warn("test",l.fout,i,s)},e=pm,n=(i,s,o)=>({x:e[i][0]+s,z:e[i][1]+o});t(n("haaks",-60,0),n("haaks",60,0),"straat"),t(n("haaks",0,-60),n("haaks",0,60),"straat"),t(n("t",-70,0),n("t",70,0),"laan"),t(n("t",0,0),n("t",0,60),"straat"),t(n("y",0,60),n("y",0,0),"straat"),t(n("y",0,0),n("y",-30,-55),"straat"),t(n("y",0,0),n("y",30,-55),"woonstraat");for(let i=0;i<5;i++){const s=i/5*Math.PI*2+.3;t(n("vijf",0,0),n("vijf",Math.cos(s)*60,Math.sin(s)*60),i%2?"straat":"woonstraat")}t(n("schuin",-50,-50),n("schuin",50,50),"gow"),t(n("schuin",-60,0),n("schuin",60,0),"straat"),t(n("bochtIn",-60,0),n("bochtIn",60,0),"straat"),t(n("bochtIn",0,0),n("bochtIn",50,55),"woonstraat",n("bochtIn",0,45)),t(n("breedte",-70,0),n("breedte",0,0),"laan"),t(n("breedte",0,0),n("breedte",70,0),"straat"),t(n("knik",-60,20),n("knik",0,20),"straat"),t(n("knik",0,20),n("knik",30,-32),"straat"),t(n("s",-70,30),n("s",0,0),"straat",n("s",-35,-30)),t(n("s",0,0),n("s",70,-30),"straat",n("s",35,30));for(const i of[...r.kavels.values()])r.zoneer(fm(i),.1,"wonenLaag")}class co extends ue{constructor(){const t=co.SkyShader,e=new ge({name:t.name,uniforms:bn.clone(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:We,depthWrite:!1});super(new Oi(1,1,1),e),this.isSky=!0}}co.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new R},up:{value:new R(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};const Xr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class As{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ab=new xo(-1,1,1,-1,0,1);class lb extends Ft{constructor(){super(),this.setAttribute("position",new bt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new bt([0,2,0,0,2,0],2))}}const cb=new lb;class uc{constructor(t){this._mesh=new ue(cb,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,ab)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class hb extends As{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof ge?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=bn.clone(t.uniforms),this.material=new ge({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new uc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class pf extends As{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),s=t.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),s.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),s.buffers.stencil.setClear(a),s.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(i.EQUAL,1,4294967295),s.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),s.buffers.stencil.setLocked(!0)}}class ub extends As{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class db{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new Z);this._width=n.width,this._height=n.height,e=new ke(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:pn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new hb(Xr),this.copyPass.material.blending=Le,this.clock=new xu}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,s=this.passes.length;i<s;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}pf!==void 0&&(o instanceof pf?n=!0:o instanceof ub&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new Z);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class fb extends As{constructor(t,e,n=null,i=null,s=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new dt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(s=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}}const Sa={defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new Z},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new Ut},cameraProjectionMatrixInverse:{value:new Ut},cameraWorldMatrix:{value:new Ut},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new R(-1,-1,-1)},sceneBoxMax:{value:new R(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;		
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif
		
		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {  
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {   
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}
		
		void main() {
			float depth = getDepth(vUv.xy);
			if (depth >= 1.0) {
				discard;
				return;
			}
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif
			
			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {
				
				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w); 
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));
				
				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));
				
				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);	

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}		

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);		
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},wa={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},lh={uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function pb(r=5){const t=Math.floor(r)%2===0?Math.floor(r)+1:Math.floor(r),e=mb(t),n=e.length,i=new Uint8Array(n*4);for(let o=0;o<n;++o){const a=e[o],l=2*Math.PI*a/n,c=new R(Math.cos(l),Math.sin(l),0).normalize();i[o*4]=(c.x*.5+.5)*255,i[o*4+1]=(c.y*.5+.5)*255,i[o*4+2]=127,i[o*4+3]=255}const s=new gn(i,t,t);return s.wrapS=Jn,s.wrapT=Jn,s.needsUpdate=!0,s}function mb(r){const t=Math.floor(r)%2===0?Math.floor(r)+1:Math.floor(r),e=t*t,n=Array(e).fill(0);let i=Math.floor(t/2),s=t-1;for(let o=1;o<=e;){if(i===-1&&s===t?(s=t-2,i=0):(s===t&&(s=0),i<0&&(i=t-1)),n[i*t+s]!==0){s-=2,i++;continue}else n[i*t+s]=o++;s++,i--}return n}const Ta={defines:{SAMPLES:16,SAMPLE_VECTORS:mm(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new Z},cameraProjectionMatrixInverse:{value:new Ut},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;
		
		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}
		
		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1    
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1    
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);
			
			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;
		
			denoised += w * neighborColor;
			totalWeight += w;
		}
		
		void main() {
			float depth = getDepth(vUv.xy);	
			vec3 viewNormal = getViewNormal(vUv);	
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);
		
			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}
		
			if (totalWeight > 0.) { 
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function mm(r,t,e){const n=gb(r,t,e);let i="vec3[SAMPLES](";for(let s=0;s<r;s++){const o=n[s];i+=`vec3(${o.x}, ${o.y}, ${o.z})${s<r-1?",":")"}`}return i}function gb(r,t,e){const n=[];for(let i=0;i<r;i++){const s=2*Math.PI*t*i/r,o=Math.pow(i/(r-1),e);n.push(new R(Math.cos(s),Math.sin(s),o))}return n}class xb{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(t,e,n){return t[0]*e+t[1]*n}dot3(t,e,n,i){return t[0]*e+t[1]*n+t[2]*i}dot4(t,e,n,i,s){return t[0]*e+t[1]*n+t[2]*i+t[3]*s}noise(t,e){let n,i,s;const o=.5*(Math.sqrt(3)-1),a=(t+e)*o,l=Math.floor(t+a),c=Math.floor(e+a),h=(3-Math.sqrt(3))/6,u=(l+c)*h,d=l-u,f=c-u,p=t-d,x=e-f;let m,g;p>x?(m=1,g=0):(m=0,g=1);const y=p-m+h,v=x-g+h,_=p-1+2*h,E=x-1+2*h,b=l&255,w=c&255,C=this.perm[b+this.perm[w]]%12,S=this.perm[b+m+this.perm[w+g]]%12,M=this.perm[b+1+this.perm[w+1]]%12;let P=.5-p*p-x*x;P<0?n=0:(P*=P,n=P*P*this.dot(this.grad3[C],p,x));let N=.5-y*y-v*v;N<0?i=0:(N*=N,i=N*N*this.dot(this.grad3[S],y,v));let I=.5-_*_-E*E;return I<0?s=0:(I*=I,s=I*I*this.dot(this.grad3[M],_,E)),70*(n+i+s)}noise3d(t,e,n){let i,s,o,a;const c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),u=Math.floor(e+c),d=Math.floor(n+c),f=1/6,p=(h+u+d)*f,x=h-p,m=u-p,g=d-p,y=t-x,v=e-m,_=n-g;let E,b,w,C,S,M;y>=v?v>=_?(E=1,b=0,w=0,C=1,S=1,M=0):y>=_?(E=1,b=0,w=0,C=1,S=0,M=1):(E=0,b=0,w=1,C=1,S=0,M=1):v<_?(E=0,b=0,w=1,C=0,S=1,M=1):y<_?(E=0,b=1,w=0,C=0,S=1,M=1):(E=0,b=1,w=0,C=1,S=1,M=0);const P=y-E+f,N=v-b+f,I=_-w+f,D=y-C+2*f,O=v-S+2*f,U=_-M+2*f,Y=y-1+3*f,k=v-1+3*f,X=_-1+3*f,$=h&255,nt=u&255,ct=d&255,te=this.perm[$+this.perm[nt+this.perm[ct]]]%12,J=this.perm[$+E+this.perm[nt+b+this.perm[ct+w]]]%12,rt=this.perm[$+C+this.perm[nt+S+this.perm[ct+M]]]%12,St=this.perm[$+1+this.perm[nt+1+this.perm[ct+1]]]%12;let ot=.6-y*y-v*v-_*_;ot<0?i=0:(ot*=ot,i=ot*ot*this.dot3(this.grad3[te],y,v,_));let At=.6-P*P-N*N-I*I;At<0?s=0:(At*=At,s=At*At*this.dot3(this.grad3[J],P,N,I));let kt=.6-D*D-O*O-U*U;kt<0?o=0:(kt*=kt,o=kt*kt*this.dot3(this.grad3[rt],D,O,U));let Lt=.6-Y*Y-k*k-X*X;return Lt<0?a=0:(Lt*=Lt,a=Lt*Lt*this.dot3(this.grad3[St],Y,k,X)),32*(i+s+o+a)}noise4d(t,e,n,i){const s=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,u,d,f,p;const x=(t+e+n+i)*l,m=Math.floor(t+x),g=Math.floor(e+x),y=Math.floor(n+x),v=Math.floor(i+x),_=(m+g+y+v)*c,E=m-_,b=g-_,w=y-_,C=v-_,S=t-E,M=e-b,P=n-w,N=i-C,I=S>M?32:0,D=S>P?16:0,O=M>P?8:0,U=S>N?4:0,Y=M>N?2:0,k=P>N?1:0,X=I+D+O+U+Y+k,$=o[X][0]>=3?1:0,nt=o[X][1]>=3?1:0,ct=o[X][2]>=3?1:0,te=o[X][3]>=3?1:0,J=o[X][0]>=2?1:0,rt=o[X][1]>=2?1:0,St=o[X][2]>=2?1:0,ot=o[X][3]>=2?1:0,At=o[X][0]>=1?1:0,kt=o[X][1]>=1?1:0,Lt=o[X][2]>=1?1:0,Kt=o[X][3]>=1?1:0,Q=S-$+c,at=M-nt+c,L=P-ct+c,Ct=N-te+c,it=S-J+2*c,yt=M-rt+2*c,ht=P-St+2*c,Nt=N-ot+2*c,xt=S-At+3*c,z=M-kt+3*c,T=P-Lt+3*c,H=N-Kt+3*c,K=S-1+4*c,et=M-1+4*c,j=P-1+4*c,Et=N-1+4*c,ft=m&255,gt=g&255,Xt=y&255,st=v&255,wt=a[ft+a[gt+a[Xt+a[st]]]]%32,Ot=a[ft+$+a[gt+nt+a[Xt+ct+a[st+te]]]]%32,Bt=a[ft+J+a[gt+rt+a[Xt+St+a[st+ot]]]]%32,Tt=a[ft+At+a[gt+kt+a[Xt+Lt+a[st+Kt]]]]%32,jt=a[ft+1+a[gt+1+a[Xt+1+a[st+1]]]]%32;let Vt=.6-S*S-M*M-P*P-N*N;Vt<0?h=0:(Vt*=Vt,h=Vt*Vt*this.dot4(s[wt],S,M,P,N));let se=.6-Q*Q-at*at-L*L-Ct*Ct;se<0?u=0:(se*=se,u=se*se*this.dot4(s[Ot],Q,at,L,Ct));let F=.6-it*it-yt*yt-ht*ht-Nt*Nt;F<0?d=0:(F*=F,d=F*F*this.dot4(s[Bt],it,yt,ht,Nt));let pt=.6-xt*xt-z*z-T*T-H*H;pt<0?f=0:(pt*=pt,f=pt*pt*this.dot4(s[Tt],xt,z,T,H));let q=.6-K*K-et*et-j*j-Et*Et;return q<0?p=0:(q*=q,p=q*q*this.dot4(s[jt],K,et,j,Et)),27*(h+u+d+f+p)}}class Ln extends As{constructor(t,e,n,i,s,o,a){super(),this.width=n!==void 0?n:512,this.height=i!==void 0?i:512,this.clear=!0,this.camera=e,this.scene=t,this.output=0,this._renderGBuffer=!0,this._visibilityCache=new Map,this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=pb(),this.pdNoiseTexture=this.generateNoise(),this.gtaoRenderTarget=new ke(this.width,this.height,{type:pn}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new ge({defines:Object.assign({},Sa.defines),uniforms:bn.clone(Sa.uniforms),vertexShader:Sa.vertexShader,fragmentShader:Sa.fragmentShader,blending:Le,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new lu,this.normalMaterial.blending=Le,this.pdMaterial=new ge({defines:Object.assign({},Ta.defines),uniforms:bn.clone(Ta.uniforms),vertexShader:Ta.vertexShader,fragmentShader:Ta.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new ge({defines:Object.assign({},wa.defines),uniforms:bn.clone(wa.uniforms),vertexShader:wa.vertexShader,fragmentShader:wa.fragmentShader,blending:Le}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new ge({uniforms:bn.clone(Xr.uniforms),vertexShader:Xr.vertexShader,fragmentShader:Xr.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Na,blendDst:Zs,blendEquation:Mn,blendSrcAlpha:ka,blendDstAlpha:Zs,blendEquationAlpha:Mn}),this.blendMaterial=new ge({uniforms:bn.clone(lh.uniforms),vertexShader:lh.vertexShader,fragmentShader:lh.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Ah,blendSrc:Na,blendDst:Zs,blendEquation:Mn,blendSrcAlpha:ka,blendDstAlpha:Zs,blendEquationAlpha:Mn}),this.fsQuad=new uc(null),this.originalClearColor=new dt,this.setGBuffer(s?s.depthTexture:void 0,s?s.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,e){t!==void 0?(this.depthTexture=t,this.normalTexture=e,this._renderGBuffer=!1):(this.depthTexture=new Vl,this.depthTexture.format=ki,this.depthTexture.type=Ui,this.normalRenderTarget=new ke(this.width,this.height,{minFilter:Ce,magFilter:Ce,type:pn,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);const n=this.normalTexture?1:0,i=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=i,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=i,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(t){t?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(t.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(t.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(t){t.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=t.radius),t.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=t.distanceExponent),t.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=t.thickness),t.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=t.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),t.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=t.scale),t.samples!==void 0&&t.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=t.samples,this.gtaoMaterial.needsUpdate=!0),t.screenSpaceRadius!==void 0&&(t.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=t.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(t){let e=!1;t.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=t.lumaPhi),t.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=t.depthPhi),t.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=t.normalPhi),t.radius!==void 0&&t.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=t.radius),t.radiusExponent!==void 0&&t.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=t.radiusExponent,e=!0),t.rings!==void 0&&t.rings!==this.pdRings&&(this.pdRings=t.rings,e=!0),t.samples!==void 0&&t.samples!==this.pdSamples&&(this.pdSamples=t.samples,e=!0),e&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=mm(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,e,n){switch(this._renderGBuffer&&(this.overrideVisibility(),this.renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this.renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case Ln.OUTPUT.Off:break;case Ln.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Le,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case Ln.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=Le,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case Ln.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=Le,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case Ln.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:e);break;case Ln.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Le,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case Ln.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Le,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.renderPass(t,this.blendMaterial,this.renderToScreen?null:e);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}renderPass(t,e,n,i,s){t.getClearColor(this.originalClearColor);const o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,i!=null&&(t.setClearColor(i),t.setClearAlpha(s||0),t.clear()),this.fsQuad.material=e,this.fsQuad.render(t),t.autoClear=a,t.setClearColor(this.originalClearColor),t.setClearAlpha(o)}renderOverride(t,e,n,i,s){t.getClearColor(this.originalClearColor);const o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,i=e.clearColor||i,s=e.clearAlpha||s,i!=null&&(t.setClearColor(i),t.setClearAlpha(s||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=a,t.setClearColor(this.originalClearColor),t.setClearAlpha(o)}setSize(t,e){this.width=t,this.height=e,this.gtaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.pdRenderTarget.setSize(t,e),this.gtaoMaterial.uniforms.resolution.value.set(t,e),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(t,e),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){e.set(n,n.visible),(n.isPoints||n.isLine)&&(n.visible=!1)})}restoreVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){const i=e.get(n);n.visible=i}),e.clear()}generateNoise(t=64){const e=new xb,n=t*t*4,i=new Uint8Array(n);for(let o=0;o<t;o++)for(let a=0;a<t;a++){const l=o,c=a;i[(o*t+a)*4]=(e.noise(l,c)*.5+.5)*255,i[(o*t+a)*4+1]=(e.noise(l+t,c)*.5+.5)*255,i[(o*t+a)*4+2]=(e.noise(l,c+t)*.5+.5)*255,i[(o*t+a)*4+3]=(e.noise(l+t,c+t)*.5+.5)*255}const s=new gn(i,t,t,Ne,Tn);return s.wrapS=Jn,s.wrapT=Jn,s.needsUpdate=!0,s}}Ln.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};const vb={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class _b extends As{constructor(){super();const t=vb;this.uniforms=bn.clone(t.uniforms),this.material=new au({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new uc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Jt.getTransfer(this._outputColorSpace)===le&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ch?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Rh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ph?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Rl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ih?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===zh&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const yb={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new dt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class cr extends As{constructor(t,e,n,i){super(),this.strength=e!==void 0?e:1,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new Z(t.x,t.y):new Z(256,256),this.clearColor=new dt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new ke(s,o,{type:pn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new ke(s,o,{type:pn});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new ke(s,o,{type:pn});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),o=Math.round(o/2)}const a=yb;this.highPassUniforms=bn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ge({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Z(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Xr;this.copyUniforms=bn.clone(h.uniforms),this.blendMaterial=new ge({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:La,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new dt,this.oldClearAlpha=1,this.basic=new wn,this.fsQuad=new uc(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,i),this.renderTargetsVertical[s].setSize(n,i),this.separableBlurMaterials[s].uniforms.invSize.value=new Z(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,s){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),s&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=cr.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=cr.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=o}getSeperableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new ge({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new Z(.5,.5)},direction:{value:new Z(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new ge({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}cr.BlurDirectionX=new Z(1,0);cr.BlurDirectionY=new Z(0,1);class Mb{constructor(t,e){this.k=e,this.renderer=new vp({canvas:t,antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!1}),this.renderer.setPixelRatio(e.pixelRatio),this.renderer.setSize(innerWidth,innerHeight,!1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Eh,this.renderer.toneMapping=Rl,this.renderer.toneMappingExposure=.95,this.renderer.outputColorSpace=De,this.camera=new Ue(42,innerWidth/innerHeight,1,9e3),this.sky=new co,this.sky.scale.setScalar(2e4);const n=this.sky.material.uniforms;n.turbidity.value=3.2,n.rayleigh.value=1.3,n.mieCoefficient.value=.004,n.mieDirectionalG.value=.82,this.scene.add(this.sky);const i=ze.degToRad(38),s=ze.degToRad(215);this.zonRichting.setFromSphericalCoords(1,Math.PI/2-i,s),n.sunPosition.value.copy(this.zonRichting),this.zon=new mu(16773596,3.1),this.zon.castShadow=!0,this.zon.shadow.mapSize.set(e.schaduw,e.schaduw),this.zon.shadow.bias=-4e-4,this.zon.shadow.normalBias=.6,this.scene.add(this.zon,this.zon.target),this.hemi=new fu(13624319,5986876,.55),this.scene.add(this.hemi);const o=new vl(this.renderer),a=new _l,l=new co;l.scale.setScalar(1e3),Object.assign(l.material.uniforms.turbidity,{value:3.2}),l.material.uniforms.rayleigh.value=1.3,l.material.uniforms.mieCoefficient.value=.004,l.material.uniforms.mieDirectionalG.value=.82,l.material.uniforms.sunPosition.value.copy(this.zonRichting),a.add(l),this.scene.environment=o.fromScene(a,0,1,2e3).texture,this.scene.environmentIntensity=.55,this.scene.fog=new vo(12176348,1500,7e3);const c=new ke(innerWidth*e.pixelRatio,innerHeight*e.pixelRatio,{type:pn,samples:4});if(this.composer=new db(this.renderer,c),this.composer.addPass(new fb(this.scene,this.camera)),e.ao){this.ao=new Ln(this.scene,this.camera,innerWidth,innerHeight),this.ao.output=Ln.OUTPUT.Default,this.ao.blendIntensity=.6;const h=this.ao,u=h.overrideVisibility.bind(h);h.overrideVisibility=()=>{u(),this.scene.traverse(d=>{d.userData.geenAO&&(d.visible=!1)})},this.ao.updateGtaoMaterial({radius:2.5,distanceExponent:1.5,thickness:2,scale:1,samples:16}),this.ao.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:16}),this.composer.addPass(this.ao)}this.composer.addPass(new cr(new Z(innerWidth,innerHeight),.12,.4,.92)),this.composer.addPass(new _b),addEventListener("resize",()=>this.pasAan())}renderer;scene=new _l;camera;zon;hemi;sky;composer;ao;zonRichting=new R;pasAan(){this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(innerWidth,innerHeight,!1),this.composer.setSize(innerWidth,innerHeight)}volg(t,e){const n=ze.clamp(e*1.1,70,1100),i=this.zon.shadow.camera;i.left=-n,i.right=n,i.top=n,i.bottom=-n,i.near=1,i.far=n*4+600,i.updateProjectionMatrix();const s=2*n/this.k.schaduw,o=t.clone();o.x=Math.round(o.x/s)*s,o.z=Math.round(o.z/s)*s,this.zon.target.position.copy(o),this.zon.position.copy(o).addScaledVector(this.zonRichting,n*2+300),this.zon.shadow.normalBias=.02*n/10;const a=this.scene.fog;a.near=Math.max(600,e*3),a.far=Math.max(3500,e*9),this.ao&&this.ao.updateGtaoMaterial({radius:ze.clamp(e*.012,1.5,12)})}render(){this.composer.render()}}class bb{constructor(t,e,n){this.cam=t,this.t=n,addEventListener("keydown",i=>{i.target instanceof HTMLInputElement||this.toetsen.add(i.key.toLowerCase())}),addEventListener("keyup",i=>this.toetsen.delete(i.key.toLowerCase())),addEventListener("blur",()=>this.toetsen.clear()),e.addEventListener("pointerdown",i=>{(i.button===1||i.button===2)&&(this.sleep={knop:i.button,x:i.clientX,y:i.clientY},e.setPointerCapture(i.pointerId))}),e.addEventListener("pointerup",i=>{this.sleep&&i.button===this.sleep.knop&&(this.sleep=null)}),e.addEventListener("pointermove",i=>{if(!this.sleep)return;const s=i.clientX-this.sleep.x,o=i.clientY-this.sleep.y;if(this.sleep.x=i.clientX,this.sleep.y=i.clientY,this.sleep.knop===2)this.yaw-=s*.005,this.pitch=ze.clamp(this.pitch+o*.004,ze.degToRad(10),ze.degToRad(88));else{const a=this.afstand/900,l=new R(Math.sin(this.yaw),0,Math.cos(this.yaw)),c=new R(l.z,0,-l.x);this.doel.addScaledVector(c,s*a*1.6).addScaledVector(l,o*a*1.6)}}),e.addEventListener("contextmenu",i=>i.preventDefault()),e.addEventListener("wheel",i=>{i.preventDefault(),this.doelAfstand=ze.clamp(this.doelAfstand*Math.pow(1.0015,i.deltaY),this.minAfstand,this.maxAfstand)},{passive:!1})}doel=new R(0,0,0);yaw=ze.degToRad(30);pitch=ze.degToRad(48);afstand=520;doelAfstand=520;toetsen=new Set;sleep=null;minAfstand=10;maxAfstand=2200;zet(t,e,n,i,s){this.doel.set(t,this.t.hoogte(t,e),e),this.afstand=this.doelAfstand=n,i!==void 0&&(this.yaw=ze.degToRad(i)),s!==void 0&&(this.pitch=ze.degToRad(s)),this.pasToe()}stap(t){const e=this.toetsen,n=new R(Math.sin(this.yaw),0,Math.cos(this.yaw)),i=new R(n.z,0,-n.x),s=new R;(e.has("w")||e.has("arrowup"))&&s.sub(n),(e.has("s")||e.has("arrowdown"))&&s.add(n),(e.has("d")||e.has("arrowright"))&&s.sub(i),(e.has("a")||e.has("arrowleft"))&&s.add(i),s.lengthSq()>0&&this.doel.addScaledVector(s.normalize(),t*ze.clamp(this.afstand*1.1,25,1600)),e.has("q")&&(this.yaw+=t*1.4),e.has("e")&&(this.yaw-=t*1.4),e.has("r")&&(this.pitch=Math.min(ze.degToRad(88),this.pitch+t*.8)),e.has("f")&&(this.pitch=Math.max(ze.degToRad(10),this.pitch-t*.8));const o=this.t.grootte/2;this.doel.x=ze.clamp(this.doel.x,-o,o),this.doel.z=ze.clamp(this.doel.z,-o,o),this.doel.y+=(Math.max(0,this.t.hoogte(this.doel.x,this.doel.z))-this.doel.y)*Math.min(1,t*6),this.afstand+=(this.doelAfstand-this.afstand)*Math.min(1,t*10),this.pasToe()}pasToe(){const t=Math.cos(this.pitch),e=new R(this.doel.x+Math.sin(this.yaw)*t*this.afstand,this.doel.y+Math.sin(this.pitch)*this.afstand,this.doel.z+Math.cos(this.yaw)*t*this.afstand),n=Math.max(this.t.hoogte(e.x,e.z),0)+2;e.y<n&&(e.y=n),this.cam.position.copy(e),this.cam.lookAt(this.doel)}}class Sb{workers=[];wachtrij=[];bezig=new Map;klaar=new Map;wachtend=new Map;ids=new Map;volgende=1;anisotropie=8;open=0;constructor(t=Math.max(2,Math.min(6,(navigator.hardwareConcurrency||4)-1))){for(let e=0;e<t;e++){const n=new Worker(new URL(""+new URL("texworker-DOeRYlxY.js",import.meta.url).href,import.meta.url),{type:"module"});n.onmessage=i=>this.ontvang(n,i.data.id,i.data.t),this.workers.push(n)}}haal(t,e){const n=this.klaar.get(t);if(n){e(n);return}const i=this.wachtend.get(t);if(i){i.push(e);return}this.wachtend.set(t,[e]);const s=this.volgende++;this.ids.set(s,t),this.wachtrij.push({id:s,sleutel:t}),this.open++,this.pomp()}wacht(){return new Promise(t=>{const e=()=>this.open===0?t():setTimeout(e,50);e()})}pomp(){for(const t of this.workers){if(this.bezig.has(t)||!this.wachtrij.length)continue;const e=this.wachtrij.shift();this.bezig.set(t,e.id),t.postMessage(e)}}ontvang(t,e,n){this.bezig.delete(t);const i=this.ids.get(e);this.ids.delete(e);const s=(a,l)=>{const c=new gn(a,n.b,n.h,Ne,Tn);return c.wrapS=c.wrapT=Jn,c.magFilter=Ee,c.minFilter=kn,c.generateMipmaps=!0,c.anisotropy=this.anisotropie,c.colorSpace=l?De:qn,c.needsUpdate=!0,c},o={map:s(n.albedo,!0),normalMap:n.normaal&&s(n.normaal,!1),ormMap:n.orm&&s(n.orm,!1),alfa:n.alfa};this.klaar.set(i,o);for(const a of this.wachtend.get(i)??[])a(o);this.wachtend.delete(i),this.open--,this.pomp()}}const Gt=r=>({kleur:[1,1,1],ruwheid:1,metaal:0,meter:1,schaduw:!0,...r}),wb={asfalt:Gt({tex:"asfalt",meter:4,normaal:.6}),fietsasfalt:Gt({tex:"fietsasfalt",meter:4,normaal:.6}),busbaan:Gt({tex:"busbaan",meter:4,normaal:.6}),klinkers:Gt({tex:"klinkers",meter:2.1,normaal:1}),stoeptegels:Gt({tex:"stoeptegels",meter:1.8,normaal:.8}),erfverharding:Gt({tex:"erfverharding",meter:3,normaal:.8}),beton:Gt({tex:"beton",meter:2,normaal:.5}),band:Gt({tex:"band",meter:2,normaal:.4}),gras:Gt({tex:"gras",meter:6,normaal:.8}),tuin:Gt({tex:"tuin",meter:5,normaal:.8}),markering:Gt({kleur:[.92,.92,.88],ruwheid:.6,bovenop:!0,schaduw:!1}),rail:Gt({kleur:[.55,.55,.57],ruwheid:.3,metaal:1,bovenop:!0,schaduw:!1}),metaal:Gt({kleur:[.55,.57,.6],ruwheid:.45,metaal:.8}),paal:Gt({kleur:[.22,.23,.24],ruwheid:.5,metaal:.6}),lamp:Gt({kleur:[1,.95,.8],ruwheid:.3,emissie:[1,.85,.6],schaduw:!1}),trim:Gt({kleur:[.92,.92,.9],ruwheid:.55}),trimDonker:Gt({kleur:[.16,.16,.17],ruwheid:.5,metaal:.2}),glas:Gt({kleur:[.22,.3,.36],ruwheid:.08,metaal:.6}),raam:Gt({kleur:[.16,.22,.28],ruwheid:.06,metaal:.5}),lichtstraat:Gt({kleur:[.55,.62,.68],ruwheid:.15,metaal:.3}),dakpannen:Gt({tex:"dakpannen",meter:2,normaal:1}),dakpannenAntraciet:Gt({tex:"dakpannenAntraciet",meter:2,normaal:1}),dakgrind:Gt({tex:"dakgrind",meter:3,normaal:.8}),golfdak:Gt({tex:"golfdak",meter:4,normaal:1}),roldeur:Gt({tex:"roldeur",meter:4,normaal:.8}),plint:Gt({tex:"plint",meter:6,normaal:1}),haag:Gt({tex:"haag",meter:2,normaal:1}),hout:Gt({tex:"hout",meter:2,normaal:.7}),keet:Gt({tex:"keet",meter:3,normaal:.8}),kraan:Gt({kleur:[.93,.7,.08],ruwheid:.45,metaal:.3}),steiger:Gt({tex:"steiger",meter:2,alfa:"knip",dubbelzijdig:!0}),hekwerk:Gt({tex:"hekwerk",meter:0,alfa:"knip",dubbelzijdig:!0}),schors:Gt({tex:"schors",meter:1,normaal:1}),schorsBerk:Gt({tex:"schorsBerk",meter:1,normaal:.8})},mf=[[.12,.22,.16],[.55,.12,.1],[.12,.16,.3],[.15,.15,.16],[.85,.84,.78]];function gm(r){const t=wb[r];if(t)return t;const[e,n]=r.split(":");switch(e){case"gevel":return Gt({tex:r,meter:0,normaal:1});case"muur":return Gt({tex:r,meter:6,normaal:1});case"winkelpui":return Gt({tex:r,meter:0,normaal:.8});case"luifel":return Gt({tex:r,meter:.6,dubbelzijdig:!0});case"golfplaat":return Gt({tex:r,meter:4,normaal:1});case"deur":return Gt({kleur:mf[Number(n)%mf.length],ruwheid:.4});case"blad":return Gt({tex:r,meter:0,alfa:"knip",dubbelzijdig:!0,normaal:.6,instantieTint:!0});case"bladkern":return Gt({tex:r,meter:3,instantieTint:!0});default:return Gt({kleur:[1,0,1]})}}class Tb{constructor(t){this.bron=t}cache=new Map;haal(t){let e=this.cache.get(t);if(e)return e;const n=gm(t);if(e=new fr({color:new dt().setRGB(...n.kleur,De),roughness:n.ruwheid,metalness:n.metaal}),e.name=t,n.dubbelzijdig&&(e.side=yn),n.alfa==="knip"&&(e.alphaTest=.5,e.transparent=!1,e.alphaToCoverage=!0),n.alfa==="mengen"&&(e.transparent=!0,e.depthWrite=!1),n.emissie&&(e.emissive=new dt(...n.emissie),e.emissiveIntensity=2.5),t.startsWith("blad")&&(e.emissive=new dt(727558),e.emissiveIntensity=1,e.envMapIntensity=.6),n.bovenop&&(e.polygonOffset=!0,e.polygonOffsetFactor=-2,e.polygonOffsetUnits=-4),n.tex){n.alfa==="knip"&&(e.visible=!1),e.color.multiplyScalar(.55);const i=e;this.bron.haal(n.tex,s=>{const o=n.meter>0?1/n.meter:1,a=l=>{if(o===1)return l;const c=l.clone();return c.repeat.set(o,o),c.needsUpdate=!0,c};i.map=a(s.map),s.normalMap&&n.normaal&&(i.normalMap=a(s.normalMap),i.normalScale.set(n.normaal,n.normaal)),s.ormMap&&(i.roughnessMap=a(s.ormMap),i.metalnessMap=i.roughnessMap,i.roughness=1,i.metalness=1),i.color.setRGB(...n.kleur,De),i.visible=!0,i.needsUpdate=!0})}return this.cache.set(t,e),e}}const tr=64,gf=new WeakMap;function Eb(r){let t=gf.get(r);if(!t){t=new Float32Array(r.n*r.n);for(let e=0;e<r.n;e++)for(let n=0;n<r.n;n++)t[e*r.n+n]=cm(r.wereldX(n),r.wereldX(e),r);gf.set(r,t)}return t}function Ab(r,t,e){const n=t*tr,i=e*tr,s=Math.min(tr,r.n-1-n),o=Math.min(tr,r.n-1-i),a=Eb(r),l=(s+1)*(o+1),c=new Float32Array(l*3),h=new Float32Array(l*3),u=new Float32Array(l*4);let d=0;for(let x=0;x<=o;x++)for(let m=0;m<=s;m++,d++){const g=n+m,y=i+x,v=r.wereldX(g),_=r.wereldX(y),E=r.h[y*r.n+g];c[d*3]=v,c[d*3+1]=E,c[d*3+2]=_;const b=r.h[r.idx(g+1,y)]-r.h[r.idx(g-1,y)],w=r.h[r.idx(g,y+1)]-r.h[r.idx(g,y-1)],C=Math.hypot(b,2*r.stap,w);h[d*3]=-b/C,h[d*3+1]=2*r.stap/C,h[d*3+2]=-w/C;const S=r.bodem(v,_,a[y*r.n+g]);u.set(S,d*4)}const f=new Uint32Array(s*o*6);let p=0;for(let x=0;x<o;x++)for(let m=0;m<s;m++){const g=x*(s+1)+m,y=g+1,v=g+s+1,_=v+1;f[p++]=g,f[p++]=_,f[p++]=y,f[p++]=g,f[p++]=v,f[p++]=_}return{i0:n,j0:i,n:s,posities:c,normalen:h,bodem:u,indices:f}}const xf=r=>Math.ceil((r.n-1)/tr);class Cb{constructor(t,e){this.t=t,this.bron=e}groep=new Zn;vakken=new Map;materiaal;water;waterNormaal;async init(){const t=await Promise.all(["gras","weide","bosgrond","zand","water"].map(l=>new Promise(c=>this.bron.haal(l,c)))),[e,n,i,s,o]=t;this.materiaal=Rb(e,n,i,s);const a=xf(this.t);for(let l=0;l<a;l++)for(let c=0;c<a;c++)this.bouwVak(c,l);this.maakWater(o)}bouwVak(t,e){const n=e*1e3+t,i=this.vakken.get(n),s=Ab(this.t,t,e),o=new Ft;if(o.setAttribute("position",new Qt(s.posities,3)),o.setAttribute("normal",new Qt(s.normalen,3)),o.setAttribute("bodem",new Qt(s.bodem,4)),o.setIndex(new Qt(s.indices,1)),o.computeBoundingSphere(),i){i.geometry.dispose(),i.geometry=o;return}const a=new ue(o,this.materiaal);a.receiveShadow=!0,a.castShadow=!1,a.matrixAutoUpdate=!1,this.vakken.set(n,a),this.groep.add(a)}werkBij(){const t=this.t.haalVuil();if(!t.length)return;const e=xf(this.t),n=this.t.stap*tr,i=this.t.grootte/2,s=new Set;for(const o of t){const a=Math.max(0,Math.floor((o.x0+i-4)/n)),l=Math.min(e-1,Math.floor((o.x1+i+4)/n)),c=Math.max(0,Math.floor((o.z0+i-4)/n)),h=Math.min(e-1,Math.floor((o.z1+i+4)/n));for(let u=c;u<=h;u++)for(let d=a;d<=l;d++)s.add(u*1e3+d)}for(const o of s)this.bouwVak(o%1e3,Math.floor(o/1e3))}maakWater(t){this.waterNormaal=t.map.clone();const e=(t.normalMap??t.map).clone();e.repeat.set(1/24,1/24),e.needsUpdate=!0,this.waterNormaal=e;const n=new bs(this.t.grootte*3,this.t.grootte*3,1,1);n.rotateX(-Math.PI/2);const i=n.getAttribute("uv");for(let o=0;o<i.count;o++)i.setXY(o,i.getX(o)*this.t.grootte*3,i.getY(o)*this.t.grootte*3);const s=new fr({color:new dt(1917520),roughness:.06,metalness:0,transparent:!0,opacity:.82,normalMap:e,normalScale:new Z(.35,.35),envMapIntensity:1.2});this.water=new ue(n,s),this.water.position.y=hi,this.water.receiveShadow=!0,this.water.renderOrder=1,this.water.userData.geenAO=!0,this.groep.add(this.water)}tik(t){this.waterNormaal&&this.waterNormaal.offset.set(t*.004,t*.0025)}}function Rb(r,t,e,n){const i=new fr({roughness:.95,metalness:0,color:16777215}),s={tGras:{value:r.map},tWeide:{value:t.map},tBos:{value:e.map},tZand:{value:n.map},nGras:{value:r.normalMap},nBos:{value:e.normalMap}};return i.onBeforeCompile=o=>{Object.assign(o.uniforms,s),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 bodem;
varying vec4 vBodem;
varying vec3 vWereld;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
vBodem = bodem;
vWereld = (modelMatrix * vec4(transformed, 1.0)).xyz;`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
uniform sampler2D tGras, tWeide, tBos, tZand, nGras, nBos;
varying vec4 vBodem;
varying vec3 vWereld;
// Twee schalen mengen tegen zichtbare herhaling.
vec3 laag(sampler2D t, vec2 p, float m) {
  vec3 a = texture2D(t, p / m).rgb;
  vec3 b = texture2D(t, vec2(p.y, -p.x) / (m * 3.7) + 0.31).rgb;
  return mix(a, b, 0.35);
}`).replace("#include <map_fragment>",`
  vec2 p = vWereld.xz;
  vec4 w = vBodem / max(0.001, vBodem.x + vBodem.y + vBodem.z + vBodem.w);
  vec3 kleur = laag(tGras, p, 6.0) * w.x + laag(tWeide, p, 9.0) * w.y + laag(tBos, p, 5.0) * w.z + laag(tZand, p, 7.0) * w.w;
  // Grote vlekken kleurvariatie.
  float vlek = texture2D(tWeide, p / 340.0).g;
  kleur *= mix(0.88, 1.1, vlek);
  // Natte zandrand vlak bij het water.
  kleur *= mix(0.62, 1.0, smoothstep(-0.3, 0.6, vWereld.y));
  diffuseColor.rgb *= kleur;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
  {
    vec3 nd = (texture2D(nGras, p / 6.0).xyz * 2.0 - 1.0) * (w.x + w.y) + (texture2D(nBos, p / 5.0).xyz * 2.0 - 1.0) * w.z + vec3(0.0, 0.0, 1.0) * w.w;
    // Reliëf langs de wereldassen (het terrein is vrijwel horizontaal).
    vec3 bump = vec3(nd.x, 0.0, -nd.y) * 0.5;
    normal = normalize(normal + (viewMatrix * vec4(bump, 0.0)).xyz);
  }`)},i}class Pb{p=[];n=[];uv=[];i=[]}class wo{b=new Map;buf(t){let e=this.b.get(t);return e||this.b.set(t,e=new Pb),e}ruw(t,e,n,i,s){const o=this.buf(t),a=o.p.length/3;for(let l=0;l<e.length;l++)o.p.push(e[l].x,e[l].y,e[l].z),o.n.push(n[l].x,n[l].y,n[l].z),o.uv.push(i[l][0],i[l][1]);for(const l of s)o.i.push(a+l)}driehoek(t,e,n,i,s,o,a,l){let c=di(ns(Ze(n,e),Ze(i,e)));l&&nh(c,l)<0&&([n,i]=[i,n],[o,a]=[a,o],c={x:-c.x,y:-c.y,z:-c.z}),this.ruw(t,[e,n,i],[c,c,c],[s,o,a],[0,1,2])}quad(t,e,n,i,s,o,a,l,c,h){let u=di(ns(Ze(n,e),Ze(i,e)));u.x===0&&u.y===1&&u.z===0&&Math.abs(ns(Ze(n,e),Ze(i,e)).y)<1e-12&&(u=di(ns(Ze(i,e),Ze(s,e)))),h&&nh(u,h)<0&&([n,s]=[s,n],[a,c]=[c,a],u={x:-u.x,y:-u.y,z:-u.z}),this.ruw(t,[e,n,i,s],[u,u,u,u],[o,a,l,c],[0,1,2,0,2,3])}muur(t,e,n,i,s,o,a=0,l=i,c=s){const h=Math.hypot(n.x-e.x,n.z-e.z);this.quad(t,{x:e.x,y:i,z:e.z},{x:n.x,y:i,z:n.z},{x:n.x,y:s,z:n.z},{x:e.x,y:s,z:e.z},[a,l],[a+h,l],[a+h,c],[a,c],o)}blok(t,e,n,i,s,o,a,l,c,h=!1){const u=o/2,d=a/2,f=(g,y,v)=>({x:n.x+i.x*g+s.x*y,y:v,z:n.z+i.z*g+s.z*y}),p=[[-u,-d],[u,-d],[u,d],[-u,d]];let x=0;for(let g=0;g<4;g++){const[y,v]=p[g],[_,E]=p[(g+1)%4],b=f(y,v,0),w=f(_,E,0),C={x:(b.x+w.x)/2-n.x,y:0,z:(b.z+w.z)/2-n.z};this.muur(t,b,w,l,c,C,x),x+=Math.hypot(w.x-b.x,w.z-b.z)}const m=p.map(([g,y])=>f(g,y,c));if(this.quad(e,m[0],m[1],m[2],m[3],[-u,-d],[u,-d],[u,d],[-u,d],{x:0,y:1,z:0}),h){const g=p.map(([y,v])=>f(y,v,l));this.quad(e,g[0],g[1],g[2],g[3],[0,0],[1,0],[1,1],[0,1],{x:0,y:-1,z:0})}}strook(t,e,n,i,s,o,a=!0){const l=this.buf(t),c=l.p.length/3,h=e.length;for(let u=0;u<h;u++){const d=Math.min(h-1,u+1),f=Math.max(0,u-1),p=Ze(e[d],e[f]),x=Ze(n[u],e[u]);let m=di(ns(x,p));m.y<0===a&&(m={x:-m.x,y:-m.y,z:-m.z}),l.p.push(e[u].x,e[u].y,e[u].z,n[u].x,n[u].y,n[u].z),l.n.push(m.x,m.y,m.z,m.x,m.y,m.z),l.uv.push(s,i[u],o,i[u])}for(let u=0;u<h-1;u++){const d=c+u*2,f=d+1,p=d+2,x=d+3,m=e[u],g=n[u],y=e[u+1];ns(Ze(g,m),Ze(y,m)).y>=0===a?l.i.push(d,f,p,f,x,p):l.i.push(d,p,f,f,p,x)}}band(t,e,n,i,s){const o=this.buf(t),a=o.p.length/3,l=e.length;for(let c=0;c<l;c++){const h=di(s[c]);o.p.push(e[c].x,e[c].y,e[c].z,n[c].x,n[c].y,n[c].z),o.n.push(h.x,h.y,h.z,h.x,h.y,h.z),o.uv.push(i[c],e[c].y,i[c],n[c].y)}for(let c=0;c<l-1;c++){const h=a+c*2,u=h+1,d=h+2,f=h+3,p=ns(Ze(e[c+1],e[c]),Ze(n[c],e[c]));nh(p,s[c])>=0?o.i.push(h,d,u,u,d,f):o.i.push(h,u,d,u,f,d)}}leeg(){return this.b.size===0}bouw(){const t=[];for(const[e,n]of this.b)n.i.length&&t.push({materiaal:e,posities:new Float32Array(n.p),normalen:new Float32Array(n.n),uvs:new Float32Array(n.uv),indices:new Uint32Array(n.i)});return{groepen:t}}}const xm=.15,vm=.12,qr=1.4,Ib={asfalt:"asfalt",klinkers:"klinkers",tegels:"stoeptegels",rood:"fietsasfalt"};function zb(r,t){switch(r.soort){case"stoep":return"stoeptegels";case"fiets":return t==="klinkers"?"klinkers":"fietsasfalt";case"bus":return"busbaan";case"berm":case"middenberm":return"gras";default:return Ib[t]}}const ci=r=>r.soort==="stoep"?xm:r.soort==="berm"||r.soort==="middenberm"?vm:0;function Ii(r,t){const e=r.length;if(t<=0){const h=r[0];return{x:h.x+h.dx*t,y:h.y,z:h.z+h.dz*t,dx:h.dx,dz:h.dz,brug:h.brug}}if(t>=r[e-1].s){const h=r[e-1],u=t-h.s;return{x:h.x+h.dx*u,y:h.y,z:h.z+h.dz*u,dx:h.dx,dz:h.dz,brug:h.brug}}let n=0,i=0,s=e-1;for(;s-i>1;){const h=i+s>>1;r[h].s<=t?i=h:s=h}n=i;const o=r[n],a=r[n+1],l=(t-o.s)/Math.max(1e-6,a.s-o.s),c=Kn({x:he(o.dx,a.dx,l),z:he(o.dz,a.dz,l)});return{x:he(o.x,a.x,l),y:he(o.y,a.y,l),z:he(o.z,a.z,l),dx:c.x,dz:c.z,brug:l<.5?o.brug:a.brug}}function Sh(r,t,e,n=0){const i=he(t.sL,t.sR,(e+t.W/2)/t.W),s=Ii(r,i);return{x:s.x-s.dz*e,y:s.y+n,z:s.z+s.dx*e}}const ss=r=>(r.sL+r.sR)/2;function _m(r,t,e=2){const n=Es(Te[t.type].stroken),i=r.eindKnip(t,"a"),s=r.eindKnip(t,"b"),o=t.lengte,a=i.links,l=i.rechts,c=o-s.links,h=o-s.rechts;if(c-a<.3||h-l<.3)return[];let u=0;for(let x=1;x<t.pad.length;x++)u=Math.max(u,Math.abs(t.pad[x].dx*t.pad[x-1].dz-t.pad[x].dz*t.pad[x-1].dx)/Math.max(.1,t.pad[x].s-t.pad[x-1].s));const d=Math.max(.6,Math.min(e,u>0?.12/u:e)),f=Math.max(1,Math.ceil(Math.max(c-a,h-l)/d)),p=[];for(let x=0;x<=f;x++)p.push({sL:he(a,c,x/f),sR:he(l,h,x/f),W:n});return p}function Lb(r,t){const e=Te[t.type],n=_m(r,t),i=new wo,s=[];if(n.length<2)return{mesh:i.bouw(),props:s};const o=t.pad,a=cc(e.stroken),l=Es(e.stroken),c=(I,D,O=0)=>Sh(o,I,D,O),h=n.map(ss),u=e.dek,d=(I,D)=>{const O=Ii(o,ss(I));return{x:-O.dz*D,y:0,z:O.dx*D}};for(let I=0;I<a.length;I++){const{a:D,b:O,s:U}=a[I],Y=ci(U);i.strook(zb(U,u),n.map(k=>c(k,D,Y)),n.map(k=>c(k,O,Y)),h,D,O);for(const[k,X,$]of[[D,a[I-1],-1],[O,a[I+1],1]]){if(!X)continue;const nt=ci(X.s);Y<=nt||i.band("band",n.map(ct=>c(ct,k,nt)),n.map(ct=>c(ct,k,Y)),h,n.map(ct=>d(ct,$)))}}for(const[I,D]of[[-l/2,-1],[l/2,1]]){const O=ci(D<0?a[0].s:a[a.length-1].s);i.band("beton",n.map(U=>c(U,I,-(Ii(o,ss(U)).brug?1.3:qr))),n.map(U=>c(U,I,O)),h,n.map(U=>d(U,D)))}for(const I of["a","b"]){const D=I==="a"?t.a:t.b;if(r.graad(D)!==1)continue;const O=I==="a"?n[0]:n[n.length-1];a.flatMap(k=>[k.a,k.b]);const U=Ii(o,ss(O)),Y=I==="a"?{x:-U.dx,y:0,z:-U.dz}:{x:U.dx,y:0,z:U.dz};for(const k of a){const X=ci(k.s);i.band("beton",[c(O,k.a,-qr),c(O,k.b,-qr)],[c(O,k.a,X),c(O,k.b,X)],[k.a,k.b],[Y,Y])}}let f=0;const p=I=>Ii(o,ss(I)).brug;for(;f<n.length;){if(!p(n[f])){f++;continue}let I=f;for(;I<n.length&&p(n[I]);)I++;const D=n.slice(Math.max(0,f-1),Math.min(n.length,I+1)),O=D.map(ss);i.strook("beton",D.map(k=>c(k,-l/2,-1.3)),D.map(k=>c(k,l/2,-1.3)),O,0,l,!1);for(const[k,X]of[[-l/2,-1],[l/2,1]]){const $=ci(X<0?a[0].s:a[a.length-1].s),nt=k-X*.3;i.band("beton",D.map(ct=>c(ct,k,$)),D.map(ct=>c(ct,k,$+1)),O,D.map(ct=>d(ct,X))),i.band("beton",D.map(ct=>c(ct,nt,$)),D.map(ct=>c(ct,nt,$+1)),O,D.map(ct=>d(ct,-X))),i.strook("beton",D.map(ct=>c(ct,Math.min(k,nt),$+1)),D.map(ct=>c(ct,Math.max(k,nt),$+1)),O,0,.3),i.band("metaal",D.map(ct=>c(ct,k-X*.15,$+1)),D.map(ct=>c(ct,k-X*.15,$+1.25)),O,D.map(ct=>d(ct,X)))}const U=O[O.length-1]-O[0],Y=Math.max(1,Math.round(U/22));for(let k=1;k<Y+(Y===1?1:0);k++){const X=Ii(o,O[0]+U*k/Math.max(2,Y)),$=Math.min(r.terrein.hoogte(X.x,X.z),hi-4),nt={x:-X.dz,y:0,z:X.dx},ct={x:X.dx,y:0,z:X.dz};i.blok("beton","beton",{x:X.x,y:0,z:X.z},nt,ct,l*.7,1.6,$-1,X.y-1.3),i.blok("beton","beton",{x:X.x,y:0,z:X.z},nt,ct,l*.95,2.2,X.y-2,X.y-1.3,!0)}f=I}const x=(I,D)=>he(I.sL,I.sR,(D+l/2)/l),m=n[0],g=n[n.length-1],y=(I,D,O,U)=>{const Y=Math.max(1,Math.ceil((U-O)/2)),k=[],X=$=>{const nt=($-x(m,(I+D)/2))/Math.max(1e-6,x(g,(I+D)/2)-x(m,(I+D)/2));return{sL:he(m.sL,g.sL,nt),sR:he(m.sR,g.sR,nt),W:l}};for(let $=0;$<=Y;$++)k.push(X(he(O,U,$/Y)));i.strook("markering",k.map($=>c($,I,.012)),k.map($=>c($,D,.012)),k.map(ss),0,D-I)},v=(I,D,O,U,Y=.5)=>{const k=x(m,I)+Y,X=x(g,I)-Y;for(let $=k;$<X;$+=O+U){const nt=Math.min(X,$+O);nt-$>.2&&y(I-D/2,I+D/2,$,nt)}},_=e.snelheid>=70,E=I=>I.soort==="auto"||I.soort==="bus"||I.soort==="vluchtstrook";for(let I=0;I<a.length-1;I++){const D=a[I].s,O=a[I+1].s,U=a[I].b;E(D)&&E(O)&&(D.soort==="vluchtstrook"||O.soort==="vluchtstrook"?v(U,.2,1e9,0):D.richting!==O.richting?v(U,.12,3,3):v(U,_?.15:.1,_?9:3,_?3:9),(D.soort==="bus"||O.soort==="bus")&&v(U,.25,1e9,0)),(D.soort==="fiets"&&E(O)||E(D)&&O.soort==="fiets")&&v(U,.15,1,1),_&&(D.soort==="berm"||D.soort==="middenberm")&&E(O)&&v(U+.35,.15,1e9,0),_&&E(D)&&(O.soort==="berm"||O.soort==="middenberm")&&v(U-.35,.15,1e9,0)}for(const I of a)if(I.s.soort==="tram"){const D=(I.a+I.b)/2;for(const O of[D-.7175,D+.7175])i.strook("rail",n.map(U=>c(U,O-.04,.02)),n.map(U=>c(U,O+.04,.02)),h,0,.08)}const b=Tl(e.stroken);for(const I of["a","b"]){const D=I==="a"?t.a:t.b;if(r.graad(D)<3)continue;const O=I==="a"?m:g,U=I==="a"?1:-1,Y=1,k=3.5;if(b.stoep)for(let $=b.binnenL+.5;$+.5<=b.binnenR-.3;$+=1){const nt=x(O,$+.25)+U*Y,ct=nt+U*k;y($,$+.5,Math.min(nt,ct),Math.max(nt,ct))}const X=I==="a"?"B":"A";for(const $ of a){if(!($.s.soort==="auto"||$.s.soort==="bus"||$.s.soort==="gedeeld")||$.s.richting!==X||$.s.soort==="gedeeld")continue;const nt=x(O,($.a+$.b)/2)+U*(b.stoep?Y+k+.8:1.5);y($.a+.1,$.b-.1,Math.min(nt,nt+U*.4),Math.max(nt,nt+U*.4))}}const w=Math.max(m.sL,m.sR),C=Math.min(g.sL,g.sR),S=I=>{const D=Ii(o,I);return Math.atan2(-D.dz,D.dx)},M=(I,D,O)=>Sh(o,{sL:I,sR:I,W:l},D,O);if(e.bomen)for(const I of a){const D=I.s.soort==="berm"||I.s.soort==="middenberm",O=I.s.soort==="stoep"&&I.s.breedte>=2;if(!D&&!O||I.s.soort==="middenberm"&&e.snelheid>70)continue;const U=D?(I.a+I.b)/2:I.a<0?I.a+.9:I.b-.9,Y=D?11:14;for(let k=w+7+(I.a<0?0:Y/2);k<C-6;k+=Y){if(Ii(o,k).brug)continue;const X=M(k,U,ci(I.s));s.push({soort:(Math.floor(k/Y)+t.id)%3===0?"linde":"plataan",x:X.x,y:X.y,z:X.z,rot:k*1.7%6.28,schaal:.85+k*7%1*.25,variant:Math.floor(k)%2})}}const P=a.find(I=>I.s.soort==="middenberm");let N=t.id%2===0?1:-1;for(let I=w+10;I<C-6;I+=32){const D=S(I);if(P&&e.snelheid>=70){const k=M(I,(P.a+P.b)/2,vm);s.push({soort:"lantaarnDubbel",x:k.x,y:k.y,z:k.z,rot:D,schaal:1,variant:0});continue}if(l<5){if(I%64<32){const k=M(I,l/2+.4,0);s.push({soort:"lantaarn",x:k.x,y:r.terrein.hoogte(k.x,k.z),z:k.z,rot:D+Math.PI,schaal:.75,variant:0})}continue}const O=N<0?a[0]:a[a.length-1],U=N<0?O.s.soort==="stoep"?O.b-.45:-l/2+.4:O.s.soort==="stoep"?O.a+.45:l/2-.4,Y=M(I,U,ci(O.s));s.push({soort:"lantaarn",x:Y.x,y:Y.y,z:Y.z,rot:N<0?D:D+Math.PI,schaal:1,variant:0}),N=-N}return{mesh:i.bouw(),props:s}}function Db(r,t){const e=new wo,n=r.knopen.get(t);if(!n||!r.isKruispunt(t))return e.bouw();const i=[];for(const d of n.segs){const f=r.segmenten.get(d),p=_m(r,f);if(!p.length)continue;const x=Te[f.type],m=f.a===t?p[0]:p[p.length-1],g=Tl(x.stroken),y=cc(x.stroken),v=P=>Sh(f.pad,m,P),_=v(g.binnenL),E=v(g.binnenR),b=v(g.buitenL),w=v(g.buitenR),C=ci(y[0].s),S=ci(y[y.length-1].s),M=(()=>{const P=f.a===t?f.pad[0]:f.pad[f.pad.length-1];return f.a===t?{x:P.dx,z:P.dz}:{x:-P.dx,z:-P.dz}})();i.push(f.b===t?{weg:M,bL:E,bR:_,oL:w,oR:b,hL:S,hR:C,dek:x.dek}:{weg:M,bL:_,bR:E,oL:b,oR:w,hL:C,hR:S,dek:x.dek})}if(i.length<2)return e.bouw();i.sort((d,f)=>Math.atan2(d.weg.z,d.weg.x)-Math.atan2(f.weg.z,f.weg.x));const s=i.every(d=>d.dek==="klinkers")?"klinkers":"asfalt",o={x:n.p.x,y:n.y,z:n.p.z},a=(d,f,p,x,m=10)=>{const g=f.x*x.z-f.z*x.x;let y={x:(d.x+p.x)/2,z:(d.z+p.z)/2};if(Math.abs(g)>.05){const _=((p.x-d.x)*x.z-(p.z-d.z)*x.x)/g,E=((p.x-d.x)*f.z-(p.z-d.z)*f.x)/g;_<.5&&E<.5&&_>-60&&E>-60&&(y={x:d.x+f.x*_,z:d.z+f.z*_})}const v=[];for(let _=0;_<=m;_++){const E=Wr({x:d.x,z:d.z},y,{x:p.x,z:p.z},_/m);v.push({x:E.x,y:he(d.y,p.y,_/m),z:E.z})}return v},l=i.length===2,c=[];for(let d=0;d<i.length;d++){const f=i[d],p=i[(d+1)%i.length];c.push(f.bL,f.bR);const x=l?[f.bR,p.bL]:a(f.bR,f.weg,p.bL,p.weg);c.push(...x.slice(1,-1));const m=xm,g=l?[f.oR,p.oL]:a(f.oR,f.weg,p.oL,p.weg),y=x.map((_,E)=>E),v=_=>({x:o.x-_.x,y:0,z:o.z-_.z});if(me({x:f.bR.x,z:f.bR.z},{x:f.oR.x,z:f.oR.z})>.1&&g.length===x.length){const _="stoeptegels",E=x.map(w=>({...w,y:w.y+m})),b=g.map(w=>({...w,y:w.y+m}));e.strook(_,E,b,y,0,1),e.band("band",x,E,y,x.map(v)),e.band("beton",g.map(w=>({...w,y:w.y-qr})),b,y,g.map(w=>({x:-v(w).x,y:0,z:-v(w).z})))}else e.band("beton",g.map(_=>({..._,y:_.y-qr})),g,g.map((_,E)=>E),g.map(_=>({x:_.x-o.x,y:0,z:_.z-o.z})))}const h=c.filter((d,f)=>me({x:d.x,z:d.z},{x:c[(f+1)%c.length].x,z:c[(f+1)%c.length].z})>.02),u=hc(h.map(d=>({x:d.x,z:d.z})));for(let d=0;d<u.length;d+=3){const[f,p,x]=[h[u[d]],h[u[d+1]],h[u[d+2]]];e.driehoek(s,f,p,x,[f.x,f.z],[p.x,p.z],[x.x,x.z],{x:0,y:1,z:0})}return e.bouw()}const Ub=4,kb=4,Nb=4,ho={x:0,y:1,z:0},Fb={x:0,y:-1,z:0};function Nn(r,t=r.voet){const e=Un(t),n=[];for(let i=0;i<t.length;i++){const s=t[i],o=t[(i+1)%t.length],a=o.x-s.x,l=o.z-s.z,c=Math.hypot(a,l);if(c<.05)continue;const h={x:a/c,z:l/c},u=e>0?{x:h.z,z:-h.x}:{x:-h.z,z:h.x},d={x:(s.x+o.x)/2,z:(s.z+o.z)/2},f=Fn(d,r.voorLijn).d,p=Fn({x:d.x+u.x*2,z:d.z+u.z*2},r.voorLijn).d<f-1.5,x=Fn({x:d.x+u.x*2,z:d.z+u.z*2},r.voorLijn).d>f+1.5,m=p&&f<r.terug+1.2?"voor":x?"achter":"zij";n.push({a:s,b:o,n:u,t:h,L:c,soort:m})}return n}const ut=(r,t)=>({x:r.x,y:t,z:r.z}),Ae=r=>({x:r.x,y:0,z:r.z});function Je(r,t,e,n,i,s,o,a=3,l=0){const c={x:e.a.x+e.n.x*l,z:e.a.z+e.n.z*l},h={x:e.b.x+e.n.x*l,z:e.b.z+e.n.z*l};if(t.startsWith("gevel:")){const u=Math.max(1,Math.round(e.L/a));r.quad(t,ut(c,n),ut(h,n),ut(h,i),ut(c,i),[0,s*.5],[u/2,s*.5],[u/2,o*.5],[0,o*.5],Ae(e.n))}else r.quad(t,ut(c,n),ut(h,n),ut(h,i),ut(c,i),[0,n],[e.L,n],[e.L,i],[0,i],Ae(e.n))}function On(r,t,e,n,i=!0,s){const o=hc(e),a=typeof n=="number"?()=>n:n;for(let l=0;l<o.length;l+=3){const[c,h,u]=[e[o[l]],e[o[l+1]],e[o[l+2]]],d=s??(f=>[f.x,f.z]);r.driehoek(t,ut(c,a(c)),ut(h,a(h)),ut(u,a(u)),d(c),d(h),d(u),i?ho:Fb)}}function El(r,t){const e=Un(r),n=r.length;return r.map((i,s)=>{const o=r[(s+n-1)%n],a=r[(s+1)%n],l=xs({x:i.x-o.x,z:i.z-o.z}),c=xs({x:a.x-i.x,z:a.z-i.z}),h=e>0?{x:-l.z,z:l.x}:{x:l.z,z:-l.x},u=e>0?{x:-c.z,z:c.x}:{x:c.z,z:-c.x},d=xs({x:h.x+u.x,z:h.z+u.z}),f=Math.max(.35,d.x*h.x+d.z*h.z);return{x:i.x+d.x*t/f,z:i.z+d.z*t/f}})}const xs=r=>{const t=Math.hypot(r.x,r.z)||1;return{x:r.x/t,z:r.z/t}};function Se(r,t,e,n,i,s,o,a,l,c=!1){r.blok(t,e,{x:n.x,y:0,z:n.z},Ae(i),Ae({x:-i.z,z:i.x}),s,o,a,l,c)}function To(r,t,e,n,i,s){const o=El(t,i),a=t.length,l=Un(t);for(let c=0;c<a;c++){const h=t[c],u=t[(c+1)%a],d=o[c],f=o[(c+1)%a],p=xs({x:u.x-h.x,z:u.z-h.z}),x=l>0?{x:p.z,z:-p.x}:{x:-p.z,z:p.x},m=Math.hypot(u.x-h.x,u.z-h.z);r.quad(s,ut(h,e),ut(u,e),ut(u,e+n),ut(h,e+n),[0,0],[m,0],[m,n],[0,n],Ae(x)),r.quad(s,ut(d,e),ut(f,e),ut(f,e+n),ut(d,e+n),[0,0],[m,0],[m,n],[0,n],Ae({x:-x.x,z:-x.z})),r.quad(s,ut(h,e+n),ut(u,e+n),ut(f,e+n),ut(d,e+n),[0,0],[m,0],[m,i],[0,i],ho)}}function Ob(r,t,e,n,i=.05){const s=dm(t,hc(t),5);for(let o=0;o<s.tri.length;o+=3){const[a,l,c]=[s.p[s.tri[o]],s.p[s.tri[o+1]],s.p[s.tri[o+2]]];r.driehoek(e,{x:a.x,y:n(a.x,a.z)+i,z:a.z},{x:l.x,y:n(l.x,l.z)+i,z:l.z},{x:c.x,y:n(c.x,c.z)+i,z:c.z},[a.x,a.z],[l.x,l.z],[c.x,c.z],ho)}}function Bb(r,t){switch(r.vorm){case"rijwoningen":return t.kies(["baksteenRood","baksteenRood","baksteenBruin","baksteenGeel"]);case"appartementen":return t.kies(["baksteenBruin","baksteenRood","stuc","modernDonker","baksteenGeel"]);case"winkelsMetWonen":return t.kies(["baksteenRood","baksteenBruin","stuc","baksteenGeel"]);case"kantoortoren":return t.kies(["vliesgevel","vliesgevel","betonband","modernDonker"]);default:return"modernDonker"}}function Vb(r,t){const e=new wo,n=[],i=new lr(r.seed),s=Bb(r,i),o=r.y,a=r.zone==="industrie"?"erfverharding":r.zone==="kantoor"||r.zone==="gemengd"?"stoeptegels":"tuin";if(Ob(e,r.perceel,a,t),!r.klaar)return $b(e,r,t),{mesh:e.bouw(),props:n};const l=s.startsWith("baksteen")?"plint":"beton";for(const c of Nn(r))Je(e,l,c,r.yGrond-.6,o,0,0,3,.04);switch(r.vorm){case"rijwoningen":Hb(e,r,i,s,t,n);break;case"appartementen":Wb(e,r,i,s,n);break;case"winkelsMetWonen":Xb(e,r,i,s);break;case"kantoortoren":qb(e,r,i,s);break;case"bedrijfshal":Yb(e,r,i);break}return{mesh:e.bouw(),props:n}}function Hb(r,t,e,n,i,s){const o=t.y,a=o+pr(t.lagen),l=t.lagen.length,c=`gevel:${n}`,h=`muur:${n}`,u=t.breedte/t.eenheden,d=e.next()<.1||!t.dak,f=e.next()<.3?"dakpannenAntraciet":"dakpannen";for(const p of Nn(t))Je(r,p.soort==="zij"?h:c,p,o,a,0,l,u/2);if(d)On(r,"dakgrind",t.voet,a),To(r,t.voet,a-.05,.45,.25,"trim");else{const p=Math.tan(42*Math.PI/180),x=t.terug+t.diepte/2,m=(v,_)=>{const E=Fn(v,t.voorLijn).d,b=_==="voor"?E-t.terug:t.terug+t.diepte-E;return a+Math.min(t.diepte/2,Math.max(0,b))*p},g=v=>_=>{const E=Fn(_,t.voorLijn,t.voorLijn.map((w,C)=>C*2)),b=v==="voor"?E.d-t.terug:t.terug+t.diepte-E.d;return[E.s,b/Math.cos(42*Math.PI/180)]};for(const v of["voor","achter"]){const _=t.dak[v];if(_.length<3)continue;On(r,f,_,b=>m(b,v),!0,g(v));const E=Un(_);for(let b=0;b<_.length;b++){const w=_[b],C=_[(b+1)%_.length],S=m(w,v),M=m(C,v);if(Math.abs(S-M)<.3&&Math.abs(S-a)<.05||Math.abs(S-M)<.3&&S>a+.5)continue;const P=xs({x:C.x-w.x,z:C.z-w.z}),N=E>0?{x:P.z,z:-P.x}:{x:-P.z,z:P.x},I=Math.hypot(C.x-w.x,C.z-w.z);r.quad(h,ut(w,a),ut(C,a),ut(C,M),ut(w,S),[0,0],[I,0],[I,M-a],[0,S-a],Ae(N))}}const y=t.dak.voor.filter(v=>Math.abs(Fn(v,t.voorLijn).d-x)<.3);for(let v=0;v<y.length-1;v++){const _=y[v],E=y[v+1],b=Math.hypot(E.x-_.x,E.z-_.z);if(b<.2||b>t.breedte+2)continue;const w=a+t.diepte/2*p;Se(r,"dakpannenAntraciet","dakpannenAntraciet",{x:(_.x+E.x)/2,z:(_.z+E.z)/2},xs({x:E.x-_.x,z:E.z-_.z}),b,.32,w-.12,w+.12)}for(const v of Nn(t)){if(v.soort==="zij")continue;Je(r,"trim",v,a-.28,a+.02,0,0,3,.18);const _={x:(v.a.x+v.b.x)/2+v.n.x*.32,z:(v.a.z+v.b.z)/2+v.n.z*.32};Se(r,"metaal","metaal",_,v.t,v.L,.18,a-.32,a-.16)}for(const v of t.ankers){if(e.next()>.45)continue;const _=Math.min(2.6,u-1.4);if(_<1.2)continue;const E={x:v.p.x+v.n.x*1.7,z:v.p.z+v.n.z*1.7},b=a+1.7*p,w=b+1.45,C=(w-a)/p-1.7,S={x:-v.n.x,z:-v.n.z},M=E,P={x:E.x+v.n.x*C,z:E.z+v.n.z*C},N=(D,O)=>({x:D.x+v.t.x*O,z:D.z+v.t.z*O});r.quad("trim",ut(N(M,-_/2),b),ut(N(M,_/2),b),ut(N(M,_/2),w),ut(N(M,-_/2),w),[0,0],[1,0],[1,1],[0,1],Ae(S));const I={x:M.x-v.n.x*.02,z:M.z-v.n.z*.02};r.quad("raam",ut(N(I,-_/2+.2),b+.25),ut(N(I,_/2-.2),b+.25),ut(N(I,_/2-.2),w-.2),ut(N(I,-_/2+.2),w-.2),[0,0],[1,0],[1,1],[0,1],Ae(S));for(const D of[-1,1])r.driehoek("trim",ut(N(M,D*_/2),b),ut(N(M,D*_/2),w),ut(N(P,D*_/2),w),[0,0],[0,1],[1,1],Ae({x:v.t.x*D,z:v.t.z*D}));r.quad("dakgrind",ut(N(I,-_/2-.1),w),ut(N(I,_/2+.1),w),ut(N(P,_/2+.1),w),ut(N(P,-_/2-.1),w),[0,0],[1,0],[1,1],[0,1],ho)}for(let v=0;v<t.ankers.length;v+=2){if(e.next()>.5)continue;const _=t.ankers[v],E={x:_.p.x+_.n.x*(t.diepte*.62)+_.t.x*u*.3,z:_.p.z+_.n.z*(t.diepte*.62)+_.t.z*u*.3},b=a+t.diepte/2*p;Se(r,h,"trimDonker",E,_.t,.6,.6,b-1.4,b+.7)}}t.ankers.forEach((p,x)=>Gb(r,p,o,(t.seed+x*7)%5));for(const p of t.ankers){const x={x:-p.n.x,z:-p.n.z},m=(v,_)=>({x:p.p.x+x.x*v+p.t.x*_,z:p.p.z+x.z*v+p.t.z*_}),g=[m(.9,-.55),m(.9,.55),m(t.terug,.55),m(t.terug,-.55)].map(v=>({x:v.x,y:i(v.x,v.z)+.08,z:v.z}));t.terug>1&&r.quad("stoeptegels",g[0],g[1],g[2],g[3],[g[0].x,g[0].z],[g[1].x,g[1].z],[g[2].x,g[2].z],[g[3].x,g[3].z],ho);const y=p.d-t.terug-t.diepte;if(y>4&&e.next()<.75){const v={x:p.p.x+p.n.x*(t.diepte+y-1.6),z:p.p.z+p.n.z*(t.diepte+y-1.6)},_=i(v.x,v.z);Se(r,"hout","dakgrind",v,p.t,Math.min(2.4,u-1),2.2,_,_+2.3)}if(y>6&&e.next()<.4){const v={x:p.p.x+p.n.x*(t.diepte+y*.45)+p.t.x*u*.25,z:p.p.z+p.n.z*(t.diepte+y*.45)+p.t.z*u*.25};s.push({soort:e.kies(["berk","eik","linde"]),x:v.x,y:i(v.x,v.z),z:v.z,rot:e.range(0,6.28),schaal:e.range(.45,.7),variant:e.int(0,1)})}}for(const p of t.grenzen){const x=g=>({x:p.p.x+p.n.x*g,z:p.p.z+p.n.z*g}),m=(g,y,v,_,E)=>{if(v-y<.8)return;const b=x((y+v)/2),w=i(b.x,b.z);Se(r,g,g,b,p.n,v-y,E,w-.1,w+_)};m("haag",.4,t.terug-.2,.9,.5),m("hout",t.terug+t.diepte+.2,Math.min(p.d-.4,t.terug+t.diepte+16),1.8,.06)}}function Gb(r,t,e,n){const i={x:-t.n.x,z:-t.n.z},s=(a,l)=>({x:t.p.x+t.t.x*a+i.x*l,z:t.p.z+t.t.z*a+i.z*l}),o=(a,l,c,h,u,d)=>r.quad(a,ut(s(l,d),e+h),ut(s(c,d),e+h),ut(s(c,d),e+u),ut(s(l,d),e+u),[0,0],[1,0],[1,1],[0,1],Ae(i));o("trim",-.62,.62,0,2.55,.05),o(`deur:${n}`,-.5,.5,0,2.3,.07),o("raam",-.5,.5,2.36,2.5,.07),Se(r,"beton","beton",s(0,.45),t.t,1.4,.8,e-.3,e+.02)}function Wb(r,t,e,n,i){const s=t.y,o=s+pr(t.lagen),a=t.lagen.length,l=Nn(t);for(const p of l)Je(r,p.soort==="zij"?`muur:${n}`:`gevel:${n}`,p,s,o,0,a);On(r,"dakgrind",t.voet,o),To(r,t.voet,o-.1,.8,.35,n==="modernDonker"?"trimDonker":"trim");const c=gs(t.voet),h=l.filter(p=>p.soort==="voor"),u=h.reduce((p,x)=>x.L>(p?.L??0)?x:p,h[0]),d=u?.t??{x:1,z:0};ir(c,t.voet)&&(Se(r,`muur:${n}`,"dakgrind",c,d,3.2,4.5,o,o+3),Se(r,"metaal","metaal",{x:c.x+d.x*4,z:c.z+d.z*4},d,2.2,1.6,o,o+1.3));const f=e.next()<.5?"glas":"metaal";for(const p of h){const x=Math.floor(p.L/6);if(x<1)continue;let m=s+t.lagen[0].hoogte;for(let g=1;g<a;g++){for(let y=0;y<x;y++){const v=(y+.5)*p.L/x,_=Math.min(4.2,p.L/x-1.2),E={x:p.a.x+p.t.x*v+p.n.x*.75,z:p.a.z+p.t.z*v+p.n.z*.75};Se(r,"beton","beton",E,p.t,_,1.5,m-.2,m);const b=(w,C)=>({x:p.a.x+p.t.x*(v+w)+p.n.x*C,z:p.a.z+p.t.z*(v+w)+p.n.z*C});r.quad(f,ut(b(-_/2,1.5),m),ut(b(_/2,1.5),m),ut(b(_/2,1.5),m+1.05),ut(b(-_/2,1.5),m+1.05),[0,0],[1,0],[1,1],[0,1],Ae(p.n));for(const w of[-1,1])r.quad(f,ut(b(w*_/2,0),m),ut(b(w*_/2,1.5),m),ut(b(w*_/2,1.5),m+1.05),ut(b(w*_/2,0),m+1.05),[0,0],[1,0],[1,1],[0,1],Ae({x:p.t.x*w,z:p.t.z*w}))}m+=t.lagen[g].hoogte}}if(u){const p={x:(u.a.x+u.b.x)/2,z:(u.a.z+u.b.z)/2},x=(m,g)=>({x:p.x+u.t.x*m+u.n.x*g,z:p.z+u.t.z*m+u.n.z*g});if(r.quad("glas",ut(x(-1.4,.04),s),ut(x(1.4,.04),s),ut(x(1.4,.04),s+2.7),ut(x(-1.4,.04),s+2.7),[0,0],[1,0],[1,1],[0,1],Ae(u.n)),Se(r,"trimDonker","trimDonker",x(0,1),u.t,4,2,s+2.85,s+3.05),t.terug>3){const m=x(Math.min(u.L/2-1.5,5),t.terug*.6);i.push({soort:"linde",x:m.x,y:s-.1,z:m.z,rot:e.range(0,6),schaal:.7,variant:e.int(0,1)})}}}function Xb(r,t,e,n){const i=t.y,s=i+pr(t.lagen),o=t.lagen.length,a=t.lagen[0].hoogte;for(const l of Nn(t)){if(l.soort!=="voor"){Je(r,l.soort==="zij"?`muur:${n}`:`gevel:${n}`,l,i,s,0,o);continue}const c=Math.max(1,Math.round(l.L/6)),h=l.L/c;for(let u=0;u<c;u++){const d={x:l.a.x+l.t.x*u*h,z:l.a.z+l.t.z*u*h},f={x:l.a.x+l.t.x*(u+1)*h,z:l.a.z+l.t.z*(u+1)*h};if(r.quad(`winkelpui:${e.int(0,Ub-1)}`,ut(d,i),ut(f,i),ut(f,i+a),ut(d,i+a),[0,0],[1,0],[1,1],[0,1],Ae(l.n)),e.next()<.7&&h>2){const p=e.int(0,kb-1),x=i+a-.55,m=(g,y)=>({x:l.a.x+l.t.x*(u*h+g)+l.n.x*y,z:l.a.z+l.t.z*(u*h+g)+l.n.z*y});r.quad(`luifel:${p}`,ut(m(.3,0),x),ut(m(h-.3,0),x),ut(m(h-.3,1.6),x-.75),ut(m(.3,1.6),x-.75),[0,0],[h-.6,0],[h-.6,1],[0,1],{x:l.n.x,y:1,z:l.n.z}),r.quad(`luifel:${p}`,ut(m(.3,1.6),x-.75),ut(m(h-.3,1.6),x-.75),ut(m(h-.3,1.6),x-1),ut(m(.3,1.6),x-1),[0,0],[h-.6,0],[h-.6,.3],[0,.3],Ae(l.n))}}Je(r,`gevel:${n}`,l,i+a,s,0,o-1),Je(r,"trim",l,i+a,i+a+.35,0,0,3,.15)}On(r,"dakgrind",t.voet,s),To(r,t.voet,s-.05,.9,.3,`muur:${n}`)}function qb(r,t,e,n,i){const s=t.y,o=s+pr(t.lagen),a=t.lagen.length,l=t.lagen[0].hoogte,c=El(t.voet,.9);for(const d of Nn(t,c))Je(r,"glas",d,s,s+l,0,0);const h=gs(t.voet);for(const d of t.voet){const f=xs({x:h.x-d.x,z:h.z-d.z});Se(r,"beton","beton",{x:d.x+f.x*.45,z:d.z+f.z*.45},f,.6,.6,s,s+l)}On(r,"beton",t.voet,s+l-.35,!1);for(const d of Nn(t))Je(r,"beton",d,s+l-.35,s+l,0,0);for(const d of Nn(t))Je(r,`gevel:${n}`,d,s+l,o,0,a-1,n==="vliesgevel"?3.6:3);On(r,"dakgrind",t.voet,o),To(r,t.voet,o-.1,1.1,.35,n==="vliesgevel"?"metaal":"trimDonker");const u=El(t.voet,Math.min(6,t.diepte*.3));if(Math.abs(Un(u))>20){On(r,"metaal",u,o+2.6);for(const d of Nn(t,u))Je(r,"metaal",d,o,o+2.6,0,0)}}function Yb(r,t,e){const n=t.y,i=n+pr(t.lagen),s=`golfplaat:${e.int(0,Nb-1)}`,o=Nn(t);for(const u of o)Je(r,s,u,n,i,0,0);On(r,"golfdak",t.voet,i),To(r,t.voet,i-.05,.6,.2,"trimDonker");const a=gs(t.voet),l=o.find(u=>u.soort==="voor"),c=l?.t??{x:1,z:0},h=l?{x:-l.n.x,z:-l.n.z}:{x:0,z:1};for(let u=-3;u<=3;u++)for(let d=-2;d<=2;d++){const f={x:a.x+c.x*u*6+h.x*d*6,z:a.z+c.z*u*6+h.z*d*6};ir(f,El(t.voet,2.5))&&Se(r,"lichtstraat","lichtstraat",f,c,2.5,3.5,i,i+.5)}for(const u of o.filter(d=>d.soort==="voor")){const d=Math.min(7.5,u.L*.35),f={...u,b:{x:u.a.x+u.t.x*d,z:u.a.z+u.t.z*d},L:d};Je(r,"gevel:modernDonker",f,n,n+7.2,0,2,3,.04);for(let p=d+3;p+2<u.L;p+=5.5){const x={x:u.a.x+u.t.x*p,z:u.a.z+u.t.z*p},m=(g,y)=>({x:x.x+u.t.x*g+u.n.x*y,z:x.z+u.t.z*g+u.n.z*y});r.quad("roldeur",ut(m(-1.8,.04),n),ut(m(1.8,.04),n),ut(m(1.8,.04),n+4.2),ut(m(-1.8,.04),n+4.2),[0,0],[3.6,0],[3.6,4.2],[0,4.2],Ae(u.n)),Se(r,"beton","beton",m(0,1.2),u.t,3.8,2.4,n-.2,n+1.1),Se(r,"trimDonker","trimDonker",m(0,1),u.t,4.4,2,n+4.8,n+5)}}}function $b(r,t,e){const n=t.y,i=t.lagen.length,s=pr(t.lagen),o=Math.min(i,Math.floor(t.voortgang*i*1.05)),a=Nn(t);for(const h of a)Je(r,"beton",h,t.yGrond-.4,n,0,0);On(r,"beton",t.voet,n+.02);let l=n;for(let h=0;h<o;h++){const u=t.lagen[h].hoogte;On(r,"beton",t.voet,l+u),On(r,"beton",t.voet,l+u-.3,!1);for(const d of a)Je(r,"beton",d,l+u-.3,l+u,0,0);for(const d of a)for(let f=.3;f<d.L;f+=5){const p={x:d.a.x+d.t.x*f-d.n.x*.3,z:d.a.z+d.t.z*f-d.n.z*.3};Se(r,"beton","beton",p,d.t,.35,.35,l,l+u-.3)}l+=u}const c=Math.max(2.5,l-n+1.2);for(const h of a){const u={x:h.a.x+h.n.x*1.2-h.t.x*1.2,z:h.a.z+h.n.z*1.2-h.t.z*1.2},d={x:h.b.x+h.n.x*1.2+h.t.x*1.2,z:h.b.z+h.n.z*1.2+h.t.z*1.2},f=h.L+2.4;r.quad("steiger",ut(u,n),ut(d,n),ut(d,n+c),ut(u,n+c),[0,0],[f,0],[f,c],[0,c],Ae(h.n))}for(const h of a.filter(u=>u.soort==="voor")){const u=Math.max(.5,t.terug-.5),d={x:h.a.x+h.n.x*u,z:h.a.z+h.n.z*u},f={x:h.b.x+h.n.x*u,z:h.b.z+h.n.z*u},p=e(d.x,d.z),x=e(f.x,f.z);if(r.quad("hekwerk",ut(d,p),ut(f,x),ut(f,x+2),ut(d,p+2),[0,0],[h.L/3.5,0],[h.L/3.5,1],[0,1],Ae(h.n)),h.L>8&&t.terug>2.5){const m={x:f.x-h.t.x*3.5-h.n.x*1.4,z:f.z-h.t.z*3.5-h.n.z*1.4};Se(r,"keet","trimDonker",m,h.t,6,2.4,e(m.x,m.z),e(m.x,m.z)+2.6)}}if(s>11&&a.length){const h=a.find(g=>g.soort==="achter")??a[0],u={x:(h.a.x+h.b.x)/2+h.n.x*3.5,z:(h.a.z+h.b.z)/2+h.n.z*3.5},d=n+s+9;Se(r,"kraan","kraan",u,h.t,1.6,1.6,n,d);const f=t.seed%628/100,p=Math.cos(f),x=Math.sin(f),m=(g,y,v,_)=>Se(r,"kraan","kraan",{x:u.x+p*g/2,z:u.z+x*g/2},{x:p,z:x},Math.abs(g),y,v,_);m(34,1.1,d,d+1.4),m(-12,1.4,d,d+1),Se(r,"beton","beton",{x:u.x-p*10,z:u.z-x*10},{x:p,z:x},2.5,2.5,d-2.2,d),Se(r,"kraan","kraan",u,{x:p,z:x},1.2,1.2,d+1.4,d+5),Se(r,"glas","kraan",{x:u.x+p*1.8,z:u.z+x*1.8},{x:p,z:x},1.8,1.8,d-2.2,d)}}function Ia(r,t,e=!0,n=""){if(!r.groepen.length)return null;for(const m of r.groepen)if(m.posities.some(g=>!Number.isFinite(g)))return console.warn(`NaN in mesh ${n} (${m.materiaal})`),null;let i=0,s=0;for(const m of r.groepen)i+=m.posities.length/3,s+=m.indices.length;const o=new Float32Array(i*3),a=new Float32Array(i*3),l=new Float32Array(i*2),c=i>65535?new Uint32Array(s):new Uint16Array(s),h=new Ft,u=[];let d=0,f=0,p=!1;r.groepen.forEach((m,g)=>{o.set(m.posities,d*3),a.set(m.normalen,d*3),l.set(m.uvs,d*2);for(let y=0;y<m.indices.length;y++)c[f+y]=m.indices[y]+d;h.addGroup(f,m.indices.length,g),u.push(t.haal(m.materiaal)),gm(m.materiaal).schaduw!==!1&&(p=!0),d+=m.posities.length/3,f+=m.indices.length}),h.setAttribute("position",new Qt(o,3)),h.setAttribute("normal",new Qt(a,3)),h.setAttribute("uv",new Qt(l,2)),h.setIndex(new Qt(c,1)),h.computeBoundingSphere(),h.computeBoundingBox();const x=new ue(h,u);return x.castShadow=e&&p,x.receiveShadow=!0,x.matrixAutoUpdate=!1,x}function Rr(r){r&&(r.parent?.remove(r),r.traverse(t=>{t.geometry&&t.geometry.dispose()}))}const wh={eik:{stam:5.5,stamR:.38,kroonY:9.5,kroonR:5.2,kroonH:5.2,trossen:26,kaart:3.6,naald:!1,berk:!1},linde:{stam:5,stamR:.32,kroonY:10,kroonR:4.2,kroonH:6.2,trossen:24,kaart:3.3,naald:!1,berk:!1},berk:{stam:6,stamR:.2,kroonY:10,kroonR:2.9,kroonH:5.5,trossen:18,kaart:2.6,naald:!1,berk:!0},den:{stam:7,stamR:.3,kroonY:11,kroonR:3.2,kroonH:7.5,trossen:0,kaart:0,naald:!0,berk:!1},plataan:{stam:5.5,stamR:.42,kroonY:11,kroonR:5.8,kroonH:5.8,trossen:28,kaart:3.8,naald:!1,berk:!1}};function er(r,t,e,n,i,s,o=7){const a=di(Ze(n,e)),l=Math.abs(a.y)<.9?{x:0,y:1,z:0}:{x:1,y:0,z:0},c=di({x:a.y*l.z-a.z*l.y,y:a.z*l.x-a.x*l.z,z:a.x*l.y-a.y*l.x}),h={x:a.y*c.z-a.z*c.y,y:a.z*c.x-a.x*c.z,z:a.x*c.y-a.y*c.x},u=[],d=[],f=[],p=[],x=Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z);for(let _=0;_<=o;_++){const E=_/o*Math.PI*2,b=Math.cos(E),w=Math.sin(E),C={x:c.x*b+h.x*w,y:c.y*b+h.y*w,z:c.z*b+h.z*w};u.push({x:e.x+C.x*i,y:e.y+C.y*i,z:e.z+C.z*i},{x:n.x+C.x*s,y:n.y+C.y*s,z:n.z+C.z*s}),d.push(C,C),f.push([_/o*2,0],[_/o*2,x/2])}for(let _=0;_<o;_++){const E=_*2;p.push(E,E+2,E+1,E+1,E+2,E+3)}const m=u[0],g=u[2],y=u[1],v={x:(g.y-m.y)*(y.z-m.z)-(g.z-m.z)*(y.y-m.y),y:(g.z-m.z)*(y.x-m.x)-(g.x-m.x)*(y.z-m.z),z:(g.x-m.x)*(y.y-m.y)-(g.y-m.y)*(y.x-m.x)};if(v.x*d[0].x+v.y*d[0].y+v.z*d[0].z<0)for(let _=0;_<p.length;_+=3){const E=p[_+1];p[_+1]=p[_+2],p[_+2]=E}r.ruw(t,u,d,f,p)}function vf(r,t,e,n,i,s,o){const l=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([h,u])=>({x:e.x+(n.x*h+i.x*u)*s,y:e.y+(n.y*h+i.y*u)*s,z:e.z+(n.z*h+i.z*u)*s})),c=l.map(h=>di({x:h.x-o.x,y:(h.y-o.y)*1.4+.6,z:h.z-o.z}));r.ruw(t,l,c,[[0,0],[1,0],[1,1],[0,1]],[0,1,2,0,2,3,0,2,1,0,3,2])}function Zb(r,t,e=!1){const n=wh[r]??wh.eik,i=new lr(r.length*977+t*31+5),s=new wo,o=n.berk?"schorsBerk":"schors",a=`blad:${r}`,l={x:i.range(-.3,.3),y:n.kroonY-(n.naald?0:n.kroonH*.35),z:i.range(-.3,.3)};er(s,o,{x:0,y:-.3,z:0},{x:l.x*.4,y:n.stam,z:l.z*.4},n.stamR*1.15,n.stamR*.8),er(s,o,{x:l.x*.4,y:n.stam,z:l.z*.4},l,n.stamR*.8,n.stamR*.35,6);const c={x:l.x,y:n.kroonY,z:l.z};if(n.naald){const y=e?4:7;for(let v=0;v<y;v++){const _=v/(y-1),E=n.stam-1+_*(n.kroonY+n.kroonH*.5-n.stam),b=n.kroonR*(1-_*.85),w=e?5:Math.max(4,Math.round(9*(1-_*.5)));for(let C=0;C<w;C++){const S=C/w*Math.PI*2+v*.7+i.range(-.2,.2),M={x:Math.cos(S),z:Math.sin(S)},P={x:l.x*_+M.x*b*.55,y:E-.3,z:l.z*_+M.z*b*.55},N={x:-M.z,y:0,z:M.x},I=di({x:M.x,y:-.35,z:M.z});vf(s,a,P,N,I,b*.6+.6,{x:l.x*_,y:E+1.5,z:l.z*_})}}return er(s,o,l,{x:l.x,y:n.kroonY+n.kroonH*.55,z:l.z},n.stamR*.35,.05,5),s.bouw()}const h=e?0:4+i.int(0,2);for(let y=0;y<h;y++){const v=y/h*Math.PI*2+i.range(-.3,.3),_=n.stam+i.range(-.5,1.5),E={x:c.x+Math.cos(v)*n.kroonR*.55,y:n.kroonY+i.range(-1,1.5),z:c.z+Math.sin(v)*n.kroonR*.55};er(s,o,{x:l.x*.4,y:_,z:l.z*.4},E,n.stamR*.45,.06,5)}const u=`bladkern:${r}`,d=e?6:8,f=e?4:5,p=[],x=[],m=[],g=[];for(let y=0;y<=f;y++)for(let v=0;v<=d;v++){const _=y/f*Math.PI,E=v/d*Math.PI*2,b={x:Math.sin(_)*Math.cos(E),y:Math.cos(_),z:Math.sin(_)*Math.sin(E)},w=.62+.08*Math.sin(E*3+y);p.push({x:c.x+b.x*n.kroonR*w,y:c.y+b.y*n.kroonH*.55*w,z:c.z+b.z*n.kroonR*w}),x.push(b),m.push([v/d,y/f])}for(let y=0;y<f;y++)for(let v=0;v<d;v++){const _=y*(d+1)+v,E=_+1,b=_+d+1,w=b+1;g.push(_,E,b,E,w,b)}s.ruw(u,p,x,m,g);for(let y=0;y<(e?Math.ceil(n.trossen/3):n.trossen);y++){const v=Math.acos(i.range(-.55,.95)),_=i.range(0,Math.PI*2),E={x:c.x+Math.sin(v)*Math.cos(_)*n.kroonR*.72,y:c.y+Math.cos(v)*n.kroonH*.5,z:c.z+Math.sin(v)*Math.sin(_)*n.kroonR*.72},b=n.kaart*i.range(.8,1.15),w=i.range(0,Math.PI),C=[[{x:Math.cos(w),y:0,z:Math.sin(w)},{x:0,y:1,z:0}],[{x:-Math.sin(w),y:0,z:Math.cos(w)},{x:0,y:1,z:0}],[{x:Math.cos(w),y:0,z:Math.sin(w)},{x:-Math.sin(w),y:0,z:Math.cos(w)}]];for(const[S,M]of e?C.slice(0,2):C)vf(s,a,E,S,M,(e?b*1.25:b)/2,c)}return s.bouw()}function _f(r){const t=new wo;er(t,"paal",{x:0,y:-.2,z:0},{x:0,y:7.2,z:0},.09,.06,6);for(const e of r?[1,-1]:[1])er(t,"paal",{x:0,y:7,z:0},{x:0,y:7.5,z:e*1.4},.05,.045,5),t.blok("paal","paal",{x:0,y:0,z:e*1.7},{x:1,y:0,z:0},{x:0,y:0,z:1},.35,.7,7.38,7.55),t.quad("lamp",{x:-.15,y:7.37,z:e*1.4},{x:.15,y:7.37,z:e*1.4},{x:.15,y:7.37,z:e*2},{x:-.15,y:7.37,z:e*2},[0,0],[1,0],[1,1],[0,1],{x:0,y:-1,z:0});return t.bouw()}const yf=r=>r in wh;function Kb(r,t,e=!1){return r==="lantaarn"?_f(!1):r==="lantaarnDubbel"?_f(!0):Zb(r,t,e)}const Al=256,Mf=(r,t)=>(Math.floor(r/Al)+100)*1e3+(Math.floor(t/Al)+100),bf=r=>new R((Math.floor(r/1e3)-100+.5)*Al,0,(r%1e3-100+.5)*Al);class jb{constructor(t){this.mats=t}groep=new Zn;bronnen=new Map;vakInhoud=new Map;vuil=new Set;meshes=new Map;lod=new Map;modellen=new Map;klok=0;model(t,e,n){const i=`${t}|${e}|${n&&yf(t)?1:0}`;let s=this.modellen.get(i);if(!s){const o=Ia(Kb(t,e,n),this.mats);s={geo:o.geometry,mat:o.material},this.modellen.set(i,s)}return s}zet(t,e){if(this.wis(t),!e.length)return;const n=new Set;for(const i of e)n.add(Mf(i.x,i.z));this.bronnen.set(t,{props:e,vakken:n});for(const i of n){let s=this.vakInhoud.get(i);s||this.vakInhoud.set(i,s=new Set),s.add(t),this.vuil.add(i)}}wis(t){const e=this.bronnen.get(t);if(e){for(const n of e.vakken)this.vakInhoud.get(n)?.delete(t),this.vuil.add(n);this.bronnen.delete(t)}}bouwVak(t,e){for(const u of this.meshes.get(t)??[])this.groep.remove(u),u.dispose();this.meshes.delete(t);const n=new Map;for(const u of this.vakInhoud.get(t)??[])for(const d of this.bronnen.get(u).props){if(Mf(d.x,d.z)!==t)continue;const f=`${d.soort}|${d.variant}`;let p=n.get(f);p||n.set(f,p=[]),p.push(d)}const i=[],s=new Ut,o=new Qe,a=new R,l=new R,c=new R(0,1,0),h=new dt;for(const[u,d]of n){const[f,p]=u.split("|"),x=this.model(f,Number(p),e),m=new ql(x.geo,x.mat,d.length),g=yf(f);d.forEach((y,v)=>{if(o.setFromAxisAngle(c,y.rot),a.setScalar(y.schaal),l.set(y.x,y.y,y.z),m.setMatrixAt(v,s.compose(l,o,a)),g){const _=Pi(Math.round(y.x*10),Math.round(y.z*10),3);h.setRGB(.86+_*.24,.9+_*.16,.82+(1-_)*.2),m.setColorAt(v,h)}}),m.instanceMatrix.needsUpdate=!0,m.instanceColor&&(m.instanceColor.needsUpdate=!0),m.computeBoundingSphere(),m.castShadow=!0,m.receiveShadow=!0,m.matrixAutoUpdate=!1,i.push(m),this.groep.add(m)}this.meshes.set(t,i),this.lod.set(t,e)}werkBij(t,e,n=!1){this.klok+=e;const i=new Set(this.vuil);if(this.vuil.clear(),this.klok>.4||n){this.klok=0;for(const a of this.vakInhoud.keys()){const l=bf(a).setY(t.y*.3).distanceTo(t)>750;this.lod.get(a)!==l&&i.add(a)}}const s=[...i],o=n?s.length:12;s.forEach((a,l)=>{if(l>=o){this.vuil.add(a);return}this.bouwVak(a,bf(a).setY(t.y*.3).distanceTo(t)>750)})}}class Jb{constructor(t,e){this.w=t,this.mats=e,this.props=new jb(e),this.zones=new Qb(t),this.groep.add(this.props.groep,this.zones.mesh);for(const n of t.bomen.alleVakken())this.natuur(n)}groep=new Zn;wegen=new Map;kruispunten=new Map;gebouwen=new Map;props;zones;bouwRij=new Set;segRij=new Set;knoopRij=new Set;natuur(t){const e=this.w.bomen,n=e.inVak(t).map(i=>({soort:N1[e.soort[i]],x:e.x[i],y:this.w.terrein.hoogte(e.x[i],e.z[i]),z:e.z[i],rot:e.rot[i],schaal:e.schaal[i],variant:e.variant[i]}));this.props.zet(`bos:${t}`,n)}werkBij(t=8){for(const n of this.w.haalEvents())switch(n.soort){case"seg+":this.segRij.add(n.id);break;case"seg-":Rr(this.wegen.get(n.id)),this.wegen.delete(n.id),this.props.wis(`weg:${n.id}`),this.segRij.delete(n.id);break;case"knoop~":this.knoopRij.add(n.id);break;case"kavel+":case"kavel-":case"kavel~":this.zones.vuil=!0;break;case"gebouw+":case"gebouw~":this.bouwRij.add(n.id);break;case"gebouw-":Rr(this.gebouwen.get(n.id)),this.gebouwen.delete(n.id),this.props.wis(`geb:${n.id}`),this.bouwRij.delete(n.id);break}for(const n of this.w.bomen.haalVuileVakken())this.natuur(n);const e=performance.now();for(const n of this.segRij){this.segRij.delete(n);const i=this.w.net.segmenten.get(n);if(Rr(this.wegen.get(n)),this.wegen.delete(n),!i)continue;const s=Lb(this.w.net,i),o=Ia(s.mesh,this.mats,!0,`weg ${n}`);o&&(this.wegen.set(n,o),this.groep.add(o)),this.props.zet(`weg:${n}`,s.props)}for(const n of this.knoopRij){if(this.knoopRij.delete(n),Rr(this.kruispunten.get(n)),this.kruispunten.delete(n),!this.w.net.knopen.has(n))continue;const i=Ia(Db(this.w.net,n),this.mats,!0,`kruispunt ${n}`);i&&(this.kruispunten.set(n,i),this.groep.add(i))}for(const n of this.bouwRij){if(performance.now()-e>t)break;this.bouwRij.delete(n);const i=this.w.gebouwen.get(n);if(Rr(this.gebouwen.get(n)),this.gebouwen.delete(n),!i)continue;const s=Vb(i,(a,l)=>this.w.terrein.hoogte(a,l)),o=Ia(s.mesh,this.mats,!0,`gebouw ${n} ${i.vorm}`);o&&(this.gebouwen.set(n,o),this.groep.add(o)),this.props.zet(`geb:${n}`,s.props)}this.zones.werkBij()}get bezig(){return this.bouwRij.size+this.segRij.size}}class Qb{constructor(t){this.w=t,this.mat=new ge({transparent:!0,depthWrite:!1,side:yn,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-8,uniforms:{uAlles:{value:0}},vertexShader:`attribute vec4 kleur; varying vec4 vK; varying vec2 vUv;
        void main(){ vK = kleur; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,fragmentShader:`uniform float uAlles; varying vec4 vK; varying vec2 vUv;
        void main(){
          float lijn = 1.0 - smoothstep(0.25, 0.7, vUv.y);
          float a = vK.a * mix(0.2, 0.42, uAlles) + lijn * mix(0.12, 0.5, uAlles) * step(0.001, vK.a);
          gl_FragColor = vec4(mix(vK.rgb, vec3(1.0), lijn * 0.5), a);
          #include <colorspace_fragment>
        }`}),this.mesh=new ue(new Ft,this.mat),this.mesh.renderOrder=2,this.mesh.userData.geenAO=!0,this.mesh.frustumCulled=!1}mesh;vuil=!0;toonAlles=!1;mat;werkBij(){if(this.mat.uniforms.uAlles.value=this.toonAlles?1:0,!this.vuil)return;this.vuil=!1;const t=[],e=[],n=[],i=[],s=this.w.terrein,o=new dt;for(const l of this.w.kavels.values()){if(l.gebouw||l.zone==="geen"&&!this.toonAlles)continue;l.zone==="geen"?o.set("#ffffff"):o.set(hm(l.zone));const c=l.zone==="geen"?.25:1,h=dm(l.poly,hc(l.poly),4),u=t.length/3;for(const d of h.p)t.push(d.x,s.hoogte(d.x,d.z)+.12,d.z),e.push(0,Fn(d,[...l.poly,l.poly[0]]).d),n.push(o.r,o.g,o.b,c);for(let d=0;d<h.tri.length;d+=3)i.push(u+h.tri[d],u+h.tri[d+1],u+h.tri[d+2])}const a=new Ft;a.setAttribute("position",new bt(t,3)),a.setAttribute("uv",new bt(e,2)),a.setAttribute("kleur",new bt(n,4)),a.setIndex(i),this.mesh.geometry.dispose(),this.mesh.geometry=a}}class tS{constructor(t){this.w=t,this.lint=new ue(new Ft,this.lintMat),this.ring=new ue(new Ft,this.ringMat),this.stippen=new ql(new Ss(1.2,1.2,.4,20),new wn({color:16777215,depthTest:!1,transparent:!0,opacity:.9}),4),this.kader=new Bn(new Ft,new Ye({color:16739179,depthTest:!1}));for(const e of[this.lint,this.ring,this.stippen,this.kader])e.renderOrder=10,e.frustumCulled=!1,e.visible=!1,e.userData.geenAO=!0,this.groep.add(e)}groep=new Zn;lint;lintMat=new wn({color:4243543,transparent:!0,opacity:.45,depthWrite:!1,depthTest:!1});ring;ringMat=new wn({color:16777215,transparent:!0,opacity:.8,depthWrite:!1,depthTest:!1});stippen;kader;lintLangs(t,e,n=.4){const i=[],s=[];for(let a=0;a<t.length;a++){const l=t[Math.max(0,a-1)],c=t[Math.min(t.length-1,a+1)];let h=c.x-l.x,u=c.z-l.z;const d=Math.hypot(h,u)||1;h/=d,u/=d;const f=-u*e/2,p=h*e/2;if(i.push(t[a].x-f,t[a].y+n,t[a].z-p,t[a].x+f,t[a].y+n,t[a].z+p),a){const x=(a-1)*2;s.push(x,x+1,x+2,x+1,x+3,x+2)}}const o=new Ft;o.setAttribute("position",new bt(i,3)),o.setIndex(s),this.lint.geometry.dispose(),this.lint.geometry=o}toon(t){this.lint.visible=this.ring.visible=this.stippen.visible=this.kader.visible=!1;const e=this.w.terrein;switch(t.soort){case"weg":{t.as.length>1&&(this.lintLangs(t.as,t.breedte,.6),this.lintMat.color.set(t.geldig?4243543:16405074),this.lint.visible=!0);const n=new Ut;t.punten.slice(0,4).forEach((i,s)=>this.stippen.setMatrixAt(s,n.makeTranslation(i.x,Math.max(i.y,0)+.6,i.z))),this.stippen.count=Math.min(4,t.punten.length),this.stippen.instanceMatrix.needsUpdate=!0,this.stippen.visible=!0;break}case"penseel":{const n=[],i=[];for(let a=0;a<=72;a++){const l=a/72*Math.PI*2;for(const c of[t.r-.8,t.r+.8]){const h=t.m.x+Math.cos(l)*c,u=t.m.z+Math.sin(l)*c;n.push(h,e.hoogte(h,u)+.8,u)}if(a){const c=(a-1)*2;i.push(c,c+1,c+2,c+1,c+3,c+2)}}const o=new Ft;o.setAttribute("position",new bt(n,3)),o.setIndex(i),this.ring.geometry.dispose(),this.ring.geometry=o,this.ringMat.color.set(t.kleur),this.ring.visible=!0;break}case"markeer":{if(t.segment!==void 0){const n=this.w.net.segmenten.get(t.segment);n&&(this.lintLangs(n.pad.map(i=>({x:i.x,y:i.y,z:i.z})),Ge(n.type)*2+1,.5),this.lintMat.color.set(t.kleur),this.lint.visible=!0)}if(t.gebouw!==void 0){const n=this.w.gebouwen.get(t.gebouw);if(n){const i=n.y+n.lagen.reduce((l,c)=>l+c.hoogte,0)+2,s=[],o=n.voet.length;for(let l=0;l<o;l++){const c=n.voet[l],h=n.voet[(l+1)%o];for(const u of[n.y,i])s.push(c.x,u,c.z,h.x,u,h.z);s.push(c.x,n.y,c.z,c.x,i,c.z)}const a=new Ft;a.setAttribute("position",new bt(s,3)),this.kader.geometry.dispose(),this.kader.geometry=a,this.kader.material.color.set(t.kleur),this.kader.visible=!0}}break}}}}const sn=r=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${r}</svg>`,He={munt:sn('<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2a3.4 3.4 0 1 0 0 5.6M8.5 11h5M8.5 13.2h5"/>'),huis:sn('<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>'),mensen:sn('<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9.5" r="2.4"/><path d="M15.5 14.3c2.6-.2 4.4 1.4 5 4.2"/>'),koffer:sn('<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3.5 12.5h17"/>'),grafiek:sn('<path d="M4 19h16"/><path d="m5 15 4-4 3 3 6-7"/><path d="M15 7h3v3"/>'),pauze:sn('<path d="M9 6v12M15 6v12"/>'),weg:sn('<path d="M8 3 5 21M16 3l3 18M12 4v3M12 10.5v3M12 17v3"/>'),zone:sn('<rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/>'),pijl:sn('<path d="M12 19V5M6 11l6-6 6 6"/>'),sloop:sn('<path d="M14.5 4.5 19.5 9.5 10 19H5v-5z"/><path d="M12 7l5 5"/>'),oog:sn('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>'),krant:sn('<path d="M5 5h11v14H6.5A1.5 1.5 0 0 1 5 17.5z"/><path d="M16 9h3v8.5a1.5 1.5 0 0 1-3 0M8 8.5h5M8 11.5h5M8 14.5h3"/>'),vlag:sn('<path d="M5 21V4M5 4.5h11l-2 3.5 2 3.5H5"/>'),let:sn('<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.3"/>')};function eS(r){const t=r>=70?"M8 14.2c1.1 1.6 2.4 2.3 4 2.3s2.9-.7 4-2.3":r>=45?"M8.5 15h7":"M8 16.3c1.1-1.5 2.4-2.2 4-2.2s2.9.7 4 2.2";return`<svg viewBox="0 0 24 24" fill="none" stroke="${r>=70?"#69db7c":r>=45?"#ffd43b":"#ff6b6b"}" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M9 10v.4M15 10v.4"/><path d="${t}"/></svg>`}function nS(r){const t=[["#c92a2a","#f8f9fa"],["#1864ab","#ffd43b"],["#2b8a3e","#f8f9fa"],["#212529","#ffd43b"],["#e8590c","#1c3d6e"],["#5f3dc4","#f8f9fa"]],[e,n]=t[r%t.length],i=r%3,s=i===0?`<path d="M4 3h16v8H4z" fill="${n}"/>`:i===1?`<path d="M12 3h8v17l-8 2.6z" fill="${n}"/>`:`<path d="M4 3l16 14V7.5L8 3z" fill="${n}" opacity=".95"/>`,o=[`<path d="M8.5 16v-5l1.2-1V8h1v1h2.6V8h1v2l1.2 1v5z" fill="${n}" stroke="${e}" stroke-width=".6"/>`,`<path d="M6.5 14.5c1.8-1.6 3.6-1.6 5.5 0s3.7 1.6 5.5 0M6.5 17.5c1.8-1.6 3.6-1.6 5.5 0s3.7 1.6 5.5 0" stroke="${n}" stroke-width="1.3" fill="none"/>`,`<path d="M12 7l1.4 3 3.2.3-2.4 2.1.7 3.1L12 13.9 9.1 15.5l.7-3.1-2.4-2.1 3.2-.3z" fill="${n}" stroke="${e}" stroke-width=".5"/>`,`<path d="M8 9l3 3m0-3-3 3M11 13l3 3m0-3-3 3M14 9l3 3m0-3-3 3" stroke="${n}" stroke-width="1.4"/>`];return`<svg viewBox="0 0 24 24"><path d="M4 3h16v8.5c0 5.2-3.6 8.6-8 10.4-4.4-1.8-8-5.2-8-10.4z" fill="${e}"/>${s}${o[(r>>2)%o.length]}<path d="M4 3h16v8.5c0 5.2-3.6 8.6-8 10.4-4.4-1.8-8-5.2-8-10.4z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1"/></svg>`}const za=r=>Math.round(r).toLocaleString("nl-NL"),iS=r=>Math.abs(r)>=1e6?`€ ${(r/1e6).toLocaleString("nl-NL",{maximumFractionDigits:1})} mln`:`€ ${za(r)}`;class sS{constructor(t){this.w=t,this.el.innerHTML=`
      <div class="kaart stadskaart paneel">
        <div class="wapen">${nS(t.seed+11)}</div>
        <div><div class="stadsnaam" title="Klik om de naam te wijzigen" data-v="naam"></div><div class="datum" data-v="datum"></div></div>
        <div class="inw"><span class="ic">${He.mensen}</span><b data-v="inw"></b></div>
      </div>
      <div class="kaart cijfers paneel">
        <div class="cijfer" title="Begroting"><span class="ic geel">${He.munt}</span><b data-v="geld"></b></div>
        <div class="cijfer" title="Woningen"><span class="ic">${He.huis}</span><b data-v="won"></b></div>
        <div class="cijfer" title="Banen"><span class="ic">${He.koffer}</span><b data-v="banen"></b></div>
        <div class="cijfer" title="Werkloosheid"><span class="ic">${He.grafiek}</span><b data-v="wl"></b></div>
        <div class="cijfer" title="Tevredenheid van de inwoners"><span class="ic" data-v="gezicht"></span><b data-v="tev"></b></div>
      </div>
      <div class="kaart bediening paneel">
        <div class="snelheid">${[0,1,2,4].map(e=>`<button class="knop rond" data-s="${e}" title="${e?e+"× snelheid":"Pauze (spatie)"}">${e===0?He.pauze:'<span class="snel">'+"›".repeat(e===4?3:e)+"</span>"}</button>`).join("")}</div>
        <div class="vraag" title="Vraag naar wonen, winkels, kantoren en industrie">
          ${[["W","wonen","#69db7c","Wonen"],["D","detailhandel","#4dabf7","Winkels"],["K","kantoor","#b197fc","Kantoren"],["I","industrie","#ffd43b","Industrie"]].map(([e,n,i,s])=>`<div class="vraag-kolom" title="${s}"><div class="vraag-staaf"><div data-q="${n}" style="background:${i}"></div></div><div class="vraag-letter">${e}</div></div>`).join("")}
        </div>
      </div>`,this.el.querySelectorAll("[data-v]").forEach(e=>this.v[e.dataset.v]=e),this.el.querySelectorAll("[data-q]").forEach(e=>this.staven[e.dataset.q]=e),this.el.querySelectorAll("[data-s]").forEach(e=>{this.knoppen.push(e),e.onclick=()=>{this.w.snelheid=Number(e.dataset.s),this.werkBij()}}),this.v.naam.onclick=()=>{const e=prompt("Naam van je stad",this.w.naam);e&&e.trim()&&(this.w.naam=e.trim().slice(0,32),this.werkBij())},addEventListener("keydown",e=>{e.target instanceof HTMLInputElement||e.code==="Space"&&(e.preventDefault(),this.w.snelheid=this.w.snelheid?0:1,this.werkBij())}),this.nieuwsEl=document.createElement("div"),this.nieuwsEl.id="nieuws",document.body.appendChild(this.nieuwsEl)}el=document.getElementById("hud");v={};staven={};knoppen=[];nieuwsEl;laatsteNieuws=0;werkBij(){const t=this.w,e=t.stat,n=new Date(2026,0,1);n.setDate(n.getDate()+Math.floor(t.dagen)),this.v.naam.textContent=t.naam,this.v.datum.textContent=n.toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"long",year:"numeric"}),this.v.inw.textContent=za(e.inwoners),this.v.geld.textContent=iS(t.geld),this.v.won.textContent=za(e.woningen),this.v.banen.textContent=za(e.banen),this.v.wl.textContent=(e.werkloosheid*100).toFixed(1)+"%";const i=t.tevredenheid;this.v.tev.textContent=i+"%",this.v.gezicht.innerHTML=eS(i);for(const[o,a]of Object.entries(this.staven))a.style.height=Math.round(t.vraag[o]*100)+"%";for(const o of this.knoppen)o.classList.toggle("aan",Number(o.dataset.s)===t.snelheid);const s=t.nieuws[t.nieuws.length-1];if(s&&s.id!==this.laatsteNieuws){this.laatsteNieuws=s.id;const o={weg:He.weg,bouw:He.huis,mijlpaal:He.vlag,waarschuwing:He.let};this.nieuwsEl.innerHTML=`<div class="nieuws-kop"><span class="ic">${He.krant}</span>${t.naam} Courant</div>`+t.nieuws.slice(-4).reverse().map((a,l)=>{const c=new Date(2026,0,1);return c.setDate(c.getDate()+Math.floor(a.dag)),`<div class="bericht ${a.soort} ${l===0?"nieuw":""}"><span class="ic">${o[a.soort]}</span><span>${a.tekst}</span><time>${c.toLocaleDateString("nl-NL",{day:"numeric",month:"short"})}</time></div>`}).join("")}this.nieuwsEl.style.display=t.nieuws.length?"block":"none"}}const rS={stoep:"#9aa0a6",fiets:"#a8473b",auto:"#3b3f45",gedeeld:"#7b4a3a",bus:"#7a3f35",tram:"#55575c",berm:"#5f8d3e",middenberm:"#5f8d3e",vluchtstrook:"#4a4e55"};function oS(r){const t=Te[r],e=Es(t.stroken),n=80/Math.max(e,12),i=43-e*n/2;return`<svg viewBox="0 0 86 46">${cc(t.stroken).map(o=>{const a=o.s.soort==="stoep"?10:o.s.soort==="berm"||o.s.soort==="middenberm"?9:7,l=o.s.soort==="auto"&&t.dek==="klinkers"?"#7b4a3a":rS[o.s.soort];return`<rect x="${i+o.a*n+e*n/2}" y="${36-a}" width="${Math.max(1,o.s.breedte*n-.6)}" height="${a}" rx="1" fill="${l}"/>`+(o.s.soort==="berm"||o.s.soort==="middenberm"?`<circle cx="${i+(o.a+o.b)/2*n+e*n/2}" cy="20" r="${Math.min(6,o.s.breedte*n)}" fill="#3f7d34"/>`:"")}).join("")}<text x="43" y="44" text-anchor="middle" font-size="7" fill="#9aa7b8">${e.toFixed(1)} m</text></svg>`}function aS(r,t){return`<svg viewBox="0 0 86 46" style="color:${t}" fill="${t}">${{wonenLaag:'<path d="M18 34 V22 L28 14 L38 22 V34 Z M42 34 V22 L52 14 L62 22 V34 Z"/>',wonenHoog:'<rect x="28" y="6" width="30" height="30" rx="2"/>',gemengd:'<rect x="22" y="10" width="42" height="26" rx="2"/><rect x="22" y="27" width="42" height="9" fill="#fff" opacity=".35"/>',kantoor:'<rect x="34" y="2" width="18" height="34" rx="1"/><rect x="22" y="14" width="12" height="22" rx="1"/>',industrie:'<path d="M14 36 V20 L28 26 V20 L42 26 V20 L56 26 V12 H64 V36 Z"/>',geen:'<path d="M30 12 L56 34 M56 12 L30 34" stroke-width="5" stroke="currentColor"/>'}[r]}</svg>`}class Sf{constructor(t,e){this.g=t,this.opZoneModus=e,this.el.className="paneel",addEventListener("keydown",n=>{if(n.target instanceof HTMLInputElement)return;const i=n.key.toLowerCase();if(i==="escape"&&(this.g.terug()||this.kies("kijk")),i==="z"&&this.kies("zone"),i==="x"&&this.kies("weg"),i==="u"&&this.kies("opwaarderen"),i==="b"&&this.kies("sloop"),i==="c"&&this.g.modus==="weg"&&(this.g.bocht=!this.g.bocht,this.g.annuleer(),this.teken()),/^[1-9]$/.test(i)){const s=Number(i)-1;this.g.modus==="zone"&&Pa[s]?(this.g.zone=Pa[s].id,this.teken()):(this.g.modus==="weg"||this.g.modus==="opwaarderen")&&sh[s]&&(this.g.wegtype=sh[s],this.teken())}(i==="+"||i==="=")&&this.g.modus==="zone"&&(this.g.penseel=Math.min(80,this.g.penseel+4),this.teken()),i==="-"&&this.g.modus==="zone"&&(this.g.penseel=Math.max(6,this.g.penseel-4),this.teken())}),this.teken()}el=document.getElementById("werkbalk");kies(t){this.g.zetModus(t),this.opZoneModus(t==="zone"),this.teken()}teken(){const t=this.g,e={weg:He.weg,zone:He.zone,opwaarderen:He.pijl,sloop:He.sloop,kijk:He.oog},n=(o,a,l)=>`<button class="knop tab ${t.modus===o?"aan":""}" data-m="${o}"><span class="ic">${e[o]}</span>${a}<span class="toets">${l}</span></button>`;let i="",s="";t.modus==="weg"||t.modus==="opwaarderen"?(i=sh.map((o,a)=>`<div class="item ${t.wegtype===o?"aan":""}" data-w="${o}">${oS(o)}<div class="item-naam">${Te[o].naam}</div><div class="item-sub">${a+1} · € ${Te[o].kosten}/m</div></div>`).join(""),t.modus==="weg"&&(s=`<button class="knop ${t.bocht?"":"aan"}" data-b="0">Recht</button><button class="knop ${t.bocht?"aan":""}" data-b="1">Bocht</button><span>C wisselt</span>`)):t.modus==="zone"?(i=Pa.map(o=>`<div class="item ${t.zone===o.id?"aan":""}" data-z="${o.id}">${aS(o.id,o.kleur)}<div class="item-naam">${o.naam}</div><div class="item-sub">${o.toets}</div></div>`).join(""),s=`<span>Penseel</span><button class="knop" data-p="-4">−</button><span style="color:#e9eef5;font-weight:600">${t.penseel} m</span><button class="knop" data-p="4">+</button>`):t.modus==="sloop"?i='<div class="item-sub" style="padding:14px">Klik op een weg of gebouw om het te slopen. Je krijgt een kwart van de wegkosten terug.</div>':i='<div class="item-sub" style="padding:14px">Kies een gereedschap. Camera: WASD of middelste muisknop = schuiven, rechts slepen of Q/E = draaien, R/F = kantelen, scrollen = zoomen. Spatie = pauze.</div>',this.el.innerHTML=`<div class="tabs">${n("weg","Wegen","X")}${n("zone","Zones","Z")}${n("opwaarderen","Opwaarderen","U")}${n("sloop","Slopen","B")}${n("kijk","Kijken","Esc")}<div class="opties">${s}</div></div><div class="items">${i}</div>`,this.el.querySelectorAll("[data-m]").forEach(o=>o.onclick=()=>this.kies(o.dataset.m)),this.el.querySelectorAll("[data-w]").forEach(o=>o.onclick=()=>{t.wegtype=o.dataset.w,this.teken()}),this.el.querySelectorAll("[data-z]").forEach(o=>o.onclick=()=>{t.zone=o.dataset.z,this.teken()}),this.el.querySelectorAll("[data-b]").forEach(o=>o.onclick=()=>{t.bocht=o.dataset.b==="1",t.annuleer(),this.teken()}),this.el.querySelectorAll("[data-p]").forEach(o=>o.onclick=()=>{t.penseel=Math.max(6,Math.min(80,t.penseel+Number(o.dataset.p))),this.teken()})}static boven(t,e){return[document.getElementById("werkbalk"),...document.querySelectorAll(".kaart")].some(n=>{const i=n.getBoundingClientRect();return t>=i.left&&t<=i.right&&e>=i.top&&e<=i.bottom})}}class lS{constructor(t,e){this.w=t,this.cam=e,this.laag.id="labels",document.body.appendChild(this.laag)}laag=document.createElement("div");pool=[];klok=0;werkBij(t,e,n=!0){if(this.klok+=t,this.klok<.08)return;this.klok=0;let i=0;if(n&&e<650){const s=new Map,o=this.cam.position,a=new R,l=new R;for(const c of this.w.net.segmenten.values()){if(!c.naam||c.lengte<25||!c.pad.length)continue;const h=c.pad[Math.floor(c.pad.length/2)];if(Math.hypot(h.x-o.x,h.y-o.y,h.z-o.z)>e*2.2+120||(a.set(h.x,h.y,h.z).project(this.cam),a.z>1||Math.abs(a.x)>.95||Math.abs(a.y)>.9))continue;const d=Math.hypot(a.x,a.y),f=s.get(c.naam);(!f||d<f.d)&&s.set(c.naam,{s:c,d})}for(const{s:c}of[...s.values()].sort((h,u)=>h.d-u.d).slice(0,28)){const h=Math.floor(c.pad.length/2),u=c.pad[h],d=c.pad[Math.min(c.pad.length-1,h+1)];if(a.set(u.x,u.y+.5,u.z).project(this.cam),a.z>1||Math.abs(a.x)>1.05||Math.abs(a.y)>1.05)continue;l.set(d.x+(d.x-u.x)*3,d.y+.5,d.z+(d.z-u.z)*3).project(this.cam);const f=(a.x+1)/2*innerWidth,p=(1-a.y)/2*innerHeight;let x=Math.atan2(-(l.y-a.y)*innerHeight,(l.x-a.x)*innerWidth)*180/Math.PI;x>90&&(x-=180),x<-90&&(x+=180);const m=this.pool[i]??this.laag.appendChild(Object.assign(document.createElement("div"),{className:"label"}));this.pool[i]=m,m.textContent!==c.naam&&(m.textContent=c.naam),m.style.transform=`translate(${f}px, ${p}px) translate(-50%, -50%) rotate(${x}deg)`,m.style.opacity=String(Math.max(0,Math.min(1,(650-e)/200))),m.style.display="block",i++}}for(let s=i;s<this.pool.length;s++)this.pool[s].style.display="none"}}const Ri=new URLSearchParams(location.search),ym=document.getElementById("laad-tekst"),cS=document.getElementById("laad-voortgang"),Pr=(r,t)=>(ym.textContent=r,cS.style.width=`${Math.round(t*100)}%`,new Promise(e=>setTimeout(e,0)));async function hS(){const r=Ri.get("kwaliteit")??"hoog",t=new Mb(document.getElementById("beeld"),{schaduw:r==="laag"?2048:4096,ao:r!=="laag",pixelRatio:Math.min(devicePixelRatio,r==="laag"?1:1.5)}),e=new Sb;e.anisotropie=t.renderer.capabilities.getMaxAnisotropy();const n=new Tb(e);await Pr("Landschap vormen…",.1);const i=new nb(Number(Ri.get("seed")??1));await Pr("Texturen maken…",.35);const s=new Cb(i.terrein,e);await s.init(),t.scene.add(s.groep);const o=Ri.has("demo"),a=Ri.get("test");a&&(ob(i),i.snelheid=0),o&&(await Pr("Voorbeeldstad bouwen…",.55),rb(i,Number(Ri.get("groei")??1800))),await Pr("Bossen planten…",.7);const l=new Jb(i,n);t.scene.add(l.groep);const c=new bb(t.camera,t.renderer.domElement,i.terrein),h=a&&pm[a],u=(Ri.get("cam")??(h?`${h[0]},${h[1]},95,0,88`:o?"-260,-60,420,215,38":"-150,0,520,30,48")).split(",").map(Number);c.zet(u[0],u[1],u[2],u[3],u[4]),l.werkBij(1e9),s.werkBij(),l.props.werkBij(t.camera.position,0,!0);const d=new sb(i),f=new tS(i);t.scene.add(f.groep);const p=new sS(i),x=new lS(i,t.camera);new Sf(d,I=>{l.zones.toonAlles=I,l.zones.vuil=!0});const m=document.getElementById("tip"),g=document.getElementById("melding"),y=new om,v=new Z;let _={x:-1,y:-1},E=null;const b=()=>{if(_.x<0||Sf.boven(_.x,_.y))return null;v.set(_.x/innerWidth*2-1,-(_.y/innerHeight)*2+1),y.setFromCamera(v,t.camera);const I=y.ray.origin,D=y.ray.direction;return i.terrein.straal({x:I.x,y:I.y,z:I.z},{x:D.x,y:D.y,z:D.z})},w=t.renderer.domElement;w.addEventListener("pointermove",I=>{_={x:I.clientX,y:I.clientY}}),w.addEventListener("pointerleave",()=>{_={x:-1,y:-1}}),w.addEventListener("pointerdown",I=>{I.button===0&&d.klik(b()),I.button===2&&(E={x:I.clientX,y:I.clientY})}),addEventListener("pointerup",I=>{I.button===0&&d.los(),I.button===2&&E&&Math.hypot(I.clientX-E.x,I.clientY-E.y)<5&&d.terug(),E=null});const C=document.createElement("div");if(C.className="hulp paneel",C.innerHTML=`<b>Bouwen</b><br>Wegen: klik begin- en eindpunt (bocht: C).<br>Zones: Z, sleep met het penseel.<br>Rechts klikken stopt.<br>${o?"":'<button class="knop" id="demo-knop" style="margin-top:8px;width:100%">Voorbeeldstad laden</button>'}`,document.body.appendChild(C),document.getElementById("demo-knop")?.addEventListener("click",()=>{location.search="?demo=1"}),await Pr("Klaar",1),await e.wacht(),document.getElementById("laden").classList.add("weg"),window.__stad={wereld:i,stad:l,sfeer:t,camera:c,gereedschap:d,bron:e,THREE:L1},Ri.has("shot")){for(let U=0;U<200&&l.bezig;U++)l.werkBij(1e9);l.props.werkBij(t.camera.position,0,!0),await e.wacht(),p.werkBij();const I=(Ri.get("verberg")??"").split(",");if(I.includes("zones")&&(l.zones.mesh.visible=!1),I.includes("ao")&&t.ao&&(t.ao.enabled=!1),I.includes("ui"))for(const U of["hud","werkbalk"])document.getElementById(U).style.display="none";I.includes("ui")&&(C.style.display="none"),t.volg(c.doel,c.afstand);const D=performance.now();t.render(),I.includes("labels")||x.werkBij(1,c.afstand);const O=t.renderer.info.render;console.log(`frame ${Math.round(performance.now()-D)} ms, ${O.triangles} driehoeken, ${O.calls} draw calls`),document.body.dataset.klaar="1";return}let S=performance.now(),M=0,P=0;const N=I=>{const D=Math.min(.1,(I-S)/1e3);S=I,P+=D,c.stap(D),i.stap(D);const O=b();d.beweeg(O),d.stap(D),l.werkBij(8),s.werkBij(),s.tik(P),l.props.werkBij(t.camera.position,D);const U=d.voorbeeld();f.toon(U);const Y=U.soort==="weg"?U.as.length?U.tekst:"":U.soort==="markeer"?U.tekst:"";m.style.display=Y&&O?"block":"none",m.textContent=Y,m.className=U.soort==="weg"&&!U.geldig?"fout":"",m.style.left=_.x+"px",m.style.top=_.y+"px",g.style.display=d.melding?"block":"none",g.textContent=d.melding,M+=D,M>.25&&(M=0,p.werkBij()),t.volg(c.doel,c.afstand),t.render(),x.werkBij(D,c.afstand),requestAnimationFrame(N)};requestAnimationFrame(N)}hS().catch(r=>{ym.textContent="Fout: "+(r?.message??r),console.error(r)});
