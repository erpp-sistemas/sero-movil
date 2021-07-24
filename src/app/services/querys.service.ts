import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuerysService {

  constructor() { }

  getTables() {

    let tableAgua = `CREATE TABLE IF NOT EXISTS agua (id INTEGER PRIMARY KEY AUTOINCREMENT, cuenta TEXT, adeudo TEXT, SupTerrenoH TEXT, SupConstruccionH TEXT, ValorTerrenoH TEXT, ValorConstruccionH TEXT, ValorCatastralH TEXT, tareaAsignada TEXT, ultimo_pago TEXT, nombre_propietario TEXT, telefono_propietario TEXT, celular_propietario TEXT, correo_electronico_propietario TEXT, calle_predio TEXT, num_interior_predio TEXT, num_exterior_predio TEXT, cp_predio TEXT, colonia_predio TEXT, entre_calle1_predio TEXT, entre_calle2_predio TEXT, manzana_predio TEXT, lote_predio TEXT, poblacion_predio TEXT, calle_notificacion TEXT, num_interior_notificacion TEXT, num_exterior_notificacion TEXT, cp_notificacion TEXT, colonia_notificacion TEXT, entre_calle1_notificacion TEXT, entre_calle2_notificacion TEXT, manzana_notificacion TEXT, lote_notificacion TEXT, referencia_predio TEXT, referencia_notificacion TEXT, id_tarea INTEGER, latitud TEXT, longitud TEXT, tipoServicio TEXT, clave_catastral TEXT, numero_medidor TEXT, tipo_servicio TEXT, gestionada INTEGER  NOT NULL DEFAULT 0)`;

    let tablePredio = `CREATE TABLE IF NOT EXISTS predio (id INTEGER PRIMARY KEY AUTOINCREMENT, cuenta TEXT, adeudo TEXT, SupTerrenoH TEXT, SupConstruccionH TEXT, ValorTerrenoH TEXT, ValorConstruccionH TEXT, ValorCatastralH TEXT, tareaAsignada TEXT, ultimo_pago TEXT, nombre_propietario TEXT, telefono_propietario TEXT, celular_propietario TEXT, correo_electronico_propietario TEXT, calle_predio TEXT, num_interior_predio TEXT, num_exterior_predio TEXT, cp_predio TEXT, colonia_predio TEXT, entre_calle1_predio TEXT, entre_calle2_predio TEXT, manzana_predio TEXT, lote_predio TEXT, poblacion_predio TEXT, calle_notificacion TEXT, num_interior_notificacion TEXT, num_exterior_notificacion TEXT, cp_notificacion TEXT, colonia_notificacion TEXT, entre_calle1_notificacion TEXT, entre_calle2_notificacion TEXT, manzana_notificacion TEXT, lote_notificacion TEXT, referencia_predio TEXT, referencia_notificacion TEXT, id_tarea INTEGER, latitud TEXT, longitud TEXT, tipoServicio TEXT, clave_catastral TEXT, numero_medidor TEXT, tipo_servicio TEXT, gestionada INTEGER  NOT NULL DEFAULT 0)`;

    // let tablePozos = `CREATE TABLE IF NOT EXISTS pozos_conagua (id INTEGER PRIMARY KEY AUTOINCREMENT, folio TEXT, numero_titulo text, titular TEXT, representante_legal TEXT, rfc TEXT, domicilio TEXT, municipio TEXT, uso_agua TEXT, vol_ext_anu TEXT, vol_con_anu TEXT, profundidad TEXT, latitud TEXT, longitud TEXT )`

    let tableAntenas = `CREATE TABLE IF NOT EXISTS antenas (id INTEGER PRIMARY KEY AUTOINCREMENT, cuenta TEXT, adeudo TEXT, SupTerrenoH TEXT, SupConstruccionH TEXT, ValorTerrenoH TEXT, ValorConstruccionH TEXT, ValorCatastralH TEXT, tareaAsignada TEXT, ultimo_pago TEXT, nombre_propietario TEXT, telefono_propietario TEXT, celular_propietario TEXT, correo_electronico_propietario TEXT, calle_predio TEXT, num_interior_predio TEXT, num_exterior_predio TEXT, cp_predio TEXT, colonia_predio TEXT, entre_calle1_predio TEXT, entre_calle2_predio TEXT, manzana_predio TEXT, lote_predio TEXT, poblacion_predio TEXT, calle_notificacion TEXT, num_interior_notificacion TEXT, num_exterior_notificacion TEXT, cp_notificacion TEXT, colonia_notificacion TEXT, entre_calle1_notificacion TEXT, entre_calle2_notificacion TEXT, manzana_notificacion TEXT, lote_notificacion TEXT, referencia_predio TEXT, referencia_notificacion TEXT, id_tarea INTEGER, latitud TEXT, longitud TEXT, tipoServicio TEXT, clave_catastral TEXT, numero_medidor TEXT, tipo_servicio TEXT, gestionada INTEGER  NOT NULL DEFAULT 0)`;

    let tablePozos = `CREATE TABLE IF NOT EXISTS pozos (id INTEGER PRIMARY KEY AUTOINCREMENT, cuenta TEXT, adeudo TEXT, SupTerrenoH TEXT, SupConstruccionH TEXT, ValorTerrenoH TEXT, ValorConstruccionH TEXT, ValorCatastralH TEXT, tareaAsignada TEXT, ultimo_pago TEXT, nombre_propietario TEXT, telefono_propietario TEXT, celular_propietario TEXT, correo_electronico_propietario TEXT, calle_predio TEXT, num_interior_predio TEXT, num_exterior_predio TEXT, cp_predio TEXT, colonia_predio TEXT, entre_calle1_predio TEXT, entre_calle2_predio TEXT, manzana_predio TEXT, lote_predio TEXT, poblacion_predio TEXT, calle_notificacion TEXT, num_interior_notificacion TEXT, num_exterior_notificacion TEXT, cp_notificacion TEXT, colonia_notificacion TEXT, entre_calle1_notificacion TEXT, entre_calle2_notificacion TEXT, manzana_notificacion TEXT, lote_notificacion TEXT, referencia_predio TEXT, referencia_notificacion TEXT, id_tarea INTEGER, latitud TEXT, longitud TEXT, tipoServicio TEXT, clave_catastral TEXT, numero_medidor TEXT, tipo_servicio TEXT, gestionada INTEGER  NOT NULL DEFAULT 0)`;

    let tableInspeccionAgua = `CREATE TABLE IF NOT EXISTS gestionInspeccionAgua (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, cuenta TEXT, clave TEXT, ordenInspeccion TEXT, numeroMedidor TEXT, pozoConagua TEXT, idTipoServicio INTEGER, idHallazgo INTEGER, otroHallazgo TEXT, idAspUser TEXT, inspector2 TEXT, inspector3 TEXT, inspector4 TEXT, idTarea INTEGER,  fechaCaptura TEXT, latitud TEXT, longitud TEXT, cargado INTEGER NOT NULL DEFAULT 0  )`;
    
    let tableInspeccionPredio = `CREATE TABLE IF NOT EXISTS gestionInspeccionPredio (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, claveCatastral TEXT, nombreContribuyente TEXT, direccion TEXT, orden TEXT, usoSuelo TEXT, observaciones TEXT, avaluo TEXT, idAspUser TEXT, inspector2 TEXT, inspector3 TEXT, inspector4 TEXT, idTarea INTEGER,  fechaCaptura TEXT, latitud TEXT, longitud TEXT, cargado INTEGER NOT NULL DEFAULT 0  )`

    // Agua
    let tableFotos = `CREATE TABLE IF NOT EXISTS capturaFotos (id INTEGER PRIMARY KEY AUTOINCREMENT, imagenLocal TEXT, cuenta TEXT,fecha TEXT,rutaBase64 TEXT,idAspUser TEXT,idTarea INTEGER,tipo TEXT,urlImagen TEXT,isSelected INTEGER NOT NULL DEFAULT 0,cargado INTEGER NOT NULL DEFAULT 0)`;

    let tableFotosPredio = `CREATE TABLE IF NOT EXISTS capturaFotosPredio (id INTEGER PRIMARY KEY AUTOINCREMENT, imagenLocal TEXT, cuenta TEXT,fecha TEXT,rutaBase64 TEXT,idAspUser TEXT,idTarea INTEGER,tipo TEXT,urlImagen TEXT,isSelected INTEGER NOT NULL DEFAULT 0,cargado INTEGER NOT NULL DEFAULT 0)`;

    let tableFotosAntenas = `CREATE TABLE IF NOT EXISTS capturaFotosAntenas (id INTEGER PRIMARY KEY AUTOINCREMENT, imagenLocal TEXT, cuenta TEXT,fecha TEXT,rutaBase64 TEXT,idAspUser TEXT,idTarea INTEGER,tipo TEXT,urlImagen TEXT,isSelected INTEGER NOT NULL DEFAULT 0,cargado INTEGER NOT NULL DEFAULT 0)`;

    let tableFotosPozos = `CREATE TABLE IF NOT EXISTS capturaFotosPozos (id INTEGER PRIMARY KEY AUTOINCREMENT, imagenLocal TEXT, cuenta TEXT,fecha TEXT,rutaBase64 TEXT,idAspUser TEXT,idTarea INTEGER,tipo TEXT,urlImagen TEXT,isSelected INTEGER NOT NULL DEFAULT 0,cargado INTEGER NOT NULL DEFAULT 0)`;

    let tables = {
      tableAgua,
      tablePredio,
      tableAntenas,
      tablePozos,
      tableInspeccionAgua,
      tableInspeccionPredio,
      tableFotos,
      tableFotosPredio,
      tableFotosAntenas,
      tableFotosPozos
    }

    return tables;

  }


}
