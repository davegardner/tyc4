# tyc4

Tanga Yacht Club website and blog.

This is a Jamstack website. It is a static website built using [eleventy](https://www.11ty.dev/) and hosted on [netlify](https://www.netlify.com/). It also uses a content management system (CMS) called [netlify CMS](https://www.netlifycms.org/). The CMS is what's displayed when you access the admin page at https://tanga-yacht-club.or.tz/admin/.

## Todo

- Set up a new Netlify account for TYC and move the site there.
- map showing TYC location for anchoring
- SEO ? Need more traffic.



## Technology Stack

**Eleventy.** I selected Eleventy as the static site generator because of its simplicity. 

**Nunjucks** is possibly the most powerful of the emerging template languages and is well supported by Mozilla. It is simple to use and well documented.

**MarkdownIT** is the default Markdown editor for Eleventy. It supports the Markdown 'standard' as well as an array of options and plugins.

**markdown-it-responsive.** To support Netlify Large Media Transforms I made a plugin for MarkdownIT. Forked a repo called markdown-it-responsive into https://github.com/davegardner/markdown-it-responsive.git. 

**Netlify** website hosting without servers or devops. Deploys directly from the website's git repository. The configuration page is at https://app.netlify.com/sites/tyc-tz/overview. 

**Netlify CMS** integrates with Netlify, Eleventy and Git to provide content management.

**Git** hosts the repository for the website source at https://github.com/davegardner/tyc4.git.

## Domain Name

The Netlify internal url is https://tyc-tz.netlify.app/ Do not use this URL. Always use the Primary domain name:

A Primary external domain name has been registered by Sebasian: https://www.tanga-yacht-club.or.tz and https://tanga-yacht-club.or.tz. These are the public URLs that should be used to advertise and access the site.

The DNS servers are Netlify servers, which allows Netlify to optimize content delivery on-the-fly. Note that there is no fixed IP address associated with the domain's A record: everything is dynamic.

## General Design

The website is a simple conventional website with three separate blogs:

- TYC Times for general news
- Places for write-ups about places of interest
- About for historical and other club information

In addition there is a menu structure delivering access to a small number of fixed 'pages'.

## Markdown

MarkdownIt supports the Common Markdown standard.

- Quick cheat sheet: https://commonmark.org/help/
- Details of Common Markdown: https://commonmark.org/

The following MarkdownIt options are enabled in eleventy.js:

```js
  html: true,     // Html tags can be entered directly into the markdown
  breaks: false,  // Ignore newlines within a para
  linkify: true   // Raw links are allowed and will display as entered
```

## Git

The source of truth is a Git repository at https://github.com/davegardner/tyc4.git.

Changes made to this repo automatically trigger Netlify to fetch the changes and rebuild the site. This is not instantaneous and may take up to a couple of minutes.

Netlify CMS updates this repo as required (thus triggering Netlify to rebuild the website).

## Admin

https://tanga-yacht-club.or.tz/admin

uses Netlify CMS

Netlify CMS is actually independent of Netlify.

Netlify CMS handles adding and editing site content, and storing it in the Git repository.

## Responsive Images

You should aim to upload large high quality jpeg photos. The images are automatically resized and cached for clients when they visit the website. There may be a slight delay the first time an image is requested but after that it is very fast.

The following image formats are handled:
- *.jpg
- *.jpeg
- *.png

The best way to add images is to add them using Netlify CMS at https://tanga-yacht-club.or.tz/admin.

There are several types of images in the TYC website:

- Home Hero. This is the big splash image at the top of the home page.
- Post Hero. These images are a bit like the Home Hero and appear near the top of each TPG Times post, Places post and About post.
- Embedded (other). Normal, smaller, images anywhere in any page, post or aside.

### Home Hero
This gets a bit of special attention because it's on the home page. The special attention boils down to a greater number of statically formatted but dynamically sized jpgs served via Netlify LM Transformations. Otherwise there is no difference between this and TYC Times Hero images.

The image is defined in `_includes/layouts/index.njk`.

### Post Hero (also called Featured Images)

Post hero images are specified as part of a Post. TYC Times, About and Places all provide for hero optional images. The image generation is handled by the following templates:

- `_includes/layouts/times.njk`
- `_includes/layouts/about.njk`
- `_includes/layouts/places.njk`

Post Hero images are optional.

### Embedded Images

I made a plugin for MarkdownIT. Forked a repo called markdown-it-responsive into https://github.com/davegardner/markdown-it-responsive.git. 

You must provide some options for it in `.eleventy.js` like this:

```js
  const responsiveOptions = {
    responsive: {
      'srcset': {
        '*': [        // <= files matching this wildcard pattern
          {                     // rule 0
            width: 450,         // request a file this width
            nf_resize: 'fit',   // from netlify transformations: https://docs.netlify.com/large-media/transform-images/
          },
          {                     // rule 1
            width: 800,         // and this width
            nf_resize: 'fit'    // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
          },
          {                     // rule 2, etc
            width: 1200,
            nf_resize: 'fit'
          },
          // more rules can go here
        ]
        // more wildcard patterns can go here
      },
      'sizes': { // this list must have an entry for each wildcard pattern above. ie: 1:1
        '*': '(min-width: 1800px) 1200px, (min-width: 1200px) 800px, (min-width: 560px) 450px, 80vw',
      }
    }
  };
```
NOTE: the above options define just a single transform that will match all image files (` '*' `). You can define any number of rules for each wildcard.

Given some standard markdown such as:

```md
![Hakuna Matata](/images/uploads/A8010101.jpg "Arthur and Mebs set off")
```

And the options above, it spits out srcsets with Netlify LM Transform image sizing querystrings, like this:

```html
<img src="/images/uploads/A8010101.jpg" 
srcset="/images/uploads/A8010101.jpg?nf_resize=fit&amp;w=450 450w, 
        /images/uploads/A8010101.jpg?nf_resize=fit&amp;w=800 800w, 
        /images/uploads/A8010101.jpg?nf_resize=fit&amp;w=1200 1200w" 
sizes="(min-width: 1800px) 1200px, (min-width: 1200px) 800px, (min-width: 560px) 450px, 80vw" 
alt="Hakuna Matata">
```
---

# Image Handling

Image handling is quite complex. It is based on git LFS (Large File System). Git LFS substitutes small text 'smudge' files for images and uploads images separately, directly to the backing store (`netlify.com`, in this case). This takes advantage of the fact jpg and most other image formats are already compressed. It also saves your repo from getting filled with images.

Netlify provide the backing store and, once git lfs and all the Netlify paraphernalia are installed, images are uploaded/downloaded using standard git push/pull commands. The NetlifyCMS Media Store works OK with Git LFS

## Git LFS

```bash
git lfs install
git lfs track "*.jpg"
git lfs track "*.psd"
git lfs track "*.jpeg"
git add .gitattributes
``` 

## Netlify CLI

- Installed Netlify CLI with `npm install netlify-cli -g`

- Confirmed deployment with `netlify status`

- Linked to my Netlify account via Github with `netlify link`

- Authenticated with `netlify login`

## Netlify Large Media

Installed the netlify Large Media plugin:

```bash
netlify plugins:install netlify-lm-plugin
netlify lm:install
```

The docs say I should be *presented with a custom command to run in order to use Netlify Large Media in your shell.* But I get the following:

```bash
dave@nuc3:~/Projects/Anjea$ netlify lm:install
  ✔ Checking Git version [2.25.1]
  ✔ Checking Git LFS version [2.11.0]
  ✔ Checking Git LFS filters
  ✔ Installing Netlify's Git Credential Helper for Linux
  ✔ Configuring Git to use Netlify's Git Credential Helper
dave@nuc3:~/Projects/Anjea$ 
```

## Netlify Identity Config

Enabled Netlify Git Gateway at https://app.netlify.com/sites/anjeat2/settings/identity#services

Added myself as administrator by sending me an invitation thru Netlify Identity at https://app.netlify.com/sites/anjeat2/settings/identity



```bash
dave@nuc3:~/Projects/Anjea$ netlify init

This site has been initialized

Site Name:  anjeat2
Site Url:   https://test.anjea.info
Site Repo:  https://github.com/davegardner/anjea
Site Id:    051dce2d-be15-4628-9380-5ad7f1ce25be
Admin URL:  https://app.netlify.com/sites/anjeat2

To disconnect this directory and create a new site (or link to another siteId)
1. Run netlify unlink
2. Then run netlify init again
dave@nuc3:~/Projects/Anjea$ netlify link
Site already linked to "anjeat2"
Admin url: https://app.netlify.com/sites/anjeat2

To unlink this site, run: netlify unlink
dave@nuc3:~/Projects/Anjea$ netlify lm:setup
  ⠦ Provisioning Netlify Large Media
  ✔ Provisioning Netlify Large Media
  ✔ Configuring Git LFS for this site
dave@nuc3:~/Projects/Anjea$ git status
On branch master
Your branch is up to date with 'origin/master'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.lfsconfig

nothing added to commit but untracked files present (use "git add" to track)
dave@nuc3:~/Projects/Anjea$ git add .lfsconfig

```
## Problems with Netlify Large Media and Transformations

- Images are in `images/uploads/ `
- The eleventy.js config files is configured to copy images to the same folder under `_site`. 

```js
  eleventyConfig.addPassthroughCopy('images')
```

- config.yml must also reference the above folder, like this:

```yaml
media_folder: "images/uploads"
public_folder: "/images/uploads"
```

To add a new image, copy it to the `/images/uploads` folder (NOT `_site/images/uploads`).

Some diagnostics you can run if images go tits up:

```bash
dave@nuc3:~/Projects/tyc4$ netlify lm:info
  ✔ Checking Git version [2.25.1]
  ✔ Checking Git LFS version [2.11.0]
  ✔ Checking Git LFS filters
  ✔ Checking Netlify's Git Credentials version [0.1.9]
```

```
dave@nuc3:~/Projects/tyc4$ git lfs ls-files
958147914a * images/uploads/IMG20200625084513.jpg
4af7c3968a * images/uploads/TYC-logo-100.png
3463ba27ec * images/uploads/TYC-logo-1600.jpg
30f3268e3d * images/uploads/TYC-logo-200.jpg
4bb9b3ce2a * images/uploads/TYC-logo-200.png
58978af0a1 * images/uploads/TYC-logo-32.png
1891837639 * images/uploads/TYC-logo-400.jpg
3300d1d0f5 * images/uploads/TYC-logo-64.png
1a109550e4 * images/uploads/TYC-logo-800.jpg
6ad04e9a88 * images/uploads/_DAG6862.jpg
2a43319932 * images/uploads/_DAG6879.jpg
5e8c1a3197 * images/uploads/_DAG6963.jpg
a6f837de69 * images/uploads/_DAG6991.jpg
```

```
dave@nuc3:~/Projects/tyc4$ netlify link
Site already linked to "tyc-tz"
Admin url: https://app.netlify.com/sites/tyc-tz

To unlink this site, run: netlify unlink

dave@nuc3:~/Projects/tyc4$ netlify lm:setup
Logging into your Netlify account...
Opening https://app.netlify.com/authorize?response_type=ticket&ticket=356a5a907036529ed845e807801ddf48
---------------------------
Error: Unable to open browser automatically
spawn /home/dave/.local/share/netlify-cli/node_modules/netlify-lm-plugin/node_modules/@netlify/cli-utils/node_modules/cli-ux/lib/xdg-open ENOENT

Please open your browser & open the URL below to login:
https://app.netlify.com/authorize?response_type=ticket&ticket=356a5a907036529ed845e807801ddf48
---------------------------
    TypeError: Cannot read property 'slug' of undefined
dave@nuc3:~/Projects/tyc4$ 
```
The automatic browser load fails but the link works fine and authorization is granted for Netlify CLI.

The documentation (https://docs.netlify.com/large-media/setup/#configure-file-tracking) indicates I should have a `.lfsconfig` file and should commit that to the repo. So I found this support item: https://community.netlify.com/t/getting-this-error-while-configuring-netlify-lfs-provisioning-netlify-large-media-x-provisioning-netlify-large-media-error-error-large-media-addon-doesnt-support-the-repo-linked-to-multiple-sites/18695/8 and followed the steps to relink the repository. That resulted in a `.lfsconfig` being created.


```
dave@nuc3:~/Projects/tyc4$ netlify logout
The "process.env.NETLIFY_AUTH_TOKEN" is still set in your terminal session

To logout completely, unset the environment variable

dave@nuc3:~/Projects/tyc4$ unset NETLIFY_AUTH_TOKEN
dave@nuc3:~/Projects/tyc4$ netlify logout
Already logged out

To login run "netlify login"
dave@nuc3:~/Projects/tyc4$ netlify login
Logging into your Netlify account...
Opening https://app.netlify.com/authorize?response_type=ticket&ticket=9c782bfb4ac6fc938672839413520ed8

You are now logged into your Netlify account!

Run netlify status for account details

To see all available commands run: netlify help


dave@nuc3:~/Projects/tyc4$ netlify plugins:install netlify-lm-plugin
Installing plugin netlify-lm-plugin... installed v1.0.0
dave@nuc3:~/Projects/tyc4$ netlify lm:install
  ✔ Checking Git version [2.25.1]
  ✔ Checking Git LFS version [2.11.0]
  ✔ Checking Git LFS filters
  ✔ Installing Netlify's Git Credential Helper for Linux
  ✔ Configuring Git to use Netlify's Git Credential Helper
dave@nuc3:~/Projects/tyc4$ netlify link
Site already linked to "tyc-tz"
Admin url: https://app.netlify.com/sites/tyc-tz

To unlink this site, run: netlify unlink
dave@nuc3:~/Projects/tyc4$ netlify lm:setup
  ⠏ Provisioning Netlify Large Media
  ✔ Provisioning Netlify Large Media
  ✔ Configuring Git LFS for this site
dave@nuc3:~/Projects/tyc4$ ls -al .lfsconfig
-rw-rw-r-- 1 dave dave 91 Jul 17 08:40 .lfsconfig

dave@nuc3:~/Projects/tyc4$ git add .lfsconfig
```
---
