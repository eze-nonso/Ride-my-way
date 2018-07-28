define(['./common'], common =>
  (rideId, checkRequest, remove) => async function request(evt) {
    const route = `/api/v1/rides/${rideId}/requests`;
    const user = JSON.parse(window.localStorage.getItem('user'));

    if (!user) {
      return common.errorHandler({
        message: 'Cannot access requested resource',
      }, 401);
    }

    const requestsRoute = '/api/v1/requests';
    const { id: userId } = user;

    const headers = new Headers({
      'x-access-token': window.localStorage.getItem('token'),
    });

    // get all requests for ride belonging to user userId
    const requests = await fetch(requestsRoute, {
      headers,
      method: 'GET',
    })
      .then(res => Promise.all([res.json(), res]))
      .then(([data, res]) => {
        if (!res.ok) return common.errorHandler(data, res.status);
        return data.requests;
      });

    if (checkRequest === 'all') return requests;

    // check if user has already made request
    const requested = await fetch(requestsRoute, {
      headers,
      method: 'GET',
    })
      .then(res => Promise.all([res.json(), res]))
      .then(([data, res]) => {
        if (!res.ok) {
          // error status handling
          return common.errorHandler(data, res.status);
        }
        const rideReq = data.requests
          .find(req => req.ride_id === +rideId
            && req.requester_id === +userId
            && !req.deleted);
        if (rideReq) return rideReq;
        return false;
      })
      .catch(error => common.errorHandler(error));

    if (checkRequest && requested) {
      return requested;
    } else if (checkRequest) return false;

    // delete request
    if (requested && remove) {
      if (confirm('Are you sure')) {
        const delRoute = `/api/v1/requests/${requested.id}`;
        return fetch(delRoute, {
          method: 'DELETE',
          headers,
        })
          .then(res => Promise.all([res.json(), res]))
          .then(([data, res]) => {
            if (!res.ok) {
            // error status code handling
              common.errorHandler(data, res.status);
            } else {
            // success
              const message = document.getElementById('js-message');
              message.textContent = 'Request successfully removed';
              const modal = document.getElementById('myModal');
              modal.style.setProperty('display', 'block');
              setTimeout(() => {
                modal.style.setProperty('display', 'none');
                message.textContent = '';
                window.location.reload();
              }, 2000);
            }
          })
          .then(() => evt.target
            .removeEventListener(evt.type, request))
          .catch(e => common.errorHandler(e));
      }
      return false;
    }

    if (requested) {
      // error code handling here - say 409
      return common.errorHandler({
        message: 'You have already made a request for this ride',
      }, 409);
    }

    // create request
    return fetch(route, {
      method: 'POST',
      headers,
    })
      .then(res => Promise.all([res.json(), res]))
      .then(([data, res]) => {
        if (!res.ok) {
          // error status code handling
          common.errorHandler(data, res.status);
        } else {
          // success
          const message = document.getElementById('js-message');
          message.textContent = 'Your request was successful, you will receive a reply soon';
          const modal = document.getElementById('myModal');
          modal.style.setProperty('display', 'block');
          setTimeout(() => {
            modal.style.setProperty('display', 'none');
            message.textContent = '';
            window.location = 'rides-confirmation.html';
          }, 2000);
        }
      })
      .then(() => evt.target
        .removeEventListener(evt.type, request))
      .catch(error => common.errorHandler(error));
  });
