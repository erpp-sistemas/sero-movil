import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Form } from 'src/app/interfaces';
import { DblocalService } from 'src/app/services/dblocal.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {

  formulario: FormGroup;
  data_form_structure: Form[];
  name_form: string = '';
  icono_form: string = '';
  photos: string[] = [];
  currentRoute: string = '';
  have_signature: boolean = false;
  id_plaza: number = 0;
  nombre_plaza: string = '';
  id_usuario: number = 0;
  id_servicio: number = 0;
  id_form: number = 0;
  longitud: number = 0;
  latitud: number = 0;
  geoPosicion: any = {};
  fecha_actual: string = '';

  imgs: any;
  infoImage: any = [];
  img_firma: any;
  img_firma_button_disabled: boolean = false;
  isPhoto: boolean = false;
  isFormGestion: boolean = false;


  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private geolocation: Geolocation,
    private alertController: AlertController,
    private dbLocalService: DblocalService,
    private messageService: MessagesService,
    private modalController: ModalController,
    private camera: Camera,
    private router: Router,
    private storage: Storage
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

    await this.getInfoBasic();
    this.workArr();
    this.buildForm();

  }

  async getInfoBasic() {
    this.id_usuario = await this.storage.get('IdUsuario');
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

  }



}
