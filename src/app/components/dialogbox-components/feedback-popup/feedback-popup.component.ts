import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Feedback } from 'src/app/model/feedback';
import { FeedbackServiceService } from 'src/app/Service/feedback-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feedback-popup',
  templateUrl: './feedback-popup.component.html',
  styleUrls: ['./feedback-popup.component.css']
})
export class FeedbackPopupComponent implements OnInit {

  public feedBackPopUpForm!: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) private data:Feedback,private feedbackService: FeedbackServiceService) { }
  email:string;
  browserLang: any;
  ngOnInit(): void {
    this.browserLang = localStorage.getItem("browserLang");
    this.feedBackPopUpForm=new FormGroup({
      to:new FormControl({ value: '', disabled: true }),
      subject:new FormControl({ value: '', disabled: true }),
      textMsg:new FormControl('')
    });
    console.log("data:",this.data);
    
    this.email=this.data.email;
    this.feedBackPopUpForm.controls.to.patchValue(this.email);
    if(this.browserLang==="en")
    this.feedBackPopUpForm.controls.subject.patchValue('Reply to Feedback : '+this.data.comments);
    else
    this.feedBackPopUpForm.controls.subject.patchValue('Responder ao feedback : '+this.data.comments);
  }
  getValueByLang() {
    this.browserLang = localStorage.getItem("browserLang");
  }
  opensweetalertSent() {
      //http request to update the label
      console.log('before data :', this.data);
      this.getValueByLang()
      this.data.subject=this.feedBackPopUpForm.controls.subject.value;
      this.data.mailBody = this.feedBackPopUpForm.controls.textMsg.value;
      this.data.mailBody.trim();
      this.data.language=this.browserLang;
      this.feedbackService.respondToFeedback(this.data).subscribe(res => {

        //check the response
        if (res.status == 200) {
          this.data.status=(res.body as Feedback).status;
          console.log('after data :', this.data);
          console.log('response :', res);
          //show successful message with popup
          if(this.browserLang==='en')
          Swal.fire('Responded to Feedback successfully', '', 'success');
          else
          Swal.fire('Respondeu ao Feedback com sucesso', '', 'success');
        }
      },
        error => {
          Swal.fire("Something went wrong, please try again later.")
          console.log(error)
        });
  }

}
