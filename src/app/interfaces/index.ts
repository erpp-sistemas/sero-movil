export interface DataGeneral {
    calle: string;
    clave_catastral: string;
    codigo_postal: string;
    colonia: string;
    correo_electronico: string;
    cuenta: string;
    domicilio_verificado: number;
    fecha_ultimo_pago: string;
    icono_proceso: string;
    id_proceso: number;
    latitud: number;
    longitud: number;
    nombreTareaAsignada: string;
    num_ext: string;
    num_int: string;
    poblacion: string;
    proceso_gestion: string;
    propietario: string;
    serie_medidor: string;
    superficie_construccion_h: number;
    superficie_terreno_h: number;
    tarea_asignada: number;
    telefono_casa: string;
    telefono_celular: string;
    tipo_servicio: string;
    total: number;
    url_aplicacion_movil: string;
    valor_catastral_h: number;
    valor_construccion_h: number;
    valor_terreno_h: number;
}

export interface EncuestaGeneral {
    id_plaza: number;
    id_encuesta: number;
    name_encuesta: string;
    id_pregunta: number;
    name_pregunta: string;
    posibles_respuestas: string;
    icono_app_movil: string;
    id_sub_pregunta: number;
    name_sub_pregunta: string;
    sub_pregunta_posibles_respuestas: string;
}

export interface UserPlacesServices {
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    foto: string;
    plaza: string;
    servicio: string;
    id_plaza: number;
    have_service_public: number;
    id_servicio: number;
    icono_app_movil: string;
    id_rol: number;
}

export interface ServicioPublico {
    id_plaza: number;
    id_servicio_publico: number;
    nombre: string;
    nombre_servicio_publico: string
}

export interface UserFirebase {
    IMEI: string;
    appVersion: string;
    email: string;
    idaspuser: number;
    isActive: boolean;
    lastSession: string;
    lastSync: string;
    name: string;
    password: string;
    totalAccounts: number;
    uid: string;
}

export interface Gestor {
    id_plaza: number;
    id_usuario: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    foto: string;
}


export interface Form {
    id_form: number; // id del formulario que es el que se guardara en el storage
    field: string; // nombre del campo
    type: string; // tipo para la abse de datos 
    type_field_form: string; // tipo para el elemento html ejemplo input, select
    type_form: string; // tipo para el elemento html ejemplo text, number
    nombre_form: string; // nombre del formulario
    options_select: string; // opciones del select
    route_app: string; // ruta para el formulario en la app movil
    icono: string; // icono del formulario
    name_photo: string; // las fotos que tendra el formulario
    have_signature: number; // para ver si el formulario tiene boton de firma de consentimiento
    send_notification: number; // para saber si cuando se manda un registro hay que mandar notificacion o no
    mandatory: number; // para saber si el campo es obligatorio
    type_select: string; // para saber si es normal o multiseleccion sel select
    parent_id_parent: number // para saber si depende de otro campo
    orden: number; // para sabeer el orden del campo
}


export interface DataInfoAccount {
    id_plaza: number;
    nombrePlaza: string;
    nombreTareaAsignada: string;
    account: string;
    propietario: string;
    nombreProceso: string;
    iconoProceso: string;
}