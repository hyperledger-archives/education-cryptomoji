# Part-Two: Cryptomoji

The task for part two, will be to build a working Hyperledger Sawtooth app,
which will allow the breeding and trading of unique "cryptomoji" on the
blockchain. This app includes a number of components, which can be run using
[Docker](https://www.docker.com/what-docker). After cloning this repo, follow
the instructions specific to your OS to install and run whatever components are
required to use `docker` and `docker-compose` from your command line.

## Components

Each component has its own docker container:

- `validator` - the Sawtooth validator, available at tcp://localhost:4004
- `rest-api` - the Sawtooth REST API, available at http://localhost:8008
- `client` - the front end for your app, served out of `client/public`
to http://localhost:8000
- `processor` - your transaction processor, located in `processor/`
- `shell` - a Sawtooth environment for running shell commands
- `settings-tp` - a built in Sawtooth transaction processor

## Docker Commands

To start all components, navigate to the `part-two` directory and use Docker:
```bash
cd code/part-two/
docker-compose up
```

Once running, these components can be stopped using `ctrl-C`, or stopped _and_
destroyed (they will be rebuilt on your next `up`) with:
```bash
docker-compose down
```

You can also stop, start, or restart individual components using their
container name. For example, with our transaction processor:
```bash
docker stop processor
docker start processor
docker restart processor
```

Finally, if you want to run commands from within a container, you can use the
`exec`. This is particularly useful when you want to use the bash command in
the shell container:
```bash
docker exec -it shell bash
```

If you need to exit a container terminal, simply use:
```bash
exit
```
