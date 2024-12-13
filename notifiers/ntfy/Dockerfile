FROM denoland/deno:2.0.4

# The port that your application listens to.
EXPOSE 7000

WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY common/ common/
COPY notifiers/common/ notifiers/common/
COPY notifiers/ntfy/ notifiers/ntfy/

RUN deno install --entrypoint notifiers/ntfy/main.ts
RUN deno cache notifiers/ntfy/main.ts

CMD ["run", "--allow-net", "--allow-env", "notifiers/ntfy/main.ts"]