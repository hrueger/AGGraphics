import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './_components/about/about.component';
import { AdminComponent } from './_components/admin/admin.component';
import { HomeComponent } from './_components/home/home.component';
import { ShowComponent } from './_components/show/show.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "live", component: ShowComponent },
  { path: "about", component: AboutComponent },
  { path: "admin", component: AdminComponent },
  //
  { path: "**", redirectTo: "/home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
