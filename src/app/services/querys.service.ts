import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuerysService {

  constructor() { }

  getTables() {

    let tableSero = `CREATE TABLE IF NOT EXISTS sero_principal (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza TEXT, id_servicio_plaza INTEGER, cuenta TEXT, total TEXT, superficie_terreno_h TEXT, superficie_construccion_h TEXT, valor_terreno_h TEXT, valor_construccion_h TEXT, valor_catastral_h TEXT, tarea_asignada TEXT, fecha_ultimo_pago TEXT, propietario TEXT, telefono_casa TEXT, telefono_celular TEXT, correo_electronico TEXT, calle TEXT, num_int TEXT, num_ext TEXT, codigo_postal TEXT, colonia TEXT, entre_calle1_predio TEXT, entre_calle2_predio TEXT, manzana_predio TEXT, lote_predio TEXT, poblacion TEXT, calle_notificacion TEXT, num_interior_notificacion TEXT, num_exterior_notificacion TEXT, cp_notificacion TEXT, colonia_notificacion TEXT, entre_calle1_notificacion TEXT, entre_calle2_notificacion TEXT, manzana_notificacion TEXT, lote_notificacion TEXT, referencia_predio TEXT, referencia_notificacion TEXT, nombre_tarea_asignada TEXT, latitud TEXT, longitud TEXT, tipo_servicio TEXT, clave_catastral TEXT, serie_medidor TEXT, id_proceso INTEGER, proceso_gestion TEXT, url_aplicacion_movil TEXT, icono_proceso TEXT, gestionada INTEGER  NOT NULL DEFAULT 0)`;

    let tableInspeccion = `CREATE TABLE IF NOT EXISTS gestionInspeccion (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, nombre_plaza TEXT, account TEXT, personaAtiende TEXT, idPuesto INTEGER, otroPuesto TEXT, idTipoServicio INTEGER, numeroNiveles INTEGER, colorFachada TEXT, colorPuerta TEXT, referencia TEXT, idTipoPredio INTEGER, entreCalle1 TEXT, entreCalle2 TEXT, hallazgoNinguna INTEGER, hallazgoNegaronAcceso INTEGER, hallazgoMedidorDescompuesto INTEGER, hallazgoDiferenciaDiametro INTEGER, hallazgoTomaClandestina INTEGER, hallazgoDerivacionClandestina INTEGER, hallazgoDrenajeClandestino INTEGER, hallazgoCambioGiro INTEGER, hallazgoFaltaDocumentacion INTEGER, idAspUser TEXT, inspector2 TEXT, inspector3 TEXT, inspector4 TEXT, observacion TEXT, lectura_medidor TEXT, giro TEXT, idTarea INTEGER, fechaCaptura TEXT, latitud TEXT, longitud TEXT, id_servicio_plaza INTEGER, cargado INTEGER NOT NULL DEFAULT 0  )`;
    
    let tableCartaInvitacion = `CREATE TABLE IF NOT EXISTS gestionCartaInvitacion (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, nombre_plaza TEXT, account TEXT, persona_atiende TEXT, id_tipo_servicio INTEGER, numero_niveles TEXT, color_fachada TEXT, color_puerta TEXT, referencia TEXT, tipo_predio TEXT, entre_calle1 TEXT, entre_calle2 TEXT, observaciones TEXT, lectura_medidor TEXT, giro TEXT, idAspUser TEXT, id_tarea INTEGER, fecha_captura TEXT, latitud TEXT, longitud TEXT,  id_servicio_plaza INTEGER, id_estatus_predio TEXT, id_tipo_gestion TEXT, id_tiempo_suministro_agua TEXT, lunes TEXT, martes TEXT, miercoles TEXT, jueves TEXT, viernes TEXT, sabado TEXT, domingo TEXT, coloco_sello INTEGER, id_motivo_no_pago INTEGER, otro_motivo_no_pago TEXT, cargado INTEGER NOT NULL DEFAULT 0)`

    let tableCortes = `CREATE TABLE IF NOT EXISTS gestionCortes (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, nombre_plaza TEXT, account TEXT, persona_atiende TEXT, id_tipo_servicio INTEGER, numero_niveles TEXT, color_fachada TEXT, color_puerta TEXT, referencia TEXT, tipo_predio TEXT, entre_calle1 TEXT, entre_calle2 TEXT, observaciones TEXT, lectura_medidor TEXT, giro TEXT, idAspUser TEXT, id_tarea INTEGER, fecha_captura TEXT, latitud TEXT, longitud TEXT,  id_servicio_plaza INTEGER, id_estatus_predio TEXT, id_tipo_gestion TEXT, id_tiempo_suministro_agua TEXT, lunes TEXT, martes TEXT, miercoles TEXT, jueves TEXT, viernes TEXT, sabado TEXT, domingo TEXT, cargado INTEGER NOT NULL DEFAULT 0)`

    let tableLegal = `CREATE TABLE IF NOT EXISTS gestionLegal (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, nombre_plaza TEXT, account TEXT, persona_atiende TEXT, id_puesto INTEGER, otro_puesto TEXT, id_motivo_no_pago INTEGER, otro_motivo TEXT, id_tipo_servicio INTEGER, numero_niveles TEXT, color_fachada TEXT, color_puerta TEXT, referencia TEXT, id_tipo_predio INTEGER, entre_calle1 TEXT, entre_calle2 TEXT, observaciones TEXT, lectura_medidor TEXT, giro TEXT, idAspUser TEXT, id_tarea INTEGER, fecha_captura TEXT, latitud TEXT, longitud TEXT, id_servicio_plaza INTEGER, coloco_sello INTEGER, id_estatus_predio TEXT, cargado INTEGER NOT NULL DEFAULT 0)`

    let tableInspeccionAntenas = `CREATE TABLE IF NOT EXISTS gestionInspeccionAntenas (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, nombre_plaza TEXT, account TEXT, propietario TEXT, personaAtiende TEXT, idPuesto INTEGER, otroPuesto TEXT, usoSuelo TEXT, idTipoAntena INTEGER, otroTipoAntena TEXT, idDetalleAntena INTEGER, otroDetalleAntena TEXT, idTipoComunicacion INTEGER, otroTipoComunicacion TEXT, numeroNiveles TEXT, colorFachada TEXT, colorPuerta TEXT, referencia TEXT, idTipoPredio INTEGER, entreCalle1 TEXT, entreCalle2 TEXT, hallazgoNinguna INTEGER, hallazgoNegaronAcceso INTEGER, hallazgoCambioUsoSuelo INTEGER, hallazgoRefrendoUsoSuelo INTEGER, hallazgoRezago INTEGER, idAspUser TEXT, idTarea INTEGER,  fechaCaptura TEXT, latitud TEXT, longitud TEXT, id_servicio_plaza INTEGER, cargado INTEGER NOT NULL DEFAULT 0)`

    let tableFotos = `CREATE TABLE IF NOT EXISTS capturaFotos (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, nombre_plaza TEXT, imagenLocal TEXT, cuenta TEXT,fecha TEXT,rutaBase64 TEXT,idAspUser TEXT,idTarea INTEGER,tipo TEXT,urlImagen TEXT,isSelected INTEGER NOT NULL DEFAULT 0,  id_servicio_plaza INTEGER, cargado INTEGER NOT NULL DEFAULT 0)`;

    let tableFotosServicios = `CREATE TABLE IF NOT EXISTS capturaFotosServicios (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, nombre_plaza text, idAspUser TEXT, idServicio INTEGER, imagenLocal TEXT, fecha TEXT, rutaBase64 TEXT, tipo TEXT, urlImagen TEXT, isSelected INTEGER NOT NULL DEFAULT 0, cargado INTEGER NOT NULL DEFAULT 0)`;

    let tableServicios = `CREATE TABLE IF NOT EXISTS serviciosPlazaUser (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, ape_pat TEXT, ape_mat TEXT, foto TEXT, plaza TEXT, servicio TEXT, id_plaza INTEGER, id_servicio INTEGER, icono_app_movil TEXT, descargado BOOLEAN)`;

    let tableDescargaServicios = `CREATE TABLE IF NOT EXISTS descargaServicios (id_plaza TEXT, id_servicio TEXT, descargado BOOLEAN)`

    let tableServiciosPublicos = `CREATE TABLE IF NOT EXISTS serviciosPublicos( id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, nombre_plaza, idAspUser TEXT, idServicio INTEGER, idServicio2 INTEGER, observacion TEXT, fechaCaptura TEXT, latitud TEXT, longitud TEXT, cargado INTEGER NOT NULL DEFAULT 0 )`

    let tableEmpleadosPlaza = `CREATE TABLE IF NOT EXISTS empleadosPlaza (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, idAspUser TEXT, nombre_empleado TEXT, apellido_paterno_empleado TEXT, apellido_materno_empleado TEXT)`
    
    let tableListaServiciosPublicos = `CREATE TABLE IF NOT EXISTS listaServiciosPublicos ( id_plaza INTEGER, nombre_plaza TEXT, id_servicio_publico INTEGER, nombre_servicio_publico TEXT)`

    let tableRecorrido =  `CREATE TABLE IF NOT EXISTS recorrido (id INTEGER PRIMARY KEY AUTOINCREMENT, latitud TEXT, longitud TEXT, idAspUser TEXT, fechaCaptura TEXT, cargado INTEGER NOT NULL DEFAULT 0)`;

    let tableEncuesta =  `CREATE TABLE IF NOT EXISTS encuesta (id INTEGER PRIMARY KEY AUTOINCREMENT, idPlaza INTEGER, account TEXT, idAlianzaVotoEstadoMexico TEXT, idAlianzaVotoMunicipio TEXT, idVotoPartidoPoliticoEstadoMexico TEXT, idVotoPartidoPoliticoMunicipio TEXT, idVotoPartidoPoliticoPais TEXT, idServicioPlaza INTEGER, fechaCaptura TEXT, cargado INTEGER NOT NULL DEFAULT 0)`;

    /**
     * Esta tabla es para guardar los procesos de gestion ejemplo carta invitacion, ejecucion fiscal y demas
     */
    let tableProcesoGestion = `CREATE TABLE IF NOT EXISTS proceso (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plaza INTEGER, nombre_plaza TEXT, id_proceso INTEGER, nombre_proceso TEXT, activo INTEGER, imagen TEXT, url_aplicacion_movil TEXT )`

    let tableCatalogoPartidos = `CREATE TABLE IF NOT EXISTS cat_partidos_politicos (id INTEGER PRIMARY KEY AUTOINCREMENT, id_partido_politico INTEGER, nombre_partido_politico TEXT)`

    let tableCatalogoAlianzas = `CREATE TABLE IF NOT EXISTS cat_alianzas_politicas (id INTEGER PRIMARY KEY AUTOINCREMENT, id_alianza_politica INTEGER, nombre_alianza_politica TEXT)`

    let tableCatalogoTareas = `CREATE TABLE IF NOT EXISTS cat_tarea (id INTEGER PRIMARY KEY AUTOINCREMENT, id_tarea INTEGER, nombre_tarea TEXT, id_proceso INTEGER)`

    let tables = {
      tableSero,
      tableFotos,
      tableServicios,
      tableDescargaServicios,
      tableServiciosPublicos,
      tableFotosServicios,
      tableInspeccion,
      tableCartaInvitacion,
      tableLegal,
      tableInspeccionAntenas,
      tableListaServiciosPublicos,
      tableEmpleadosPlaza,
      tableRecorrido,
      tableEncuesta,
      tableProcesoGestion,
      tableCortes,
      tableCatalogoPartidos,
      tableCatalogoAlianzas,
      tableCatalogoTareas
    }

    return tables;

  }


}
