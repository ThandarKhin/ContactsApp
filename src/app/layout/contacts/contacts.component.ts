import { Component, OnInit, LOCALE_ID, Inject, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../../services/contact.service'; 
import { FormBuilder , Validators } from '@angular/forms';
import * as alertify from "alertifyjs";

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
  public contactForm = this.fb.group({
    id: [0,],
    name: ['', Validators.required], 
    phone: ['', Validators.required],
    email: ['', Validators.required]
  });

  public ContactList =  [];
  public showNoContactsFoundMessage : boolean = false;
  public filteredWithNameArray= [];
  public filteredWithEmailArray= [];
  public filteredWithPhoneArray= [];
  public showContactForm : boolean = false;
  public returnMessage : string = "";
  


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
  addNewContact(){
    this.showContactForm = true;
  }
  saveNewContact(){
    
    this.contactService.saveNewContact(this.contactForm.value).subscribe(x => {
      this.contactForm.reset();
      this.contactForm.controls["id"].setValue(0);
      this.getAllContactList();
      this.showContactForm = false;
    }, 
    (error) => {                            
      console.error('Request failed with error')
      alert(error);
      }
    );
  }
  
  editContact(data){
    this.showContactForm = true;
    this.contactForm.controls.id.setValue(data.id);
    this.contactForm.controls.name.setValue(data.name);
    this.contactForm.controls.email.setValue(data.email);
    this.contactForm.controls.phone.setValue(data.phone);
  }

  updateContact(){
    this.contactService.updateContact(this.contactForm.value).subscribe(x => {
      this.contactForm.reset();
      this.contactForm.controls["id"].setValue(0);
      this.getAllContactList();
      this.showContactForm = false;
    }, 
    (error) => {                            
      console.error('Request failed with error')
      alert(error);
    });
  }
  
  deleteConfirmation(row){
    alertify.confirm(
      "Delete Contact", "Are you sure to delete " + "<strong>" + row.name+ "</strong>" + "?",
      ()=>{
        this.deleteContact(row);
      },
      ()=> {}
    );
  }
  deleteContact(row){    

    this.contactService.deleteContact(row.id).subscribe(x => {
        this.contactForm.reset();
        this.contactForm.controls["id"].setValue(0);
        this.getAllContactList();
    }, 
    (error) => {                            
      console.error('Request failed with error')
      alert(error);
    });
  }

  cancel(){
    this.searchForm.reset();
    this.contactForm.reset();
    this.contactForm.controls["id"].setValue(0);
    this.showContactForm = false;
    this.showNoContactsFoundMessage = false;
    this.getAllContactList();
  }


}
