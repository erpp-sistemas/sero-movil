(self.webpackChunkerpp_movil=self.webpackChunkerpp_movil||[]).push([[1358],{31358:(i,t,o)=>{"use strict";o.r(t),o.d(t,{Tab2PageModule:()=>x});var e=o(54812),n=o(61116),r=o(11462),s=o(60940),a=o(9069),c=o(64762),l=o(87368),d=o(18372),p=o(75919),h=o(42590);function g(i,t){if(1&i&&(l.TgZ(0,"ion-select-option",9),l._uU(1),l.ALo(2,"titlecase"),l.qZA()),2&i){const i=t.$implicit;l.Q6J("value",i.id_plaza),l.xp6(1),l.hij("",l.lcZ(2,2,i.plaza)," ")}}function u(i,t){if(1&i&&l._UZ(0,"ion-icon",14),2&i){const i=l.oxw().$implicit;l.Q6J("name",i.icono_app_movil)}}function v(i,t){if(1&i&&l._UZ(0,"img",15),2&i){const i=l.oxw().$implicit;l.Q6J("src",i.icono_app_movil,l.LSH)}}function m(i,t){if(1&i){const i=l.EpF();l.TgZ(0,"ion-card",11),l.NdJ("click",function(){const t=l.CHM(i).$implicit;return l.oxw(2).irListado(t.id_servicio)}),l.TgZ(1,"ion-card-header"),l.YNc(2,u,1,1,"ion-icon",12),l.YNc(3,v,1,1,"img",13),l.qZA(),l.TgZ(4,"ion-card-content"),l.TgZ(5,"h3"),l._uU(6),l.qZA(),l.qZA(),l.qZA()}if(2&i){const i=t.$implicit;l.xp6(2),l.Q6J("ngIf",i.icono_app_movil.length<15),l.xp6(1),l.Q6J("ngIf",i.icono_app_movil.length>12),l.xp6(3),l.hij(" ",i.servicio," ")}}function f(i,t){if(1&i&&(l.TgZ(0,"div"),l.YNc(1,m,7,3,"ion-card",10),l.qZA()),2&i){const i=l.oxw();l.xp6(1),l.Q6J("ngForOf",i.servicios)}}const _=[{path:"",component:(()=>{class i{constructor(i,t,o,e,n){this.router=i,this.storage=t,this.rest=o,this.auth=e,this.platform=n,this.idPlazas=[],this.plazas=[],this.descargaAgua=!1,this.descargaPredio=!1,this.descargaAntenas=!1,this.descargaPozos=!1,this.selecciona=!1}ngOnInit(){this.platform.ready().then(()=>{this.obtenerPlazasUsuario()})}ionViewDidEnter(){this.obtenerPlazasUsuario()}obtenerPlazasUsuario(){return(0,c.mG)(this,void 0,void 0,function*(){this.plazasServicios=yield this.rest.obtenerPlazasSQL(),this.id_plaza=this.plazasServicios[0].id_plaza;const i=yield this.rest.mostrarServicios(this.id_plaza);this.mostrarServicios(i)})}resultPlaza(i){return(0,c.mG)(this,void 0,void 0,function*(){console.log(i.detail.value),0!=this.id_plaza&&this.asignarSectores(this.id_plaza)})}asignarSectores(i){return(0,c.mG)(this,void 0,void 0,function*(){this.selecciona=0==i,this.servicios=yield this.rest.mostrarServicios(i),this.mostrarServicios(this.servicios)})}mostrarServicios(i){return(0,c.mG)(this,void 0,void 0,function*(){this.servicios=yield this.rest.mostrarServicios(this.id_plaza)})}irListado(i){return(0,c.mG)(this,void 0,void 0,function*(){const t=yield this.rest.mostrarServicios(this.id_plaza);console.log(t),yield this.storage.set("NombrePlazaActiva",t[0].plaza),yield this.storage.set("IdPlazaActiva",t[0].id_plaza),yield this.storage.set("IdServicioActivo",i),console.log("IdServicioActivo "+i),console.log("IdPlazaActiva "+t[0].id_plaza),console.log("NombrePlazaActiva "+t[0].plaza),this.router.navigate(["/listado-cuentas",i,this.id_plaza])})}}return i.\u0275fac=function(t){return new(t||i)(l.Y36(a.F0),l.Y36(d.Ke),l.Y36(p.v),l.Y36(h.e),l.Y36(e.t4))},i.\u0275cmp=l.Xpm({type:i,selectors:[["app-tab2"]],decls:16,vars:4,consts:[["color","medium",3,"fullscreen"],["color","medium"],["color","dark",2,"text-align","center"],[2,"color","white","font-size","16px"],[1,"texto-centrado"],[1,"datos"],["interface","popover","placeholder","Seleccionar plaza",1,"myCustomSelect","text-center",2,"color","#000000",3,"ngModel","ionChange","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],[4,"ngIf"],[3,"value"],["color","medium",3,"click",4,"ngFor","ngForOf"],["color","medium",3,"click"],["color","light",3,"name",4,"ngIf"],["style","width: 50px;",3,"src",4,"ngIf"],["color","light",3,"name"],[2,"width","50px",3,"src"]],template:function(i,t){1&i&&(l._UZ(0,"hr"),l._UZ(1,"hr"),l._UZ(2,"hr"),l._UZ(3,"hr"),l.TgZ(4,"ion-content",0),l.TgZ(5,"ion-card",1),l.TgZ(6,"ion-card-subtitle",2),l.TgZ(7,"p",3),l._uU(8,"\xbfQue quieres gestionar?"),l.qZA(),l.qZA(),l.qZA(),l._UZ(9,"hr"),l.TgZ(10,"div",4),l.TgZ(11,"p",5),l.TgZ(12,"ion-select",6),l.NdJ("ionChange",function(i){return t.resultPlaza(i)})("ngModelChange",function(i){return t.id_plaza=i}),l.YNc(13,g,3,4,"ion-select-option",7),l.qZA(),l.qZA(),l.qZA(),l._UZ(14,"hr"),l.YNc(15,f,2,1,"div",8),l.qZA()),2&i&&(l.xp6(4),l.Q6J("fullscreen",!0),l.xp6(8),l.Q6J("ngModel",t.id_plaza),l.xp6(1),l.Q6J("ngForOf",t.plazasServicios),l.xp6(2),l.Q6J("ngIf",0!=t.id_plaza))},directives:[e.W2,e.PM,e.tO,e.t9,e.QI,r.JJ,r.On,n.sg,n.O5,e.n0,e.Zi,e.FN,e.gu],pipes:[n.rS],styles:[".texto-centrado[_ngcontent-%COMP%]{text-align:center;background-color:#00c800;width:60%;margin:0 auto;border-radius:10px}.datos[_ngcontent-%COMP%]{font-size:15px;text-align:center;color:#00c800}h3[_ngcontent-%COMP%]{color:#fff}ion-card-content[_ngcontent-%COMP%], ion-card-header[_ngcontent-%COMP%]{text-align:center}ion-card-content[_ngcontent-%COMP%]{border-bottom:1px solid #025f1e}ion-icon[_ngcontent-%COMP%]{font-size:40px}"]}),i})()}];let z=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=l.oAB({type:i}),i.\u0275inj=l.cJS({imports:[[a.Bz.forChild(_)],a.Bz]}),i})();var Z=o(5530);let x=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=l.oAB({type:i}),i.\u0275inj=l.cJS({imports:[[e.Pc,n.ez,r.u5,s.e,z,Z.K]]}),i})()}}]);