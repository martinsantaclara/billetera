import { Injectable } from '@angular/core';
import { SyncRequestClient } from 'ts-sync-request/dist';

@Injectable({
  providedIn: 'root'
})
export class CryptosService {

  constructor() { }

  getCrypto = async (crypto:string) => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    };
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=ars`,requestOptions);
    const data = await response.json();
    return data
  }
  getCryptos = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
  };
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cusd-coin&vs_currencies=ars%2Cars%2Cars",requestOptions);
    const data = await response.json();
    return data
  }

  getCryptus(crypto: string) {
    const response = new SyncRequestClient()
    .addHeader('Content-Type', 'application/json')
    .get<[]>(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=ars`);
    // console.log(response);
    // console.log(crypto);
    return response;
  }

}
