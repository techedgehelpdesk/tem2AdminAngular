import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product/product.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ProductComponent,
    AddEditProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
