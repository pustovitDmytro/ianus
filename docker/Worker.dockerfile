FROM pustovitdmytro/ianus-base:1.1.1

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]