import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSort, Sort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H" },
  { position: 2, name: "Helium", weight: 4.0026, symbol: "He" },
  { position: 3, name: "Lithium", weight: 6.941, symbol: "Li" },
  { position: 4, name: "Beryllium", weight: 9.0122, symbol: "Be" },
  { position: 5, name: "Boron", weight: 10.811, symbol: "B" },
  { position: 6, name: "Carbon", weight: 12.0107, symbol: "C" },
  { position: 7, name: "Nitrogen", weight: 14.0067, symbol: "N" },
  { position: 8, name: "Oxygen", weight: 15.9994, symbol: "O" },
  { position: 9, name: "Fluorine", weight: 18.9984, symbol: "F" },
  { position: 10, name: "Neon", weight: 20.1797, symbol: "Ne" },
];
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  userList = [
    {
      index:1,
      first_name: "Test",
      last_name: "Test",
      status: "Test",
      email: "Test",
      password: "Test",
      phone_number: "Test",
      is_admin: true,
      is_emp: "Test",
      id: "1",
    },
    {
      index:2,
      first_name: "Test",
      last_name: "Test",
      status: "Test",
      email: "Test",
      password: "Test",
      phone_number: "Test",
      is_admin: false,
      is_emp: "Test",
      id: "2",
    },
    {
      index:3,
      first_name: "Test",
      last_name: "Test",
      status: "Test",
      email: "Test",
      password: "Test",
      phone_number: "Test",
      is_admin: true,
      is_emp: "Test",
      id: "3",
    },
    {
      index:4,
      first_name: "Test",
      last_name: "Test",
      status: "Test",
      email: "Test",
      password: "Test",
      phone_number: "Test",
      is_admin: true,
      is_emp: "Test",
      id: "4",
    },
  ];
  displayedColumns: string[] = [
    "index",
    "first_name",
    "status",
    "email",
    "is_admin",
    "is_emp",
    "action"
    
  ];
  dataSource = new MatTableDataSource(this.userList);

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
