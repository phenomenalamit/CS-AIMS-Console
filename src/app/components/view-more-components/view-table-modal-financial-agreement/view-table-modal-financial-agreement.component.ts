import { Component, OnInit } from '@angular/core';
import { FinancialAgreement } from 'src/app/model/financial-agreement';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';

@Component({
  selector: 'app-view-table-modal-financial-agreement',
  templateUrl: './view-table-modal-financial-agreement.component.html',
  styleUrls: ['./view-table-modal-financial-agreement.component.css']
})
export class ViewTableModalFinancialAgreementComponent implements OnInit {

  constructor(private financialAgreementService: FinancingServiceService) { }
  faId :string ;
  ngOnInit(): void {
    this.faId=localStorage.getItem("financialAgreementId");
    this.getFinancialAgreementViewMoreData();
  }
  tabaleData : FinancialAgreement[]=[];
  browserLang:any;
  private getFinancialAgreementViewMoreData(){
    this.financialAgreementService.getFinancialAgreementById(this.faId).subscribe(data => {
      console.log("data:",data);
        let faData:FinancialAgreement = data;
        this.browserLang = localStorage.getItem("browserLang");
        console.log("fa data :",faData);
        this.tabaleData.push(faData);
        console.log("data:",this.tabaleData);
    })
  }
}
