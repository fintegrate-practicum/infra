export interface Message {
  pattern: string;
  data: {
    to: string;
    subject: string;
    type: 'email';
    kindSubject: string;
    name: string;
    description?: string;
    date?: Date;
    managerName?: string;
    invitationLink: string;
    connection: any[];
    businessId: string;
  };
}
