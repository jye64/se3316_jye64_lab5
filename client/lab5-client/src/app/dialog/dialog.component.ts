import { Component, OnInit, Inject, } from '@angular/core';
import { MatDialogRef, MatDialog} from "@angular/material";


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})


export class DialogComponent implements OnInit {


  public confirmationMsg: string;

  constructor(public dialogRef:MatDialogRef<DialogComponent>) {

  }

  ngOnInit() {

  }

}
