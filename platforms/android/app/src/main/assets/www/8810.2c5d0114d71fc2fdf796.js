(self.webpackChunkerpp_movil=self.webpackChunkerpp_movil||[]).push([[8810],{98810:(t,e,n)=>{"use strict";n.r(e),n.d(e,{StreetviewPageModule:()=>m});var o=n(61116),a=n(11462),i=n(54812),s=n(9069),r=n(64762),p=n(87368);const c=[{path:"",component:(()=>{class t{constructor(t,e){this.route=t,this.router=e}ngOnInit(){return(0,r.mG)(this,void 0,void 0,function*(){this.route.queryParams.subscribe(t=>{this.router.getCurrentNavigation().extras.state&&(this.Data=this.router.getCurrentNavigation().extras.state.position,this.loadMap(this.Data))})})}loadMap(t){console.log(t);var e=new google.maps.Map(document.getElementById("maps"),{center:t,zoom:14}),n=new google.maps.StreetViewPanorama(document.getElementById("pano_canvas"),{position:t,pov:{heading:34,pitch:10}});e.setStreetView(n)}}return t.\u0275fac=function(e){return new(e||t)(p.Y36(s.gz),p.Y36(s.F0))},t.\u0275cmp=p.Xpm({type:t,selectors:[["app-streetview"]],decls:2,vars:0,consts:[["id","pano_canvas"],["id","maps"]],template:function(t,e){1&t&&(p.TgZ(0,"div",0),p._UZ(1,"div",1),p.qZA())},styles:["#pano_canvas[_ngcontent-%COMP%]{height:100%;position:relative!important}#maps[_ngcontent-%COMP%]{bottom:5%;left:5%;width:150px;height:150px;position:absolute!important;z-index:2}"]}),t})()}];let u=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=p.oAB({type:t}),t.\u0275inj=p.cJS({imports:[[s.Bz.forChild(c)],s.Bz]}),t})(),m=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=p.oAB({type:t}),t.\u0275inj=p.cJS({imports:[[o.ez,a.u5,i.Pc,u]]}),t})()}}]);