define([], () => class {
  static store({
    token, user,
  }) {
    localStorage.clear();
    localStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  static errorHandler(error) {
    alert(error.message);
  }

  static allow() {
    window.location.href = '/rides.html';
  }
});
