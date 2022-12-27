import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-primary-link',
  templateUrl: './primary-link.component.html',
  styleUrls: ['./primary-link.component.css']
})
export class PrimaryLinkComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  num: any;
  funds:any;
  tabClick(index: number) {
    this.num = index;
  }
}
