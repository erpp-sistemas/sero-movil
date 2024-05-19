import { Component, OnInit } from '@angular/core';
import { DblocalService } from '../services/dblocal.service';
import { EncuestaGeneral } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuestas-list',
  templateUrl: './encuestas-list.page.html',
  styleUrls: ['./encuestas-list.page.scss'],
})
export class EncuestasListPage implements OnInit {

  data: EncuestaGeneral[]
  plazasServicios: any;
  id_plaza: number;
  encuestas_plazas: any;
  encuestas_plaza: any[]

  constructor(
    private dblocal: DblocalService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getDataEncuestas()
    this.getPlacesUser();
  }

  ionViewDidEnter() {
    this.getPlacesUser();
  }


  /**
   * Metodo que obtiene las plazas y los ids guardadas en el storage por auth.service
   */
  async getPlacesUser() {
    this.plazasServicios = await this.dblocal.obtenerPlazasSQL();
    this.id_plaza = this.plazasServicios[0].id_plaza;
    this.showEncuestasPlace()
  }

  /**
 * Metodo que se ejcuta cuando cambian en selec option de la plazam este metodo tambien se ejecuta al inicio 
 * @param event 
 */
  async resultPlaza(event: any) {
    if (this.id_plaza != 0) {
      this.showEncuestasPlace()
    }
  }

  async showEncuestasPlace() {
    const encuestas_place = this.encuestas_plazas[this.id_plaza]
    const temp = this.groupData(encuestas_place, 'id_encuesta')
    //console.log(temp)
    let encuestas_temp = []
    for (const clave in temp) {
      if (temp.hasOwnProperty(clave)) {
        let arr = temp[clave]
        encuestas_temp.push({
          id_encuesta: arr[0].id_encuesta,
          name_encuesta: arr[0].name_encuesta,
          icono_app_movil: arr[0].icono_app_movil
        })
      }
    }
    this.encuestas_plaza = encuestas_temp
  }


  async getDataEncuestas() {
    this.data = await this.dblocal.getDataEncuestas()
    //console.log(this.data)
    this.encuestas_plazas = this.groupData(this.data, 'id_plaza')
    //console.log(this.encuestas_plazas)
  }

  groupData(data: any[], field: string) {
    const agrupadoPorId = data.reduce((resultado, objeto) => {
      // Verificar si ya existe un array para el id actual
      if (!resultado[objeto[field]]) {
        // Si no existe, crear un nuevo array
        resultado[objeto[field]] = [];
      }

      // Agregar el objeto al array correspondiente al id
      resultado[objeto[field]].push(objeto);

      return resultado;
    }, {});
    
    return agrupadoPorId

  }


  goEncuesta(id_encuesta: number) {
    this.router.navigate(['encuesta-general', this.id_plaza, id_encuesta]);
  }

}
