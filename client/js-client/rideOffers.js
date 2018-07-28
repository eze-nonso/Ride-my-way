define(['./common', './requestRide'], (common, requestRide) => {
  const displayLetter = document.querySelector('.username-circle p');
  const offersWrapper = document.getElementById('one');
  const userName = document.getElementById('js-username');
  const modal = document.getElementById('notif-modal');
  const modalHeader = modal.querySelector('.modal-header');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return common.errorHandler({
      message: 'Cannot access requested resource',
    }, 401);
  }

  const userId = user.id;

  const headers = new Headers({
    'x-access-token': token,
  });

  // attach first letter of first name
  displayLetter.textContent = (
    user.firstname.slice(0, 1)
  )
    .toUpperCase() + displayLetter.textContent;

  userName.textContent = user.firstname;

  const route = '/api/v1/rides';

  const remove = (evt) => {
    evt.preventDefault();
    if (confirm('Are you sure?')) {
      const { rideId } = JSON.parse(evt.target.parentElement.getAttribute('data-delete'));
      const delRoute = `/api/v1/rides/${rideId}`;
      fetch(delRoute, {
        headers,
        method: 'DELETE',
      })
        .then(delRes => Promise.all([delRes.json(), delRes]))
        .then(([delData, delRes]) => {
          if (!delRes.ok) {
            // error status handling
            common.errorHandler(delData, delRes.status);
          } else {
            modalHeader.innerHTML += `<p style='font-size:larger;color:green;'>
              Ride successfully deleted!
              </p>
              `;
            modal.style.setProperty('display', 'block');
            setTimeout(() => {
              modal.style.setProperty('display', 'none');
              modalHeader.removeChild(modalHeader.querySelector('p'));
              evt.target.removeEventListener('click', remove);
              window.location.reload();
            }, 2000);
          }
        })
        /* remove listener - evt.target removed on
        page reload or error status handling */
        .then(() => evt.target
          .removeEventListener(evt.type, remove))
        .catch(error => common.errorHandler(error));
    }
  };

  const processGetOffers = (evt) => {
    fetch(route, {
      method: 'GET',
      headers,
    })
      .then(res => Promise.all([res.json(), res]))
      .then(([data, res]) => {
        if (!res.ok) {
          // add error handling here
          return common.errorHandler(data, res.status);
        }
        if (!data.rides.length) {
          // no rides
          offersWrapper.innerHTML = `
            <h2>No Available Ride Offers At The Moment</h2>
            <hr>
            ${offersWrapper.innerHTML}
          `;
          return offersWrapper.removeChild(offersWrapper.querySelector('progress'));
        }

        // rides available
        offersWrapper.innerHTML = `
            <h2>Current Available Rides</h2>
            <hr>
            ${offersWrapper.innerHTML}`;

        offersWrapper.removeChild(offersWrapper.querySelector('progress'));

        const populator = async (ride, index) => {
          const localeTime = common.toLocaleDateString({
            date: ride.departure_date,
            time: ride.departure_time,
          });

          const exists = await requestRide(ride.id, true)();
          const requests = await requestRide(ride.id, 'all')();
          let status = 'class="danger">*ride deleted';
          if (exists) {
            const { accepted } = exists;
            status = (() => {
              switch (accepted) {
                case null: return 'class="warning">*pending';
                case true: return 'class="success">*accepted';
                default: return 'class="danger">*rejected';
              }
            })();
          }

          const disableButton = 'class="btn btn-pri" disabled style="background-color:#848b85;border:1px #848b85;color:#585656;cursor:default;">remove';
          const deleteButton = requests.length
            ? disableButton
            : 'class="btn btn-pri change" style="background-color:#cd6a52;border:#cd6a52;">remove';

          /* eslint-disable no-nested-ternary */
          const actionButton = `
          <button 
          ${
  +userId === +ride.user_id
    ? common.isFrozen(ride)
      ? disableButton
      : deleteButton
    : 'class="btn btn-pri change">select'}</button>
          `;

          const actionLink = `
            <a
            ${
  +userId === +ride.user_id
    ? common.isFrozen(ride)
      ? 'href="#">'
      : `data-delete='${JSON.stringify({ rideId: ride.id })}'>`
    : `href="./user-order-details.html?id=${ride.id}">`
}${actionButton}</a>`;

          offersWrapper.querySelector('#js-order-summary').innerHTML += `
            ${exists ? `<span style="position:absolute;"><small class='success'>*requested</small>&emsp;<small ${status}</small></span>` : ''}
            ${+userId === +ride.user_id
    ? `<span style="position:absolute;"><small class='success'>${requests.length}</small> <small>requests</small></span>`
    : ''}
            <div>
            <h3>${index + 1}.&nbsp;${ride.driver_name} | ${ride.city_from} TO ${ride.city_to} &nbsp; | PICKUP- ${ride.pickup_location}<BR>
              &nbsp; &nbsp;${actionLink}&nbsp;
              &nbsp;${localeTime}
            </h3>
            </div>
            ${index + 1 === data.rides.length ? '' : '<hr>'}
            `;
        };

        return data.rides.reduce((prev, curr, index) => prev
          .then(populator.bind(null, curr, index)), Promise.resolve());
      })
      .then(() => {
        // DOM fully populated - safe to query
        const delRides = document.querySelectorAll('[data-delete]');
        delRides
          .forEach(ride => ride.addEventListener('click', remove));
        evt.target
          .removeEventListener(evt.type, processGetOffers);
      })
      .catch(error => common.errorHandler(error));
  };

  window.addEventListener('load', processGetOffers);
});

