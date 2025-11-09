export interface Marathon {
  id?: number;
  name: string;
  slug: string;
  view_count?: number;
  comment_count?: number;
  description: string;
  scale: number;
  highlights: string[];
  registration: {
    start: string;
    end: string;
    status: string;
    site: string;
    text?: string;
  };
  event: {
    date: string;
    start_time: string;
  };
  location: {
    text: string;
    latitude: number;
    longitude: number;
  };
  price: Record<string, number>;
  hosts: {
    organizer: string;
    operator: string;
    sponsor: string[] | string;
    souvenir: string[] | string;
  };
  images: {
    main: string;
    sub: string[];
  };
  contacts: {
    home: string;
    tel: string;
    email: string;
    instagram: string;
    kakao: string;
  };
}
