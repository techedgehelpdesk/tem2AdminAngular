import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';

const routes: Routes = [
  {path:'',component:ProductComponent},
  {path:'add-edit/:id',component:AddEditProductComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
