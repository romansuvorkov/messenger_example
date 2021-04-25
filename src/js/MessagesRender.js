// const searchlink = /(http[s]?:\/\/)[-\w.\/%а-яА-Я:]+/g;

export default class MessagesRender {
  constructor() {
    this.container = document.querySelector('.messenger_field');
  }

  addMsg(obj, targetPlace) {
    let messageText = obj.msg;
    let urlRegex = /(https?:\/\/[^\s]+)/g; // eslint-disable-line no-useless-escape
    let messageWithLinks = messageText.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    while (messageWithLinks.includes(String.fromCodePoint(0x000A))) {
      messageWithLinks = messageWithLinks.replace(String.fromCodePoint(0x000A), '<br>');
    }
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message_vrapper');
    const messageFavorite = document.createElement('span');
    messageFavorite.classList.add('message_favorite');
    if (obj.favorite === 'true') {
      messageFavorite.classList.add('favorite_active');
    } else {
      messageFavorite.classList.add('favorite_false');
    }
    const newMsg = document.createElement('div');
    newMsg.classList.add('message');
    const msgContent = document.createElement('span');
    msgContent.innerHTML = `${messageWithLinks}`;
    msgContent.classList.add('message_content');
    newMsg.append(msgContent);
    messageWrapper.dataset.id = obj.id;
    messageWrapper.append(messageFavorite);
    messageWrapper.append(newMsg);
    if (obj.geo !== null) {
      const geo = document.createElement('span');
      geo.innerHTML = `${obj.geo}`;
      geo.classList.add('geo');
      msgContent.append(geo);
    }
    if (targetPlace === 'append') {
      this.container.append(messageWrapper);
    } else {
      this.container.prepend(messageWrapper);
    }
  }

  addFileMsg(obj, targetPlace) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message_vrapper');
    const messageFavorite = document.createElement('span');
    messageFavorite.classList.add('message_favorite');
    if (obj.favorite === 'true') {
      messageFavorite.classList.add('favorite_active');
    } else {
      messageFavorite.classList.add('favorite_false');
    }
    const newMsg = document.createElement('div');
    if (obj.type === 'image') {
      newMsg.innerHTML = `
            <img class="image_preview" src="${obj.msg}">
            <span class="image_name">${obj.name}</span>
            <a class="link_download background_image" href="${obj.msg}" download="${obj.name}"></a>
          `;
      newMsg.classList.add('image_message_item');
    } else if (obj.type === 'audio') {
      newMsg.innerHTML = `
      <audio src="${obj.msg}" class="media" controls="controls"></audio>
      <span class="image_name">${obj.name}</span>
      <a class="link_download background_image" href="${obj.msg}" download="${obj.name}"></a>
    `;
      newMsg.classList.add('file_message_item');
    } else if (obj.type === 'video') {
      newMsg.innerHTML = `
            <video src="${obj.msg}" class="media" controls="controls"></video>
            <span class="image_name">${obj.name}</span>
            <a class="link_download background_image" href="${obj.msg}" download="${obj.name}"></a>
          `;
      newMsg.classList.add('file_message_item');
    } else {
      newMsg.innerHTML = `
            <img class="file_preview" src="../img/file.png">
            <span class="image_name">${obj.name}</span>
            <a class="link_download background_image" href="${obj.msg}" download="${obj.name}"></a>
          `;
      newMsg.classList.add('file_message_item');
    }
    messageWrapper.dataset.id = obj.id;
    // console.log(obj);
    if (obj.geo !== null) {
      const geo = document.createElement('span');
      geo.innerHTML = `${obj.geo}`;
      geo.classList.add('geo');
      newMsg.append(geo);
    }
    messageWrapper.append(messageFavorite);
    messageWrapper.append(newMsg);


    if (targetPlace === 'append') {
      this.container.append(messageWrapper);
    } else {
      this.container.prepend(messageWrapper);
    }
  }
}
