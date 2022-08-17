FROM pustovitdmytro/ianus-base:1.7.0

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]