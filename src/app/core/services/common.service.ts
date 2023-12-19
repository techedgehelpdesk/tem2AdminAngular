import { Injectable } from "@angular/core";
import { HttpService } from "../http";
import { BehaviorSubject } from "rxjs";

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

@Injectable()
export class CommonService {
  constructor(private _http: HttpService) {}

  private _productListSubject: BehaviorSubject<
    IroductList[]
  > = new BehaviorSubject<IroductList[]>([]);
  public _productListSubject$ = this._productListSubject.asObservable();

  private _productDetailsSubject: BehaviorSubject<
    IroductList|null
  > = new BehaviorSubject<IroductList|null>(null);
  public _productDetailsSubject$ = this._productDetailsSubject.asObservable();

  setProductList(data: IroductList[]) {
    this._productListSubject.next(data);
  }
  setProductDetails(data: IroductList) {
    this._productDetailsSubject.next(data);
  }
}
