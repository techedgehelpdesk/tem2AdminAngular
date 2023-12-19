import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';

const routes: Routes = [
  {path:'',component:CategoryComponent},
  {path:'add-edit/:id',component:AddEditCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
