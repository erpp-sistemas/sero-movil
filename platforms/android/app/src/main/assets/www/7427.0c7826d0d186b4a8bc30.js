(self.webpackChunkerpp_movil=self.webpackChunkerpp_movil||[]).push([[7427],{57427:(e,o,i)=>{"use strict";i.d(o,{_:()=>P});var t=i(64762),n=i(38643),a=i(87368),r=i(18372),s=i(9069),c=i(9935),l=i(2977),g=i(54812),d=i(75919),h=i(11585),u=i(3759),Z=i(90074),p=i(11462),m=i(61116);function A(e,o){if(1&e){const e=a.EpF();a.TgZ(0,"ion-item",0),a.TgZ(1,"ion-label"),a.TgZ(2,"p"),a._uU(3,"Especifique: "),a.qZA(),a.qZA(),a.TgZ(4,"ion-input",9),a.NdJ("ngModelChange",function(o){return a.CHM(e),a.oxw().otroPuesto=o}),a.qZA(),a.qZA()}if(2&e){const e=a.oxw();a.xp6(4),a.Q6J("ngModel",e.otroPuesto)}}function T(e,o){if(1&e){const e=a.EpF();a.TgZ(0,"div"),a.TgZ(1,"ion-item",0),a.TgZ(2,"ion-label"),a.TgZ(3,"p"),a._uU(4,"Especifique: "),a.qZA(),a.qZA(),a.TgZ(5,"ion-input",9),a.NdJ("ngModelChange",function(o){return a.CHM(e),a.oxw().otroMotivo=o}),a.qZA(),a.qZA(),a.qZA()}if(2&e){const e=a.oxw();a.xp6(5),a.Q6J("ngModel",e.otroMotivo)}}function q(e,o){if(1&e){const e=a.EpF();a.TgZ(0,"div"),a.TgZ(1,"ion-item",0),a.TgZ(2,"ion-label"),a.TgZ(3,"p"),a._uU(4,"Giro: "),a.qZA(),a.qZA(),a.TgZ(5,"ion-input",9),a.NdJ("ngModelChange",function(o){return a.CHM(e),a.oxw().giro=o}),a.qZA(),a.qZA(),a.qZA()}if(2&e){const e=a.oxw();a.xp6(5),a.Q6J("ngModel",e.giro)}}function f(e,o){if(1&e){const e=a.EpF();a.TgZ(0,"div"),a.TgZ(1,"ion-item",0),a.TgZ(2,"ion-label"),a.TgZ(3,"p"),a._uU(4,"Lectura medidor: "),a.qZA(),a.qZA(),a.TgZ(5,"ion-input",9),a.NdJ("ngModelChange",function(o){return a.CHM(e),a.oxw().lectura_medidor=o}),a.qZA(),a.qZA(),a.qZA()}if(2&e){const e=a.oxw();a.xp6(5),a.Q6J("ngModel",e.lectura_medidor)}}function v(e,o){1&e&&a._UZ(0,"ion-icon",50)}function b(e,o){if(1&e){const e=a.EpF();a.TgZ(0,"ion-fab-button",53),a.NdJ("click",function(){a.CHM(e);const o=a.oxw().$implicit;return a.oxw().deletePhoto(o.imagen)}),a._UZ(1,"ion-icon",54),a.qZA()}}function _(e,o){if(1&e&&(a.TgZ(0,"ion-slide"),a._UZ(1,"img",51),a.YNc(2,b,2,0,"ion-fab-button",52),a.qZA()),2&e){const e=o.$implicit;a.xp6(1),a.s9C("src",e.imagen,a.LSH),a.xp6(1),a.Q6J("ngIf","assets/img/imgs.png"!=e.imagen)}}let P=(()=>{class e{constructor(e,o,i,t,n,a,r,s,c,l,g,d,h){this.storage=e,this.router=o,this.mensaje=i,this.geolocation=t,this.modalController=n,this.platform=a,this.loadingController=r,this.rest=s,this.camera=c,this.webview=l,this.navCtrl=g,this.callNumber=d,this.alertCtrl=h,this.account="",this.propietario="",this.personaAtiende="",this.idPuesto=0,this.otroPuesto="",this.idMotivoNoPago=0,this.otroMotivo="",this.idTipoServicio=0,this.numeroNiveles=1,this.colorFachada="",this.colorPuerta="",this.referencia="",this.idTipoPredio=0,this.entreCalle1="",this.entreCalle2="",this.observaciones="",this.lectura_medidor="",this.tipoServicioPadron="",this.fechaCaptura="",this.idAspUser="",this.image="",this.isPhoto=!1,this.isMotive=!1,this.nombreTareaAsignada="",this.indicadorImagen=0,this.takePhoto=!1,this.takePhotoFachada=!1,this.takePhotoEvidencia=!1,this.activaOtroMotivo=!1,this.detectedChanges=!1,this.giro="",this.mostrarGiro=!1,this.idServicioPlaza=0,this.mostrarOtroPuesto=!1,this.geoPosicion={},this.sello=!1,this.sliderOpts={zoom:!0,slidesPerView:1.55,spaceBetween:10,centeredSlides:!0},this.imgs=[{imagen:"assets/img/imgs.png"}]}ngOnInit(){return(0,t.mG)(this,void 0,void 0,function*(){yield this.platform.ready(),this.getInfoAccount(),this.getPlaza(),this.getFechaActual(),this.idServicioPlaza=yield this.storage.get("IdServicioActivo"),this.estatusLecturaMedidor()})}estatusLecturaMedidor(){return(0,t.mG)(this,void 0,void 0,function*(){this.plazaAgua=1===this.idServicioPlaza})}ionViewWillLeave(){this.detectedChanges&&this.mensaje.showAlert("La gesti\xf3n no se guardar\xe1, tendras que capturar de nuevo")}getPlaza(){return(0,t.mG)(this,void 0,void 0,function*(){this.nombrePlaza=yield this.storage.get("NombrePlazaActiva"),this.id_plaza=yield this.storage.get("IdPlazaActiva")})}getInfoAccount(){return(0,t.mG)(this,void 0,void 0,function*(){this.account=yield this.storage.get("account"),this.nombreProceso=yield this.storage.get("proceso_gestion"),this.iconoProceso=yield this.storage.get("icono_proceso"),this.idAspUser=yield this.storage.get("IdAspUser"),this.infoAccount=yield this.rest.getInfoAccount(this.account),this.propietario=this.infoAccount[0].propietario,this.idAccountSqlite=this.infoAccount[0].id,this.tareaAsignada=this.infoAccount[0].tarea_asignada,this.nombreTareaAsignada=this.infoAccount[0].nombre_tarea_asignada,this.tipoServicioPadron=this.infoAccount[0].tipo_servicio,1==this.infoAccount[0].gestionada&&(this.mensaje.showAlert("Esta cuenta ya ha sido gestionada"),this.router.navigateByUrl("home/tab2"))})}getFechaActual(){var e=(new Date).toISOString();let o=new Date(e),i=new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate()));this.fechaActual=i.toISOString(),this.fechaActual.split("T")}resultIdPuesto(e){this.mostrarOtroPuesto=6==e.detail.value}resultTipoServicio(e){this.mostrarGiro="8"!==e.detail.value}resultMotivoNoPago(e){this.activaOtroMotivo=5==e.detail.value}confirmaFoto(e){return(0,t.mG)(this,void 0,void 0,function*(){const o=yield this.alertCtrl.create({header:"Tomar foto",subHeader:"Selecciona el modo para tomar foto ",buttons:[{text:"Camara",cssClass:"secondary",handler:()=>{this.takePic(e)}},{text:"Galeria",cssClass:"secondary",handler:()=>{this.takePicGallery(e)}}]});yield o.present()})}takePic(e){let o;1==e?(o="Legal fachada predio",this.takePhotoFachada=!0):2==e?(o="Legal evidencia",this.takePhotoEvidencia=!0):3==e&&(o="Legal toma");var i=(new Date).toISOString();let t=new Date(i),n=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds())).toISOString();this.camera.getPicture({quality:40,correctOrientation:!0,destinationType:this.camera.DestinationType.FILE_URI,sourceType:this.camera.PictureSourceType.CAMERA,encodingType:this.camera.EncodingType.JPEG,mediaType:this.camera.MediaType.PICTURE}).then(e=>{this.indicadorImagen=this.indicadorImagen+1;let i=e;this.image=this.webview.convertFileSrc(e),this.isPhoto=!1,this.imgs.push({imagen:this.image}),1==this.indicadorImagen&&this.imgs.splice(0,1),this.saveImage(this.id_plaza,this.nombrePlaza,this.image,this.account,n,i,this.idAspUser,this.tareaAsignada,o,this.idServicioPlaza)}).catch(e=>console.log(e))}takePicGallery(e){let o;1==e?(o="Legal fachada predio",this.takePhotoFachada=!0):2==e?(o="Legal evidencia",this.takePhotoEvidencia=!0):3==e&&(o="Legal toma");var i=(new Date).toISOString();let t=new Date(i),n=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds())).toISOString();this.camera.getPicture({quality:40,correctOrientation:!0,destinationType:this.camera.DestinationType.FILE_URI,sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,encodingType:this.camera.EncodingType.JPEG,mediaType:this.camera.MediaType.PICTURE}).then(e=>{this.indicadorImagen=this.indicadorImagen+1;let i=e;this.image=this.webview.convertFileSrc(e),this.isPhoto=!1,this.imgs.push({imagen:this.image}),1==this.indicadorImagen&&this.imgs.splice(0,1),this.saveImage(this.id_plaza,this.nombrePlaza,this.image,this.account,n,i,this.idAspUser,this.tareaAsignada,o,this.idServicioPlaza)}).catch(e=>console.log(e))}saveImage(e,o,i,t,n,a,r,s,c,l){this.rest.saveImage(e,o,i,t,n,a,r,s,c,l).then(e=>{this.mensaje.showToast("Se almaceno la imagen correctamente")})}verify(){return(0,t.mG)(this,void 0,void 0,function*(){if(!1===this.takePhotoFachada||!1===this.takePhotoEvidencia)return void this.mensaje.showAlert("Foto de fachada y evidencia son obligatorias para terminar la gesti\xf3n");var e=(new Date).toISOString();let o=new Date(e),i=new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()));this.fechaCaptura=i.toISOString();let t=yield this.loadingController.create({message:"Obteniendo ubicaci\xf3n...",spinner:"dots"});yield t.present(),yield this.getGeolocation(),console.log(this.geoPosicion),this.geoPosicion.coords?(this.latitud=this.geoPosicion.coords.latitude,this.longitud=this.geoPosicion.coords.longitude):(console.log("No se pudo obtener la geolocalizaci\xf3n"),this.latitud=0,this.longitud=0),t.dismiss(),this.loading=yield this.loadingController.create({message:"Guardando la gesti\xf3n",spinner:"dots"}),yield this.loading.present();let n={id_plaza:this.id_plaza,nombrePlaza:this.nombrePlaza,account:this.account,personaAtiende:this.personaAtiende,idPuesto:this.idPuesto,otroPuesto:this.otroPuesto,idMotivoNoPago:this.idMotivoNoPago,otroMotivo:this.otroMotivo,idTipoServicio:this.idTipoServicio,numeroNiveles:this.numeroNiveles,colorFachada:this.colorFachada,colorPuerta:this.colorPuerta,referencia:this.referencia,idTipoPredio:this.idTipoPredio,entreCalle1:this.entreCalle1,entreCalle2:this.entreCalle2,observaciones:this.observaciones,lectura_medidor:this.lectura_medidor,giro:this.giro,idAspUser:this.idAspUser,idTarea:this.tareaAsignada,fechaCaptura:this.fechaCaptura,latitud:this.latitud,longitud:this.longitud,idServicioPlaza:this.idServicioPlaza,id:this.idAccountSqlite};yield this.gestionLegal(n),this.loading.dismiss(),this.exit()})}gestionLegal(e){return(0,t.mG)(this,void 0,void 0,function*(){this.detectedChanges=!1,yield this.rest.gestionLegal(e)})}exit(){this.navCtrl.navigateRoot(["/home/tab2"])}getGeolocation(){return(0,t.mG)(this,void 0,void 0,function*(){return new Promise((e,o)=>(0,t.mG)(this,void 0,void 0,function*(){try{setTimeout(()=>{e(this.geoPosicion)},8e3),this.geoPosicion=yield this.geolocation.getCurrentPosition()}catch(i){console.log(i),o(i)}}))})}deletePhoto(e){return(0,t.mG)(this,void 0,void 0,function*(){for(let o=0;o<this.imgs.length;o++)this.imgs[o].imagen==e&&this.imgs.splice(o,1);this.infoImage=yield this.rest.getImageLocal(e)})}salida(e){return(0,t.mG)(this,void 0,void 0,function*(){const o=yield this.alertCtrl.create({header:"Salir",subHeader:"Confirme para salir de la gesti\xf3n, se perderan los cambios ",buttons:[{text:"Cancelar",role:"cancel",cssClass:"secondary",handler:e=>{}},{text:"Confirmar",cssClass:"secondary",handler:()=>{this.navegar(e)}}]});yield o.present()})}goPhotos(){return(0,t.mG)(this,void 0,void 0,function*(){let e=this.id_plaza;const o=yield this.modalController.create({component:n.Z,componentProps:{account:this.account,idPlaza:e}});yield o.present()})}colocacionSello(){return(0,t.mG)(this,void 0,void 0,function*(){const e=yield this.alertCtrl.create({header:"Colocaci\xf3n de sello",subHeader:"Aceptar para confirmar la colocaci\xf3n del sello",buttons:[{text:"Cancelar",role:"cancel",cssClass:"secondary",handler:e=>{console.log("Confirm Cancel: blah")}},{text:"Confirmar",cssClass:"secondary",handler:()=>{this.sello=!0}}]});yield e.present()})}navegar(e){1==e?this.router.navigateByUrl("home/tab1"):2==e?this.router.navigateByUrl("home/tab2"):3==e?this.router.navigateByUrl("home/tab3"):4==e?this.router.navigateByUrl("home/tab4"):5==e&&this.callNumber.callNumber("911",!0).then(e=>console.log("Launched dialer!",e)).catch(e=>console.log("Error launching dialer",e))}}return e.\u0275fac=function(o){return new(o||e)(a.Y36(r.Ke),a.Y36(s.F0),a.Y36(c.K),a.Y36(l.b),a.Y36(g.IN),a.Y36(g.t4),a.Y36(g.HT),a.Y36(d.v),a.Y36(h.V1),a.Y36(u.k),a.Y36(g.SH),a.Y36(Z.X),a.Y36(g.Br))},e.\u0275cmp=a.Xpm({type:e,selectors:[["app-gestion-legal"]],decls:238,vars:27,consts:[["color","medium"],[1,"contenedor-icono-proceso",2,"text-align","center"],[1,"icono-proceso",3,"name"],[1,"contenedor-nombre-proceso"],[2,"text-align","center","margin","15 0px 0 20"],["color","success"],[2,"font-weight","bold"],["fill","outline","color","primary","expand","block",1,"button-fotos-historicas",3,"click"],["slot","start","name","image"],["interface","popover",1,"myCustomSelect",3,"ngModel","ngModelChange"],["interface","action-sheet","placeholder","Selecciona uno",1,"myCustomSelect",3,"ngModel","ngModelChange","ionChange"],["value","1"],["value","2"],["value","3"],["value","4"],["value","5"],["value","6"],["color","medium",4,"ngIf"],["interface","popover","placeholder","Selecciona uno",1,"myCustomSelect",3,"ngModel","ngModelChange","ionChange"],[4,"ngIf"],["color","primary"],["value","7"],["value","8"],[2,"text-align","center"],["type","number","interface","popover",1,"myCustomSelect",3,"ngModel","ngModelChange"],["interface","popover","placeholder","Selecciona uno",1,"myCustomSelect",3,"ngModel","ngModelChange"],["rows","5",3,"ngModel","ngModelChange"],["fill","outline","color","success","expand","block",1,"button-fotos-historicas",3,"disabled","click"],["slot","start","name","albums-outline"],["color","success","slot","end","name","checkmark-done-circle-outline",4,"ngIf"],[3,"options"],[4,"ngFor","ngForOf"],["color","medium","text-center",""],[1,"fotos-visita"],["text-center",""],["expand","block","color","warning",3,"click"],["name","camera"],["expand","block","color","primary",3,"click"],["expand","block","color","secondary",3,"click"],["size","12",1,"ion-text-center"],["shape","round","color","success","expand","block",3,"click"],["scrollable",""],[3,"click"],["color","light","name","home"],["color","light",2,"font-size","2px"],["color","light","name","layers"],["color","light","name","map"],["color","light","name","warning"],["src","../../../assets/img/sos.png","alt","",2,"width","30px","height","30px","margin-bottom","-15px"],["color","light",2,"font-size","3px","margin-bottom","-1px"],["color","success","slot","end","name","checkmark-done-circle-outline"],[1,"imagen",3,"src"],["padding","","size","small","color","danger",3,"click",4,"ngIf"],["padding","","size","small","color","danger",3,"click"],["name","trash",1,"icon-trash"]],template:function(e,o){1&e&&(a._UZ(0,"hr"),a._UZ(1,"hr"),a._UZ(2,"hr"),a._UZ(3,"hr"),a.TgZ(4,"ion-content",0),a._UZ(5,"hr"),a.TgZ(6,"div",1),a._UZ(7,"ion-icon",2),a.qZA(),a.TgZ(8,"div",3),a.TgZ(9,"ion-label"),a.TgZ(10,"p"),a._uU(11),a.qZA(),a.qZA(),a.qZA(),a.TgZ(12,"ion-card",0),a.TgZ(13,"div",4),a.TgZ(14,"ion-chip",5),a._uU(15,"Informaci\xf3n de la gesti\xf3n a realizar"),a.qZA(),a.qZA(),a.TgZ(16,"ion-card-content"),a.TgZ(17,"ion-item",0),a.TgZ(18,"ion-label"),a.TgZ(19,"p"),a._uU(20," Plaza: "),a.TgZ(21,"span",6),a._uU(22),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(23,"ion-item",0),a.TgZ(24,"ion-label"),a.TgZ(25,"p"),a._uU(26," Acci\xf3n a realizar: "),a.TgZ(27,"span",6),a._uU(28),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(29,"ion-item",0),a.TgZ(30,"ion-label"),a.TgZ(31,"p"),a._uU(32," Cuenta a gestionar: "),a.TgZ(33,"span",6),a._uU(34),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(35,"ion-item",0),a.TgZ(36,"ion-label"),a.TgZ(37,"p"),a._uU(38," Propietario: "),a.TgZ(39,"span",6),a._uU(40),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(41,"ion-button",7),a.NdJ("click",function(){return o.goPhotos()}),a._UZ(42,"ion-icon",8),a._uU(43," Ver fotos hist\xf3ricas "),a.qZA(),a.qZA(),a.qZA(),a.TgZ(44,"div",4),a.TgZ(45,"ion-chip",5),a._uU(46,"Informaci\xf3n contribuyente"),a.qZA(),a.qZA(),a.TgZ(47,"ion-card",0),a.TgZ(48,"ion-card-content"),a.TgZ(49,"ion-item",0),a.TgZ(50,"ion-label"),a.TgZ(51,"p"),a._uU(52,"Persona que atiende: "),a.qZA(),a.qZA(),a.TgZ(53,"ion-input",9),a.NdJ("ngModelChange",function(e){return o.personaAtiende=e}),a.qZA(),a.qZA(),a.TgZ(54,"ion-item",0),a.TgZ(55,"ion-label"),a.TgZ(56,"p"),a._uU(57," Seleccione el puesto: "),a.qZA(),a.TgZ(58,"p"),a.TgZ(59,"ion-select",10),a.NdJ("ngModelChange",function(e){return o.idPuesto=e})("ionChange",function(e){return o.resultIdPuesto(e)}),a.TgZ(60,"ion-select-option",11),a._uU(61,"Representante legal"),a.qZA(),a.TgZ(62,"ion-select-option",12),a._uU(63,"Gerente"),a.qZA(),a.TgZ(64,"ion-select-option",13),a._uU(65,"Encargado"),a.qZA(),a.TgZ(66,"ion-select-option",14),a._uU(67,"Empleado"),a.qZA(),a.TgZ(68,"ion-select-option",15),a._uU(69,"Vigilante"),a.qZA(),a.TgZ(70,"ion-select-option",16),a._uU(71,"Otros"),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.YNc(72,A,5,1,"ion-item",17),a.qZA(),a.qZA(),a.TgZ(73,"ion-card",0),a.TgZ(74,"ion-card-content",0),a.TgZ(75,"ion-item",0),a.TgZ(76,"ion-label"),a.TgZ(77,"p"),a._uU(78," Motivo de no pago "),a.qZA(),a.TgZ(79,"p"),a.TgZ(80,"ion-select",18),a.NdJ("ngModelChange",function(e){return o.idMotivoNoPago=e})("ionChange",function(e){return o.resultMotivoNoPago(e)}),a.TgZ(81,"ion-select-option",11),a._uU(82,"No quiero pagar"),a.qZA(),a.TgZ(83,"ion-select-option",12),a._uU(84,"No tengo dinero"),a.qZA(),a.TgZ(85,"ion-select-option",14),a._uU(86,"Descontento con administraci\xf3n"),a.qZA(),a.TgZ(87,"ion-select-option",15),a._uU(88,"Otro"),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.YNc(89,T,6,1,"div",19),a.qZA(),a.qZA(),a.TgZ(90,"ion-card",0),a.TgZ(91,"ion-card-content",0),a.TgZ(92,"ion-item",0),a.TgZ(93,"ion-label"),a.TgZ(94,"p"),a._uU(95,"Tipo de servicio actual"),a.qZA(),a.TgZ(96,"ion-text",20),a._uU(97),a.qZA(),a.qZA(),a.qZA(),a.TgZ(98,"ion-item",0),a.TgZ(99,"ion-label"),a.TgZ(100,"p"),a._uU(101," Cambiar el tipo de servicio "),a.qZA(),a.TgZ(102,"p"),a.TgZ(103,"ion-select",18),a.NdJ("ngModelChange",function(e){return o.idTipoServicio=e})("ionChange",function(e){return o.resultTipoServicio(e)}),a.TgZ(104,"ion-select-option",11),a._uU(105,"Dom\xe9stico"),a.qZA(),a.TgZ(106,"ion-select-option",12),a._uU(107,"Comercial"),a.qZA(),a.TgZ(108,"ion-select-option",13),a._uU(109,"Industrial"),a.qZA(),a.TgZ(110,"ion-select-option",14),a._uU(111,"Gobierno"),a.qZA(),a.TgZ(112,"ion-select-option",15),a._uU(113,"Dom\xe9stico / Comercial"),a.qZA(),a.TgZ(114,"ion-select-option",16),a._uU(115,"Residencial"),a.qZA(),a.TgZ(116,"ion-select-option",21),a._uU(117,"Departamental"),a.qZA(),a.TgZ(118,"ion-select-option",22),a._uU(119,"No Aplica"),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.YNc(120,q,6,1,"div",19),a.YNc(121,f,6,1,"div",19),a._UZ(122,"hr"),a.TgZ(123,"div",23),a.TgZ(124,"ion-chip",5),a._uU(125,"Caracter\xedsticas del inmueble"),a.qZA(),a.qZA(),a._UZ(126,"hr"),a.TgZ(127,"ion-item",0),a.TgZ(128,"ion-label"),a.TgZ(129,"p"),a._uU(130,"N\xfamero de niveles: "),a.qZA(),a.qZA(),a.TgZ(131,"ion-input",24),a.NdJ("ngModelChange",function(e){return o.numeroNiveles=e}),a.qZA(),a.qZA(),a.TgZ(132,"ion-item",0),a.TgZ(133,"ion-label"),a.TgZ(134,"p"),a._uU(135,"Color fachada: "),a.qZA(),a.qZA(),a.TgZ(136,"ion-input",9),a.NdJ("ngModelChange",function(e){return o.colorFachada=e}),a.qZA(),a.qZA(),a.TgZ(137,"ion-item",0),a.TgZ(138,"ion-label"),a.TgZ(139,"p"),a._uU(140,"Color puerta: "),a.qZA(),a.qZA(),a.TgZ(141,"ion-input",9),a.NdJ("ngModelChange",function(e){return o.colorPuerta=e}),a.qZA(),a.qZA(),a.TgZ(142,"ion-item",0),a.TgZ(143,"ion-label"),a.TgZ(144,"p"),a._uU(145,"Referencia: "),a.qZA(),a.qZA(),a.TgZ(146,"ion-input",9),a.NdJ("ngModelChange",function(e){return o.referencia=e}),a.qZA(),a.qZA(),a.TgZ(147,"ion-item",0),a.TgZ(148,"ion-label"),a.TgZ(149,"p"),a._uU(150," Tipo de predio "),a.qZA(),a.TgZ(151,"p"),a.TgZ(152,"ion-select",25),a.NdJ("ngModelChange",function(e){return o.idTipoPredio=e}),a.TgZ(153,"ion-select-option",11),a._uU(154,"Esquinero"),a.qZA(),a.TgZ(155,"ion-select-option",12),a._uU(156,"Intermedio"),a.qZA(),a.TgZ(157,"ion-select-option",13),a._uU(158,"Manzanero"),a.qZA(),a.TgZ(159,"ion-select-option",14),a._uU(160,"Ahogado"),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(161,"ion-item",0),a.TgZ(162,"ion-label"),a.TgZ(163,"p"),a._uU(164,"Entre calle 1: "),a.qZA(),a.qZA(),a.TgZ(165,"ion-input",9),a.NdJ("ngModelChange",function(e){return o.entreCalle1=e}),a.qZA(),a.qZA(),a.TgZ(166,"ion-item",0),a.TgZ(167,"ion-label"),a.TgZ(168,"p"),a._uU(169,"Entre calle 2: "),a.qZA(),a.qZA(),a.TgZ(170,"ion-input",9),a.NdJ("ngModelChange",function(e){return o.entreCalle2=e}),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(171,"ion-card",0),a.TgZ(172,"ion-card-content",0),a.TgZ(173,"ion-item",0),a.TgZ(174,"ion-label"),a.TgZ(175,"p"),a._uU(176," Observaciones: "),a.qZA(),a.qZA(),a.TgZ(177,"ion-textarea",26),a.NdJ("ngModelChange",function(e){return o.observaciones=e}),a.qZA(),a.qZA(),a.TgZ(178,"ion-button",27),a.NdJ("click",function(){return o.colocacionSello()}),a._UZ(179,"ion-icon",28),a._uU(180," Colocaci\xf3n de sello "),a.YNc(181,v,1,0,"ion-icon",29),a.qZA(),a.qZA(),a.qZA(),a.TgZ(182,"ion-slides",30),a.YNc(183,_,3,2,"ion-slide",31),a.qZA(),a.TgZ(184,"ion-item",32),a.TgZ(185,"ion-label"),a.TgZ(186,"p",33),a._uU(187," Fotos de la visita "),a.qZA(),a.TgZ(188,"ion-grid"),a.TgZ(189,"ion-row"),a.TgZ(190,"ion-col",34),a.TgZ(191,"ion-button",35),a.NdJ("click",function(){return o.confirmaFoto(1)}),a._UZ(192,"ion-icon",36),a.qZA(),a.TgZ(193,"ion-label",33),a._uU(194,"Fachada Predio"),a.qZA(),a.qZA(),a.TgZ(195,"ion-col",34),a.TgZ(196,"ion-button",37),a.NdJ("click",function(){return o.confirmaFoto(2)}),a._UZ(197,"ion-icon",36),a.qZA(),a.TgZ(198,"ion-label",33),a._uU(199,"Evidencia"),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(200,"ion-grid"),a.TgZ(201,"ion-row"),a.TgZ(202,"ion-col",34),a.TgZ(203,"ion-button",38),a.NdJ("click",function(){return o.confirmaFoto(3)}),a._UZ(204,"ion-icon",36),a.qZA(),a.TgZ(205,"ion-label",33),a._uU(206,"Toma"),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(207,"ion-grid"),a.TgZ(208,"ion-row"),a.TgZ(209,"ion-col",39),a.TgZ(210,"ion-button",40),a.NdJ("click",function(){return o.verify()}),a._uU(211,"Terminar"),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(212,"ion-segment",41),a.TgZ(213,"ion-segment-button",42),a.NdJ("click",function(){return o.salida(1)}),a._UZ(214,"ion-icon",43),a.TgZ(215,"ion-label",44),a.TgZ(216,"small"),a._uU(217,"Inicio"),a.qZA(),a.qZA(),a.qZA(),a.TgZ(218,"ion-segment-button",42),a.NdJ("click",function(){return o.salida(2)}),a._UZ(219,"ion-icon",45),a.TgZ(220,"ion-label",44),a.TgZ(221,"small"),a._uU(222,"Cuentas"),a.qZA(),a.qZA(),a.qZA(),a.TgZ(223,"ion-segment-button",42),a.NdJ("click",function(){return o.salida(3)}),a._UZ(224,"ion-icon",46),a.TgZ(225,"ion-label",44),a.TgZ(226,"small"),a._uU(227,"Mapa"),a.qZA(),a.qZA(),a.qZA(),a.TgZ(228,"ion-segment-button",42),a.NdJ("click",function(){return o.salida(4)}),a._UZ(229,"ion-icon",47),a.TgZ(230,"ion-label",44),a.TgZ(231,"small"),a._uU(232,"S.P\xfablicos"),a.qZA(),a.qZA(),a.qZA(),a.TgZ(233,"ion-segment-button",42),a.NdJ("click",function(){return o.salida(5)}),a._UZ(234,"img",48),a.TgZ(235,"ion-label",49),a.TgZ(236,"small"),a._uU(237,"S.O.S."),a.qZA(),a.qZA(),a.qZA(),a.qZA()),2&e&&(a.xp6(7),a.Q6J("name",o.iconoProceso),a.xp6(4),a.Oqu(o.nombreProceso),a.xp6(11),a.hij(" ",o.nombrePlaza," "),a.xp6(6),a.hij(" ",o.nombreTareaAsignada," "),a.xp6(6),a.hij(" ",o.account," "),a.xp6(6),a.hij(" ",o.propietario," "),a.xp6(13),a.Q6J("ngModel",o.personaAtiende),a.xp6(6),a.Q6J("ngModel",o.idPuesto),a.xp6(13),a.Q6J("ngIf",o.mostrarOtroPuesto),a.xp6(8),a.Q6J("ngModel",o.idMotivoNoPago),a.xp6(9),a.Q6J("ngIf",o.activaOtroMotivo),a.xp6(8),a.hij(" ",o.tipoServicioPadron," "),a.xp6(6),a.Q6J("ngModel",o.idTipoServicio),a.xp6(17),a.Q6J("ngIf",o.mostrarGiro),a.xp6(1),a.Q6J("ngIf",o.plazaAgua),a.xp6(10),a.Q6J("ngModel",o.numeroNiveles),a.xp6(5),a.Q6J("ngModel",o.colorFachada),a.xp6(5),a.Q6J("ngModel",o.colorPuerta),a.xp6(5),a.Q6J("ngModel",o.referencia),a.xp6(6),a.Q6J("ngModel",o.idTipoPredio),a.xp6(13),a.Q6J("ngModel",o.entreCalle1),a.xp6(5),a.Q6J("ngModel",o.entreCalle2),a.xp6(7),a.Q6J("ngModel",o.observaciones),a.xp6(1),a.Q6J("disabled",o.sello),a.xp6(3),a.Q6J("ngIf",o.sello),a.xp6(1),a.Q6J("options",o.sliderOpts),a.xp6(1),a.Q6J("ngForOf",o.imgs))},directives:[g.W2,g.gu,g.Q$,g.PM,g.hM,g.FN,g.Ie,g.YG,g.pK,g.j9,p.JJ,p.On,g.t9,g.QI,g.n0,m.O5,g.yW,g.as,g.g2,g.Hr,m.sg,g.jY,g.Nd,g.wI,g.cJ,g.GO,g.A$,g.W4],styles:[".contenedor-icono-proceso[_ngcontent-%COMP%]{background-image:linear-gradient(180deg,#3880ff,#2e68db,#2352b9,#143c98,#002878);border:2px solid lime;width:70px;height:70px;border-radius:50%;display:flex;justify-content:center;align-items:center;margin:20px auto;padding:10px}.icono-proceso[_ngcontent-%COMP%]{text-align:center;color:#00c800;font-size:40px}.contenedor-nombre-proceso[_ngcontent-%COMP%]{text-align:center;margin-bottom:20px}.contenedor-nombre-proceso[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{text-align:center;font-size:22px;font-weight:700}.button-fotos-historicas[_ngcontent-%COMP%]{margin:10px 0}ion-card[_ngcontent-%COMP%]{padding:15px 0;border-top:.7px dotted #00c800;border-bottom:.7px dotted #00c800}p[_ngcontent-%COMP%]{font-weight:300;font-size:11px;color:#000}.myCustomSelect[_ngcontent-%COMP%], ion-select[_ngcontent-%COMP%]{max-width:100%!important}.imagen[_ngcontent-%COMP%]{width:35%;height:35%;margin-top:30px;margin-bottom:30px}p[_ngcontent-%COMP%]{color:#fff!important}.fotos-visita[_ngcontent-%COMP%]{text-align:center;color:#fff}.plaza[_ngcontent-%COMP%], .procedimiento[_ngcontent-%COMP%]{width:100px!important}ion-input[_ngcontent-%COMP%], ion-textarea[_ngcontent-%COMP%]{color:#fff!important}.icon-trash[_ngcontent-%COMP%]{color:red}ion-segment[_ngcontent-%COMP%]{--background:#254061;border-top:1px solid #0000001a;height:60px;margin-bottom:-5px}ion-segment-button[_ngcontent-%COMP%]{--indicator-color:#0000!important}"]}),e})()}}]);