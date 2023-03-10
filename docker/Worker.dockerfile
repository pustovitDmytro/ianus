FROM pustovitdmytro/ianus-base:1.10.1

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]