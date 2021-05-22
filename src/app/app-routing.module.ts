import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './layout/contacts/contacts.component';

const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'prefix' },
  { path: 'contacts', component: ContactsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [ContactsComponent]
})
export class AppRoutingModule { }
