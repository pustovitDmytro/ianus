FROM pustovitdmytro/ianus-base:1.6.2

WORKDIR /app

ENV PORT=8010
EXPOSE 8010

CMD ["node", "lib/web.js"]