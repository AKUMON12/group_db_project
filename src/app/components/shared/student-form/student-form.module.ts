import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentFormComponent } from './student-form.component';

@NgModule({
    declarations: [StudentFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [StudentFormComponent]
})
export class StudentFormModule { } 