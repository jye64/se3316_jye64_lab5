import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { DialogComponent } from "../dialog/dialog.component";

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.css']
})
export class NewCollectionComponent implements OnInit {


  model: any = {};
  collections= [];
  show:boolean = false;

  dialogRef:MatDialogRef<DialogComponent>;

  constructor(private httpClient:HttpClient, private route:Router, public dialog:MatDialog) { }

  ngOnInit() {
    this.getCollections();
  }

  showInfo(){
    this.show = !this.show;
  }

  // create new collection
  add(){
    var pub:boolean;
    if(this.model.privacy){
      pub = false;
    }else{
      pub = true;
    }
    this.httpClient.post('http://localhost:8081/api/collections', {
      name: this.model.name,
      description: this.model.description,
      privacy:pub
    }).subscribe(function (res) {
      console.log(res);
    })
  }

  // load collections
  getCollections(){
    var request = new Request('http://localhost:8081/api/collections', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      })
    });
    var here = this;
    fetch(request).then(function (resp) {
      resp.json().then(function (data) {
        here.collections = data;
      });
    }).catch(err => {
      console.log(err);
    });
  }

  // user delete collection
  delete(name){
    fetch('http://localhost:8081/api/collections',{
      method:'DELETE',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:name})
    });
    this.getCollections();
  }

  openDeleteConfirmationDialog(name){
    this.dialogRef = this.dialog.open(DialogComponent,{
      disableClose:false,
      autoFocus: true,
    });
    this.dialogRef.componentInstance.confirmationMsg = "Please confirm your action";

    this.dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.delete(name);
      }
      this.dialogRef = null;
    });
  }

  // user rename collection
  rename(oldName,newName){
    fetch('http://localhost:8081/api/collections/rename',{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:oldName,newName:newName})
    });
    this.getCollections();
  }
}


