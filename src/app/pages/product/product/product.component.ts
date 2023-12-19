import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Dialog, DIALOG_DATA, DialogModule } from "@angular/cdk/dialog";
import { AddEditCategoryComponent } from "../../category/add-edit-category/add-edit-category.component";
import { ModalDialogComponent } from "src/app/components/modal-dialog/modal-dialog.component";
import { HttpService } from "src/app/core/http";
import { Subscription } from "rxjs";
import { CommonService } from "src/app/core/services/common.service";
import { Router } from "@angular/router";
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

interface IroductList {
  id: number;
  manual_description: string;
  accounts_description: string;
  model_suitability: string;
  specification: string;
  part_no: string;
  consumer_price: number;
  weight: string;
  new_consumer_price: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  private submitted = false;
  private subscriptions: Subscription[] = [];
  productList: IroductList[] = [];
  // productList: IProduct[] = [
  //   {
  //     serial_no: 1,
  //     id: 1,
  //     cat_id: 1,
  //     cat_name: "Test 1",
  //     name: "Test prod 1",
  //     description: "Test",
  //     status: false,
  //     tn_image_sm: "",
  //     tn_image_bg: "",
  //     img_slider: [],
  //   },
  //   {
  //     serial_no: 2,
  //     id: 2,
  //     cat_id: 2,
  //     cat_name: "Test 1",
  //     name: "Test prod 2",
  //     description: "Test",
  //     status: false,
  //     tn_image_sm: "",
  //     tn_image_bg: "",
  //     img_slider: [],
  //   },
  //   {
  //     serial_no: 3,
  //     id: 3,
  //     cat_id: 3,
  //     cat_name: "Test 1",
  //     name: "Test prod 3",
  //     description: "Test",
  //     status: false,
  //     tn_image_sm: "",
  //     tn_image_bg: "",
  //     img_slider: [],
  //   },
  //   {
  //     serial_no: 4,
  //     id: 4,
  //     cat_id: 4,
  //     cat_name: "Test 1",
  //     name: "Test prod 4",
  //     description: "Test",
  //     status: false,
  //     tn_image_sm: "",
  //     tn_image_bg: "",
  //     img_slider: [],
  //   },
  // ];
  uploadExcelDialog = false;
  displayedColumns: string[] = [
    "row_no",
    "manual_description",
    "accounts_description",
    "status",
    "consumer_price",
    "new_consumer_price",
    "action",
  ];
  dataSource;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: Dialog,
    private _http: HttpService,
    private _common: CommonService,
    private _router:Router
  ) {
    this.fetchProductList();
   
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.subscriptions.push(
      this._common._productListSubject$.subscribe({ next: (data) => {
        if(data) {
          this.productList = data;
          this.dataSource = new MatTableDataSource(this.productList);
          this.dataSource.sort = this.sort;
        }
        
      } })
    );
  }

  @ViewChild(MatSort) sort!: MatSort;

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
  loaded = false;
  fetchProductList() {
    this.subscriptions.push(
      this._http.get("products/getAllProducts").subscribe({
        next: (result) => {
          this._common.setProductList(result.data)
          // this.loaded=true
        },
        error: (err) => {
          console.log(err);
          throw err;
        },
      })
    );
  }
  deleteProduct(id:number) {
    this.subscriptions.push(
      this._http.post("products/deleteProduct",{id:id}).subscribe({
        next: (result) => {
          this.fetchProductList();
          // this._common.setProductList(result.data)
          // this.loaded=true
        },
        error: (err) => {
          console.log(err);
          throw err;
        },
      })
    )
  }

  openExcelModal() {
    this.dialog.open(ModalDialogComponent);
  }

  getProdcutDetails(id:number) {
    this.subscriptions.push(
      this._http.post("products/getProductDetails",{id:id}).subscribe({
        next: (result) => {
          this._common.setProductDetails(result.data);
          this._router.navigate(['/product/add-edit/'+id])
          // this.loaded=true
        },
        error: (err) => {
          console.log(err);
          throw err;
        },
      })
    )
  }
}
