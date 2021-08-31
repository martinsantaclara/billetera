import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
// import { PesosComponent } from './pesos/pesos.component';
// import { BitcoinComponent } from './bitcoin/bitcoin.component';
// import { EthereumComponent } from './ethereum/ethereum.component';
// import { UsdcComponent } from './usdc/usdc.component';
import { PerfilComponent } from './perfil/perfil.component';
import { MonederosComponent } from './monederos/monederos.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    HomeComponent,
    // PesosComponent,
    // BitcoinComponent,
    // EthereumComponent,
    // UsdcComponent,
    PerfilComponent,
    MonederosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    HttpClientModule
  ]
})
export class DashboardModule { }
