import { Component, OnInit, LOCALE_ID, Inject, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../../services/contact.service'; 
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  constructor(@Inject(LOCALE_ID) private httpclient: HttpClient,
              private fb: FormBuilder,
              private contactService: ContactService,
              ) {}

  ngOnInit() {
    this.getAllContactList();
  }
  public searchForm = this.fb.group({
    filterText: ['']
  });

  public ContactList =  [];
  public showNoContactsFoundMessage : boolean = false;

  getAllContactList() {
    this.showNoContactsFoundMessage = false;
    this.contactService.getAllContactList()
      .subscribe((result: any) => {
        if(result.length == 0 ){
          this.showNoContactsFoundMessage = true;
        }
        this.ContactList = result;
      }, 
      (error) => {                            
        console.error('Request failed with error')
        alert(error);
      });
  } 
}
