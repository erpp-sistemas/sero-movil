(self.webpackChunkerpp_movil=self.webpackChunkerpp_movil||[]).push([[2603],{2603:(i,e,t)=>{"use strict";t.r(e),t.d(e,{ServiciosPublicosPageModule:()=>A});var o=t(61116),n=t(11462),a=t(54812),s=t(9069),r=t(64762),c=t(87368),l=t(18372),d=t(75919),g=t(11585),h=t(3759),u=t(9935),p=t(2977);function m(i,e){if(1&i&&(c.TgZ(0,"ion-select-option",18),c._uU(1),c.ALo(2,"titlecase"),c.qZA()),2&i){const i=e.$implicit;c.Q6J("value",i.id_plaza),c.xp6(1),c.hij(" ",c.lcZ(2,2,i.plaza)," ")}}function v(i,e){if(1&i&&(c.TgZ(0,"ion-select-option",18),c._uU(1),c.qZA()),2&i){const i=e.$implicit;c.Q6J("value",i.id_servicio_publico),c.xp6(1),c.hij(" ",i.nombre_servicio_publico," ")}}function Z(i,e){if(1&i){const i=c.EpF();c.TgZ(0,"ion-fab-button",21),c.NdJ("click",function(){c.CHM(i);const e=c.oxw().$implicit;return c.oxw().deletePhoto(e.imagen,1)}),c._UZ(1,"ion-icon",22),c.qZA()}}function f(i,e){if(1&i&&(c.TgZ(0,"ion-slide"),c._UZ(1,"img",19),c.YNc(2,Z,2,0,"ion-fab-button",20),c.qZA()),2&i){const i=e.$implicit;c.xp6(1),c.s9C("src",i.imagen,c.LSH),c.xp6(1),c.Q6J("ngIf","assets/img/imgs.png"!=i.imagen)}}const b=[{path:"",component:(()=>{class i{constructor(i,e,t,o,n,a,s,r,c){this.storage=i,this.rest=e,this.camera=t,this.webview=o,this.mensaje=n,this.geolocation=a,this.platform=s,this.loadingController=r,this.router=c,this.account="",this.idTareaGestor=0,this.fechaCaptura="",this.idAspuser="",this.latitud=0,this.longitud=0,this.idPlazas=[],this.plazas=[],this.fechaActual="",this.image="",this.indicadorImagen=0,this.takePhoto=!1,this.isPhoto=!1,this.idServicio=0,this.observacion="",this.nombrePlaza="",this.idIncidencia1Selected=!1,this.colorIncidencia1="",this.sliderOpts={zoom:!0,slidesPerView:1.55,spaceBetween:2,centeredSlides:!0},this.imgs=[{imagen:"assets/img/imgs.png"}]}ngOnInit(){return(0,r.mG)(this,void 0,void 0,function*(){this.getFechaActual(),yield this.mostrarServiciosPublicos(this.id_plaza),this.idAspuser=yield this.storage.get("IdAspUser")})}ionViewDidEnter(){return(0,r.mG)(this,void 0,void 0,function*(){yield this.platform.ready(),this.obtenerPlazasUsuario(),this.idIncidencia1Selected=!1,this.colorIncidencia1=""})}obtenerPlazasUsuario(){return(0,r.mG)(this,void 0,void 0,function*(){this.plazasServicios=yield this.rest.obtenerPlazasSQL(),console.log(this.plazasServicios),this.id_plaza=this.plazasServicios[0].id_plaza,this.nombrePlaza=this.plazasServicios[0].plaza,console.log("idPlaza "+this.id_plaza),console.log("Nombre plaza "+this.nombrePlaza)})}deletePhoto(i,e){return(0,r.mG)(this,void 0,void 0,function*(){if(console.log(i),console.log(this.imgs),1==e){console.log("Borrar foto de incidencia 1");for(let e=0;e<this.imgs.length;e++)console.log(this.imgs[e].imagen),this.imgs[e].imagen==i?this.imgs.splice(e,1):console.log("No hay coincidencias")}this.infoImage=yield this.rest.getImageLocalServicios(i),console.log(this.infoImage[0])})}resultPlaza(i){return(0,r.mG)(this,void 0,void 0,function*(){let e=i.detail.value,t=yield this.rest.mostrarServicios(e);this.nombrePlaza=t[0].plaza,console.log(this.id_plaza),this.mostrarServiciosPublicos(this.id_plaza),console.log(this.nombrePlaza)})}resultIncidencia(i){console.log(i.detail.value),this.idIncidencia1Selected=!0}takePic(i){return(0,r.mG)(this,void 0,void 0,function*(){1==i&&(this.idServicioMandar=this.idServicio,this.photoEvidencia1("Evidencia servicios p\xfablicos"))})}photoEvidencia1(i){var e=(new Date).toISOString();let t=new Date(e),o=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds())).toISOString();this.camera.getPicture({quality:40,correctOrientation:!0,destinationType:this.camera.DestinationType.FILE_URI,sourceType:this.camera.PictureSourceType.CAMERA,encodingType:this.camera.EncodingType.JPEG,mediaType:this.camera.MediaType.PICTURE}).then(e=>{this.indicadorImagen=this.indicadorImagen+1;let t=e;this.image=this.webview.convertFileSrc(e),console.log(t,this.image),this.isPhoto=!1,this.takePhoto=!0,this.imgs.push({imagen:this.image}),1==this.indicadorImagen&&this.imgs.splice(0,1),this.saveImage(this.id_plaza,this.idAspuser,this.image,o,t,i,this.idServicioMandar,this.nombrePlaza)}).catch(i=>{console.error(i)})}saveImage(i,e,t,o,n,a,s,r){this.rest.saveImageServicios(i,e,t,o,n,a,s,r).then(i=>{console.log(i),this.mensaje.showToast("Se almacen\xf3 la imagen correctamente")})}getFechaActual(){var i=(new Date).toISOString();let e=new Date(i),t=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate()));this.fechaActual=t.toISOString();let o=this.fechaActual.split("T");this.fechaActual=o[0],console.log("Esta es la fecha Actual :::::::::::"+this.fechaActual)}verify(){return(0,r.mG)(this,void 0,void 0,function*(){0==this.takePhoto?this.mensaje.showAlert("Captura minimo una foto para poder terminar la gestion"):(this.loading=yield this.loadingController.create({message:"Obteniendo la ubicaci\xf3n de esta gesti\xf3n y guardando...."}),yield this.loading.present(),this.geolocation.getCurrentPosition().then(i=>(0,r.mG)(this,void 0,void 0,function*(){if(i){this.latitud=i.coords.latitude,this.longitud=i.coords.longitude,console.log("La latitud es",this.latitud),console.log("La longitud es ",this.longitud),this.loading.dismiss(),this.loading=yield this.loadingController.create({message:"Guardando la gesti\xf3n..."}),yield this.loading.present();var e=(new Date).toISOString();let t=new Date(e),o=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds()));this.fechaCaptura=o.toISOString();let n={id_plaza:this.id_plaza,nombrePlaza:this.nombrePlaza,idAspUser:this.idAspuser,idServicio:this.idServicio,observacion:this.observacion,fechaCaptura:this.fechaCaptura,latitud:this.latitud,longitud:this.longitud};yield this.gestionServiciosPublicos(n),this.loading.dismiss()}})).catch(i=>(0,r.mG)(this,void 0,void 0,function*(){console.log("No se pudo obtener la geolocalizacion "+i),console.log(`La latitud de implementta es ${this.latitud} y la longitud de implementta es ${this.longitud}`),this.loading.dismiss(),this.loading=yield this.loadingController.create({message:"Guardando reporte"}),yield this.loading.present();var e=(new Date).toISOString();let t=new Date(e),o=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds()));this.fechaCaptura=o.toISOString();let n={id_plaza:this.id_plaza,nombrePlaza:this.nombrePlaza,idAspUser:this.idAspuser,idServicio:this.idServicio,observacion:this.observacion,fechaCaptura:this.fechaCaptura,latitud:this.latitud,longitud:this.longitud};yield this.gestionServiciosPublicos(n),this.loading.dismiss()})))})}gestionServiciosPublicos(i){return(0,r.mG)(this,void 0,void 0,function*(){yield this.rest.gestionServiciosPublicos(i),console.log(i),this.borrarCampos(),this.router.navigateByUrl("/home")})}borrarCampos(){this.observacion="",this.idServicio=0,this.imgs=[{imagen:"assets/img/imgs.png"}]}mostrarIncidencias(i){console.log(i.detail.value)}mostrarServiciosPublicos(i){return(0,r.mG)(this,void 0,void 0,function*(){this.listaServiciosPublicos=yield this.rest.mostrarServiciosPublicos(i),console.log(this.listaServiciosPublicos)})}}return i.\u0275fac=function(e){return new(e||i)(c.Y36(l.Ke),c.Y36(d.v),c.Y36(g.V1),c.Y36(h.k),c.Y36(u.K),c.Y36(p.b),c.Y36(a.t4),c.Y36(a.HT),c.Y36(s.F0))},i.\u0275cmp=c.Xpm({type:i,selectors:[["app-servicios-publicos"]],decls:57,vars:9,consts:[["color","medium"],["color","dark",2,"text-align","center"],[2,"color","white","font-size","16px"],[1,"texto-centrado"],[1,"datos"],["interface","popover","placeholder","Seleccionar plaza",1,"myCustomSelect",3,"ngModel","ngModelChange","ionChange"],[3,"value",4,"ngFor","ngForOf"],[2,"text-align","center"],["color","secondary"],["interface","action-sheet","placeholder","Selecciona uno",3,"ngModel","ngModelChange","ionChange"],[1,"fotos-visita"],[3,"options"],[4,"ngFor","ngForOf"],[1,"btn-camara",3,"color","disabled","click"],["name","camera"],["color","light","placeholder","Ingrese observaci\xf3n",3,"ngModel","ngModelChange"],["size","12",1,"ion-text-center"],["color","primary","expand","block",3,"click"],[3,"value"],[1,"imagen",3,"src"],["padding","","size","small","color","danger",3,"click",4,"ngIf"],["padding","","size","small","color","danger",3,"click"],["name","trash",1,"delete"]],template:function(i,e){1&i&&(c._UZ(0,"hr"),c._UZ(1,"hr"),c._UZ(2,"hr"),c._UZ(3,"hr"),c.TgZ(4,"ion-content",0),c.TgZ(5,"ion-card",0),c.TgZ(6,"ion-card-subtitle",1),c.TgZ(7,"p",2),c._uU(8,"Selecciona la plaza"),c.qZA(),c.qZA(),c.qZA(),c.TgZ(9,"div",3),c.TgZ(10,"p",4),c.TgZ(11,"ion-select",5),c.NdJ("ngModelChange",function(i){return e.id_plaza=i})("ionChange",function(i){return e.resultPlaza(i)}),c.YNc(12,m,3,4,"ion-select-option",6),c.qZA(),c.qZA(),c.qZA(),c._UZ(13,"hr"),c._UZ(14,"hr"),c.TgZ(15,"div",7),c.TgZ(16,"ion-chip",8),c._uU(17,"Incidencia"),c.qZA(),c.qZA(),c.TgZ(18,"ion-card",0),c.TgZ(19,"ion-card-header",0),c.TgZ(20,"p",7),c._uU(21,"Tipo de incidenia"),c.qZA(),c.qZA(),c.TgZ(22,"ion-card-content",0),c.TgZ(23,"p"),c.TgZ(24,"ion-select",9),c.NdJ("ngModelChange",function(i){return e.idServicio=i})("ionChange",function(i){return e.resultIncidencia(i)}),c.YNc(25,v,2,2,"ion-select-option",6),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.TgZ(26,"ion-card",0),c.TgZ(27,"ion-card-header",0),c.TgZ(28,"ion-label"),c.TgZ(29,"p",10),c._uU(30," Fotos de incidencia "),c.qZA(),c.qZA(),c.qZA(),c._UZ(31,"hr"),c.TgZ(32,"ion-card-content",0),c.TgZ(33,"ion-slides",11),c.YNc(34,f,3,2,"ion-slide",12),c.qZA(),c.TgZ(35,"ion-grid",7),c.TgZ(36,"ion-col"),c.TgZ(37,"ion-button",13),c.NdJ("click",function(){return e.takePic(1)}),c._UZ(38,"ion-icon",14),c.qZA(),c._UZ(39,"ion-ripple-effect"),c.qZA(),c.qZA(),c.TgZ(40,"ion-grid"),c.TgZ(41,"ion-row"),c.TgZ(42,"ion-col",7),c.TgZ(43,"ion-label",10),c._uU(44,"Evidencia"),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.TgZ(45,"ion-card",0),c.TgZ(46,"ion-card-header",0),c.TgZ(47,"p"),c._uU(48,"Observaciones"),c.qZA(),c.qZA(),c.TgZ(49,"ion-card-content",0),c.TgZ(50,"ion-item",0),c.TgZ(51,"ion-textarea",15),c.NdJ("ngModelChange",function(i){return e.observacion=i}),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.TgZ(52,"ion-grid"),c.TgZ(53,"ion-row"),c.TgZ(54,"ion-col",16),c.TgZ(55,"ion-button",17),c.NdJ("click",function(){return e.verify()}),c._uU(56,"Terminar"),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.qZA()),2&i&&(c.xp6(11),c.Q6J("ngModel",e.id_plaza),c.xp6(1),c.Q6J("ngForOf",e.plazasServicios),c.xp6(12),c.Q6J("ngModel",e.idServicio),c.xp6(1),c.Q6J("ngForOf",e.listaServiciosPublicos),c.xp6(8),c.Q6J("options",e.sliderOpts),c.xp6(1),c.Q6J("ngForOf",e.imgs),c.xp6(3),c.Q6J("color",e.colorIncidencia1)("disabled",!e.idIncidencia1Selected),c.xp6(14),c.Q6J("ngModel",e.observacion))},directives:[a.W2,a.PM,a.tO,a.t9,a.QI,n.JJ,n.On,o.sg,a.hM,a.Zi,a.FN,a.Q$,a.Hr,a.jY,a.wI,a.YG,a.gu,a.H$,a.Nd,a.Ie,a.g2,a.j9,a.n0,a.A$,o.O5,a.W4],pipes:[o.rS],styles:[".texto-centrado[_ngcontent-%COMP%]{text-align:center;background-color:#00c800;width:60%;margin:0 auto;border-radius:10px}.datos[_ngcontent-%COMP%]{font-size:15px;text-align:center;color:#00c800}h3[_ngcontent-%COMP%]{color:#fff}ion-select[_ngcontent-%COMP%]{max-width:100%!important}ion-icon[_ngcontent-%COMP%]{font-size:28px}.delete[_ngcontent-%COMP%]{color:red!important}.imagen[_ngcontent-%COMP%]{width:35%;height:35%;margin-top:30px;margin-bottom:30px}.fotos-visita[_ngcontent-%COMP%], p[_ngcontent-%COMP%]{color:#fff!important}.fotos-visita[_ngcontent-%COMP%]{text-align:center}.btn-camara[_ngcontent-%COMP%]{width:200px;margin:0 auto!important}ion-segment[_ngcontent-%COMP%]{--background:#254061;border-top:1px solid #0000001a;height:60px;margin-bottom:-5px}ion-segment-button[_ngcontent-%COMP%]{--indicator-color:#0000!important}"]}),i})()}];let S=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=c.oAB({type:i}),i.\u0275inj=c.cJS({imports:[[s.Bz.forChild(b)],s.Bz]}),i})(),A=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=c.oAB({type:i}),i.\u0275inj=c.cJS({imports:[[o.ez,n.u5,a.Pc,S]]}),i})()}}]);