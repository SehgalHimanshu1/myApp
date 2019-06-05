import { Component, OnInit } from '@angular/core';
import { Loc8rDataService } from '../loc8r-data.service';
import { GeolocationService } from '../geolocation.service';

export class Location {
  _id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  facilities: string[];
}

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})

export class HomeListComponent implements OnInit {

  constructor(
    private loc8rDataService: Loc8rDataService,
    private geolocationService:  GeolocationService) { }

  public locations: Location[];

  public message: string;

  private getPosition(): void {
    this.message = 'Getting your location. . .';
    this.geolocationService.getPosition(
      this.getLocations.bind(this),
      this.showError.bind(this),
      this.noGeo.bind(this)
    );
  }

  private getLocations(position: any): void{
    this.message = 'Searching for the nearby locations';
    const lng: number = position.coords.longitude;
    const lat: number = position.coords.latitude;
    this.loc8rDataService
      .getLocations(lng, lat)
      .then(foundLocations => {
        this.message = foundLocations.length > 0 ? '' : 'No location found!';
        this.locations = foundLocations;
      });
  }

  private showError(error: any): void {
    this.message = error.message;
  }

  private noGeo(): void {
    this.message = 'Geolocation not supported on this browser.';
  }

  ngOnInit() {
    this.getPosition();
  }

}
