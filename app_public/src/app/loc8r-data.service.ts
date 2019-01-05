import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from './home-list/home-list.component';

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

  constructor(private http: HttpClient) {}
  private baseUrlAPI = 'http://localhost:3000/api';

  public getLocations(): Promise<Location[]>{
    const lng: number = 77.135590;
    const lat: number = 28.68840;
    const maxDistance: number = 2999;
    const url: string = `${this.baseUrlAPI}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Location[])
      .catch(this.handleError);
  }
  
  private handleError(error: any): Promise<any>{
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
}
