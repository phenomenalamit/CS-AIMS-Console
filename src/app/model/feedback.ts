export class Feedback {
    feedbackId: number;
    name: string;
    email: string;
    telephone: string;
    organization: string;
    subject: string;
    mailBody: string;
    comments: string;
    createdOn: Date;
    updatedOn: Date;
    priority: string;
    status: string;
    isEdit: boolean = false;
    language:string;
}