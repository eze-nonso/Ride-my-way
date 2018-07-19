define([], () => class {
  static store({
    token, user,
  }) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  static errorHandler(error) {
    alert(error.message);
  }

  static allow() {
    window.location.href = '/user-dashboard.html';
  }

  static auth(token) {
    const headers = new Headers({
      'x-access-token': token,
    });
    // check that token is valid
    return fetch('/api/v1/rides', {
      method: 'GET',
      headers,
    })
      .then(res => res.ok);
  }
});
