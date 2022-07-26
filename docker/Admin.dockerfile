FROM pustovitdmytro/ianus-base:1.3.1

WORKDIR /app

ENV PORT=8010
EXPOSE 8010

CMD ["node", "lib/web.js"]