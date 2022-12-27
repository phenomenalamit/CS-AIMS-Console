import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feedback } from '../model/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackServiceService {

  constructor(private http: HttpClient) { }

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${environment.getFeedbacksURL}`);
   }
  ignoreFeedback(id: number):Observable<HttpResponse<Object>>{
    return this.http.patch(`${environment.ignoreFeedbackURL}`,id,{observe: 'response'});
  }
  updateFeedback(feedback:Feedback):Observable<HttpResponse<Object>>{
    return this.http.put(`${environment.updateFeedbackURL}`,feedback,{observe: 'response'});
  }

  respondToFeedback(feedback:Feedback):Observable<HttpResponse<Object>>{
    return this.http.patch(`${environment.respondToFeedbackURL}`,feedback,{observe: 'response'});
  }
  getFeedbackById(feedbackId:number): Observable<HttpResponse<Object>> {
    return this.http.get(`${environment.getFeedbackByIdURL}`+'/'+feedbackId,{observe: 'response'});
   }
}
