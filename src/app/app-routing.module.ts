import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './layout/contacts/contacts.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'prefix' },
  { path: 'contacts', component: ContactsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes),
            CommonModule,
            FormsModule,
            ReactiveFormsModule],
  exports: [RouterModule],
  declarations: [ContactsComponent]
})
export class AppRoutingModule { }
