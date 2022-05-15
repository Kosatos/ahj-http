export default class API {
  constructor(url, port) {
    this.url = url;
    this.port = port;
  }

  getAll() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `http://${this.url}:${this.port}?method=allTickets`);
      xhr.responseType = 'json';

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send();
    });
  }

  getFullTicket(id) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        `http://${this.url}:${this.port}?method=ticketById&id=${id}`
      );
      xhr.responseType = 'json';

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send();
    });
  }

  POSTData(data, method) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `http://${this.url}:${this.port}`);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      const body = JSON.stringify({ ...data, method: method });
      xhr.send(body);
    });
  }
}
