import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publish-administration',
  templateUrl: './publish-administration.component.html',
  styleUrls: ['./publish-administration.component.css']
})
export class PublishAdministrationComponent implements OnInit {
  num:any;
  tabClick(index: number) {
    this.num=index;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
