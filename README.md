# Out-Of-Office Solution Test Task

## How to install
You just run this git command
`git clone https://github.com/PanquecaFuriosa/Out-Off-Office_Solution`

Then, in the project directory, go to the client folder an run:
`npm install`

After that, go to the server folder and run again:
`npm install`

With that step, you will be have all the dependencies installed.

Make sure you have MySQL installed and it's server is running. Then create a database.
Set the conection on the file index.js, in the server folder.
```
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:""
});
```

Run QUERIES.sql file in the database and it will create the tables needed.

## How to run
Go to the server folder an run:
`node index.js`

And the, go to the client folder and run:
`npm start`

Open http://localhost:3000 to view it in your browser.

Now enjoy the project, create employees, projects, leave requests. etc. :).
