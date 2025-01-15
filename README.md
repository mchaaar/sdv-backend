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
MONGO_URL_RIGHT=''
MONGO_USERNAME=''
MONGO_PASSWORD=''
```

## 3 - Fill the values

Fill the missing MONGO_USERNAME MONGO_PASSWORD and MONGO_URL_RIGHT values with your own MongoDB ones.

You can find your own MONGO_URL_RIGHT value in the cluster section -> connect

![cluster connection infos](https://github.com/mchaaar/sdv-backend/blob/master/cluster.png)

## 4 - Install and run

Execute
```
npm install
```

Then to start the api, you simply need to do
```
npm run dev
```

### If you have an error regarding tsx install/at the start after typing npm run dev :
```
npm install -g tsx
```
then restart with
```
npm run dev
```
