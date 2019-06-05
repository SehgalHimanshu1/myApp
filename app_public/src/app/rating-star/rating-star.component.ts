import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrls: ['./rating-star.component.css']
})
export class RatingStarComponent implements OnInit {

  constructor() { }

  @Input() rating: number;

  ngOnInit() {
  }

}
