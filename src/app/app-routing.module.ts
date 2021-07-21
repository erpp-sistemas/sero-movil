import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoLoginGuard } from './guards/no-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
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
    path: 'google-maps',
    loadChildren: () => import('./google-maps/google-maps.module').then( m => m.GoogleMapsPageModule)
  },
  {
    path: 'pozo-conagua',
    loadChildren: () => import('./pozo-conagua/pozo-conagua.module').then( m => m.PozoConaguaPageModule)
  },
  {
    path: 'listado-cuentas/:id',
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
    path: 'sincronizar-agua',
    loadChildren: () => import('./sincronizar-agua/sincronizar-agua.module').then( m => m.SincronizarAguaPageModule)
  },
  {
    path: 'sincronizar-predio',
    loadChildren: () => import('./sincronizar-predio/sincronizar-predio.module').then( m => m.SincronizarPredioPageModule)
  },
  {
    path: 'sincronizar-antenas',
    loadChildren: () => import('./sincronizar-antenas/sincronizar-antenas.module').then( m => m.SincronizarAntenasPageModule)
  },
  {
    path: 'sincronizar-pozos',
    loadChildren: () => import('./sincronizar-pozos/sincronizar-pozos.module').then( m => m.SincronizarPozosPageModule)
  },
  {
    path: 'gestion-inspeccion-predio',
    loadChildren: () => import('./gestion-inspeccion-predio/gestion-inspeccion-predio.module').then( m => m.GestionInspeccionPredioPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
