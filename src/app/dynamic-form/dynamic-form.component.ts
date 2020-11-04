import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IField } from '../IField.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() fields: string;
  dynamicForm: FormGroup;
  data: IField[];
  constructor() {
    this.initForm();
  }

  ngOnInit(): void {}

  // Initiating the form
  private initForm(): void {
    this.dynamicForm = new FormGroup({});
  }

  // Adding control to form
  addControl(name: string, validations: string[]): void {
    this.dynamicForm.addControl(name, new FormControl(null));
    if (validations?.length) {
      for (const v of validations) {
        this.dynamicForm.controls[name].setValidators(Validators[v]);
        this.dynamicForm.controls[name].updateValueAndValidity();
      }
    }
  }

  // Get the changes in the textarea and update the form
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fields.currentValue) {
      if (this.testJSON(changes.fields.currentValue)) {
        const form = JSON.parse(changes.fields.currentValue);
        this.data = form.form;
        for (const item of this.data) {
          this.addControl(item.fieldName, item.validations);
        }
      }
    }
  }

  // Submitting form to console to test
  submit(): void {
    if (this.dynamicForm.valid) {
      console.log(this.dynamicForm.value);
    }
  }

  // Test if the string is a valid JSON format
  testJSON(text): boolean {
    if (typeof text !== 'string') {
      return false;
    }
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  }
}
