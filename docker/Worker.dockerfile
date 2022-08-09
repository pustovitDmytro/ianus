FROM pustovitdmytro/ianus-base:1.6.2

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]