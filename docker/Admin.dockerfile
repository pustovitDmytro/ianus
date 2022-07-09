FROM pustovitdmytro/ianus-base:0.0.2

WORKDIR /app

ENV PORT=8010
EXPOSE 8010

CMD ["node", "lib/web.js"]