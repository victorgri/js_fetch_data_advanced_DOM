'use strict';

// write code here
const urlWithAllPhones = 'https://mate-academy.github.io'
  + '/phone-catalogue-static/api/phones.json';
const urlWithDetails = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones/';
const body = document.querySelector('body');

function request(link) {
  return fetch(link)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}

function getFirstReceivedDetails(url) {
  request(url)
    .then(json => makeArraywithPromises(json))
    .then(array => Promise.race(array))
    .then(fastest => onSuccessFirstReceived(fastest))
    .catch(error => onError(error));
}

function getAllSuccessfulDetails(url) {
  request(url)
    .then(json => makeArraywithPromises(json))
    .then(array => Promise.all(array))
    .then(list => onSuccessfulDetails(list))
    .catch(error => onError(error));
}

function getThreeFastestDetails(url) {
  request(url)
    .then(json => makeArraywithPromises(json))
    .then(array => Promise.all([
      Promise.race(array), Promise.race(array), Promise.race(array)]))
    .then(list => onSuccessThreeFastest((list)))
    .catch(error => onError(error));
}

function makeArraywithPromises(list) {
  const array = [];
  const arrayofPromises = [];

  for (const item of list) {
    array.push(`${urlWithDetails}${item.id}.json`);
  }

  for (const item of array) {
    arrayofPromises.push(request(item));
  }

  return arrayofPromises;
}

function onSuccessFirstReceived(phone) {
  body.insertAdjacentHTML('afterbegin', `
  <div class="first-received">
    <h3>First Received</h3>
    <ul>
      <li>${phone.name} - ${phone.id.toUpperCase()}</li>
    </ul>
  </div>
  `);
}

function onSuccessfulDetails(list) {
  const div = document.createElement('div');
  const ul = document.createElement('ul');
  const h3 = document.createElement('h3');

  body.append(div);
  div.append(h3);
  div.append(ul);
  div.className = 'all-successful';
  h3.textContent = 'All Successful';

  for (const item of list) {
    const li = document.createElement('li');

    ul.append(li);
    li.textContent = `${item.name} - ${item.id.toUpperCase()}`;
  }
}

function onSuccessThreeFastest(list) {
  body.insertAdjacentHTML('afterbegin', `
  <div class="three-received">
    <h3>Three Fastest Received</h3>
    <ul>
      <li>${list[0].name} - ${list[0].id.toUpperCase()}</li>
      <li>${list[1].name} - ${list[1].id.toUpperCase()}</li>
      <li>${list[2].name} - ${list[2].id.toUpperCase()}</li>
    </ul>
  </div>
  `);
}

function onError(data) {
  const div = document.createElement('div');
  const p = document.createElement('p');

  document.body.append(div);
  div.append(p);
  div.className = 'error';
  p.textContent = `Oops! ${data}`;
}

getFirstReceivedDetails(urlWithAllPhones);
getAllSuccessfulDetails(urlWithAllPhones);
getThreeFastestDetails(urlWithAllPhones);
