- Trabalhando com o padrão Strategy para Multi DataSources

## Instalando docker para usar o MongoDB e Postgres

```shell
docker run \
    --name postgres \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=root \
    -e POSTGRES_DB=edescarte \
    -p 5432:5432 \
    -d \
    postgres

docker run \
    --name adminer \
    -p 8080:8080 \
    --link postgres:postgres \
    -d \
    adminer

## ---- MONGODB
docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
    -d \
    mongo:4

docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient

docker exec -it mongodb \
    mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'erickwendel', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db: 'herois'}]})"

## -- Listar imagens no Docker
docker ps
```

## Instalando o Mocha

```shell
    npm install -g mocha

    npm i --save-dev mocha
```

## Instalando Sequelize

```shell
    npm install --save sequelize pg-hstore pg
```

## Deletando Node_Modules e instalando novamente

```shell
    rm -rf node_modules
    npm i
```

## Executar Testes

```shell
    npm t
```

## Instalando Hapi

```shell
    npm i hapi
```
