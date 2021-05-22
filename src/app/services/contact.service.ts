
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends BehaviorSubject<HttpClient>{

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpclient: HttpClient) { super(null); }
  
  public getAllContactList() {
    return this.httpclient.get('http://localhost:3000/contacts'); 
  }
  public filterContactWithName(searchData) {
    return this.httpclient.get('http://localhost:3000/contacts?name_like=' + searchData); 
  } 
  public filterContactWithEmail(searchData) {
    return this.httpclient.get('http://localhost:3000/contacts?email_like=' + searchData); 
  } 
  public filterContactWithPhone(searchData) {
    return this.httpclient.get('http://localhost:3000/contacts?phone_like=' + searchData); 
  } 

  // public searchContactWithName(searchData) {
  //   return this.httpclient.get('http://localhost:3000/contacts?name=' + searchData); 
  // } 
  // public searchContactWithEmail(searchData) {
  //   return this.httpclient.get('http://localhost:3000/contacts?email=' + searchData.email + '&&id_ne='+ searchData.id); 
  // } 
  // public searchContactWithPhone(searchData) {
  //   return this.httpclient.get('http://localhost:3000/contacts?phone=' + searchData.phone + '&&id_ne='+ searchData.id); 
  // }

  // public deleteContact(id) {
  //   return this.httpclient.delete('http://localhost:3000/contacts/' + id); 
  // }
  
  // public saveNewContact(contact) {
  //   return this.httpclient.post('http://localhost:3000/contacts/', contact, this.httpOptions); 
  // }

  // public updateContact(contact) {
  //   return this.httpclient.put('http://localhost:3000/contacts/'+ contact.id, contact, this.httpOptions); 
  // }
}
