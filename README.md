# tyc4
Tanga Yacht Club blog

After a git sync/merge remember to run `git commit -m "commit message"`


## Todo

- Set up a new Netlify account for TYC and move the site there.
- map showing TYC location for anchoring
- SEO ? Need more traffic.

## Responsive Images

There are several types of images in the TYC website:

- Home Hero. This is the big splash image at the top of the home page.
- TYC Times Hero. These images are a bit like the Home Hero and appear near the top of each TPG Times post.
- Embedded (other). Normal, smaller, images anywhere in any page, post or aside.

### Home Hero
This gets a bit of special attention because it's on the home page. The special attention boils down to a greater number of statically formatted but dynamically sized jpgs served via Netlify LM Transformations. Otherwise there is no difference between this and TYC Times Hero images.

The image is defined in `_includes/layouts/index.njk`.

### TYC Times Hero
This is in `_includes/layouts/times.njk`. 

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
      },
      'sizes': { // this list must match wildcard pattern above
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


## Problems with Netlify Large Media and Transformations

The Tanga Yacht Club website (https://tanga-yacht-club.or.tz) is a simple website built using Eleventy, Netlify CMS and Netlify hosting.

This is my first Jamstack project.

For responsive images the objective is to use Netlify image Transformations. However I am unable to make this work. Here's a summary of where I am at:

- Repo is https://github.com/davegardner/tyc4

- .gitignore EXCLUDES ` _site/` yet repo contains images from that folder. Those images were uploaded with Netlify CMS. Why are they included from `_site/` and not present in `images/uploads/` ?

- Images in `images/uploads/ ` seem correctly labelled as `Stored with Git LFS`.

- Accessing an image such as https://tanga-yacht-club.or.tz/images/uploads/_DAG6862.jpg?nf_resize=fit&w=100&h=100 delivers a **full-sized** image rather than a 100 x 100 image.

Here's some further diagnostics:

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

However, there is no `.lfsconfig` file:
```
dave@nuc3:~/Projects/tyc4$ ls -al .lfsconfig
ls: cannot access '.lfsconfig': No such file or directory
```

The documentation (https://docs.netlify.com/large-media/setup/#configure-file-tracking) indicates I should have a `.lfsconfig` file and should commit that to the repo. So I found this support item: https://community.netlify.com/t/getting-this-error-while-configuring-netlify-lfs-provisioning-netlify-large-media-x-provisioning-netlify-large-media-error-error-large-media-addon-doesnt-support-the-repo-linked-to-multiple-sites/18695/8 and followed the steps to relink the repository. That resulted in a `.lfsconfig` being created !! But had no effect on the image transformations.


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


That's as far as I have been able to diagnose. 

Any help would be gratefully received as I've already spent more than a day trying to nut this out.

------

I got this prompt and accurate reply from Netlify:

[luke] 	luke Support Engineer
July 17

Hi, @davegardner, I’m seeing that Large Media was first configured for this site on Fri, 17 Jul 2020-07-17 05:40:48 UTC (which is just under two hours ago).

So, if you’ve been working on this for over a day, the initial issue was different and it was that the Large Media add-on was no installed for this site.

First, I would ask that you test a new deploy. The current deploy was published on Fri, 17 Jul 2020 05:35:26 UTC +00:00. This is five minutes before the Large Media add-on was installed so it is impossible for that deploy to have used Large Media.

Second, before you deploy, would also double check that all Git LFS tracked files are already uploaded to our Git LFS service (Large Media)? This can be done using the command below:

git lfs push --all origin

Running this if we already have the assets won’t hurt anything. It will just do nothing. If we don’t have the assets, this will make certain that we do.

Once that is done, make a change to the site repo, commit it, and git push to trigger a new build at Netlify.

If this doesn’t help to get the Large Media assets working, please let us know.

Visit Topic or reply to this email to respond.

To unsubscribe from these emails, click here.

---

- Docs on maintenance for Arthur, seb, ed and me.

- Fork https://github.com/nhoizey/eleventy-plugin-images-responsiver
  NO. Do it from Markdown-it:
  https://github.com/tatsy/markdown-it-responsive

- Call the fork markdown-it-responsive-netlify

---
# Image Handling

Image handling is quite complex. It is based on git LFS (Large File System). Git LFS susbtitutes small text 'smudge' files for images and uploads images separately, directly to the backing store. This takes advantage of the fact jpg and most other image formats are already compressed. It also saves your repo from getting filled with images.

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

## LFS Not Working

Getting the following error when attempting to deploy on Netlify:

```bash
11:32:21 AM: Error checking out branch: Downloading _site/images/uploads/_dag6857-2.jpg (2.2 MB)
Error downloading object: _site/images/uploads/_dag6857-2.jpg (c4071bf): Smudge error: Error downloading _site/images/uploads/_dag6857-2.jpg (c4071bf66e62f2a34655bc7279daa4c1fd7b2785390bc1866bc4568334901359): batch request: missing protocol: ""
```

Finally resolved by reinstalling/configuring netlify cli:

Run `netlify status` for account details.

To see all available commands run `netlify help`


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

It then builds.