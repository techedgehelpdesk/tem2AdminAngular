import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { UsersRoutingModule } from "./users-routing.module";
import { UserComponent } from "./user/user.component";
import { MatTableModule } from "@angular/material/table";
import { UserAddEditComponent } from "./user-add-edit/user-add-edit.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
@NgModule({
  declarations: [UserComponent, UserAddEditComponent],
  imports: [
    MatTableModule,
    CommonModule,
    UsersRoutingModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UsersModule {}
