# PWA Starter

[**Straight to Full Documentation**](https://docs.pwabuilder.com/#/starter/quick-start)

The PWABuilder pwa-starter is our opinionated, best practices, production tested starter that we use to build all of our PWAs, including [PWABuilder itself](https://blog.pwabuilder.com/posts/introducing-the-brand-new-pwa-builder/)! The pwa-starter is a starter codebase, just like create-react-app or the Angular CLI can generate, that uses the PWABuilder team&#39;s preferred front-end tech stack. We also have a CLI tool to allow you to create a PWA template from the command line.

## Jump Right In

Install the PWABuilder CLI:

`npm i -g @pwabuilder/cli`

And create a new app with this command:

`pwa create`

And start your app locally with:

`pwa start`

And that's it! Good luck on your Progressive Web App adventure!

## More Info

[![Get started with the pwa-starter!](https://img.youtube.com/vi/u3pWKpmic_k/0.jpg)](https://www.youtube.com/watch?v=u3pWKpmic_k)

With it you get an app that:
- Has no build system to set up and no boilerplate code to add. Everything is included out of the box.
- Has a Service Worker system using [Workbox](https://developers.google.com/web/tools/workbox/)
- Scores close to 100 on Lighthouse out of the box
- Has everything needed to be installable in the browser
- Is ready to be package for the app stores using [PWABuilder](https://www.pwabuilder.com)
- Uses the [Azure Static Web Apps CLI](https://azure.github.io/static-web-apps-cli) which enables emulating your production environment locally, and gets you ready for deploying to Azure Static Web Apps!

and all with just a few button clicks 😊.

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# URL complète de l'API backend (optionnel)
# Si non défini, l'application utilisera automatiquement: http://api.{host}/api
VITE_HOST=http://localhost:3000/api
```

**Note de sécurité :** Le token d'authentification est stocké dans le `localStorage`, ce qui le rend vulnérable aux attaques XSS. Pour une sécurité renforcée, il est recommandé d'utiliser des cookies httpOnly côté backend.
