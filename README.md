# How to install

## 1 - Get the repo
```
git clone https://github.com/mchaaar/sdv-backend.git
```
*or with ssh*
```
git clone git@github.com:mchaaar/sdv-backend.git
```

## 2 - Add the .env

Create a .env file at the root of the project and add the following keys:
```
MONGO_URL_LEFT='mongodb+srv://'
MONGO_URL_RIGHT='@cluster0.xruot.mongodb.net/'
MONGO_USERNAME=''
MONGO_PASSWORD=''
```

## 3 - Fill the values

Fill the missing MONGO_USERNAME & MONGO_PASSWORD values with your own MongoDB ones.

## 4 - Install and run

Execute
```
npm install
```

Then to start the api, you simply need to do
```
npm run dev
```
