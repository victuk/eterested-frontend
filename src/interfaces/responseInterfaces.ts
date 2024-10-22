export interface PaginatedReponseInterface {
  docs: any[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface Tags {
  name?: string;
  slug?: string;
}

export interface TicketDetailsInterface {
  id?: string;
  ticketType: Tags;
  ticketDescription: string;
  ticketCost: number;
  totalTicketsAvailable: number;
}

export interface EventInterface {
  averageRating?: number;
  averageRatingByTicketType?: Array<any>;
  cityOrLGA?: string;
  country?: string;
  createdAt?: Date;
  dateAndTime?: Date;
  description?: string
  eventFlyer?: string;
  eventOrganizer?: string | null;
  state?: string;
  tags?: string[];
  title?: string;
  updatedAt?: Date;
  venue?: string;
  __v?: number;
  _id?: string;
}
