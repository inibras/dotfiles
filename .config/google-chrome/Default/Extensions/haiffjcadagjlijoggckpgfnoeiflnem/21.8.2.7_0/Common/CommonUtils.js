var g;(function(g){if(!g._0XdL){g._0XdL={};}g._0XdL.xPEhH=function(D3iuT){var G9j6S=D3iuT[(0x18c8+2624-0x2308)].bounds.left;var _JUe9=D3iuT[(0x1324+477-0x1501)].bounds.top;var eakBo=(D3iuT[(0x13d6+4642-0x25f8)].bounds.left+D3iuT[(0xc3+7933-0x1fc0)].bounds.width);var EirmD=(D3iuT[(0x109c+5685-0x26d1)].bounds.top+D3iuT[(0xf9a+4428-0x20e6)].bounds.height);var SvDTf=[];SvDTf.push(D3iuT[(0x5a3+4805-0x1868)].bounds);if(D3iuT.length==(0x20d6+1230-0x25a3)){return{MJVsr:false,Gj_Bc:{left:G9j6S,right:eakBo,top:_JUe9,bottom:EirmD},SvDTf:SvDTf};}SvDTf=[];for(var XMC0D=(0x14b9+2760-0x1f81);XMC0D<D3iuT.length;XMC0D++){if(G9j6S>D3iuT[XMC0D].bounds.left){G9j6S=D3iuT[XMC0D].bounds.left;}if(_JUe9>D3iuT[XMC0D].bounds.top){_JUe9=D3iuT[XMC0D].bounds.top;}if(eakBo<(D3iuT[XMC0D].bounds.left+D3iuT[XMC0D].bounds.width)){eakBo=(D3iuT[XMC0D].bounds.left+D3iuT[XMC0D].bounds.width);}var height=D3iuT[XMC0D].bounds.height;if(EirmD<(D3iuT[XMC0D].bounds.top+D3iuT[XMC0D].bounds.height)){EirmD=(D3iuT[XMC0D].bounds.top+D3iuT[XMC0D].bounds.height);}SvDTf.push({left:D3iuT[XMC0D].bounds.left,top:D3iuT[XMC0D].bounds.top,width:D3iuT[XMC0D].bounds.width,height:height});}for(var XMC0D=(0x797+2513-0x1168);XMC0D<D3iuT.length;XMC0D++){D3iuT[XMC0D].bounds.left-=G9j6S;D3iuT[XMC0D].workArea.left-=G9j6S;D3iuT[XMC0D].bounds.top-=_JUe9;D3iuT[XMC0D].workArea.top-=_JUe9;}eakBo-=G9j6S;EirmD-=_JUe9;var devicePixelRatio=window.devicePixelRatio;if(!devicePixelRatio){devicePixelRatio=(0x631+6038-0x1dc6);}var v9Ejf=-(0x1847+1360-0x1d96),af72y=(0x679+8269-0x26c6),EOVnB=true;for(var EuG3B=(0x112+4158-0x1150);EuG3B<D3iuT.length;EuG3B++){var display=D3iuT[EuG3B];if(v9Ejf===-(0x16f7+1900-0x1e62)&&Math.floor(screen.width*devicePixelRatio)===display["\x62\x6f\x75\x6e\x64\x73"].width&&Math.floor(screen.height*devicePixelRatio)===display["\x62\x6f\x75\x6e\x64\x73"].height){v9Ejf=EuG3B;}af72y+=display["\x62\x6f\x75\x6e\x64\x73"].width;EOVnB=(EOVnB&&(Math.abs(Math.floor(screen.height*devicePixelRatio)-display["\x62\x6f\x75\x6e\x64\x73"].height)<=D3iuT.length));}var ETg6i=(Math.abs(Math.floor(screen.width*devicePixelRatio)-af72y));if(v9Ejf===-(0x1531+2221-0x1ddd)&&ETg6i<=D3iuT.length&&EOVnB===true){if(ETg6i>(0xf96+156-0x1032)){D3iuT[D3iuT.length-(0x14b3+1141-0x1927)]["\x62\x6f\x75\x6e\x64\x73"].width-=ETg6i;D3iuT[D3iuT.length-(0x1169+1489-0x1739)]["\x77\x6f\x72\x6b\x41\x72\x65\x61"].width-=ETg6i;}if(devicePixelRatio!=(0x43f+1256-0x926)){ky44h(D3iuT,devicePixelRatio);}return{MJVsr:true,Gj_Bc:{left:G9j6S,right:eakBo,top:_JUe9,bottom:EirmD},SvDTf:SvDTf};}return{MJVsr:false,Gj_Bc:{left:G9j6S,right:eakBo,top:_JUe9,bottom:EirmD},SvDTf:SvDTf};};function ky44h(D3iuT,devicePixelRatio){for(var XMC0D=(0x1b7c+52-0x1bb0);XMC0D<D3iuT.length;XMC0D++){var display=D3iuT[XMC0D];if(display["\x62\x6f\x75\x6e\x64\x73"]){display["\x62\x6f\x75\x6e\x64\x73"].left=Math.floor(display["\x62\x6f\x75\x6e\x64\x73"].left/devicePixelRatio);display["\x62\x6f\x75\x6e\x64\x73"].top=Math.floor(display["\x62\x6f\x75\x6e\x64\x73"].top/devicePixelRatio);display["\x62\x6f\x75\x6e\x64\x73"].width=Math.floor(display["\x62\x6f\x75\x6e\x64\x73"].width/devicePixelRatio);display["\x62\x6f\x75\x6e\x64\x73"].height=Math.floor(display["\x62\x6f\x75\x6e\x64\x73"].height/devicePixelRatio);}if(display["\x77\x6f\x72\x6b\x41\x72\x65\x61"]){display["\x77\x6f\x72\x6b\x41\x72\x65\x61"].left=Math.floor(display["\x77\x6f\x72\x6b\x41\x72\x65\x61"].left/devicePixelRatio);display["\x77\x6f\x72\x6b\x41\x72\x65\x61"].top=Math.floor(display["\x77\x6f\x72\x6b\x41\x72\x65\x61"].top/devicePixelRatio);display["\x77\x6f\x72\x6b\x41\x72\x65\x61"].width=Math.floor(display["\x77\x6f\x72\x6b\x41\x72\x65\x61"].width/devicePixelRatio);display["\x77\x6f\x72\x6b\x41\x72\x65\x61"].height=Math.floor(display["\x77\x6f\x72\x6b\x41\x72\x65\x61"].height/devicePixelRatio);};}};g._0XdL.UuDUd=function(){var yYJBl=window.document;var LzLr8=yYJBl.createElement("\x63\x61\x6e\x76\x61\x73");LzLr8.style.left=-(0x799+2124-0xbfd)+"\x70\x78";LzLr8.style.top=-(0x1137+493-0xf3c)+"\x70\x78";var daR2s=yYJBl.createElement("\x63\x61\x6e\x76\x61\x73");daR2s.style.left=-(0x1288+4243-0x1f33)+"\x70\x78";daR2s.style.top=-(0x109f+3624-0x1adf)+"\x70\x78";daR2s.width=(0x16ff+1196-0x1b8b);daR2s.height=(0x99b+6687-0x239a);var HkzPP=daR2s.getContext("\x32\x64");function RZPTa(data){LzLr8.height=data.height;LzLr8.width=data.width;var context=LzLr8.getContext("\x32\x64");var nCD9k=context.getImageData((0x76f+2275-0x1052),(0xd5c+4538-0x1f16),data.width,data.height);var WBRQC=nCD9k.data;WBRQC.set(new Uint8Array(data.iGC7p.SiiwA.buffer));context.putImageData(nCD9k,(0x48d+4093-0x148a),(0x2bc+3615-0x10db));HkzPP.clearRect((0xc57+5946-0x2391),(0x713+3683-0x1576),daR2s.width,daR2s.height);HkzPP.drawImage(LzLr8,(0x791+1817-0xeaa),(0x333+1103-0x782),LzLr8.width,LzLr8.height,(0xac2+3490-0x1864),(0xa63+3389-0x17a0),daR2s.width,daR2s.height);return daR2s.toDataURL();};return{RZPTa:RZPTa};};var m7fM6=(function(){function m7fM6(D6Yle){this.ozI2t=D6Yle;this.xRk82={};this.init();};m7fM6.prototype.init=function(){for(var method in Object.getPrototypeOf(this.ozI2t)){if(this.ozI2t[method].IBLpc){this.xRk82[this.ozI2t[method].IBLpc]=method;};}};m7fM6.prototype.TOLzv=function(key,pwq2o){var mWoWo=this.ozI2t[this.xRk82[key]];if(mWoWo){this.ozI2t[this.xRk82[key]](pwq2o);}};return m7fM6;})();g._0XdL.nYWbY=m7fM6;})(g||(g={}));