import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { HttpService } from "src/app/core/http";

@Component({
  selector: "app-user-add-edit",
  templateUrl: "./user-add-edit.component.html",
  styleUrls: ["./user-add-edit.component.scss"],
})
export class UserAddEditComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  userForm!: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _http: HttpService,
    private _router: Router
  ) {
    this.createUserForm();
  }

  ngOnInit(): void {}

  createUserForm() {
    this.userForm = this._fb.group({
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      status: [true],
      email: ["", [Validators.required]],
      password: ["123456"],
      phone_number: ["", [Validators.required]],
      is_admin: [false],
      is_emp: [true],
      id: [0],
      address: [""],
      city: [""],
      pin: [""],
    });
  }
  get formControl() {
    return this.userForm.controls;
  }

  submitUserForm() {
    if (this.userForm.invalid) {
      console.log(this.userForm.value);
      
      this.userForm.markAllAsTouched();
      return;
    }
    let param = this.userForm.value;
    this.subscriptions.push(
      this._http.post("users/register", param).subscribe({
        next: (result) => {
          this._router.navigate(["/users"]);
        },
        error: (err) => {
          throw err;
        },
      })
    );
  }
}
