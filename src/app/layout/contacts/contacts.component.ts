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
  public filteredWithNameArray= [];
  public filteredWithEmailArray= [];
  public filteredWithPhoneArray= [];


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
  
  filterContact() {
    this.filteredWithNameArray = [];
    this.filteredWithEmailArray = [];
    this.filteredWithPhoneArray = [];
    this.ContactList = [];

    this.filterContactWithName();
    this.filterContactWithEmail();
    this.filterContactWithPhone();

  }
  filterContactWithName(){
    this.contactService.filterContactWithName(this.searchForm.value.filterText)
    .subscribe((result: any) => {
      if (result.length > 0){
        this.filteredWithNameArray = result;
        for (let i = 0; i < result.length; i++) {
          this.ContactList.push(this.filteredWithNameArray[i]);
        }
      }
    }, 
    (error) => {                            
      console.error('Request failed with error')
      alert(error);
    });
  }
  
  filterContactWithEmail(){
    this.contactService.filterContactWithEmail(this.searchForm.value.filterText)
    .subscribe((result: any) => {
      if (result.length > 0){
        this.filteredWithEmailArray = result;
        for (let i = 0; i < this.filteredWithEmailArray.length; i++) {

          var index = this.filteredWithNameArray.findIndex(x => x.id == this.filteredWithEmailArray[i].id)
          if (index == -1){
            this.ContactList.push(this.filteredWithEmailArray[i]);
          }
        }
      }
    }, 
    (error) => {                            
      console.error('Request failed with error')
      alert(error);
    });
  }
  
  filterContactWithPhone(){
    this.contactService.filterContactWithPhone(this.searchForm.value.filterText)
    .subscribe((result: any) => {
      if (result.length > 0){
        this.filteredWithPhoneArray = result;
        
        for (let i = 0; i < this.filteredWithPhoneArray.length; i++) {

          var indexInName = this.filteredWithNameArray.findIndex(x => x.id == this.filteredWithPhoneArray[i].id)
          var indexInEmail = this.filteredWithEmailArray.findIndex(x => x.id == this.filteredWithPhoneArray[i].id)
          
          if (indexInName == -1 && indexInEmail == -1){
            this.ContactList.push(this.filteredWithPhoneArray[i]);
          }
        }
      }
    }, 
    (error) => {                            
      console.error('Request failed with error')
      alert(error);
    });
  }
}
