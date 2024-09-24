import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Form } from 'src/app/interfaces';
import { DblocalService } from 'src/app/services/dblocal.service';
import { MessagesService } from 'src/app/services/messages.service';
import { PhotoService } from 'src/app/services/photo.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {

  @Input() data: any;

  formulario: FormGroup;
  data_form_structure: Form[];
  name_form: string = '';
  icono_form: string = '';
  photos: string[] = [];
  currentRoute: string = '';
  have_signature: boolean = false;
  nombre_plaza: string = '';
  id_usuario: number = 0;
  id_plaza: number = 0;
  id_form: number = 0;
  longitud: number = 0;
  latitud: number = 0;
  geoPosicion: any = {};
  fecha_actual: string = '';

  // cuando es un formulario de gestion
  account: any;
  id_proceso: any;
  infoAccount: any;
  propietario: any;
  idAccountSqlite: any;
  tareaAsignada: any;
  nombreTareaAsignada: any;
  tipoServicioPadron: any;

  loading: any;


  imgs: any;
  infoImage: any = [];
  img_firma: any;
  img_firma_button_disabled: boolean = false;
  isPhoto: boolean = false;
  isFormGestion: boolean = false;
  indicadorImagen: number = 0;
  image: string = '';

  showGestor: boolean = false;


  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private geolocation: Geolocation,
    private alertController: AlertController,
    private dbLocalService: DblocalService,
    private messageService: MessagesService,
    private camera: Camera,
    private router: Router,
    private storage: Storage,
    private webview: WebView,
    private photoService: PhotoService,
    private rest: RestService
  ) { this.imgs = [{ imagen: 'assets/img/imgs.png' }] }

  async ngOnInit() {
    this.currentRoute = this.router.url;
    await this.getDataForm();
  }


  async getDataForm() {
    const data = await this.storage.get('IdsForms');
    const id_forms = JSON.parse(data);
    const form_arr = id_forms.filter((f: string) => f === this.currentRoute.substring(1, 100));
    const form = form_arr[0];
    this.getForm(form);
  }

  async getForm(form: string) {
    const data = await this.storage.get(form);
    this.data_form_structure = JSON.parse(data);
    this.id_form = this.data_form_structure[0].id_form;
    this.name_form = this.data_form_structure[0].nombre_form;
    this.icono_form = this.data_form_structure[0].icono;
    const photos_text = this.data_form_structure[0].name_photo;
    if (photos_text) this.photos = photos_text.split(',');

    if (this.currentRoute.includes('gestion')) {
      await this.getInfoAccount();
      this.isFormGestion = true;
    }

    if (this.currentRoute.includes('coordinator')) {
      this.showGestor = true;
    }

    await this.getInfoBasic();
    this.workArr();
    this.buildForm();

  }

  async getInfoBasic() {
    this.id_usuario = await this.storage.get('IdAspUser');
  }


  buildForm() {
    const formControls = {};
    for (const campo of this.data_form_structure) {
      if (campo.mandatory === 1 && campo.type_form === 'email') {
        formControls[campo.field] = ['', Validators.required, Validators.email];
      } else if (campo.mandatory === 1 && campo.type_form !== 'email') {
        formControls[campo.field] = ['', Validators.required];
      } else if (campo.mandatory === 0 && campo.type_form === 'email') {
        formControls[campo.field] = ['', Validators.email];
      } else {
        formControls[campo.field] = [''];
      }
    }
    this.formulario = this.fb.group(formControls);
  }


  workArr() {
    this.data_form_structure.forEach(item => {
      if (item.type_field_form === 'select') {
        this.setFieldSelectArray(item)
      }
    })
  }

  setFieldSelectArray(obj: any) {
    let options = obj.options_select;
    options = this.generateArray(options);
    obj.options_select = options;
  }

  generateArray(text: string) {
    let res = text.split(',');
    return res;
  }

  async getInfoAccount() {
    this.id_plaza = await this.storage.get('IdPlazaActiva');
    this.nombre_plaza = await this.storage.get('NombrePlazaActiva');
    this.account = await this.storage.get("account");
    this.id_proceso = await this.storage.get('id_proceso');
    this.infoAccount = await this.dbLocalService.getInfoAccount(this.account);
    this.propietario = this.infoAccount[0].propietario;
    this.idAccountSqlite = this.infoAccount[0].id;
    this.tareaAsignada = this.infoAccount[0].tarea_asignada;
    this.nombreTareaAsignada = this.infoAccount[0].nombre_tarea_asignada;
    this.tipoServicioPadron = this.infoAccount[0].tipo_servicio;
  }

  async onSubmit() {
    const mensaje = await this.alertController.create({
      header: "Mensaje",
      subHeader: "Recuerda que las fotos deben de estar correctas, de lo contrario es posible que la gestión no sea válida",
      buttons: [
        {
          text: "Regresar",
          cssClass: "secondary",
          handler: () => {
            console.log("Regresar")
          }
        },
        {
          text: "Aceptar",
          cssClass: "secondary",
          handler: () => {
            this.endGestion()
          }
        },
      ]
    });
    await mensaje.present();
  }


  async endGestion() {
    if (!this.formulario.valid) {
      this.messageService.showAlert("Tienes que cumplir con los requerimientos de los campos, *obligatorios y los que son email")
      return
    }
    if (this.fecha_actual === '') {
      this.fecha_actual = this.getDateCurrent();
    }

    this.loading = await this.loadingController.create({
      message: 'Enviando registro...',
      spinner: 'dots'
    })

    await this.loading.present();

    await this.getPosition()

    let data = {
      ...this.formulario.value,
      id_form: this.id_form,
      account: this.isFormGestion ? this.account : `${this.id_usuario}-${this.fecha_actual}`,
      fecha: this.fecha_actual,
      latitud: this.latitud,
      longitud: this.longitud,
      id_usuario: this.id_usuario,
    }

    if (this.showGestor) {
      data = { ...data, gestor_visitado: this.data.id_usuario }
    }

    console.log(data)

    try {
      const message = await this.rest.sendOneRegisterFormDynamic(data);
      if (message === 'No se pudo enviar') {
        //console.log("No se envio entonces vamos a guardarla")
        this.loading.dismiss()
        await this.saveLocal(data, this.fecha_actual)
      } else {
        this.loading.dismiss()
        this.exit()
      }
    } catch (error) {

    }

  }

  async saveLocal(data: any, fecha_actual: string) {
    this.loading = await this.loadingController.create({
      message: 'Guardando encuesta...',
      spinner: 'dots'
    })
    await this.loading.present();

    this.dbLocalService.insertRegisterFormDynamic(data, fecha_actual).then((message: string) => {
      console.log(message)
      this.messageService.showToastLarge(message)
      this.loading.dismiss()
      this.exit()
    }).catch(error => {
      this.messageService.showToastLarge(error)
      this.loading.dismiss();
    })
  }

  exit() {
    this.router.navigateByUrl('/home/tab1')
  }

  async getPosition() {
    let loadingGeolocation = await this.loadingController.create({
      message: 'Obteniendo ubicación...',
      spinner: 'dots'
    });

    await loadingGeolocation.present();

    await this.getGeolocation();

    if (this.geoPosicion.coords) {
      this.latitud = this.geoPosicion.coords.latitude;
      this.longitud = this.geoPosicion.coords.longitude;
    } else {
      console.log("No se pudo obtener la geolocalización");
      this.latitud = 0;
      this.longitud = 0;
    }

    loadingGeolocation.dismiss();
  }

  async getGeolocation() {
    return new Promise(async (resolve, reject) => {
      try {
        setTimeout(() => {
          resolve(this.geoPosicion);
        }, 5000);
        this.geoPosicion = await this.geolocation.getCurrentPosition();
      } catch (error) {
        console.log(error);
        reject(error)
      }
    })
  }

  getDateCurrent() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
    const fecha_actual = ionicDate.toISOString();
    return fecha_actual
  }


  takePic(photo: string) {

    let options: CameraOptions = {
      quality: 40,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options)
      .then(imageData => {
        if (this.fecha_actual === '') {
          this.fecha_actual = this.getDateCurrent();
        }
        this.indicadorImagen = this.indicadorImagen + 1;
        let rutaBase64 = imageData;
        this.image = this.webview.convertFileSrc(imageData);
        this.isPhoto = false;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1);
        }

        this.saveImageLocal(
          this.isFormGestion ? Number(this.id_plaza) : 0,
          this.isFormGestion ? this.nombre_plaza : 'Coordinación',
          this.image,
          this.isFormGestion ? this.account : `${this.id_usuario}-${this.fecha_actual}`,
          this.fecha_actual,
          rutaBase64,
          this.id_usuario,
          this.isFormGestion ? this.tareaAsignada : 0,
          photo,
          this.isFormGestion ? Number(this.tipoServicioPadron) : 0
        );
      })
      .catch(error => {
        console.error(error);
      });
  }


  //saveImage(id_plaza, nombrePlaza, image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo, idServicioPlaza) {

  async saveImageLocal(id_plaza: number, nombrePlaza: string, img: any, id: any, fecha_actual: string, rutaBase64: any, id_usuario: number, id_tarea: number, tipo: string, id_servicio_plaza: number) {

    this.photoService
      .saveImage(id_plaza, nombrePlaza, img, id, fecha_actual, rutaBase64, id_usuario, id_tarea, tipo, id_servicio_plaza)
      .then(res => this.messageService.showToast("Se almacenó la imagen correctamente"));

  }

  openSignature() {

  }

  deletePhoto(img: any) {

  }




}
