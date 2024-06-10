import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoLoginGuard } from './guards/no-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio-temp',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [NoLoginGuard]
  },
  {
    path: 'streetview',
    loadChildren: () => import('./streetview/streetview.module').then( m => m.StreetviewPageModule)
  },
  {
    path: 'gestion-page',
    loadChildren: () => import('./gestion-page/gestion-page.module').then( m => m.GestionPagePageModule)
  },
  {
    path: 'checador',
    loadChildren: () => import('./checador/checador.module').then( m => m.ChecadorPageModule)
  },
  {
    path: 'gestion-inspeccion-agua',
    loadChildren: () => import('./gestion-inspeccion-agua/gestion-inspeccion-agua.module').then( m => m.GestionInspeccionAguaPageModule)
  },
  {
    path: 'google-maps/:id/:id_plaza',
    loadChildren: () => import('./google-maps/google-maps.module').then( m => m.GoogleMapsPageModule)
  },
  {
    path: 'listado-cuentas/:id/:id_plaza',
    loadChildren: () => import('./listado-cuentas/listado-cuentas.module').then( m => m.ListadoCuentasPageModule)
  },
  {
    path: 'gestion-carta',
    loadChildren: () => import('./gestion-carta/gestion-carta.module').then( m => m.GestionCartaPageModule)
  },
  {
    path: 'gestion-legal',
    loadChildren: () => import('./gestion-legal/gestion-legal.module').then( m => m.GestionLegalPageModule)
  },
  {
    path: 'sincronizar-gestiones',
    loadChildren: () => import('./sincronizar-gestiones/sincronizar-gestiones.module').then( m => m.SincronizarGestionesPageModule)
  },
  {
    path: 'video-presentacion',
    loadChildren: () => import('./video-presentacion/video-presentacion.module').then( m => m.VideoPresentacionPageModule)
  },
  {
    path: 'directorio',
    loadChildren: () => import('./directorio/directorio.module').then( m => m.DirectorioPageModule)
  },
  {
    path: 'servicios-publicos',
    loadChildren: () => import('./servicios-publicos/servicios-publicos.module').then( m => m.ServiciosPublicosPageModule)
  },
  {
    path: 'sincronizar-servicios',
    loadChildren: () => import('./sync-servicios/sincronizar-servicios.module').then( m => m.SincronizarServiciosPageModule)
  },
  {
    path: 'sincronizar-fotos',
    loadChildren: () => import('./sincronizar-fotos/sincronizar-fotos.module').then( m => m.SincronizarFotosPageModule)
  },
  {
    path: 'image-preview',
    loadChildren: () => import('./image-preview/image-preview.module').then( m => m.ImagePreviewPageModule)
  },
  {
    path: 'sync-fotos-acciones',
    loadChildren: () => import('./sync-fotos-acciones/sync-fotos-acciones.module').then( m => m.SyncFotosAccionesPageModule)
  },
  {
    path: 'sync-fotos-servicios',
    loadChildren: () => import('./sync-fotos-servicios/sync-fotos-servicios.module').then( m => m.SyncFotosServiciosPageModule)
  },
  {
    path: 'sync-acciones/:id_servicio_plaza',
    loadChildren: () => import('./sync-acciones/sync-acciones.module').then( m => m.SyncAccionesPageModule)
  },
  {
    path: 'inicio-temp',
    loadChildren: () => import('./inicio-temp/inicio-temp.module').then( m => m.InicioTempPageModule)
  },
  {
    path: 'mapa-google/:id/:id_plaza',
    loadChildren: () => import('./mapa-google/mapa-google.module').then( m => m.MapaGooglePageModule)
  },
  {
    path: 'mapa-prueba/:id/:id_plaza',
    loadChildren: () => import('./mapa-prueba/mapa-prueba.module').then( m => m.MapaPruebaPageModule)
  },
  {
    path: 'photos-history',
    loadChildren: () => import('./photos-history/photos-history.module').then( m => m.PhotosHistoryPageModule)
  },
  {
    path: 'gestion-inspeccion-antena',
    loadChildren: () => import('./gestion-inspeccion-antena/gestion-inspeccion-antena.module').then( m => m.GestionInspeccionAntenaPageModule)
  },
  {
    path: 'encuesta',
    loadChildren: () => import('./encuesta/encuesta.module').then( m => m.EncuestaPageModule)
  },
  {
    path: 'boton-panico',
    loadChildren: () => import('./boton-panico/boton-panico.module').then( m => m.BotonPanicoPageModule)
  },
  {
    path: 'mapa-leaflet',
    loadChildren: () => import('./mapa-leaflet/mapa-leaflet.module').then( m => m.MapaLeafletPageModule)
  },
  {
    path: 'push-notifications',
    loadChildren: () => import('./push-notifications/push-notifications.module').then( m => m.PushNotificationsPageModule)
  },
  {
    path: 'actions-history',
    loadChildren: () => import('./actions-history/actions-history.module').then( m => m.ActionsHistoryPageModule)
  },
  {
    path: 'lectura-medidor',
    loadChildren: () => import('./lectura-medidor/lectura-medidor.module').then( m => m.LecturaMedidorPageModule)
  },
  {
    path: 'change-task',
    loadChildren: () => import('./change-task/change-task.module').then( m => m.ChangeTaskPageModule)
  },
  {
    path: 'encuestas-list',
    loadChildren: () => import('./encuestas-list/encuestas-list.module').then( m => m.EncuestasListPageModule)
  },
  {
    path: 'encuesta-general/:id_plaza/:id_encuesta',
    loadChildren: () => import('./encuesta-general/encuesta-general.module').then( m => m.EncuestaGeneralPageModule)
  },  {
    path: 'sync-encuestas',
    loadChildren: () => import('./sync-encuestas/sync-encuestas.module').then( m => m.SyncEncuestasPageModule)
  },
  {
    path: 'history-checking',
    loadChildren: () => import('./history-checking/history-checking.module').then( m => m.HistoryCheckingPageModule)
  }




];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
