# Blueflag stats collector

This is a simple tool to collect metrics from the DCS Blueflag servers and store in an InfluxDB for timeseries graphing.

## Live

[Caucasus 80s dashboard](https://bf.sigkill.me/d/m5PU-jpMk/blueflag-caucasus-80s?orgId=2&refresh=5s&from=now-24h&to=now)

## Usage

Example docker-compose.yml:
```version: '2'
services:
  bf-influxdb:
    image: influxdb
    restart: always
    logging:
      options:
        max-file: "3"
        max-size: "50m"
    volumes:
      - ./influxdb:/var/lib/influxdb
    networks:
      - internal
  grafana:
    image: grafana/grafana
    restart: always
    depends_on:
      - bf-influxdb
    volumes:
      - ./grafana:/var/lib/grafana
    networks:
      - web
      - internal
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_NAME=public
    labels:
      - traefik.docker.network=web_external
      - traefik.frontend.rule=Host:bf.sigkill.me
      - traefik.port=3000
      - traefik.enable=true
    logging:
      options:
        max-file: "3"
        max-size: "50m"
  collector:
    build: ./collector
    depends_on:
      - bf-influxdb
    restart: always
    logging:
      options:
        max-file: "3"
        max-size: "50m"
    networks:
      - internal
      - web

networks:
  internal:
    driver: bridge
    internal: true
  web:
    external:
      name: web_external
```
