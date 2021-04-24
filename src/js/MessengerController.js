export default class MessengerController {
  constructor(api, renderer, geo) {
    this.api = api;
    this.renderer = renderer;
    this.inputTextarea = document.querySelector('.input_field');
    this.inputDnD = document.querySelector('.input');
    this.messagesFieid = document.querySelector('.messenger_field');
    this.clipBtn = document.querySelector('.clip_btn');
    this.geoBtn = document.querySelector('.geo_btn');
    this.inputBtn = document.querySelector('.input_btn');
    // this.wsURL = 'ws://localhost:7070/ws';
    this.favorite = document.querySelector('.favorite');
    this.wsURL = 'wss://ahj-diploma-serv.herokuapp.com/ws';
    this.lazyLoadCounter = 10;
    this.messageslimit = 10;
    this.favoriteSwitch = false;
    this.geolocation = geo;
    this.coordinates = null;
  }

  async init() {
    this.ws = new WebSocket(this.wsURL);

    this.ws.addEventListener('message', (event) => {
      if (event.data && event.data !== null) {
        const messageObject = JSON.parse(event.data);
        if (messageObject.type === 'text') {
          this.renderer.addMsg(messageObject, 'append');
        } else {
          this.renderer.addFileMsg(messageObject, 'append');
        }
      }
    });

    this.startDraw();

    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('message_favorite')) {
        if (event.target.classList.contains('favorite_false')) {
          event.target.classList.remove('favorite_false');
          event.target.classList.add('favorite_active');
          const targetID = event.target.parentNode.dataset.id;
          const status = true;
          this.api.changeStatus(targetID, status);
        } else {
          event.target.classList.remove('favorite_active');
          event.target.classList.add('favorite_false');
          const targetID = event.target.parentNode.dataset.id;
          const status = false;
          this.api.changeStatus(targetID, status);
        }
      }
    });


    this.inputTextarea.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter' && event.ctrlKey) {
        const valid = /[\wа-яА-Я]/;
        if (this.inputTextarea.value !== '' && this.inputTextarea.value.search(valid) !== -1) {
          event.preventDefault();
          if (this.ws.readyState === WebSocket.OPEN) {
            try {
              const newTextMsg = {
                type: 'text',
                favorite: false,
                msg: this.inputTextarea.value,
                geo: this.coordinates,
              };
              this.ws.send(JSON.stringify(newTextMsg));
            } catch (e) {
            // console.log(e);
            }
          } else {
            this.ws = new WebSocket(this.wsURL);
            const newTextMsg = {
              type: 'text',
              favorite: false,
              msg: this.inputTextarea.value,
              geo: this.coordinates,
            };
            this.ws.send(JSON.stringify(newTextMsg));
          }
          this.inputTextarea.value = '';
        }
      }
    });

    this.inputBtn.addEventListener('click', async () => {
      const valid = /[\wа-яА-Я]/;
      if (this.inputTextarea.value !== '' && this.inputTextarea.value.search(valid) !== -1) {
        if (this.ws.readyState === WebSocket.OPEN) {
          try {
            const newTextMsg = {
              type: 'text',
              favorite: false,
              msg: this.inputTextarea.value,
              geo: this.coordinates,
            };
            this.ws.send(JSON.stringify(newTextMsg));
          } catch (e) {
            // console.log(e);
          }
        } else {
          this.ws = new WebSocket(this.wsURL);
          const newTextMsg = {
            type: 'text',
            favorite: false,
            msg: this.inputTextarea.value,
            geo: this.coordinates,
          };
          this.ws.send(JSON.stringify(newTextMsg));
        }
        this.inputTextarea.value = '';
      }
    });

    this.clipBtn.addEventListener('click', () => {
      this.inputDnD.dispatchEvent(new MouseEvent('click'));
    });

    this.inputDnD.addEventListener('input', (event) => {
      const files = Array.from(event.currentTarget.files);

      for (const item of files) {
        const fileTypeRegExp = /[a-z]+/;
        const fileType = item.type.match(fileTypeRegExp)[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(item);
        fileReader.onload = () => {
          const message = {
            type: fileType,
            favorite: false,
            name: item.name,
            msg: fileReader.result,
            geo: this.coordinates,
          };
          this.ws.send(JSON.stringify(message));
        };
      }
    });

    this.messagesFieid.addEventListener('dragover', (evt) => {
      evt.preventDefault();
      this.messagesFieid.classList.add('focus');
    });

    this.messagesFieid.addEventListener('dragleave', (evt) => {
      evt.preventDefault();
      this.messagesFieid.classList.remove('focus');
    });

    this.messagesFieid.addEventListener('drop', (evt) => {
      evt.preventDefault();
      this.messagesFieid.classList.remove('focus');
      const files = Array.from(evt.dataTransfer.files);


      for (const item of files) {
        const fileTypeRegExp = /[a-z]+/;
        const fileType = item.type.match(fileTypeRegExp)[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(item);
        fileReader.onload = () => {
          const message = {
            type: fileType,
            favorite: false,
            name: item.name,
            msg: fileReader.result,
            geo: this.coordinates,
          };
          this.ws.send(JSON.stringify(message));
        };
      }
    });

    this.renderer.container.addEventListener('scroll', (event) => {
      if (event.target.scrollTop === 0) {
        this.lazyLoad();
      }
    });

    this.favorite.addEventListener('click', () => {
      this.favorite.classList.toggle('favorite_active');
      this.favorite.classList.toggle('favorite_false');
      if (!this.favoriteSwitch) {
        this.favoriteSwitch = true;
        this.favoriteInterface();
      } else {
        this.favoriteSwitch = false;
        while (this.renderer.container.firstChild) {
          this.renderer.container.removeChild(this.renderer.container.firstChild);
        }
        this.startDraw();
      }
    });

    this.geoBtn.addEventListener('click', async () => {
      if (this.coordinates === null) {
        this.coordinates = await this.geolocation.getLocation();
        this.geoBtn.classList.remove('geo_off');
        this.geoBtn.classList.add('geo_on');
      } else {
        this.coordinates = null;
        this.geoBtn.classList.remove('geo_on');
        this.geoBtn.classList.add('geo_off');
      }
    });

    if (this.coordinates === null) {
      this.geoBtn.classList.add('geo_off');
    } else {
      this.geoBtn.classList.add('geo_on');
    }
  }


  async lazyLoad() {
    this.messageslimit += this.lazyLoadCounter;
    const messagesListNew = await this.api.getMsg(this.messageslimit);
    if (messagesListNew === 'All loaded') {
      alert('All loaded');
    }
    messagesListNew.reverse();
    for (const item of messagesListNew) {
      if (item.type === 'text') {
        this.renderer.addMsg(item, 'prepend');
      } else {
        this.renderer.addFileMsg(item, 'prepend');
      }
    }
  }

  async favoriteInterface() {
    while (this.renderer.container.firstChild) {
      this.renderer.container.removeChild(this.renderer.container.firstChild);
    }
    const favoriteList = await this.api.getfavorire(this.lazyLoadCounter);
    for (const item of favoriteList) {
      if (item.type === 'text') {
        this.renderer.addMsg(item, 'append');
      } else {
        this.renderer.addFileMsg(item, 'append');
      }
    }
  }

  async startDraw() {
    const messagesList = await this.api.getMsg(this.lazyLoadCounter);

    if (messagesList.length > this.lazyLoadCounter) {
      for (let i = 0; i < this.lazyLoadCounter; i += 1) {
        const index = messagesList.length - 1 - i;
        if (messagesList[index].type === 'text') {
          this.renderer.addMsg(messagesList[index], 'prepend');
        } else {
          this.renderer.addFileMsg(messagesList[index], 'prepend');
        }
      }
    } else {
      for (const item of messagesList) {
        if (item.type === 'text') {
          this.renderer.addMsg(item, 'append');
        } else {
          this.renderer.addFileMsg(item, 'append');
        }
      }
    }
  }
}
