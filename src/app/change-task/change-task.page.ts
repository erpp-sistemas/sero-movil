import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DblocalService } from '../services/dblocal.service';


@Component({
  selector: 'app-change-task',
  templateUrl: './change-task.page.html',
  styleUrls: ['./change-task.page.scss'],
})
export class ChangeTaskPage implements OnInit {

  @Input() id_proceso: any;

  tareas: any[] = []
  id_tarea_seleccionada: number = 0;
  nombre_tarea_seleccionada: string = ''

  constructor(
    private dbLocalService: DblocalService,
    private modalController: ModalController,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    console.log(this.id_proceso)
    await this.getCatTareaLocal()
  }

  async getCatTareaLocal() {
    this.tareas = await this.dbLocalService.getCatTareasLocal(this.id_proceso)
  }

  async changeTask(tarea: any) {
    const mensaje = await this.alertCtrl.create({
      header: "Confirmación",
      subHeader: `Confirmas que deseas cambiar la tarea por ${tarea.nombre_tarea}`,
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
            this.terminar(tarea)
          }
        },
      ]
    });
    await mensaje.present();
  }

  terminar(tarea: any) {
    this.id_tarea_seleccionada = tarea.id_tarea
    this.nombre_tarea_seleccionada = tarea.nombre_tarea
    this.back()
  }

  back() {
    this.modalController.dismiss({
      "id_tarea": this.id_tarea_seleccionada,
      "nombre_tarea" : this.nombre_tarea_seleccionada
    });
  }


}
