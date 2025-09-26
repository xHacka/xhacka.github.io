# Old 34    Javascript (Debug)

URL: [https://webhacking.kr/challenge/js-7/index.php](https://webhacking.kr/challenge/js-7/index.php)

Upon visiting the website we get an `alert`:

![old-34.png](/assets/ctf/webhacking.kr/old-34.png)

```html

<html>
<head>
<title>Challenge 34</title>
<script>
var a=['RcOhTDV1Ew==','McOVwqpRBg==','c8K/w43DvcK8','SsOrTCF1CVDCgcKLEsKc','NsK/w4Bc','G1TDpwk=','AcKtwqfDlW7Dsw==','e3kkcQJfwoNFDEU9','QMOXDBo=','w5bCsWlh','eWY6bg8=','FnbDoEvDtl1LUkB7w4Q=','esOZTiPDsg==','bzfCkFfCtA==','ZmzDjHcn','PxLCm3LDvA==','IcKlVy9pw57DgMK3w6kmwpvCiUnDhcOKw4A=','LMKnwqECawEeEMOZQsK7wrLCscKpSG1AwqvDvjnDpMKhOSDCqQfDmVRowo1nwpzCh8OGc1vDv3cKVR/CgMK4w7PCukbCv8O8woNHXcK7SsOmMhHDnUEJw4lsw6g=','wrTDnltl','UMOXHRs=','Tz0lw48=','O8K0w5JcwrA=','w5DCpnx/LA==','HsKrS8KVQw==','dcKvfnkhUQ3DncOFIsOew5lHwr7CjcKYAsOuwrc3UjhfwopNwqwuWcOjw4PDrkIRWAfCnSIdw5jDtsKyWFBMwq4YMQvDhRrCrlBlw71LUR5HGMKwEBs=','w4RAw5xg','RkQSNA==','SsOsQztv','wonDvMOwwow=','wovDlMKvw5nCog==','w73Ch8K5VcK/','wpN7HsOMwpI=','w5/CuMKDacOKPcKoB3jDomQ=','wpnDvMOhwo0=','wp4xwrvDvA==','H1LDrhc=','wo86woHDm37Dow==','woY4wobDmg==','wr/CgMKQNcOo','ecOlUSF2S3fCsMKbGQ==','E3nCrcKe','w5d5w6HDnsOFw7RcRFjDosKsZ8OHEcOv','QMOXDBrCrcKLwp3DvA==','w5fDsiPDrsOf','V3c3A0Q=','E8OjwpNaP1lDTMKXcsO5','G08JPDZMw5s8w4ITw54dEMKAwps=','wo8pwoXDnmg=','wpo5wqvDoMOQw6Jd','bH4+TyM='];(function(c,d){var e=function(f){while(--f){c['push'](c['shift']());}};var g=function(){var h={'data':{'key':'cookie','value':'timeout'},'setCookie':function(i,j,k,l){l=l||{};var m=j+'='+k;var n=0x0;for(var n=0x0,p=i['length'];n<p;n++){var q=i[n];m+=';\x20'+q;var r=i[q];i['push'](r);p=i['length'];if(r!==!![]){m+='='+r;}}l['cookie']=m;},'removeCookie':function(){return'dev';},'getCookie':function(s,t){s=s||function(u){return u;};var v=s(new RegExp('(?:^|;\x20)'+t['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var w=function(x,y){x(++y);};w(e,d);return v?decodeURIComponent(v[0x1]):undefined;}};var z=function(){var A=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return A['test'](h['removeCookie']['toString']());};h['updateCookie']=z;var B='';var C=h['updateCookie']();if(!C){h['setCookie'](['*'],'counter',0x1);}else if(C){B=h['getCookie'](null,'counter');}else{h['removeCookie']();}};g();}(a,0xa2));var b=function(c,d){c=c-0x0;var e=a[c];if(b['clOwyu']===undefined){(function(){var f=function(){var g;try{g=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(h){g=window;}return g;};var i=f();var j='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';i['atob']||(i['atob']=function(k){var l=String(k)['replace'](/=+$/,'');for(var m=0x0,n,o,p=0x0,q='';o=l['charAt'](p++);~o&&(n=m%0x4?n*0x40+o:o,m++%0x4)?q+=String['fromCharCode'](0xff&n>>(-0x2*m&0x6)):0x0){o=j['indexOf'](o);}return q;});}());var r=function(s,d){var u=[],v=0x0,w,x='',y='';s=atob(s);for(var z=0x0,A=s['length'];z<A;z++){y+='%'+('00'+s['charCodeAt'](z)['toString'](0x10))['slice'](-0x2);}s=decodeURIComponent(y);for(var B=0x0;B<0x100;B++){u[B]=B;}for(B=0x0;B<0x100;B++){v=(v+u[B]+d['charCodeAt'](B%d['length']))%0x100;w=u[B];u[B]=u[v];u[v]=w;}B=0x0;v=0x0;for(var C=0x0;C<s['length'];C++){B=(B+0x1)%0x100;v=(v+u[B])%0x100;w=u[B];u[B]=u[v];u[v]=w;x+=String['fromCharCode'](s['charCodeAt'](C)^u[(u[B]+u[v])%0x100]);}return x;};b['wxbdQn']=r;b['ZjQald']={};b['clOwyu']=!![];}var D=b['ZjQald'][c];if(D===undefined){if(b['XvSLaK']===undefined){var E=function(F){this['swkpev']=F;this['DGOTpS']=[0x1,0x0,0x0];this['zlbdZJ']=function(){return'newState';};this['KCuPKs']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['AnZPoE']='[\x27|\x22].+[\x27|\x22];?\x20*}';};E['prototype']['DCDTIR']=function(){var G=new RegExp(this['KCuPKs']+this['AnZPoE']);var H=G['test'](this['zlbdZJ']['toString']())?--this['DGOTpS'][0x1]:--this['DGOTpS'][0x0];return this['ZjMdYn'](H);};E['prototype']['ZjMdYn']=function(I){if(!Boolean(~I)){return I;}return this['LqSTke'](this['swkpev']);};E['prototype']['LqSTke']=function(J){for(var K=0x0,L=this['DGOTpS']['length'];K<L;K++){this['DGOTpS']['push'](Math['round'](Math['random']()));L=this['DGOTpS']['length'];}return J(this['DGOTpS'][0x0]);};new E(b)['DCDTIR']();b['XvSLaK']=!![];}e=b['wxbdQn'](e,d);b['ZjQald'][c]=e;}else{e=D;}return e;};var e=function(){var c=!![];return function(d,e){var f=c?function(){if(e){var g=e['apply'](d,arguments);e=null;return g;}}:function(){};c=![];return f;};}();var Q=e(this,function(){var c=function(){return'\x64\x65\x76';},d=function(){return'\x77\x69\x6e\x64\x6f\x77';};var e=function(){var f=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!f['\x74\x65\x73\x74'](c['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var g=function(){var h=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return h['\x74\x65\x73\x74'](d['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var i=function(j){var k=~-0x1>>0x1+0xff%0x0;if(j['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===k)){l(j);}};var l=function(m){var n=~-0x4>>0x1+0xff%0x0;if(m['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==n){i(m);}};if(!e()){if(!g()){i('\x69\x6e\x64\u0435\x78\x4f\x66');}else{i('\x69\x6e\x64\x65\x78\x4f\x66');}}else{i('\x69\x6e\x64\u0435\x78\x4f\x66');}});Q();var q=function(){var r=!![];return function(s,t){var u=r?function(){if(b('0x0','hezG')!==b('0x1','A6hd')){if(t){if(b('0x2','G(vo')===b('0x3','K*$C')){q(this,function(){var j=new RegExp(b('0x4','$VvG'));var k=new RegExp(b('0x5','2@LG'),'i');var l=H(b('0x6','k(C)'));if(!j[b('0x7','14cN')](l+'chain')||!k[b('0x8','aEot')](l+b('0x9','ln]I'))){l('0');}else{H();}})();}else{var z=t[b('0xa','$ybZ')](s,arguments);t=null;return z;}}}else{var f=r?function(){if(t){var g=t[b('0xb','C%Xw')](s,arguments);t=null;return g;}}:function(){};r=![];return f;}}:function(){};r=![];return u;};}();(function(){q(this,function(){var D=new RegExp('function\x20*\x5c(\x20*\x5c)');var E=new RegExp(b('0xc','RLUb'),'i');var F=H(b('0xd','iWKi'));if(!D[b('0xe','ho]6')](F+b('0xf','RLUb'))||!E[b('0x10','X!$R')](F+b('0x11','RUTX'))){if(b('0x12','J[i1')===b('0x13','Pa4(')){F('0');}else{(function(){return!![];}[b('0x14','kK4Z')](b('0x15','X!$R')+b('0x16','llaF'))[b('0x17','3R^0')](b('0x18','iUmC')));}}else{H();}})();}());setInterval(function(){H();},0xfa0);if(location[b('0x19','iUmC')][b('0x1a','6]r1')](0x1)==b('0x1b','RLUb'))location[b('0x1c','4c%d')]=b('0x1d','llaF');else alert(b('0x1e','14cN'));function H(I){function J(K){if(b('0x1f','oYXf')!==b('0x20','ho]6')){return J;}else{if(typeof K==='string'){return function(M){}[b('0x21','2@LG')](b('0x22','joDm'))[b('0x23','iUmC')](b('0x24','llaF'));}else{if('thtMU'===b('0x25','Am%6')){if((''+K/K)[b('0x26','RLUb')]!==0x1||K%0x14===0x0){if(b('0x27','2@LG')!==b('0x28','bO4C')){return!![];}else{(function(){return!![];}[b('0x29','RLUb')](b('0x2a','ln]I')+b('0x2b','3R^0'))['call'](b('0x2c','c3hQ')));}}else{(function(){return![];}[b('0x2d','Am%6')](b('0x2e','14cN')+b('0x2f','$ybZ'))[b('0x30','Am%6')](b('0x31','O!T!')));}}else{H();}}J(++K);}}try{if(I){return J;}else{J(0x0);}}catch(P){}}
</script>
</head>
<body bgcolor="black">
```

Deobfuscate Javascript with [https://deobfuscate.io](https://deobfuscate.io) or [https://deobfuscate.relative.im](https://deobfuscate.relative.im)

```js
var a = ["RcOhTDV1Ew==", "McOVwqpRBg==", "c8K/w43DvcK8", "SsOrTCF1CVDCgcKLEsKc", "NsK/w4Bc", "G1TDpwk=", "AcKtwqfDlW7Dsw==", "e3kkcQJfwoNFDEU9", "QMOXDBo=", "w5bCsWlh", "eWY6bg8=", "FnbDoEvDtl1LUkB7w4Q=", "esOZTiPDsg==", "bzfCkFfCtA==", "ZmzDjHcn", "PxLCm3LDvA==", "IcKlVy9pw57DgMK3w6kmwpvCiUnDhcOKw4A=", "LMKnwqECawEeEMOZQsK7wrLCscKpSG1AwqvDvjnDpMKhOSDCqQfDmVRowo1nwpzCh8OGc1vDv3cKVR/CgMK4w7PCukbCv8O8woNHXcK7SsOmMhHDnUEJw4lsw6g=", "wrTDnltl", "UMOXHRs=", "Tz0lw48=", "O8K0w5JcwrA=", "w5DCpnx/LA==", "HsKrS8KVQw==", "dcKvfnkhUQ3DncOFIsOew5lHwr7CjcKYAsOuwrc3UjhfwopNwqwuWcOjw4PDrkIRWAfCnSIdw5jDtsKyWFBMwq4YMQvDhRrCrlBlw71LUR5HGMKwEBs=", "w4RAw5xg", "RkQSNA==", "SsOsQztv", "wonDvMOwwow=", "wovDlMKvw5nCog==", "w73Ch8K5VcK/", "wpN7HsOMwpI=", "w5/CuMKDacOKPcKoB3jDomQ=", "wpnDvMOhwo0=", "wp4xwrvDvA==", "H1LDrhc=", "wo86woHDm37Dow==", "woY4wobDmg==", "wr/CgMKQNcOo", "ecOlUSF2S3fCsMKbGQ==", "E3nCrcKe", "w5d5w6HDnsOFw7RcRFjDosKsZ8OHEcOv", "QMOXDBrCrcKLwp3DvA==", "w5fDsiPDrsOf", "V3c3A0Q=", "E8OjwpNaP1lDTMKXcsO5", "G08JPDZMw5s8w4ITw54dEMKAwps=", "wo8pwoXDnmg=", "wpo5wqvDoMOQw6Jd", "bH4+TyM="];
(function (c, d) {
  var e = function (f) {
    while (--f) {
      c.push(c.shift());
    }
  };
  var g = function () {
    var h = {data: {key: "cookie", value: "timeout"}, setCookie: function (i, j, k, l) {
      l = l || {};
      var m = j + "=" + k;
      var n = 0;
      for (var n = 0, p = i.length; n < p; n++) {
        var q = i[n];
        m += "; " + q;
        var r = i[q];
        i.push(r);
        p = i.length;
        if (r !== true) {
          m += "=" + r;
        }
      }
      l.cookie = m;
    }, removeCookie: function () {
      return "dev";
    }, getCookie: function (s, t) {
      s = s || function (u) {
        return u;
      };
      var v = s(new RegExp("(?:^|; )" + t.replace(/([.$?*|{}()[]\/+^])/g, "$1") + "=([^;]*)"));
      var w = function (x, y) {
        x(++y);
      };
      w(e, d);
      return v ? decodeURIComponent(v[1]) : undefined;
    }};
    var z = function () {
      var A = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
      return A.test(h.removeCookie.toString());
    };
    h.updateCookie = z;
    var B = "";
    var C = h.updateCookie();
    if (!C) {
      h.setCookie(["*"], "counter", 1);
    } else if (C) {
      B = h.getCookie(null, "counter");
    } else {
      h.removeCookie();
    }
  };
  g();
}(a, 162));
var b = function (c, d) {
  c = c - 0;
  var e = a[c];
  if (b.clOwyu === undefined) {
    (function () {
      var f = function () {
        var g;
        try {
          g = Function('return (function() {}.constructor("return this")( ));')();
        } catch (h) {
          g = window;
        }
        return g;
      };
      var i = f();
      var j = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      i.atob || (i.atob = function (k) {
        var l = String(k).replace(/=+$/, "");
        for (var m = 0, n, o, p = 0, q = ""; o = l.charAt(p++); ~o && (n = m % 4 ? n * 64 + o : o, m++ % 4) ? q += String.fromCharCode(255 & n >> (-2 * m & 6)) : 0) {
          o = j.indexOf(o);
        }
        return q;
      });
    }());
    var r = function (s, d) {
      var u = [], v = 0, w, x = "", y = "";
      s = atob(s);
      for (var z = 0, A = s.length; z < A; z++) {
        y += "%" + ("00" + s.charCodeAt(z).toString(16)).slice(-2);
      }
      s = decodeURIComponent(y);
      for (var B = 0; B < 256; B++) {
        u[B] = B;
      }
      for (B = 0; B < 256; B++) {
        v = (v + u[B] + d.charCodeAt(B % d.length)) % 256;
        w = u[B];
        u[B] = u[v];
        u[v] = w;
      }
      B = 0;
      v = 0;
      for (var C = 0; C < s.length; C++) {
        B = (B + 1) % 256;
        v = (v + u[B]) % 256;
        w = u[B];
        u[B] = u[v];
        u[v] = w;
        x += String.fromCharCode(s.charCodeAt(C) ^ u[(u[B] + u[v]) % 256]);
      }
      return x;
    };
    b.wxbdQn = r;
    b.ZjQald = {};
    b.clOwyu = true;
  }
  var D = b.ZjQald[c];
  if (D === undefined) {
    if (b.XvSLaK === undefined) {
      var E = function (F) {
        this.swkpev = F;
        this.DGOTpS = [1, 0, 0];
        this.zlbdZJ = function () {
          return "newState";
        };
        this.KCuPKs = "\\w+ *\\(\\) *{\\w+ *";
        this.AnZPoE = "['|\"].+['|\"];? *}";
      };
      E.prototype.DCDTIR = function () {
        var G = new RegExp(this.KCuPKs + this.AnZPoE);
        var H = G.test(this.zlbdZJ.toString()) ? --this.DGOTpS[1] : --this.DGOTpS[0];
        return this.ZjMdYn(H);
      };
      E.prototype.ZjMdYn = function (I) {
        if (!Boolean(~I)) {
          return I;
        }
        return this.LqSTke(this.swkpev);
      };
      E.prototype.LqSTke = function (J) {
        for (var K = 0, L = this.DGOTpS.length; K < L; K++) {
          this.DGOTpS.push(Math.round(Math.random()));
          L = this.DGOTpS.length;
        }
        return J(this.DGOTpS[0]);
      };
      new E(b).DCDTIR();
      b.XvSLaK = true;
    }
    e = b.wxbdQn(e, d);
    b.ZjQald[c] = e;
  } else {
    e = D;
  }
  return e;
};
var e = function () {
  var c = true;
  return function (d, e) {
    var f = c ? function () {
      if (e) {
        var g = e.apply(d, arguments);
        e = null;
        return g;
      }
    } : function () {};
    c = false;
    return f;
  };
}();
var Q = e(this, function () {
  var e = function () {
    var f = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
    return !f.test(c.toString());
  };
  var g = function () {
    var h = new RegExp("(\\\\[x|u](\\w){2,4})+");
    return h.test(d.toString());
  };
  var i = function (j) {
    var k = 0;
    if (j.indexOf("i" === k)) {
      l(j);
    }
  };
  var l = function (m) {
    var n = 3;
    if (m.indexOf("true"[3]) !== n) {
      i(m);
    }
  };
  if (!e()) {
    if (!g()) {
      i("indеxOf");
    } else {
      i("indexOf");
    }
  } else {
    i("indеxOf");
  }
});
Q();
var q = function () {
  var r = true;
  return function (s, t) {
    var u = r ? function () {
      if (b("0x0", "hezG") !== b("0x1", "A6hd")) {
        if (t) {
          if (b("0x2", "G(vo") === b("0x3", "K*$C")) {
            q(this, function () {
              var j = new RegExp(b("0x4", "$VvG"));
              var k = new RegExp(b("0x5", "2@LG"), "i");
              var l = H(b("0x6", "k(C)"));
              if (!j[b("0x7", "14cN")](l + "chain") || !k[b("0x8", "aEot")](l + b("0x9", "ln]I"))) {
                l("0");
              } else {
                H();
              }
            })();
          } else {
            var z = t[b("0xa", "$ybZ")](s, arguments);
            t = null;
            return z;
          }
        }
      } else {
        var f = r ? function () {
          if (t) {
            var g = t[b("0xb", "C%Xw")](s, arguments);
            t = null;
            return g;
          }
        } : function () {};
        r = false;
        return f;
      }
    } : function () {};
    r = false;
    return u;
  };
}();
(function () {
  q(this, function () {
    var D = new RegExp("function *\\( *\\)");
    var E = new RegExp(b("0xc", "RLUb"), "i");
    var F = H(b("0xd", "iWKi"));
    if (!D[b("0xe", "ho]6")](F + b("0xf", "RLUb")) || !E[b("0x10", "X!$R")](F + b("0x11", "RUTX"))) {
      if (b("0x12", "J[i1") === b("0x13", "Pa4(")) {
        F("0");
      } else {
        (function () {
          return true;
        }[b("0x14", "kK4Z")](b("0x15", "X!$R") + b("0x16", "llaF"))[b("0x17", "3R^0")](b("0x18", "iUmC")));
      }
    } else {
      H();
    }
  })();
}());
setInterval(function () {
  H();
}, 4e3);
if (location[b("0x19", "iUmC")][b("0x1a", "6]r1")](1) == b("0x1b", "RLUb")) location[b("0x1c", "4c%d")] = b("0x1d", "llaF"); else alert(b("0x1e", "14cN"));
function H(I) {
  function J(K) {
    if (b("0x1f", "oYXf") !== b("0x20", "ho]6")) {
      return J;
    } else {
      if (typeof K === "string") {
        return function (M) {}[b("0x21", "2@LG")](b("0x22", "joDm"))[b("0x23", "iUmC")](b("0x24", "llaF"));
      } else {
        if ("thtMU" === b("0x25", "Am%6")) {
          if (("" + K / K)[b("0x26", "RLUb")] !== 1 || K % 20 === 0) {
            if (b("0x27", "2@LG") !== b("0x28", "bO4C")) {
              return true;
            } else {
              (function () {
                return true;
              }[b("0x29", "RLUb")](b("0x2a", "ln]I") + b("0x2b", "3R^0")).call(b("0x2c", "c3hQ")));
            }
          } else {
            (function () {
              return false;
            }[b("0x2d", "Am%6")](b("0x2e", "14cN") + b("0x2f", "$ybZ"))[b("0x30", "Am%6")](b("0x31", "O!T!")));
          }
        } else {
          H();
        }
      }
      J(++K);
    }
  }
  try {
    if (I) {
      return J;
    } else {
      J(0);
    }
  } catch (P) {}
}
```

Line looks interesting as it's using `alert` and `location`
```js
if (location[b("0x19", "iUmC")][b("0x1a", "6]r1")](1) == b("0x1b", "RLUb")) location[b("0x1c", "4c%d")] = b("0x1d", "llaF"); else alert(b("0x1e", "14cN"));
```

```js
> console.log(b("0x19", "iUmC"))
VM389:1 hash
> console.log(b("0x1a", "6]r1"))
VM389:2 slice
> console.log(b("0x1b", "RLUb"))
VM389:3 Passw0RRdd
> console.log(b("0x1c", "4c%d"))
VM389:4 href
> console.log(b("0x1d", "llaF"))
VM389:5 ./?Passw0RRdd=1
> console.log(b("0x1e", "14cN"))
VM389:6 debug me
```

Navigate to [https://webhacking.kr/challenge/js-7/?Passw0RRdd=1](https://webhacking.kr/challenge/js-7/?Passw0RRdd=1)

![old-34-1.png](/assets/ctf/webhacking.kr/old-34-1.png)

	