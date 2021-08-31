import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptosService {

  constructor() { }

  getCryptos = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
  };
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Ccardano&vs_currencies=ars%2Cars%2Cars",requestOptions);
    const data = await response.json();
    console.log('Bitcoin ' + data.bitcoin.ars);
    console.log('Ethereum ' + data.ethereum.ars);
    console.log('Cardano ' + data.cardano.ars);
    return data
  }
}
