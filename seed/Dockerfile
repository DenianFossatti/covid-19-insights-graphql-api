ARG DB_IMAGE

FROM ${DB_IMAGE}

ARG DB_NAME
ARG DB_COLLECTION

RUN apt-get update && apt-get install unzip

RUN mkdir -p /srv/tmp/import

WORKDIR /srv/tmp/import

COPY ./seed/out.json.zip /srv/tmp/import
COPY ./seed/cities.json /srv/tmp/import

RUN unzip out.json.zip

CMD mongosh covid-insights-dev --host mongodb --eval 'db.dropDatabase()' && \ 
    mongoimport --host mongodb --db covid-insights-dev --collection covid_2022 --file ./out.json --jsonArray && \
    mongoimport --host mongodb --db covid-insights-dev --collection cities --file ./cities.json --jsonArray
