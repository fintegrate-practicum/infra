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
    connections: any[];
    businessId: string;
  };
}
