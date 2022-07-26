FROM pustovitdmytro/ianus-base:1.3.2

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]