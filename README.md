# Initials.sg

### Structure
1) **client** folder for frontend
2) **server** folder for backend

### Installion for first run
1) Run `npm i` at each folder
2) Make sure Postgres is installed and running, run `psql postgres` (by default), inside psql console run `CREATE USER initialadmin WITH CREATEDB LOGIN PASSWORD 'Pass1234';`
3) Once done, go to server folder and run `sequelize db:create`

### Getting it up and ready
1) Run `npm start` at each folder

#### Note for installing Postgres using Brew
1. `brew install postgres` for installing postgres with brew
2. `brew services start postgresql` for autostart, `pg_ctl -D /usr/local/var/postgres start` for manual start.

### More to be added...
