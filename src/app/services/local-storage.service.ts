import { Injectable } from '@angular/core';

export interface StoredUser {
  id?: number;
  name?: string;
  userType: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly USER_KEY = 'user';

  constructor() {}

  setUser(user: StoredUser): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): StoredUser | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? (JSON.parse(data) as StoredUser) : null;
  }

  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  getUserRole(): string | null {
    return this.getUser()?.userType || null;
  }

  getUserId(): number | null {
    return this.getUser()?.id ?? null;
  }
}
