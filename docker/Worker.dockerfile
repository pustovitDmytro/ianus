FROM pustovitdmytro/ianus-base:1.7.5

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]