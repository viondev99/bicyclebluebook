export const tokenManager: {
  logout: Array<() => void>;
  setLogoutMethod: (m: () => void) => void;
  doLogout: () => void;
} = {
  logout: [],
  setLogoutMethod(m: () => void) {
    this.logout = [m];
  },
  doLogout() {
    this.logout.forEach((i: () => void) => i());
  },
};
