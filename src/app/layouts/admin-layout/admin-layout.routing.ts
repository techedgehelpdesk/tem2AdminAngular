import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { AuthGuard } from "src/app/core/guards/authGuard";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard",    canActivate: [AuthGuard], component: DashboardComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "tables", component: TablesComponent },
  { path: "icons", component: IconsComponent },
  { path: "maps", component: MapsComponent },
  {
    path: "users",
    loadChildren: () =>
      import("src/app/pages/users/users.module").then((m) => m.UsersModule),
  },
  {
    path: "category",
    loadChildren: () =>
      import("src/app/pages/category/category.module").then((m) => m.CategoryModule),
  },
  {
    path: "product",
    loadChildren: () =>
      import("src/app/pages/product/product.module").then((m) => m.ProductModule),
  },
];
