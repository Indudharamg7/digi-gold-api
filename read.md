1.Install serverless npm
-> sudo npm install -g serverless 

2.check the serverless is installed
-> serverless --version

3.create a folder to setup serverless api

4.npm init -y

5.create these 2 files

handler.js ->  contains the api details
serverless.yml -> container the serverless setup , configurations

6.command to run in local

-> serverless offline

7.to deploy in aws in gateway , lamda , cloudwatch

-> serverless deploy

8.mongo db connections is in source/db/mongo.js and in .env connection url is defined.