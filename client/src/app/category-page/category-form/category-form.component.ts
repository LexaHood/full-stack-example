import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  form!: FormGroup;
  isNew = true;

  constructor(private route: ActivatedRoute, private CategoryService: CategoryService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false;
              return this.CategoryService.getById(params['id']);
            }

            // Если ничего не вернулось, возвращаем пустой Observable
            return of(null)
          }
        )
      )
      .subscribe(
        category => {
          if (category) {
            this.form.patchValue({
              name: category.name
            })
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        err => MaterialService.toast(err.error.message)
      );


  }

  onSubmit() {

  }
}
