define(['./common'], common =>
  (rideId, checkRequest) => async () => {
    const route = `/api/v1/rides/${rideId}/requests`;
    const { id: userId } = JSON.parse(window.localStorage.getItem('user'));
    const headers = new Headers({
      'x-access-token': window.localStorage.getItem('token'),
    });

    // check if user has already made request
    const requestsRoute = '/api/v1/requests';
    const requested = await fetch(requestsRoute, {
      headers,
      method: 'GET',
    })
      .then(res => Promise.all([res.json(), res]))
      .then(([data, res]) => {
        if (!res.ok) {
          // error status handling
          return alert(JSON.stringify(data));
        }
        return data.requests
          .find(req => req.ride_id === +rideId
            && req.requester_id === userId);
      })
      .catch(error => common.errorHandler(error));

    if (checkRequest && requested) {
      return true;
    } else if (checkRequest) return false;

    if (requested) {
      // error code handling here - say 409
      return alert('You have already made a request for this ride');
    }

    return fetch(route, {
      method: 'POST',
      headers,
    })
      .then(res => Promise.all([res.json(), res]))
      .then(([data, res]) => {
        if (!res.ok) {
          // error status code handling
          alert(JSON.stringify(data));
        } else {
          // success
          document.getElementById('js-message')
            .textContent = 'Your request was successful, you will receive a reply soon';
          const modal = document.getElementById('myModal');
          modal.style.setProperty('display', 'block');
          setTimeout(() => {
            modal.style.setProperty('display', 'none');
            window.location = 'rides-confirmation.html';
          }, 4000);
        }
      })
      .catch(error => common.errorHandler(error));
  });