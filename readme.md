# Indie Photographers

Indie Photographers is a passion project of mine that I hope could go commercial at a future point in time.

But for now if you'd like to test drive it on your machine you'll have to make a Cloudinary and MongoDB accounts and fill in the .env file at root directory as follows.

First you'd have to clone the app
```console
~$ git clone https://github.com/OsamaAdam98/indie-photographers.git
~$ cd indie-photographers
```

Now create a .env file at the root directory with your own details.

```
ATLAS_URI = Your mongodb atlas URI
jwtSecret = Your JWT secret
CLOUD_NAME = Your Cloudinary cloud name
CLOUDINARY_PRESET = Cloudinary presets
CLOUDINAY_API_KEY = Cloudinary api key
CLOUDINARY_API_SECRET = Cloudinary api secret
```

Then simply run the following commands to install dependencies
```console
~$ yarn run init-all
```
Then just go ahead and run
```console
~$ yarn run dev
```
Et voila!