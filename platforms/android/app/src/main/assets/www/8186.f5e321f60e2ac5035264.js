(self.webpackChunkerpp_movil=self.webpackChunkerpp_movil||[]).push([[8186],{58186:(i,n,e)=>{"use strict";e.r(n),e.d(n,{BotonPanicoPageModule:()=>A});var o=e(61116),t=e(11462),a=e(54812),s=e(9069),r=e(64762),c=e(87368),d=e(2977),g=e(18372),l=e(75919),u=e(14522),h=e(9935);function m(i,n){if(1&i){const i=c.EpF();c.TgZ(0,"div",6),c.TgZ(1,"img",7),c.NdJ("click",function(){return c.CHM(i),c.oxw().confirmarBoton()}),c.qZA(),c.qZA()}}function p(i,n){1&i&&(c.TgZ(0,"div",8),c._UZ(1,"img",9),c.qZA())}function f(i,n){1&i&&(c.TgZ(0,"div",10),c._UZ(1,"img",11),c.qZA())}function v(i,n){1&i&&(c.TgZ(0,"div",12),c.TgZ(1,"h1"),c._uU(2,"Se han enviado los mensajes de ayuda"),c.qZA(),c.TgZ(3,"h1"),c._uU(4,"Espera indicaciones"),c.qZA(),c.TgZ(5,"h1"),c._uU(6,"\u2714\u2714\ud83d\ude80\ud83d\ude94"),c.qZA(),c.qZA())}function _(i,n){1&i&&(c.TgZ(0,"div",12),c.TgZ(1,"h1"),c._uU(2,"No se ha podido enviar el mensaje, pero el registro ya se encuentra en el sistema"),c.qZA(),c.TgZ(3,"h1"),c._uU(4,"Espera indicaciones"),c.qZA(),c.TgZ(5,"h1"),c._uU(6,"\ud83d\udd34\ud83d\ude80\ud83d\ude94"),c.qZA(),c.qZA())}const Z=[{path:"",component:(()=>{class i{constructor(i,n,e,o,t,a){this.loadingController=i,this.geolocation=n,this.storage=e,this.rest=o,this.sms=t,this.message=a,this.usuariosAyuda=[],this.codigoPais="+521",this.mensajeEnviado=!1,this.usuarios=[{apellido_materno:"Nava",apellido_paterno:"Perez",distancia:48473.293960164956,id_usuario:9,latitud:19.628384,longitud:-99.206668,nombre:"Guadalupe ",telefono_personal:"5527112322",fecha_captura:""},{apellido_materno:"Lopez",apellido_paterno:"Ticante",distancia:48473.293960164956,id_usuario:54,latitud:19.628384,longitud:-99.206668,nombre:"Ezequiel",telefono_personal:"5568982899",fecha_captura:""}]}ngOnInit(){return(0,r.mG)(this,void 0,void 0,function*(){yield this.obtenerUsuario()})}ionViewWillLeave(){this.usuariosAyuda=[],this.mensajeEnviado=!1}confirmarBoton(){return(0,r.mG)(this,void 0,void 0,function*(){console.log("Obtener geolocalizacion y madar mensaje de texto"),this.loading=yield this.loadingController.create({message:"Mandando petici\xf3n de ayuda!!!!"}),yield this.loading.present();var i=(new Date).toISOString();let n=new Date(i),e=new Date(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate(),n.getHours(),n.getMinutes(),n.getSeconds()));this.fechaCaptura=e.toISOString(),yield this.obtenerGeolocalizacion()})}obtenerGeolocalizacion(){return(0,r.mG)(this,void 0,void 0,function*(){this.geolocation.getCurrentPosition().then(i=>(0,r.mG)(this,void 0,void 0,function*(){i?(this.latitud=i.coords.latitude,this.longitud=i.coords.longitude,yield this.mandarInformacion()):this.loading.dismiss()}))})}obtenerUsuario(){return(0,r.mG)(this,void 0,void 0,function*(){this.id_usuario=yield this.storage.get("IdAspUser"),this.nombre=yield this.storage.get("Nombre")})}mandarInformacion(){return(0,r.mG)(this,void 0,void 0,function*(){let i={id_usuario:this.id_usuario,fecha_captura:this.fechaCaptura,latitud:this.latitud,longitud:this.longitud};this.usuariosAyuda=yield this.rest.registroBotonPanico(i),console.log(this.usuariosAyuda),this.usuariosAyuda.forEach(i=>(0,r.mG)(this,void 0,void 0,function*(){const n="+521"+i.telefono_personal;"Mensaje enviado"===(yield this.enviarMensaje(n,i.nombre,i.apellido_paterno))?(this.mensajeEnviado=!0,this.error=!1):(this.error=!0,this.mensajeEnviado=!1)})),this.loading.dismiss()})}enviarMensaje(i,n,e){return(0,r.mG)(this,void 0,void 0,function*(){return new Promise((o,t)=>(0,r.mG)(this,void 0,void 0,function*(){if(yield this.sms.hasPermission())try{this.sms.send(i,`Hola ${n} ${e} soy ${this.nombre} y necesito ayuda, mi ubicacion es https://www.google.com/maps/place/${this.latitud},${this.longitud} `,{replaceLineBreaks:!0}).then(i=>{"OK"===i&&o("Mensaje enviado")})}catch(a){t(a)}else this.message.showToast("Activa el permiso para mandar mensajes sms")}))})}}return i.\u0275fac=function(n){return new(n||i)(c.Y36(a.HT),c.Y36(d.b),c.Y36(g.Ke),c.Y36(l.v),c.Y36(u.y),c.Y36(h.K))},i.\u0275cmp=c.Xpm({type:i,selectors:[["app-boton-panico"]],decls:18,vars:5,consts:[["color","medium"],[2,"text-align","center"],["class","img-boton-panico",4,"ngIf"],["class","img-selecciona",4,"ngIf"],["class","img-good",4,"ngIf"],["class","texto-confimacion-ayuda",4,"ngIf"],[1,"img-boton-panico"],["src","../../assets/img/boton-panico.png","alt","",3,"click"],[1,"img-selecciona"],["src","../../assets/img/mano.png","alt",""],[1,"img-good"],["src","../../assets/img/good.png","alt",""],[1,"texto-confimacion-ayuda"]],template:function(i,n){1&i&&(c.TgZ(0,"ion-content",0),c._UZ(1,"hr"),c._UZ(2,"hr"),c._UZ(3,"hr"),c._UZ(4,"hr"),c._UZ(5,"hr"),c._UZ(6,"hr"),c._UZ(7,"hr"),c._UZ(8,"hr"),c.TgZ(9,"div",1),c.TgZ(10,"h3"),c._uU(11,"Bot\xf3n de p\xe1nico"),c.qZA(),c.qZA(),c._UZ(12,"hr"),c.YNc(13,m,2,0,"div",2),c.YNc(14,p,2,0,"div",3),c.YNc(15,f,2,0,"div",4),c.YNc(16,v,7,0,"div",5),c.YNc(17,_,7,0,"div",5),c.qZA()),2&i&&(c.xp6(13),c.Q6J("ngIf",!n.mensajeEnviado),c.xp6(1),c.Q6J("ngIf",!n.mensajeEnviado),c.xp6(1),c.Q6J("ngIf",n.mensajeEnviado),c.xp6(1),c.Q6J("ngIf",n.mensajeEnviado),c.xp6(1),c.Q6J("ngIf",n.error))},directives:[a.W2,o.O5],styles:["h3[_ngcontent-%COMP%]{color:#fff}.img-boton-panico[_ngcontent-%COMP%]{text-align:center;margin-top:30px}.img-boton-panico[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:80%}.img-selecciona[_ngcontent-%COMP%]{text-align:center}.img-selecciona[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:80%}.img-good[_ngcontent-%COMP%]{text-align:end}.img-good[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:80%}.texto-confirmacion-ayuda[_ngcontent-%COMP%], h1[_ngcontent-%COMP%]{text-align:center}h1[_ngcontent-%COMP%]{color:#fff;font-size:22px;margin-top:10px}"]}),i})()}];let y=(()=>{class i{}return i.\u0275fac=function(n){return new(n||i)},i.\u0275mod=c.oAB({type:i}),i.\u0275inj=c.cJS({imports:[[s.Bz.forChild(Z)],s.Bz]}),i})(),A=(()=>{class i{}return i.\u0275fac=function(n){return new(n||i)},i.\u0275mod=c.oAB({type:i}),i.\u0275inj=c.cJS({imports:[[o.ez,t.u5,a.Pc,y]]}),i})()}}]);