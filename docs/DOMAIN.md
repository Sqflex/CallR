# Подключение callr.online

В репозитории уже есть файл `CNAME` с доменом `callr.online`. Для работы сайта нужны настройка GitHub Pages, корректные DNS-записи и сертификат HTTPS.

## 1. Сначала GitHub

Опубликуйте сайт по инструкции в README. Рекомендуется подтвердить владение доменом в настройках GitHub Pages вашего аккаунта или организации через предложенную GitHub TXT-запись.

Затем в **репозитории сайта → Settings → Pages → Custom domain** укажите:

```text
callr.online
```

Нажмите **Save**. Если GitHub создаст отдельный коммит с файлом `CNAME`, подтяните его в локальный репозиторий перед следующей отправкой изменений.

Не направляйте DNS домена на GitHub раньше, чем добавили домен в настройки нужного сайта.

## 2. Затем DNS у регистратора

Для основного домена создайте четыре A-записи:

| Тип | Имя / Host | Значение |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Для `www` создайте CNAME:

| Тип | Имя / Host | Значение |
|---|---|---|
| CNAME | www | sqflex.github.io |

Не добавляйте `https://` или имя репозитория в CNAME.

Проверьте и удалите только конфликтующие записи для сайта. **Не удаляйте MX-записи почты и другие записи, назначение которых вам неизвестно.** Не создавайте wildcard-запись `*`.

Эти настройки рассчитаны на GitHub Pages. Значения приведены по официальной документации, проверенной 24 сентября 2026 года. Перед подключением сверьтесь с актуальной инструкцией GitHub.

## 3. Включите HTTPS

Дождитесь успешной проверки DNS в **Settings → Pages**. Затем включите **Enforce HTTPS**, когда настройка станет доступна. Обновление DNS и выпуск сертификата могут занять время; это не требует изменений в HTML.

Проверьте:

```text
https://callr.online/
https://callr.online/en.html
https://callr.online/assets/CallR_Pitch_RU.pdf
```

## Если используете другой домен

Замените `https://callr.online` на новый адрес в:

- `index.html` и `en.html`: canonical, alternate, Open Graph и Twitter image;
- `sitemap.xml` и `robots.txt`;
- `404.html`;
- видимых подписях с доменом и обложке `assets/social-cover.png`.

Сейчас SEO-метаданные и sitemap используют `https://callr.online/`. На работоспособность обычных относительных ссылок смена домена не влияет.

## Официальные инструкции

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
