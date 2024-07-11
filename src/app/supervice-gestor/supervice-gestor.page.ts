import { Component, Input, OnInit } from '@angular/core';
import { Gestor } from '../interfaces';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Enum, FaceCaptureResponse, FaceSDK, LivenessResponse, MatchFacesImage, MatchFacesRequest, MatchFacesResponse, MatchFacesSimilarityThresholdSplit } from '@regulaforensics/ionic-native-face-api/ngx'
import { MessagesService } from '../services/messages.service';
import { Router } from '@angular/router';


var imageSelfie = new MatchFacesImage();
var imageSero = new MatchFacesImage();

@Component({
  selector: 'app-supervice-gestor',
  templateUrl: './supervice-gestor.page.html',
  styleUrls: ['./supervice-gestor.page.scss'],
})
export class SuperviceGestorPage implements OnInit {

  @Input() gestores: Gestor[];

  loading: any;

  
  constructor(
    private alertController: AlertController,
    private faceSdk: FaceSDK,
    private message: MessagesService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.faceSdk.init().then(json => {
      var response = JSON.stringify(json)
      if (response["success"] == false) {
        console.log("Init false")
        console.log(json)
      } else {
        console.log("Init complete")
      }
    });
  }

  async showMessageInitProcess(gestor: Gestor) {
    const mensaje = await this.alertController.create({
      header: `¿Quiéres supervisar a ${gestor.nombre} ${gestor.apellido_paterno} ${gestor.apellido_materno}?`,
      subHeader: `${gestor.nombre} Tendrá que tomarse una selfie en tu dispotivo para continuar ...`,
      buttons: [
        {
          text: "Regresar",
          cssClass: "secondary",
          handler: () => console.log("Regresar")
        },
        {
          text: "Aceptar",
          cssClass: "secondary",
          handler: () => this.initRecognizadedFace(gestor)
        }
      ]
    });
    await mensaje.present();
  }


  initRecognizadedFace(gestor: Gestor) {
    this.presentFace().then(async message => {

      this.message.showToast(message)

        this.setImageSero(gestor.foto, Enum.ImageType.PRINTED);
        
        this.matchFaces().then((data: any) => {
          
          if (data.estatus === 'passed') {
            this.success();
          } else {
            this.message.showAlert("Error!!!! -- No coinciden los biométricos")
          }

        }).catch(error => {
          console.log(error)
          this.message.showToast("Error al analizar los biométricos")
        })

    }).catch(error => {
      console.log(error)
      this.message.showToast("Error al capturar los biométricos, intentalo de nuevo ")
    })

  }


  presentFace() {
    return new Promise<string>((resolve, reject) => {
      this.faceSdk.presentFaceCaptureActivity().then(result => {
        this.setImage(FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap, Enum.ImageType.LIVE)
        resolve("Biometricos capturados")
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  }

  setImage(base64: string, type: number) {
    if (base64 === null) {
      console.log("No se pudieron tomar las facciones")
    } else {
      imageSelfie.bitmap = base64
      imageSelfie.imageType = type
    }
  }

  setImageSero(base64: string, type: number) {
    let imgBase64 = base64.substring(23)
    //console.log(imgBase64)
    if (base64 === null) {
      console.log("No se pudieron tomar las facciones")
    } else {
      imageSero.bitmap = imgBase64
      imageSero.imageType = type
    }
  }

  matchFaces() {
    return new Promise(async (resolve, reject) => {
      this.loading = await this.loadingController.create({
        message: 'Analizando biométricos',
        spinner: 'dots'
      })
      await this.loading.present();

      const request = new MatchFacesRequest();
      request.images = [imageSelfie, imageSero];
      this.faceSdk.matchFaces(JSON.stringify(request)).then(matchFacesResponse => {
        const response = MatchFacesResponse.fromJson(JSON.parse(matchFacesResponse));
        this.faceSdk.matchFacesSimilarityThresholdSplit(JSON.stringify(response.results), 0.75).then(splitResponse => {
          const split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(splitResponse))
          if (split.matchedFaces.length > 0) {
            this.loading.dismiss()
            resolve({ "estatus": "passed", "similarity": (split.matchedFaces[0].similarity * 100) })
          } else {
            this.loading.dismiss()
            resolve({ "estatus": "not_passed", "similarity": 0 })
          }
        }, e => {
          this.loading.dismiss()
          console.log(e)
          reject(e)
        });
      })
    })
  }


  success() {
    this.modalController.dismiss({
      status: true
    })
  }


}
