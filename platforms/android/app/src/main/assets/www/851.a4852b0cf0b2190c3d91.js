(self.webpackChunkerpp_movil=self.webpackChunkerpp_movil||[]).push([[851],{80851:(o,n,e)=>{"use strict";e.r(n),e.d(n,{DirectorioPageModule:()=>b});var i=e(61116),t=e(11462),r=e(54812),c=e(9069),a=e(64762),l=e(87368),s=e(90074),u=e(79899),m=e(35796),p=e(75919);let g=(()=>{class o{transform(o,n){if(n.length<3)return o;const e=[];for(const i of o)(i.nombre.toLowerCase().indexOf(n.toLowerCase())>-1||i.apellido_paterno.toLowerCase().indexOf(n.toLowerCase())>-1)&&e.push(i);return e}}return o.\u0275fac=function(n){return new(n||o)},o.\u0275pipe=l.Yjl({name:"empleado",type:o,pure:!0}),o})();function h(o,n){if(1&o){const o=l.EpF();l.TgZ(0,"ion-item-sliding",13),l.TgZ(1,"ion-item-options",14),l.TgZ(2,"ion-item-option",15),l.NdJ("click",function(){const n=l.CHM(o).$implicit;return l.oxw().phone(n.numero_celular)}),l._UZ(3,"ion-icon",16),l.qZA(),l.qZA(),l.TgZ(4,"ion-item",17),l.TgZ(5,"ion-label"),l.TgZ(6,"p"),l.TgZ(7,"ion-chip",18),l._uU(8),l.qZA(),l.qZA(),l.TgZ(9,"p"),l._uU(10),l.qZA(),l.TgZ(11,"p"),l._uU(12),l.qZA(),l.qZA(),l.qZA(),l.TgZ(13,"ion-item-options",19),l.TgZ(14,"ion-item-option",20),l.NdJ("click",function(){const n=l.CHM(o).$implicit;return l.oxw().whatsapp(n.numero_celular)}),l._UZ(15,"ion-icon",21),l.qZA(),l.TgZ(16,"ion-item-option",22),l.NdJ("click",function(){const n=l.CHM(o).$implicit;return l.oxw().email(n.email)}),l._UZ(17,"ion-icon",23),l.qZA(),l.qZA(),l.qZA()}if(2&o){const o=n.$implicit;l.xp6(8),l.AsE(" Nombre: ",o.nombre," ",o.apellido_paterno," "),l.xp6(2),l.hij("Puesto: ",o.puesto,""),l.xp6(2),l.hij("Area: ",o.area,"")}}const Z=[{path:"",component:(()=>{class o{constructor(o,n,e,i,t){this.callNumber=o,this.iab=n,this.router=e,this.emailComposer=i,this.rest=t,this.countryCode="+521",this.findText="",this.busqueda=!1}ngOnInit(){return(0,a.mG)(this,void 0,void 0,function*(){yield this.obtenerInformacionEmpleados()})}obtenerInformacionEmpleados(){return(0,a.mG)(this,void 0,void 0,function*(){this.contactos=yield this.rest.obtenerInformacionEmpleados()})}phone(o){this.callNumber.callNumber(o,!0).then(o=>console.log("Launched dialer!",o)).catch(o=>console.log("Error launching dialer",o))}whatsapp(o){this.iab.create(`https://api.whatsapp.com/send?phone=${this.countryCode}${o}`,"_system")}find(o){this.busqueda=!0,this.findText=o.detail.value}email(o){this.emailComposer.open({to:o})}navegar(o){1==o?this.router.navigateByUrl("home/tab1"):2==o?this.router.navigateByUrl("home/tab2"):3==o?this.router.navigateByUrl("home/tab3"):4==o?this.router.navigateByUrl("home/tab4"):5==o&&this.callNumber.callNumber("911",!0).then(o=>console.log("Launched dialer!",o)).catch(o=>console.log("Error launching dialer",o))}}return o.\u0275fac=function(n){return new(n||o)(l.Y36(s.X),l.Y36(u.i),l.Y36(c.F0),l.Y36(m.w),l.Y36(p.v))},o.\u0275cmp=l.Xpm({type:o,selectors:[["app-directorio"]],decls:42,vars:4,consts:[["color","medium","id","main"],[2,"text-align","center"],["color","light","placeholder","Busqueda por nombre",3,"ionChange"],["color","white",4,"ngFor","ngForOf"],["scrollable",""],[3,"click"],["color","light","name","home"],["color","light",2,"font-size","2px"],["color","light","name","layers"],["color","light","name","map"],["color","light","name","warning"],["src","../../../assets/img/sos.png","alt","",2,"width","30px","height","30px","margin-bottom","-15px"],["color","light",2,"font-size","3px","margin-bottom","-1px"],["color","white"],["side","start"],["color","secondary",3,"click"],["name","call-outline",1,"icono-directorio"],["color","medium"],["color","secondary"],["side","end"],["color","success",3,"click"],["name","logo-whatsapp",1,"icono-directorio"],["color","primary",3,"click"],["name","mail-outline",1,"icono-directorio"]],template:function(o,n){1&o&&(l.TgZ(0,"ion-content",0),l._UZ(1,"hr"),l._UZ(2,"hr"),l._UZ(3,"hr"),l._UZ(4,"hr"),l._UZ(5,"hr"),l._UZ(6,"hr"),l._UZ(7,"hr"),l._UZ(8,"hr"),l.TgZ(9,"div",1),l.TgZ(10,"h3"),l._uU(11,"Directorio"),l.qZA(),l.qZA(),l._UZ(12,"hr"),l.TgZ(13,"ion-searchbar",2),l.NdJ("ionChange",function(o){return n.find(o)}),l.qZA(),l.YNc(14,h,18,4,"ion-item-sliding",3),l.ALo(15,"empleado"),l.qZA(),l.TgZ(16,"ion-segment",4),l.TgZ(17,"ion-segment-button",5),l.NdJ("click",function(){return n.navegar(1)}),l._UZ(18,"ion-icon",6),l.TgZ(19,"ion-label",7),l.TgZ(20,"small"),l._uU(21,"Inicio"),l.qZA(),l.qZA(),l.qZA(),l.TgZ(22,"ion-segment-button",5),l.NdJ("click",function(){return n.navegar(2)}),l._UZ(23,"ion-icon",8),l.TgZ(24,"ion-label",7),l.TgZ(25,"small"),l._uU(26,"Cuentas"),l.qZA(),l.qZA(),l.qZA(),l.TgZ(27,"ion-segment-button",5),l.NdJ("click",function(){return n.navegar(3)}),l._UZ(28,"ion-icon",9),l.TgZ(29,"ion-label",7),l.TgZ(30,"small"),l._uU(31,"Mapa"),l.qZA(),l.qZA(),l.qZA(),l.TgZ(32,"ion-segment-button",5),l.NdJ("click",function(){return n.navegar(4)}),l._UZ(33,"ion-icon",10),l.TgZ(34,"ion-label",7),l.TgZ(35,"small"),l._uU(36,"S.P\xfablicos"),l.qZA(),l.qZA(),l.qZA(),l.TgZ(37,"ion-segment-button",5),l.NdJ("click",function(){return n.navegar(5)}),l._UZ(38,"img",11),l.TgZ(39,"ion-label",12),l.TgZ(40,"small"),l._uU(41,"S.O.S."),l.qZA(),l.qZA(),l.qZA(),l.qZA()),2&o&&(l.xp6(14),l.Q6J("ngForOf",l.xi3(15,1,n.contactos,n.findText)))},directives:[r.W2,r.VI,r.j9,i.sg,r.cJ,r.QI,r.GO,r.gu,r.Q$,r.td,r.IK,r.u8,r.Ie,r.hM],pipes:[g],styles:["p[_ngcontent-%COMP%]{color:#fff!important;font:14px}h3[_ngcontent-%COMP%]{color:#fff}.icono-directorio[_ngcontent-%COMP%]{font-size:36px!important}ion-segment[_ngcontent-%COMP%]{--background:#254061;border-top:1px solid #0000001a;height:60px;margin-bottom:-5px}ion-segment-button[_ngcontent-%COMP%]{--indicator-color:#0000!important}"]}),o})()}];let d=(()=>{class o{}return o.\u0275fac=function(n){return new(n||o)},o.\u0275mod=l.oAB({type:o}),o.\u0275inj=l.cJS({imports:[[c.Bz.forChild(Z)],c.Bz]}),o})();var f=e(5530);let b=(()=>{class o{}return o.\u0275fac=function(n){return new(n||o)},o.\u0275mod=l.oAB({type:o}),o.\u0275inj=l.cJS({providers:[s.X],imports:[[i.ez,t.u5,r.Pc,d,f.K]]}),o})()}}]);