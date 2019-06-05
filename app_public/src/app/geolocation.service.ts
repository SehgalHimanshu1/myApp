import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  public getPosition(successCb, failCb, unsupCb): void {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(successCb, failCb);
    } else {
      unsupCb();
    }
  }
}
