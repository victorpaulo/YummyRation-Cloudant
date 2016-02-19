
OVERVIEW


**This version I added the IBM Cloudant No-SQL database functionality**

**You must have to provision an instance of IBM Cloudant on BlueMix and inform the credentials on file _cloudant.json_**

**Please see the documentation:** https://www.ng.bluemix.net/docs/#services/Cloudant/index.html#Cloudant

**Credits**

> Original code owner: *jlmarech*

> Link: https://hub.jazz.net/project/jlmarech/YummyRation/overview

##Online Catering Services (http://yummyration.mybluemix.net/).  

The web app is an online catalog. It displays menu items (fresh cooked dishes), with pictures, description, price, and customer rating
The app also expose YummyRation data through public APIs (REST API).


TECHNOLOGIES

The following technologies are used in this application:
- Node.js (runtime)
- Express (web app framework)
- Jade (Templates)
- Bootstrap (UI for web and mobile devices)
- RESTful services 
- **Cloudant** (added by @victorpaulo)

Licensed under the MIT license: http://opensource.org/licenses/MIT

##How to run this sample

- Clone the repository

`git clone https://github.com/victorpaulo/YummyRation-Cloudant.git`

- Install the dependencies

`cd YummyRation-Cloudant && npm install`

- Run the node application

`node app.js`
