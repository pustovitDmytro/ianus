FROM pustovitdmytro/ianus-base:1.7.6

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]