import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { stringify } from "querystring";
import { Subscription } from "rxjs";
import { HttpService } from "src/app/core/http";
import { CommonService } from "src/app/core/services/common.service";

interface IImageForm {
  id: number;
  file_path: number;
  file: File;
}
@Component({
  selector: "app-add-edit-product",
  templateUrl: "./add-edit-product.component.html",
  styleUrls: ["./add-edit-product.component.scss"],
})
export class AddEditProductComponent implements OnInit {
  imagesFormGroup!: FormGroup;
  selectedImage: any;
  productForm!: FormGroup;
  imageList = [];
  private submitted = false;
  private subscriptions: Subscription[] = [];
  constructor(
    private _fb: FormBuilder,
    private _http: HttpService,
    private _common: CommonService,
    private _route:ActivatedRoute
  ) {
    this.createAddProductForm();
    this.initilizeImageFormGroup();
    this.getProductDetails(this._route.snapshot.params['id']);
    
  }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.subscriptions.push(
      this._common._productDetailsSubject$.subscribe({
        next: (data) => {
          if (data) {
            console.log(data);

            this.productForm.patchValue(data);
           
          }
        },
      })
    );
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

  initilizeImageFormGroup() {
    this.imagesFormGroup = this._fb.group({
      items: this._fb.array([]),
    });
  }

  initImageFormField(imgForm: IImageForm) {
    return this._fb.group({
      id: [imgForm.id],
      file_path: [imgForm.file_path],
      file: [null],
    });
  }

  get image_form_arr() {
    return this.imagesFormGroup.get("items") as FormArray;
  }

  addImage(imgForm?: IImageForm) {
    if (imgForm) {
      this.image_form_arr.push(this.initImageFormField(imgForm));
    } else {
      this.image_form_arr.push(
        this.initImageFormField({ id: null, file_path: null, file: null })
      );
    }
  }

  getProductDetails(id) {
    let param = {
      id: id,
    };
    this.subscriptions.push(
      this._http.post("products/getProductDetails", param).subscribe({
        next: (result) => {
          this._common.setProductDetails(result.data)
          console.log(result);
          this.initilizeImageFormGroup();
          this.imageList = result.images;
          this,this.imageList.forEach((item)=>{
            this.addImage({id:item.id,file_path:item.filePath,file:null})
          })
        },
        error: (err) => {
          console.log(err);
          throw err;
        },
      })
    );
  }

  submitForm() {
    if (this.productForm.invalid) {
      return;
    }
    let param = this.productForm.value;
    let url='';
    if(this._route.snapshot.params['id']) {
      url = 'products/updateProduct';
    } else {
      url = "products/addProduct"
    }
    this.subscriptions.push(
      this._http.post(url, param).subscribe({
        next: (result) => {
          alert("Product Added/Updated sucessfully.");
        },
        error: (err) => {
          console.log(err);
          throw err;
        },
      })
    );
  }
  submitImageForm() {
    if (this.imagesFormGroup.invalid) {
      console.log("failed", this.image_form_arr.value);

      alert("Image Form is Invalid");
      return;
    }
    // let param = this.productForm.value;
    console.log(this.image_form_arr.value);
    let formData: FormData = new FormData();
    formData.append("files", JSON.stringify(this.image_form_arr.value));
    formData.append("product_id", this.productForm.value.id);

    this.subscriptions.push(
      this._http.post("products/imageUpload", formData).subscribe({
        next: (res) => {
          alert("Product Images Added/Updated sucessfully.");
          console.log(res);
        },
        error: (err) => {
          console.log(err);
          throw err;
        },
      })
    );
    // this.subscriptions.push(
    //   this._http.post("products/addProduct", param).subscribe({
    //     next: (result) => {
    //       alert("Product Added/Updated sucessfully.");
    //     },
    //     error: (err) => {
    //       console.log(err);
    //       throw err;
    //     },
    //   })
    // );
  }

  fileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files as FileList;
    console.log(files);
    this.selectedImage = files[0];
  }

  selectFormArrImg(event: any, index: number) {
    const files = (event.target as HTMLInputElement).files as FileList;
    console.log(event.target.value);

    this.image_form_arr.at(index).get("file").setValue(files[0]);
    // this.image_form_arr.at(index).get('file_path').setValue(event.target.value);
    this.imageUpload(files[0])
  }

  imageUpload(file:File) {
    let formData: FormData = new FormData();
    formData.append("files", file);
    formData.append("product_id", this.productForm.value.id);
    this.subscriptions.push(
      this._http.post("products/imageUpload", formData).subscribe({
        next: (res) => {
          alert("Product Images Added/Updated sucessfully.");
          console.log(res);
          this.getProductDetails(this._route.snapshot.params['id'])
        },
        error: (err) => {
          console.log(err);
          throw err;
        },
      })
    );
  }
  
}
