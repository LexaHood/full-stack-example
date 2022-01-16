import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/position.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId!: string | undefined;
  @ViewChild('modal') modalRef!: ElementRef;

  positions: Position[] = [];
  loading = false;
  modal!: MaterialInstance;
  form!: FormGroup;
  positionId: any = null;

  constructor(private positionService: PositionsService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    });

    this.loading = true;
    this.positionService.fetch(this.categoryId)
      .subscribe(positions => {
        this.positions = positions;
        this.loading = false;
      });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    if (this.modal) {
      this.modal?.destroy();
    }
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal?.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset();
    this.modal?.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal?.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Позиция изменена');
        },
        err => {
          MaterialService.toast(err.error.message);
        },
        () => {
          this.modal.close();
          this.form.reset({name: '', cost: 1});
          this.form.enable();
        }
      );
    } else {
      this.positionService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана');
          this.positions.push(position);
        },
        err => {
          MaterialService.toast(err.error.message);
        },
        () => {
          this.modal.close();
          this.form.reset({name: '', cost: 1});
          this.form.enable();
        }
      );
    }
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const descision = window.confirm(`Удалить позицию ${position.name}?`);

    if (descision) {
      this.positionService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast('Позиция удалена');
        },
        err => MaterialService.toast(err.error.message)
      );
    }
  }

}
