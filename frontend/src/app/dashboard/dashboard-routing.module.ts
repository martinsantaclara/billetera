import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { BitcoinComponent } from './bitcoin/bitcoin.component';
// import { EthereumComponent } from './ethereum/ethereum.component';
import { HomeComponent } from './home/home.component';
import { MonederosComponent } from './monederos/monederos.component';
import { PerfilComponent } from './perfil/perfil.component';
// import { PesosComponent } from './pesos/pesos.component';
// import { UsdcComponent } from './usdc/usdc.component';

const routes: Routes = [
  { path: 'dashboard', component: HomeComponent,
    children : [
      // { path: 'pesos', component: PesosComponent},
      // { path: 'bitcoin', component: BitcoinComponent},
      // { path: 'ethereum', component: EthereumComponent},
      // { path: 'usdc', component: UsdcComponent}
      { path: 'perfil', component: PerfilComponent},
      { path: ':op', component: MonederosComponent}
    ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
