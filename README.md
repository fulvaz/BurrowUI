# BurrowUI
This is a NodeJS/Angular 2 frontend UI for Kafka cluster monitoring with [Burrow](https://github.com/linkedin/Burrow "Burrow's GitHub").
Again, this project is used as a support tool to build on top of the hard work already completed by the team at linkedin.

![homepage](https://github.com/GeneralMills/BurrowUI/blob/master/screenshots/burrowHome.PNG)

---

![graph](https://github.com/GeneralMills/BurrowUI/blob/master/screenshots/graph.PNG)

---

![partitions](https://github.com/GeneralMills/BurrowUI/blob/master/screenshots/partition.PNG)

## Dependencies
* [NodeJS](https://nodejs.org "Node's Homepage")
* [Angular-CLI](https://cli.angular.io "Angular CLI's Homepage")
* [Docker (Optional)](https://www.docker.com "Docker's Homepage")

## Use With Docker
1. Get latest docker image

   `docker pull generalmills/burrowui`
2. Run with Parameters
   
   `sudo docker run -p 80:3000 -e BURROW_HOME="http://{burrow_host}/v2/kafka" -d generalmills/burrowui`
   
   *BurrowUI should now be live on your server at port 80*
   
## Build from Source
1. CD to Project Root
2. Install Dependencies

   `npm install`
2. Compile Project

   `npm run build`
3. Edit Config

   Edit the file /server/config/server_config.json with your Burrow Host Home
4. Start App

   `node server.js`
   
   *BurrowUI should now be live on your server at port 3000*

## Development

```
npm install
npm run devFrontend
npm run devBackend
```
