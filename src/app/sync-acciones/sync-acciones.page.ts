import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import * as XLSX from 'xlsx';
import { Proceso } from '../interfaces/Procesos';
import { DblocalService } from '../services/dblocal.service';
import { RegisterService } from '../services/register.service';


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
    private router: Router,
    private loadingCtrl: LoadingController,
    private message: MessagesService,
    private activeRoute: ActivatedRoute,
    private storage: Storage,
    private file: File,
    private email: EmailComposer,
    private dbLocalService: DblocalService,
    private registerService: RegisterService
  ) { }

  ngOnInit() {
    this.id_servicio_plaza = this.activeRoute.snapshot.paramMap.get('id_servicio_plaza');
    this.listadoGestiones(this.id_servicio_plaza);
  }

  async  listadoGestiones(id_servicio_plaza: number) {
    this.gestiones = null;
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando el listado de acciones',
      spinner: 'dots'
    });
    await this.loading.present();
    await this.getInfoCuentas(id_servicio_plaza);
    this.totalGestiones = this.gestiones!.length;
    this.loading.dismiss();
  }



  async getInfoCuentas(id_servicio_plaza: number) {
    this.gestiones = await this.registerService.getAccountsGestiones(id_servicio_plaza);
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

    await this.registerService.sendInspeccionByIdServicio(this.id_servicio_plaza);
    await this.registerService.sendCartaInvitacionByIdServicio(this.id_servicio_plaza);
    await this.registerService.sendLegalByIdServicio(this.id_servicio_plaza);
    await this.registerService.sendCortesByIdServicio(this.id_servicio_plaza);
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
      await this.registerService.sendInspeccionByIdServicioAccount(this.id_servicio_plaza, cuenta);
    } else if (rol === 'Carta invitación') {
      await this.registerService.sendCartaByIdServicioAccount(this.id_servicio_plaza, cuenta);
    } else if (rol === 'Legal') {
      await this.registerService.sendLegalByIdServicioAccount(this.id_servicio_plaza, cuenta);
    } else if (rol === 'Cortes') {
      await this.registerService.sendCortesByIdServicioAccount(this.id_servicio_plaza, cuenta);
    }

    this.loading.dismiss();

    this.listadoGestiones(this.id_servicio_plaza);

  }

  async deleteAccount(cuenta: string, rol: string) {

    let table = ''

    if (rol == 'Inspección') {
      table = 'gestionInspeccion';
    } else if (rol == 'Carta invitación') {
      table = 'gestionCartaInvitacion';
    } else if (rol == 'Legal') {
      table = 'gestionLegal';
    } 

   await this.registerService.deleteAccountGestionGeneral(table, cuenta);

    this.listadoGestiones(this.id_servicio_plaza);

  }



  async selectType() {
    let id_plaza = await this.storage.get('IdPlazaActiva');
    console.log(id_plaza);
    this.procesos = await this.dbLocalService.getProcessLocalByIdPlaza(Number(id_plaza));
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
    let tipo = this.procesosObj[this.procesoSeleccionado];
    console.log(tipo);
    this.gestionesLocales = await this.dbLocalService.getGestionesLocalByIdServicio(this.id_servicio_plaza, tipo);
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



}
