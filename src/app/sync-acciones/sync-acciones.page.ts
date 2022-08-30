import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LoadingController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import * as XLSX from 'xlsx';
import { Proceso } from '../interfaces/Procesos';


@Component({
  selector: 'app-sync-acciones',
  templateUrl: './sync-acciones.page.html',
  styleUrls: ['./sync-acciones.page.scss'],
})
export class SyncAccionesPage implements OnInit {

  loading: any;
  id_servicio_plaza: any;
  gestiones: any;
  totalGestiones: any;

  openSelectType: boolean = false;
  gestionesLocales: any[] = [];
  procesos: Proceso[] = [];
  procesoSeleccionado: any = '';

  procesosObj = {
    "1": "gestionCartaInvitacion",
    "3": "gestionInspeccion",
    "6": "gestionLegal"
  }

  constructor(
    private rest: RestService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private message: MessagesService,
    private activeRoute: ActivatedRoute,
    private callNumber: CallNumber,
    private storage: Storage,
    private file: File,
    private email: EmailComposer
  ) { }

  ngOnInit() {
    console.log("id_servicio_plaza: ", this.activeRoute.snapshot.paramMap.get('id_servicio_plaza'));
    this.id_servicio_plaza = this.activeRoute.snapshot.paramMap.get('id_servicio_plaza');
    this.listadoGestiones(this.id_servicio_plaza);

  }

  async listadoGestiones(idServicioPlaza) {
    console.log("Cargando el listado de acciones del servicio " + idServicioPlaza);
    this.gestiones = null;
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando el listado de acciones',
      spinner: 'dots'
    });
    await this.loading.present();
    await this.getInfoCuentas(idServicioPlaza);
    this.totalGestiones = this.gestiones!.length;
    console.log(this.totalGestiones);
    //this.getInfo(idServicioPlaza);
    this.loading.dismiss();
  }

  // async getInfo(idServicioPlaza) {
  //   this.totalGestiones = await this.rest.getTotalGestionadas(idServicioPlaza);
  //   console.log("Total de gestiones " + this.totalGestiones);
  // }


  async getInfoCuentas(idServicioPlaza) {
    this.gestiones = await this.rest.getAccountsGestiones(idServicioPlaza);
    console.log(this.gestiones);
    if (this.gestiones.length == 0) {
      this.message.showAlert("No tienes gestiones realizadas en este servicio!!!!");
      this.router.navigateByUrl('sincronizar-gestiones');
    }
  }

  async syncAccounts() {
    this.loading = await this.loadingCtrl.create({
      message: 'Enviando información',
      spinner: 'dots'
    });

    await this.loading.present();

    await this.rest.sendInspeccionByIdServicio(this.id_servicio_plaza);
    await this.rest.sendCartaInvitacionByIdServicio(this.id_servicio_plaza);
    await this.rest.sendLegalByIdServicio(this.id_servicio_plaza);
    await this.rest.sendInspeccionAntenasByIdServicio(this.id_servicio_plaza);
    await this.rest.sendEncuestaByIdServicio(this.id_servicio_plaza);
    await this.rest.sendCortesByIdServicio(this.id_servicio_plaza);
    this.loading.dismiss();
    this.router.navigateByUrl('home/tab1');
  }

  async syncAccount(cuenta: string, rol: string) {

    console.log(rol);

    this.loading = await this.loadingCtrl.create({
      message: 'Enviando la gestión',
      spinner: 'dots'
    });

    await this.loading.present();

    if (rol == 'Inspección') {
      const resultado = await this.rest.sendInspeccionByIdServicioAccount(this.id_servicio_plaza, cuenta);
      console.log(resultado);
    } else if (rol === 'Carta invitación') {
      const resultado = await this.rest.sendCartaByIdServicioAccount(this.id_servicio_plaza, cuenta);
      const resultadoEncuesta = await this.rest.sendEncuestaByCuenta(this.id_servicio_plaza, cuenta);
      console.log(resultado);
      console.log(resultadoEncuesta);
    } else if (rol === 'Legal') {
      const resultado = await this.rest.sendLegalByIdServicioAccount(this.id_servicio_plaza, cuenta);
      console.log(resultado);
    } else if (rol === 'Inspección Antenas') {
      const resultado = await this.rest.sendInspeccionAntenasByIdServicioAccount(this.id_servicio_plaza, cuenta)
      console.log(resultado);
    } else if (rol === 'Cortes') {
      const resultado = await this.rest.sendCortesByIdServicioAccount(this.id_servicio_plaza, cuenta);
      const resultadoEncuesta = await this.rest.sendEncuestaByCuenta(this.id_servicio_plaza, cuenta);
      console.log(resultado);
      console.log(resultadoEncuesta);
    }

    this.loading.dismiss();

    this.listadoGestiones(this.id_servicio_plaza);

  }

  async deleteAccount(cuenta: string, rol: string) {

    console.log(rol);

    let table = ''

    if (rol == 'Inspección') {
      table = 'gestionInspeccion';
    } else if (rol == 'Carta invitación') {
      table = 'gestionCartaInvitacion';
    } else if (rol == 'Legal') {
      table = 'gestionLegal';
    } else if (rol = 'Inpeccion Antenas') {
      table = 'gestionInspeccionAntenas'
    }

    console.log(table);

    const result = await this.rest.deleteAccountGestionGeneral(table, cuenta);
    console.log(result);

    this.listadoGestiones(this.id_servicio_plaza);

  }



  async selectType() {
    let id_plaza = await this.storage.get('IdPlazaActiva');
    console.log(id_plaza);
    this.procesos = await this.rest.getProcessLocalByIdPlaza(Number(id_plaza));
    console.log(this.procesos);
    this.openSelectType = true;
  }


  enviarArchivo() {
    if (this.procesoSeleccionado === '') {
      this.message.showAlert("Debe seleccionar el proceso que gestiono");
      return;
    }
    this.sendFile();
  }

  cancelarEnvioArchivo() {
    this.openSelectType = false;
  }

  async sendFile() {
    console.log("enviando ", this.procesoSeleccionado);
    let tipo = this.procesosObj[this.procesoSeleccionado];
    console.log(tipo);
    this.gestionesLocales = await this.rest.getGestionesLocalByIdServicio(this.id_servicio_plaza, tipo);
    console.log(this.gestionesLocales);
    this.createExcel();
  }

  createExcel() {
    var ws = XLSX.utils.json_to_sheet(this.gestionesLocales);
    var wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    var buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveToPhone(buffer);
  }

  async saveToPhone(buffer) {
    var fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var fileExtension = '.xlsx';
    var nameFile = await this.setNameFile();
    var data: Blob = new Blob([buffer], { type: fileType })
    this.file.writeFile(this.file.externalRootDirectory, nameFile + fileExtension, data, { replace: true })
      .then(() => {
        this.message.showToast("Excel guardado en el dispositivo!!!!");
        this.file.checkFile(this.file.externalRootDirectory, nameFile + fileExtension).then(() => {
          console.log("Archivo existe");
          this.sendEmail(nameFile, fileExtension);
        }).catch(err => console.log("Archivo no existe ", err))
      })
  }

  async sendEmail(name: string, extension: string) {
    let emailSend = {
      to: 'oscar.vazquez@erpp.mx',
      cc: 'antonio.ticante@erpp.mx',
      bcc: ['carlos.martinez@erpp.mx'],
      attachments: [
        `${this.file.externalRootDirectory}${name}${extension}`
      ],
      subject: 'Gestiones manuales',
      body: 'Buen dia tuve un error al enviar mis gestiones realizadas por lo que le mando mi archivo.',
      isHtml: true
    }

    this.email.open(emailSend).then(() => {
      this.message.showAlert("Se ha enviado el correo exitosamente");
      this.openSelectType = false;
      this.procesoSeleccionado = '';
    }).catch(err => console.log(err));
  }

  async setNameFile() {
    let email = await this.storage.get('Email');
    // let id_usuario = await this.storage.get('IdAspUser');
    let fechaEnvio = this.obtenerFechaActual();
    let fileName = `${email}-${fechaEnvio}`
    return fileName;
  }

  obtenerFechaActual() {
    let fecha = Date.now().toString();
    return fecha;
  }


  navegar(tipo) {
    this.openSelectType = false
    if (tipo == 1) {
      this.router.navigateByUrl('home/tab1');
    } else if (tipo == 2) {
      this.router.navigateByUrl('home/tab2');
    } else if (tipo == 3) {
      this.router.navigateByUrl('home/tab3');
    } else if (tipo == 4) {
      this.router.navigateByUrl('home/tab4');
    } else if (tipo == 5) {

      this.callNumber.callNumber('911', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }

}
