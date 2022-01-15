import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/interfaces';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-order-category',
  templateUrl: './order-category.component.html',
  styleUrls: ['./order-category.component.css']
})
export class OrderCategoryComponent implements OnInit {

  categories$!: Observable<Category[]>;

  constructor(private categoriesService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.fetch();
  }

}
