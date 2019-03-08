import { Photo } from './Photo';

export interface User {
  id: number;
  userName: string;
  gender: string;
  age: number;
  knownAs: string;
  created: Date;
  LastActive: Date;
  introduction?: string;
  interests?: string;
  lockingFor?: string;
  city: string;
  country: string;
  mainPhotoUrl?: string;
  photos?: Photo[];
}
