import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { HttpService } from "src/app/core/http";
import { CommonService } from "src/app/core/services/common.service";

@Component({
  selector: "app-add-edit-product",
  templateUrl: "./add-edit-product.component.html",
  styleUrls: ["./add-edit-product.component.scss"],
})
export class AddEditProductComponent implements OnInit {
  productForm!: FormGroup;
  private submitted = false;
  private subscriptions: Subscription[] = [];
  constructor(private _fb: FormBuilder, private _http: HttpService,private _common:CommonService) {
    this.createAddProductForm();
  }

  ngOnInit(): void {
    this.loadData()
  }
  loadData() {
    this.subscriptions.push(
      this._common._productDetailsSubject$.subscribe({
        next: (data) => {
          if(data) {
            this.productForm.setValue(data)
          }
        }
      })
    )
  }

  createAddProductForm() {
    this.productForm = this._fb.group({
      id: [null],
      manual_description: ["", [Validators.required]],
      accounts_description: ["", [Validators.required]],
      model_suitability: ["", [Validators.required]],
      specification: ["", [Validators.required]],
      part_no: ["", [Validators.required]],
      consumer_price: [null, [Validators.required]],
      weight: ["", [Validators.required]],
      new_consumer_price: [null, [Validators.required]],
    });
  }
  public hasFormControlError(field: string): boolean {
		const control = this.productForm.get(field) as FormControl;
		if (
			(this.submitted && control.errors) ||
			(control.invalid && control.dirty)
		) {
			return true;
		}
		return false;
	}

  get formcontrol() {
		return this.productForm.controls;
	}

  submitForm() {
    if(this.productForm.invalid) {
      return
    }
    let param = this.productForm.value;
    this.subscriptions.push(this._http.post('products/addProduct',param).subscribe({
      next: (result) => {
        alert("Product Added/Updated sucessfully.")
      },
      error: (err) => {
        console.log(err);
          throw err;
      }
    }));
  }
}
