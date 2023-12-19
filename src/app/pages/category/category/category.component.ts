import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

interface ICategory {
  serial_no: number;
  id: number;
  name: string;
  status: boolean;
}
@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
  categoryList: ICategory[] = [
    {
      serial_no: 1,
      id: 1,
      name: "Test prod 1",
      status: false,
    },
    {
      serial_no: 2,
      id: 2,
      name: "Test prod 2",
      status: false,
    },
    {
      serial_no: 3,
      id: 3,
      name: "Test prod 3",
      status: false,
    },
    {
      serial_no: 4,
      id: 4,
      name: "Test prod 4",
      status: false,
    },
  ];

  displayedColumns: string[] = [
    "serial_no",
    "name",
    "status",
    "action",
  ];
  dataSource = new MatTableDataSource(this.categoryList);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}
  ngOnInit(): void {}

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

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
}
