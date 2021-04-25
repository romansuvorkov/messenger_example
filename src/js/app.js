import API from './API';
import MessengerController from './MessengerController';
import MessagesRender from './MessagesRender';
import GetGeolocation from './GetGeolocation';
import Recorder from './Recorder';


const api = new API();
const renderer = new MessagesRender();
const popupContainer = document.querySelector('.popup_container');
const geo = new GetGeolocation(popupContainer);
const msController = new MessengerController(api, renderer, geo);
msController.init();
const recorder = new Recorder(msController, popupContainer);
recorder.init();

