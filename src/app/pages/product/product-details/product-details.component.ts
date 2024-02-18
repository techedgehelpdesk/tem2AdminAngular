import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
})
export class ProductDetailsComponent implements OnInit {
  product = {
    id:'',
    manual_description: "Tension Spring(Short)",
    accounts_description: "Tension Spring(Short)``",
    model_suitability: "ALL",
    specification: "1.2*10*20",
    part_no: "2201210020",
    consumer_price: "30",
    weight: "2.5 gm",
    new_consumer_price: "34.5",
    availability: "TRUE",
    discount: "40",
    rating: "5",
  };
  constructor() {}

  ngOnInit(): void {}
}
