import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoLoginGuard } from './guards/no-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'video-presentacion',
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
    path: 'mapa-predio/:id_plaza',
    loadChildren: () => import('./mapa-predio/mapa-predio.module').then( m => m.MapaPredioPageModule)
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

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
