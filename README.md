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

The documentation (https://docs.netlify.com/large-media/setup/#configure-file-tracking) indicates I should have a `.lfsconfig` file and should commit that to the repo.

That's as far as I have been able to diagnose. It seems something is preventing the generation of the `.lfsconfig` file.

Any help would be gratefully received as I've already spent more than a day trying to nut this out.
