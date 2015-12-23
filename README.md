# Find'N'Ride

##About
The main idea of this project is to create a platform that integrates mobility in a city with fast querying abilities. O​ur team developed the "Find and Ride" app which enables users to locate nearby restaurants and/or Yelp­listed establishments and provides taxi transportation prices (Uber) to those destinations via a map­based interface.

## App Hosted @ : http://find-and-ride.herokuapp.com/

**Note:** For in-depth details, refer to the technical report **FindNRide-TechnicalReport.pdf**

## Technologies Used:
- Frontend: Bootstrap JS / CSS
- Web Framework: Django
- Database: PostgreSQL (Hosted on Heroku)
- APIs: Google Maps, Yelp, Uber
- App Server: Heroku
- File Server: Amazon S3

## Installation Notes

### Initialize Django/Postgres Environment

##### Python 3.4.0 (heroku needs the Python version specified in the 'runtime.txt' file)

##### install PostgreSQL packages on computer
- sudo apt-get install libpq-dev python-dev postgresql postgresql-contrib

##### create virtualenv, install project dependencies in virtualenv:
##### (use 'which python' to find location of Python; 'webarch' is name of virtualenv in this example.)
- virtualenv -p /usr/bin/python3.4 webarch
- source webarch/bin/activate
- pip install -r requirements.txt

##### requirements.txt
- to save currently-installed Python packages
  - pip freeze > requirements.txt
- to install python packages (note: use within activated virtualenv):
  - pip install -r requirements.txt

##### creation of new project (e.g., 'fatandlazy') or new app (e.g., 'locations')
- django-admin startproject fatandlazy .
- python manage.py startapp locations

##### Preparing/Staging Database Migrations (based on changes to models.py); Migrating Database
- python manage.py makemigrations
- python manage.py migrate

##### Run Local Server (at localhost)
- python manage.py runserver

##### General Postgres connection structure:
- postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
- (see http://www.postgresql.org/docs/9.3/static/libpq-connect.html)

##### Setting Environmental Paths (e.g., Local vs. Production Databases: Setting $DATABASE_URL path) -- useful for removing hardcoded values from 'settings.py' file
- use environment variables on different machines (e.g., local/dev, live/production) to switch between settings without having to hardcode them in settings.py (e.g., local and live instances of database)
  - edit in the ~/.bash_profile (on mac) or ~/.bashrc (on linux)
  - restart bash terminal to enact changes, or, run 'source ~/.bash_profile' to load environmental variables
- to retrieve database settings from heroku: heroku config:get DATABASE_URL
- to create new envpath on heroku: heroku config:add ENV_NAME=VALUE
- to create new envpath on local machine: export ENV_NAME=VALUE
- on local machine, add the DEBUG_SETTING=False and DATABASE_URL envpaths

##### Heroku Toolbelt
- install the heroku toolbelt (at https://toolbelt.heroku.com/)
- establish heroku credentials by logging-into my heroku account using the 'heroku login' command
- github integration: https://devcenter.heroku.com/articles/github-integration
- to push local PostgreSQL database to live instance on Heroku:
  - heroku pg:push [database_path] [app_name]::DATABASE

##Contributors
- Brian Goodness
- Carlo Liquido
- Keshav Potluri
- Richa Prajapati
