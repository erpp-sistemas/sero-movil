export interface EncuestaGeneral {
    id_plaza: number;
    id_encuesta: number;
    name_encuesta: string;
    id_pregunta: number;
    name_pregunta: string;
    posibles_respuestas: string;
    icono_app_movil: string;
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
}