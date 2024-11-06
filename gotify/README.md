A [Komodo](https://komo.do/) [Alerter](https://komo.do/docs/resources#alerter) for [Gotify](https://gotify.net/)

# Usage

Create a new container or stack with:

* Gotify URL as env `GOTIFY_URL`
* Gotify App Token as env `GOTIFY_APP_TOKEN`

```yaml

services:
  komodo-gotify:
    image: foxxmd/komodo-gotify-alerter:latest
    environment:
      - GOTIFY_URL=${GOTIFY_URL}
      - GOTIFY_APP_TOKEN=${GOTIFY_APP_TOKEN}
    ports:
      - "7000:7000"
```

Then, create a new Alerter of type `Custom` and point it to the IP of the started service:

```
[[alerter]]
name = "gotify"
[alerter.config]
enabled = true
endpoint.type = "Custom"
endpoint.params.url = "http://192.168.YOUR.IP:7000"
```