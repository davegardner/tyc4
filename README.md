# tyc4
Tanga Yacht Club blog

After a git sync/merge remember to run `git commit -m "commit message"`

To log in: `tycTyc!2020`

## Todo

- Set up a new Netlify account for TYC
- CSS
    - images
 content:
    - text
    - images
- map showing TYC location for anchoring
- map showing Tanga town and important places with pins

- Is deep data merging on or off? Tags problem? It was off and should be on. But have decided against using tags for now.

- SEO

## Responsive Images

There are several types of images in the TYC website:

- Home Hero. This is the big splash image at the top of the home page.
- TYC Times Hero. These images are a bit like the Home Hero and appear near the top of each TPG Times post.
- Embedded (other). Normal, smaller, images anywhere in any page, post or aside.

### Home Hero
This gets a bit of special attention because it's on the home page. The special attention boils down to a greater number of statically formatted sized jpg files. Otherwise there is no difference between this and TYC Times Hero images.

### TYC Times Hero


### Embedded
One size fits all. These images are smaller, of lower quality and don't justify the work of 


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
