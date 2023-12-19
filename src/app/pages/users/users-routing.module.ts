import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserComponent } from "./user/user.component";
import { UserAddEditComponent } from "./user-add-edit/user-add-edit.component";

const routes: Routes = [
  { path: "", component: UserComponent },
  { path: "add-edit/:id", component: UserAddEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
