FROM pustovitdmytro/ianus-base:1.9.0

WORKDIR /app

ENV PORT=8010
EXPOSE 8010

CMD ["node", "lib/web.js"]