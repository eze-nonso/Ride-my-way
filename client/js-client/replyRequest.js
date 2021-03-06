define(['./common'], (common) => {
  // display username
  const welcome = document.getElementById('js-welcome');
  const displayName = document.getElementById('js-user');
  const displayLetter = document.querySelector('.username-circle p');

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return common.errorHandler({
      message: 'Cannot access requested resource',
    }, 401);
  }

  const { id: userId } = JSON.parse(localStorage.getItem('user'));

  const greeting = document.createTextNode(`Hello, ${user.firstname}`);
  displayName.textContent = user.firstname;
  const h2 = document.createElement('h2');
  welcome.appendChild(h2);
  h2.appendChild(greeting);

  // attach first letter of first name
  displayLetter.textContent = (
    user.firstname.slice(0, 1)
  )
    .toUpperCase() + displayLetter.textContent;

  const route = '/api/v1/requests';
  const token = localStorage.getItem('token');
  const headers = new Headers({
    'x-access-token': token,
  });

  fetch(route, {
    method: 'GET',
    headers,
  })
    .then(res => Promise.all([res.json(), res]))
    .then(([data, res]) => {
      if (!res.ok) {
        // error status code handling
        return common.errorHandler(data, res.status);
      }
      return [...data.requests].filter(req => req.owner_id === userId
        && !req.ride_deleted && !req.deleted);
    })
    .then((requests) => {
      if (!requests || !requests.length) {
        const displayTable = document.querySelector('#js-order-details table');
        displayTable.innerHTML += `
          <tr style="position:relative;">
            <td style='font-size:30px;position:absolute;'>There have been no requests so far</td>
          </tr>
          `;
      } else if (requests) {
        // if accepted not pending, cannot change accepted 6 hrs b4 time

        document.querySelector('#js-order-details table')
          .innerHTML += requests.reduce((prev, req, index) => `
          ${prev}<tr>
          <td>${index + 1}</td>
          <td>${req.requester}</td>
          <td>${req.city_from}</td>
          <td>${req.city_to}</td>
          <td>${
  common.toLocaleDateString({
    date: req.departure_date,
    time: req.departure_time,
  })
}</td>
          <td>
            <span>
              <select class="success table-select" ${
  ((status) => {
    switch (status) {
      case true: return `data-ids='${JSON.stringify({ id: req.id, rideId: req.ride_id })}'>
                    <option class="warning" value="pending" disabled>Pending</option>
                    <option class="success" value="accept" selected>Accept</option>
                    <option class="danger" ${(common.isFrozen({
      departure_date: req.departure_date,
      departure_time: req.departure_time,
    })) ? 'disabled' : ''} value="reject">Reject`;
      case false: return `data-ids='${JSON.stringify({ id: req.id, rideId: req.ride_id })}'>
                    <option class="warning" value="pending" disabled>Pending</option>
                    <option class="success" ${(common.isFrozen({
      departure_date: req.departure_date,
      departure_time: req.departure_time,
    })) ? 'disabled' : ''} value="accept">Accept</option>
                    <option class="danger" value="reject" selected>Reject`;
      default: return `data-ids='${JSON.stringify({ id: req.id, rideId: req.ride_id })}'>
                    <option class="warning" value="pending" selected>Pending</option>
                    <option class="success" value="accept">Accept</option>
                    <option class="danger" value="reject">Reject`;
    }
  })(req.accepted)
}</option>
              </select>
            </span>
          </td>
        </tr>
          `, '');

        const toggle = (evt) => {
          const { rideId, id: reqId } = JSON.parse(evt.target.getAttribute('data-ids'));
          const statRoute = `/api/v1/users/rides/${rideId}/requests/${reqId}`;
          const body = {
            accept: evt.target.selectedOptions[0].value === 'accept',
          };
          const statHeaders = new Headers({
            'content-type': 'application/json',
            'x-access-token': token,
          });
          fetch(statRoute, {
            method: 'PUT',
            headers: statHeaders,
            body: JSON.stringify(body),
          })
            .then(statRes => Promise.all([statRes.json(), statRes]))
            .then(([statData, statRes]) => {
              if (!statRes.ok) {
                // error status code handling
                common.errorHandler(statData, statRes.status);
              } else {
                // notify user
                const message = document.getElementById('js-message');
                message.textContent = `Successfully updated!, you can still make changes up 
              until 6 hours before departure time`;
                const modal = document.getElementById('myModal');
                modal.style.setProperty('display', 'block');
                setTimeout(() => {
                  modal.style.setProperty('display', 'none');
                  message.textContent = '';
                }, 2000);
                // disable option "pending"
                evt.target.querySelector('[value="pending"]')
                  .setAttribute('disabled', true);
              }
            });
        };

        const stats = document.querySelectorAll('select');
        stats.forEach((stat) => {
          stat.addEventListener('change', toggle);
        });
      }
    })
    .catch(error => common.errorHandler(error));
});
