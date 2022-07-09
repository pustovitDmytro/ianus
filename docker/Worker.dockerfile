FROM pustovitdmytro/ianus-base:0.0.2

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]