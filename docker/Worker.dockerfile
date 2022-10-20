FROM pustovitdmytro/ianus-base:1.7.7

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]