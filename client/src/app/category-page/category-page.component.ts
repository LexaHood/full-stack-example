import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../shared/interfaces';
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {

  categories$!: Observable<Category[]>;

  constructor(private CategoryService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.CategoryService.fetch();
  }

}
