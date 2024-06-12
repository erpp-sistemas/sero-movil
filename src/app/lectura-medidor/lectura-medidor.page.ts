import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';
//import { CameraPreview, CameraPreviewOptions } from '@awesome-cordova-plugins/camera-preview/ngx';
//import { OCR, OCRResult, OCRSourceType } from '@awesome-cordova-plugins/ocr/ngx';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-lectura-medidor',
  templateUrl: './lectura-medidor.page.html',
  styleUrls: ['./lectura-medidor.page.scss'],
})
export class LecturaMedidorPage implements OnInit {

  @Input() idPlaza: any;
  @Input() account: any;
  @Input() idServicioPlaza: any;


  imgs: any;
  imgs_medidor: any
  propietario: string = "";
  infoAccount: any = [];

  numero_medidor: string = ''
  marca_medidor: string = '';
  diametro_toma_medidor: string = ''

  funcionaMedidor: string = ''
  idFuncionaMedidor: number = 0
  activaNoFuncionaMedidor: boolean = false;
  otraOpcionNoFuncionaMedidor: string = ''

  inconsistenciaMedidor: string = ''
  idInconsistenciaMedidor: number = 0
  activaInconsistenciaMedidor: boolean = false;
  lectura_medidor: string = '';

  idAspUser: string = '';
  idTarea: number = 0;
  latitud: number;
  longitud: number;
  nombrePlaza: any;
  id_plaza: any;
  idAccountSqlite: any;
  idTareaGestor: any;
  gestionada: number;
  tareaAsignada: number = 0;
  nombreTareaAsignada: string = '';
  fechaActual: any;
  infoImage: any = [];
  takePhoto: boolean = false;
  image: string = '';
  isPhoto: boolean = false;
  loading: any;
  fechaCaptura: any;
  fechaCapturaFoto: any;



  indicadorImagen: number = 0;
  indicadorImagenNumeroMedidor: number = 0;
  indicadorImagenLecturaMedidor: number = 0;
  indicadorImagenMedidor: number = 0;

  tipoServicio: number = 0;
  tipoServicioPadron: string = '';
  geoPosicion: any = {};
  type_photo_medidor: any;
  showIonContent: boolean = true
  img_numero_medidor: string = '';
  img_lectura_medidor: string = ''

  id_proceso: any;
  nombreProceso: string;
  iconoProceso: string;

  lectura_medidor_ocr: any = ''

  id_anomalia: number = 0
  leyendaAnomalia: boolean = false


  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };

  // cameraPreviewOpts: CameraPreviewOptions = {
  //   x: 100,
  //   y: 190,
  //   width: window.screen.width - 200,
  //   height: window.screen.height - 630,
  //   camera: 'rear',
  //   tapPhoto: true,
  //   previewDrag: true,
  //   toBack: true,
  //   alpha: 1,
  //   storeToFile: false,
  //   disableExifHeaderStripping: false,
  //   tapFocus: true
  // }


  constructor(
    private modalCtrl: ModalController,
    private mensaje: MessagesService,
    private camera: Camera,
    private webview: WebView,
    private photoService: PhotoService
    // private router: Router,
    // private callNumber: CallNumber,
    // private alertCtrl: AlertController,
    //private cameraPreview: CameraPreview,
    //private ocr: OCR
  ) {
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
    this.imgs_medidor = [{ imagen: "assets/img/imgs.png" }];
  }

  ngOnInit() {
    this.getFechaActual();
  }

  getFechaActual() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    this.fechaActual = ionicDate.toISOString();
    let fecha = this.fechaActual.split("T");
    this.fechaActual = fecha[0];
  }

  resultAnomalia( event: any ) {
    let opcion = event.target.value
    
    if(opcion == '5') {
      // activar la opcion de medidor descompuesto
      this.activaNoFuncionaMedidor = true
      this.activaInconsistenciaMedidor = false
      this.idInconsistenciaMedidor = 0
    } else if(opcion == '19') {
      this.activaInconsistenciaMedidor = true
      this.activaNoFuncionaMedidor = false
      this.idFuncionaMedidor = 0
    } else {
      this.activaInconsistenciaMedidor = false
      this.activaNoFuncionaMedidor = false
      this.idFuncionaMedidor = 0
      this.idInconsistenciaMedidor = 0
      this.otraOpcionNoFuncionaMedidor = ''
    }

  }

  closeCamera() {
    // this.cameraPreview.stopCamera().then(() => {
    //   console.log("Se detuvo la camara")
    //   this.showIonContent = true
    // })
  }



  takePic(type: number) {

    if (type == 1 || type == 2 || type == 5) {
      this.takePicOther(type)
    } else if (type == 3 || type == 4) {
      this.takePicCut(type)
    }


  }

  takePicOther(type: any) {

    let tipo = ''
    if (type == 1) {
      tipo = 'Fachada predio'
    } else if (type == 2) {
      tipo = 'Cuadro toma'
    } else if (type == 5) {
      tipo = 'Estado medidor'
    }

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

    this.fechaCapturaFoto = ionicDate.toISOString();

    let options: CameraOptions = {
      quality: 40,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    };

    this.camera
      .getPicture(options)
      .then(imageData => {
        this.indicadorImagen = this.indicadorImagen + 1;
        let rutaBase64 = imageData;
        this.image = this.webview.convertFileSrc(imageData);
        
        if(type == 1) {
          this.takePhoto = true;
        }

        this.isPhoto = false;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1);
        }

        this.saveImage(
          this.id_plaza,
          this.nombrePlaza,
          this.image,
          this.account,
          this.fechaCapturaFoto,
          rutaBase64,
          this.idAspUser,
          this.tareaAsignada,
          tipo,
          this.idServicioPlaza
        );
      })
      .catch(error => {
        console.error(error);
      });

  }

  takePicCut(type: any) {
    console.log(this.img_numero_medidor)
    console.log(this.img_lectura_medidor)
    if (type == 3) {
      if (this.img_numero_medidor !== '') {
        // ya se tiene la foto entonces no se puede tomar otra
        this.mensaje.showAlert("Ya se tiene foto del número de medidor, solo se puede ingresar una de este tipo")
        return
      }
    }

    if (type == 4) {
      if (this.img_lectura_medidor !== '') {
        // ya se tiene la foto entonces no se puede tomar otra
        this.mensaje.showAlert("Ya se tiene foto de la lectura de medidor, solo se puede ingresar una de este tipo")
        return
      }
    }

    this.type_photo_medidor = type;
    //this.cameraPreview.stopCamera();
    console.log("Se ejecuta el takePicCut")

    // this.cameraPreview.startCamera(this.cameraPreviewOpts).then((message) => {
    //   this.showIonContent = false
    //   console.log(message)
    // })
  }


  async takePicture() {

    this.getFechaActual()

    // this.cameraPreview.takePicture({
    //   width: 1280,
    //   height: 1280,
    //   quality: 85
    // }).then(async (imageData) => {

    //   //console.log(imageData)
    //   const rutaBase64 = imageData
    //   let tipo = ''

    //   this.indicadorImagenMedidor++;

    //   if (this.type_photo_medidor === 3) {
    //     this.img_numero_medidor = 'data:image/jpeg;base64,' + imageData
    //     this.indicadorImagenNumeroMedidor++;
    //     tipo = 'Numero medidor'
    //     this.imgs_medidor.push({
    //       imagen: this.img_numero_medidor
    //     })

    //   }

    //   if (this.type_photo_medidor === 4) {
    //     this.img_lectura_medidor = 'data:image/jpeg;base64,' + imageData
    //     this.indicadorImagenLecturaMedidor++;

    //     tipo = 'Lectura medidor'
    //     this.imgs_medidor.push({
    //       imagen: this.img_lectura_medidor
    //     })
    //   }

    //   // si el indicador imagen es 1 quitamos el primero que viene siendo la imagen del icono de la camara
    //   // cuando el indicador es 1 eso quiere decir que es la primer foto que se toma
    //   if (this.indicadorImagenMedidor === 1) {
    //     this.imgs_medidor.splice(0, 1);
    //   }


    //   this.saveImage(this.id_plaza, this.nombrePlaza, this.type_photo_medidor == 3 ? this.img_numero_medidor : this.img_lectura_medidor, this.account, this.fechaActual, rutaBase64, this.idAspUser, this.tareaAsignada, tipo, this.idServicioPlaza);

    //   if (tipo === 'Lectura medidor') {
    //     this.enableOCR(rutaBase64);
    //   } else {
    //     this.lectura_medidor_ocr = ''
    //   }

    //   this.closeCamera()

    // }, (err) => {
    //   console.log(err);
    // });

  }

  enableOCR(image: any) {

    // this.ocr.recText(OCRSourceType.BASE64, image)
    //   .then((res: OCRResult) => {

    //     console.log(res)

    //     if (res.foundText) {
    //       const lineText = res.lines.linetext
    //       this.generateLecturaOCR(lineText)
    //     } else {
    //       this.lectura_medidor_ocr = ''
    //     }

    //   })
    //   .catch((error: any) => console.error(error));
  }

  generateLecturaOCR(lecturaArr: string[]) {
    console.log(lecturaArr)
    this.lectura_medidor_ocr = lecturaArr.join(',')
  }

  saveImage(id_plaza: number, nombrePlaza: string, image: any, accountNumber: string, fecha: string, rutaBase64: any, idAspuser: any, idTarea: any, tipo: any, idServicioPlaza: any) {
    this.photoService
      .saveImage(
        id_plaza,
        nombrePlaza,
        image,
        accountNumber,
        fecha,
        rutaBase64,
        idAspuser,
        idTarea,
        tipo,
        idServicioPlaza
      )
      .then(res => {
        this.mensaje.showToast("Se almacenó la imagen correctamente");
      });
  }

  async deletePhoto(img: any, type: any) {
  
    if (type == 1) {

      // tengo que bajar el indicadorImagenNumeroMedidor o el indicadorImagenLecturaMedidor
      this.indicadorImagenMedidor--

      if (this.indicadorImagenMedidor === 0) {
        this.imgs_medidor = [{ imagen: "assets/img/imgs.png" }];
      }

      if (this.indicadorImagenNumeroMedidor > 0) {
        this.img_numero_medidor = ''
      }

      if (this.indicadorImagenLecturaMedidor > 0) {
        this.img_lectura_medidor = ''
      }

      for (let i = 0; i < this.imgs_medidor.length; i++) {
        if (this.imgs_medidor[i].imagen == img) {
          this.imgs_medidor.splice(i, 1);
        }
      }
      console.log(this.img_lectura_medidor)
      console.log(this.img_numero_medidor)

    } else {

      this.indicadorImagen--

      if (this.indicadorImagen === 0) {
        this.imgs = [{ imagen: "assets/img/imgs.png" }];
      }

      for (let i = 0; i < this.imgs.length; i++) {
        if (this.imgs[i].imagen == img) {
          this.imgs.splice(i, 1);
        }
      }
    }

    this.infoImage = await this.photoService.getImageLocal(img);

  }

  messageTerminarGestion() {
    
  }


  regresar() {
    this.modalCtrl.dismiss()
  }

}
