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
  public emailSearchedCount = 0;
  public phoneSearchedCount = 0;
  public saveEditButtonEnable : boolean = true;

  // public phPattern = "^[+]{1}[9]{1}[5]{1}[9]{1}[0-9]{7,11}$";
  public phPattern = "^[0]{1}[9]{1}[0-9]{7,11}$";
  public emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,50}";

  public retrieveLoading : boolean = false;
  public saveLoading : boolean = false;
  public errorMsgForEmail : string = "";
  public errorMsgForPhone : string = "";
  
  public checkValidationForEmail(){
    
    if (this.emailSearchedCount != 0){
      this.errorMsgForEmail = "Email already used by another user. Please try with another";
      alert(this.errorMsgForEmail);
    }
    else{
      if (this.contactForm.controls.email.status != "VALID") {
        this.errorMsgForEmail = "Please input with the right email format.";
        alert(this.errorMsgForEmail);
      }
      else{
        if (this.phoneSearchedCount != 0){
          this.errorMsgForPhone = "Phone Number already used by another user. Please try with another";
          alert(this.errorMsgForPhone);
        }
        else{
          if (this.contactForm.controls.phone.status != "VALID") {
            this.errorMsgForPhone = "Phone number must be at least 6 digit number, start with 09.";
            alert(this.errorMsgForPhone);
          }
        }
      }
    }
  }
  public checkValidationForPhone(){
    if (this.phoneSearchedCount != 0){
      this.errorMsgForPhone = "Phone Number already used by another user. Please try with another";
      alert(this.errorMsgForPhone);
    }
    else{
        
      if (this.contactForm.controls.phone.status != "VALID") {
        this.errorMsgForPhone = "Phone number must be at least 6 digit number, start with 09.";
        alert(this.errorMsgForPhone);
      }
      else{
        if (this.emailSearchedCount != 0){
          this.errorMsgForEmail = "Email already used by another user. Please try with another";
          alert(this.errorMsgForEmail);
        }
        else{
          if (this.contactForm.controls.email.status != "VALID") {
            this.errorMsgForEmail = "Please input with the right email format.";
            alert(this.errorMsgForEmail);
          }
        }
      }
    }
  }
  searchContactWithEmail(){
    this.saveEditButtonEnable = true;
    this.contactService.searchContactWithEmail(this.contactForm.value)
    .subscribe((result: any) => {
      this.emailSearchedCount = result.length;
      if (this.emailSearchedCount > 0 ){
        this.saveEditButtonEnable = false;
      }
    }, 
    (error) => {                            
      console.error('Request failed with error')
      alert(error);
    });
  }

  searchContactWithPhone(){
    this.saveEditButtonEnable = true;
    this.contactService.searchContactWithPhone(this.contactForm.value)
    .subscribe((result: any) => {
      this.phoneSearchedCount = result.length;
      if (this.phoneSearchedCount > 0 ){
        this.saveEditButtonEnable = false;
      }
    }, 
    (error) => {                            
      console.error('Request failed with error')
      alert(error);
    });

  }

  getAllContactList() {
    this.retrieveLoading = true;
    this.showNoContactsFoundMessage = false;
    this.contactService.getAllContactList()
      .subscribe((result: any) => {
        if(result.length == 0 ){
          this.showNoContactsFoundMessage = true;
        }
        this.ContactList = result;
        this.retrieveLoading = false;
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

          var findDuplicateIdInFilterNameAry = this.filteredWithNameArray.findIndex(x => x.id == this.filteredWithEmailArray[i].id);
          if (findDuplicateIdInFilterNameAry == -1){
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
    this.retrieveLoading = true;
    this.contactService.filterContactWithPhone(this.searchForm.value.filterText)
    .subscribe((result: any) => {
      if (result.length > 0){
        this.filteredWithPhoneArray = result;
        
        for (let i = 0; i < this.filteredWithPhoneArray.length; i++) {

          var findDuplicateIdInFilterNameAry = this.filteredWithNameArray.findIndex(x => x.id == this.filteredWithPhoneArray[i].id)
          var findDuplicateIdInFilterEmailAry = this.filteredWithEmailArray.findIndex(x => x.id == this.filteredWithPhoneArray[i].id)
          
          if (findDuplicateIdInFilterNameAry == -1 && findDuplicateIdInFilterEmailAry == -1){
            this.ContactList.push(this.filteredWithPhoneArray[i]);
          }
        }
      }
      this.retrieveLoading = false;
    }, 
    (error) => {                            
      console.error('Request failed with error')
      alert(error);
    });
  }
  addNewContact(){
    this.showContactForm = true;
    this.saveEditButtonEnable = true;
  }
  
  saveNewContact(){
    this.saveLoading = true;
    this.saveEditButtonEnable = true;
    this.contactService.saveNewContact(this.contactForm.value).subscribe(x => {
      this.contactForm.reset();
      this.contactForm.controls["id"].setValue(0);
      this.saveLoading = false;
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
    this.saveLoading = true;
    this.saveEditButtonEnable = true;
    this.contactService.updateContact(this.contactForm.value).subscribe(x => {
      this.contactForm.reset();
      this.contactForm.controls["id"].setValue(0);
      this.getAllContactList();
      this.showContactForm = false;
      this.saveLoading = false;
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
