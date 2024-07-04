import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-update-address',
  templateUrl: './update-address.page.html',
  styleUrls: ['./update-address.page.scss'],
})
export class UpdateAddressPage implements OnInit {


  calle_historico: any = null;
  numero_exterior_historico: any = null;
  numero_interior_historico: any = null;
  manzana_historico: any = null;
  lote_historico: any = null;
  colonia_historico: any = null;
  codigo_postal_historico: any = null;

  calle: string = '';
  numero_exterior: string = '';
  numero_interior: string = '';
  manzana: string = '';
  lote: string = '';
  colonia: string = '';
  codigo_postal: number = 0;

  backButtonSubscription: any;


  @Input() idPlaza: number;
  @Input() account: string;
  @Input() idUsuario: number;
  @Input() data: any;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private messageService: MessagesService,
    private platform: Platform,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.calle_historico = this.data[0].calle;
    this.numero_exterior_historico = this.data[0].num_ext;
    this.numero_interior_historico = this.data[0].num_int;
    this.manzana_historico = this.data[0].manzana_predio;
    this.lote_historico = this.data[0].lote_predio;
    this.colonia_historico = this.data[0].colonia;
    this.codigo_postal_historico = this.data[0].codigo_postal;
  }

  ionViewDidEnter() {
    this.subscribeToBackButton();
  }

  ionViewWillLeave() {
    this.unsubscribeFromBackButton();
  }


  private async subscribeToBackButton() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, async () => {
      console.log("Se regreso")
    });
  }

  private unsubscribeFromBackButton() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }


  async messageValidate() {
    const alert = await this.alertController.create({
      header: 'Validar datos',
      subHeader: '¿Todos los datos son correctos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => console.log("Cancel")
        },
        {
          text: 'Aceptar',
          handler: () => this.save()
        }
      ]
    })

    await alert.present();
  }


  save() {
    if (this.calle === '') return this.messageService.showAlert("La calle es obligatoria")
    const data = {
      calle: this.calle,
      numero_exterior: this.numero_exterior,
      numero_interior: this.numero_interior,
      manzana: this.manzana,
      lote: this.lote,
      colonia: this.colonia,
      codigo_postal: this.codigo_postal,
      id_plaza: this.idPlaza,
      account: this.account,
      id_usuario: this.idUsuario
    }
    this.modalController.dismiss({ data })
  }

}
