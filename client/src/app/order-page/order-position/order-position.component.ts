import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/position.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-position',
  templateUrl: './order-position.component.html',
  styleUrls: ['./order-position.component.css']
})
export class OrderPositionComponent implements OnInit {

  positions$!: Observable<Position[]>;

  constructor(private route: ActivatedRoute, private positionsService: PositionsService, private order: OrderService) {
  }

  ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            return this.positionsService.fetch(params['id']);
          }
        ),
        map(
          (positions: Position[]) => {
            return positions.map(position => {
              position.counter = 1;
              return position;
            });
          }
        )
      )
  }

  addToOrder(position: Position) {
    console.log(position);
    this.order.add(position);
  }
}
