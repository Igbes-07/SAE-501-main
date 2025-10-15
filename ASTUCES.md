# Astuces

- [Astuces](#astuces)
  - [Swagger](#swagger)
  - [Middleware](#middleware)
    - [Middleware "routeName"](#middleware-routename)
  - [Gestion des retours à la ligne (nunjucks)](#gestion-des-retours-à-la-ligne-nunjucks)
  - [Ouvrir avec Code / Afficher le code](#ouvrir-avec-code--afficher-le-code)
  - [En vrac](#en-vrac)


Pour vous aider à mener à bien, le projet intègre des outils dont **l'utilisation est facultative.** Toutefois, nous vous invitons à lire attentivement ce document.

Ce document n'abordera pas l'utilisation de POSTMAN, vu qu'il y a un document dédié à son utilisation. [Accéder au document de présentation de POSTMAN](./POSTMAN.md).

## Swagger

En complément de Postman, le projet intégère également Swagger, appelé également OpenAPI. C'est un outil permettant la documentation d'API via une syntaxe propre à l'outil. Vous pourrez trouver des exemples d'utilisation dans les fichiers du dossier `/server/api`. 

Comme Postman, Swagger permet de tester les points d'accès de votre API en effectuant de réelles requêtes. Dans le projet, le Swagger est accessible via la routes `/swagger` ou depuis l'administration dans la partie "debug". Partie "debug" visible uniquement en mode "développement".

## Middleware

Le middleware est un concept clé d'express. Toutefois, le middleware n'est pas propre à express, il existe dans l'informatique en général. C'est un logiciel qui se place entre différentes applications qui leur permettre une meilleure interopérabilité.

Express est fondé sur le concept des middlewares, "une application Express n’est ni plus ni moins qu’une succession d’appels de fonctions middleware". Observons le code suivant :

```js
router.delete('/articles/:id', (req, res, next) => {
   res.send(`Je suis le texte d'un middleware`);
});
```
Dans le code ci-dessus, la fonction anonyme (avec la signature `(req, res, next)`) est un middleware qui sera appelé quand on effectuera une requête de type DELETE pour l'url `articles/:id` où `:id` est un paramètre dynamique. Lors de l'appel, le middleware retournera du texte, il est possible d'effectuer d'autres actions comme afficher un document JSON, télécharger un fichier ou encore passer des informations au middleware suivant. Exemple :

```js
const myMiddleware = (req, res, next) => {
    console.log("I'm a middleware");
    
    // IMPORTANT : Without the following function, the next middleware will never be called
    // leading to a infinite loop
    next();
}

// Before calling our anonymous middleware, the myMiddleware is called before
router.put('/articles/:id', myMiddleware, (req, res, next) => {
   res.send(`Je suis le texte d'un middleware`);
});
```
A noter qu'on peut placer plusieurs middlewares, il suffit juste de les séparer par des virgules.

Le système des middlewares est très puissant et pratique, vous pourrez en savoir plus en consultant la documentation. [Accéder à la documentation des middlewares](https://expressjs.com/fr/guide/using-middleware.html).

### Middleware "routeName"

Aussi pratique puisse être express et son système de routes, il possède une lacune assez contraignante : il n'est pas possible de nommer les routes. Fonctionnalité qu'on peut voir dans d'autres frameworks comme Symfony (php) ou Django (Python). Très pratique, elle permet de limiter la duplication de code en écrivant dans les templates non pas le chemin d'URL mais une fonction avec le nom de la route et les paramètres à lui passer.

L'avantage de ce système est que si vous changez le chemin d'une route, vous n'avez pas besoin de faire des mises à jour dans vos templates. Le projet intégère un middleware nommé "routeName()" (à importer) qui va vous permettre d'utiliser cette fonctionnalité manquante. Vous pourrez en trouver des exemples dans le fichier `server/front-end-router.js`. Néanmoins, voici un exemple d'utilisation :

```js
import routeName from "#server/utils/name-route.middleware.js";

router.get('/:user/articles/:id', routeName("my_route"), (req, res, next) => {
   /* [...] */
});
```
Dans le code ci-dessus, nous avons nommé notre route "my_route" grâce au middleware `routeName()`. Côté nunjucks, vous avez également une fonction `routeName()` dont la signature est un peu différente comparé au middleware. La fonction prend les paramètres suivants :
- Nom de la route (string)
- Paramètres de la route (objet)

Si on souhaite faire un lien vers notre route dans nunjucks, ceci donne le code suivant :
```html
<a href="{{ routeName('my_route', {id: 42, user: 'toto'}) }}">My link</a>
```
La fonction nunjucks transformera le code entre les accolades en "/toto/articles/42". A noter que si vous ajoutez des paramètres supplémentaires qui n'existent pas dans la route, ils seront ajoutés en tant que chaîne de requête.

> Note : Le middleware `routeName` a été ajouté pour vous aider, **son utilisation est facultative.**

> Note 2 : Toutes vos routes ainsi que leur nom sont accessibles dans la route `/debug/router`. Route accessible également via l'admin dans la partie "Debug".

## Gestion des retours à la ligne (nunjucks)
Si vos textes contenus dans la base de données contiennent des retours à la ligne, ils ne seront pas pris en compte lorsque vous les chargerez. Pour les afficher, il faudra utiliser la [fonction `nl2br`](https://mozilla.github.io/nunjucks/templating.html#nl2br) de nunjucks. Vous pouvez trouver un exemple dans le code dans le fichier `src/pages/front-end/about.njk`.

## Ouvrir avec Code / Afficher le code
Sur certaines pages comme la page de debug eslint (url debug/eslint), il est donné la possibilité d'ouvrir le code directement à l'endroit où se trouve le problème. Toutefois il est possible que cette fonctionnalité dysfonctionne. Pour ce faire :
- **MacOS uniquement** : Soyez sûr(e) que VS Code est dans le dossier "Applications"
- Ouvrez la Commande Palette `ctrl/cmd + shift + p`
- Recherchez "shell command"
- Sélectionnez "Uninstall 'code'" puis "Install 'code'"
![alt text](./captures/shell-command.png)

## En vrac
- Si votre formulaire doit permettre l'upload d'image, il doit respecter les conditions suivantes. Sinon, vous ne recupèrerez **jamais** les données du formulaire contenues dans l'objet "req.body". :
  - A la valeur "POST" pour la propriété "method"
  - A l'attribut "enctype" avec la valeur "multipart/form-data"
  - La route doit impérativement avoir le middleware "multer" (représenté dans certaines routes par `upload.single("image")`)
  - L'input type image doit avoir comme valeur d'attribut "name" "image"
    - Il y a un component `components/back-end/input-file.njk` qui est là pour gérer ceci
- Lorsque vous utilisez la méthode `console.log()` dans un fichier du dossier "server/", le résultat ne s'affichera pas dans la console du navigateur mais dans la console de votre terminal
- Pensez à utiliser au maximum les avantages des templates nunjucks. N'allez pas faire une duplication de code s'il y a possibilité de le découper en morceaux réutilisables.
- Tous les templates nunjucks importent des variables globales, vous pouvez trouver la liste complète dans le fichier `server/index.js` (vers la ligne 101), mais voici une liste non exhaustive des variables :
  - `current_url` : URL courante (sans les query string params)
  - `NODE_ENV` : Retourne "production" ou "development"
    > Note 1 : Toutes les variables définies dans votre fichier env actif seront injectées dans tous les templates

    > Note 2 : Il existe une fonction nunjucks "context()" (non native) qui contient toutes les variables accessibles sur la page courante sous forme de JSON. Il faudra utiliser le filtre [`|dump`](https://mozilla.github.io/nunjucks/templating.html#dump) pour afficher le contenu sur votre page web. Ce qui donnerait dans un template nunjucks : `{{ context()|dump }}`

    > Note 3 : Si vous souhaitez ajouter d'autres variables globales, il est préférable de modifier la variable `context` dans le fichier `server/index.js`