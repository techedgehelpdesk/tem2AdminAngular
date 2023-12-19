import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category/category.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    CategoryComponent,
    AddEditCategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    MatTableModule,
    MatSlideToggleModule
  ]
})
export class CategoryModule { }
