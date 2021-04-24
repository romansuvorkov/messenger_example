export default class API {
  constructor() {
    // this.server = 'http://localhost:7070';
    this.server = 'https://ahj-diploma-serv.herokuapp.com';
  }

  addMsg(text) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.append('text', text);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${this.server}/msgArr`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 204) {
          return resolve(xhr.responseText);
        }
        return reject(xhr.responseText);
      });
      xhr.send(params);
    });
  }

  getfavorire() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.server}/msgArr`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const messages = JSON.parse(xhr.responseText);
          return resolve(messages);
        }
        return reject(xhr.responseText);
      });
      xhr.send();
    });
  }

  getMsg(counter) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.server}/msgArr/${counter}`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const messages = JSON.parse(xhr.responseText);
          return resolve(messages);
        }
        return reject(xhr.responseText);
      });
      xhr.send();
    });
  }

  async uploadToServer(images) {
    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${this.server}/msgFiles`);
      xhr.send(formData);
    }
  }

  async loadFromServer() {
    const request = new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.server);
      xhr.addEventListener('load', () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          }
        }
      });
      xhr.send();
    });
    const result = await request;
    return result;
  }

  changeStatus(id, status) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.append('id', id);
      params.append('status', status);

      const xhr = new XMLHttpRequest();
      xhr.open('PATCH', `${this.server}/favorite?${params}`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 204) {
          const response = xhr.responseText;
          return resolve(response);
        }
        return reject(xhr.responseText);
      });
      xhr.send();
    });
  }
}
