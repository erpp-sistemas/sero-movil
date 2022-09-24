export interface PushNotification {
    id_registro_push: number;
    id_push_notification: string;
    id_usuario: number;
    titulo_push: string,
    mensaje: string;
    leido: number;
    fecha_recibido: string;
    activo: number;
    url_img: string;
}