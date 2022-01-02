import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category } from 'src/app/shared/interfaces';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  @ViewChild('input') inputRef!: ElementRef;
  form!: FormGroup;
  image!: File;
  imagePreview!: any;
  isNew = true;
  category!: Category;

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
        (category: Category | null) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            })

            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        err => MaterialService.toast(err.error.message)
      );
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file);
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.CategoryService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.CategoryService.update(this.form.value.name, this.image, this.category._id);
    }

    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Изменения сохранены');
        this.form.enable();
      },
      err => {
        MaterialService.toast(err.error.message);
        this.form.enable();
      }
    );
  }
}
