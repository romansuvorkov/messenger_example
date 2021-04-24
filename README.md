https://romansuvorkov.github.io/messenger_example

[![Build status](https://ci.appveyor.com/api/projects/status/uoit8r45no37q3gy?svg=true)](https://ci.appveyor.com/project/romansuvorkov/messenger-example)

# Тестовая версия мессенджера

В проекте использованы следующие технологии:
1. Webpack
1. Eslint
1. Navigator.geolocation
1. WebSocket - обмен данными с сервером
1. MediaRecorder - Для записи медиа


Функциональность проекта:

1. Сохранение в истории ссылок и текстовых сообщений
1. Ссылки (то, что начинается с http:// или https://) должны быть кликабельны и отображаться как ссылки
1. Сохранение в истории изображений, видео и аудио (как файлов) - через Drag & Drop и через иконку загрузки (скрепка в большинстве мессенджеров)
1. Скачивание файлов (на компьютер пользователя)
1. Ленивая подгрузка: сначала подгружаются последние 10 сообщений, при прокрутке вверх подгружаются следующие 10 и т.д.
1. Для отправки текстового сообщения необходимо нажать CTR+Enter или на иконку письма
1. Синхронизация - если приложение открыто в нескольких окнах (вкладках), то контент должен быть синхронизирован
1. Отправка геолокации
1. Добавление сообщения в избранное (тогда должен быть интерфейс для просмотра избранного)
1. Запись видео и аудио (используя API браузера)
1. Воспроизведение видео/аудио (используя API браузера)

### Инструкция

1. Для отправки текстового сообщения необходимо нажать CTR+Enter или на иконку письма в поле ввода
1. Сервер бесплатно размещен на heroku, поэтому нужно несколько минут для его запуска

