# ianus
Boilerplate for creating npm packages.

[![Version][badge-vers]][npm]
[![Bundle size][npm-size-badge]][npm-size-url]
[![Downloads][npm-downloads-badge]][npm]

[![CodeFactor][codefactor-badge]][codefactor-url]
[![SonarCloud][sonarcloud-badge]][sonarcloud-url]
[![Codacy][codacy-badge]][codacy-url]
[![Total alerts][lgtm-alerts-badge]][lgtm-alerts-url]
[![Language grade][lgtm-lg-badge]][lgtm-lg-url]
[![Scrutinizer][scrutinizer-badge]][scrutinizer-url]

[![Dependencies][badge-deps]][npm]
[![Security][snyk-badge]][snyk-url]
[![Build Status][tests-badge]][tests-url]
[![Coverage Status][badge-coverage]][url-coverage]

[![Commit activity][commit-activity-badge]][github]
[![FOSSA][fossa-badge]][fossa-url]
[![License][badge-lic]][github]

## Table of Contents
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contribute](#contribute)

## Requirements
[![Platform Status][node-ver-test-badge]][node-ver-test-url]

To use library you need to have [node](https://nodejs.org) and [npm](https://www.npmjs.com) installed in your machine:

* node `>=10`
* npm `>=6`

Package is [continuously tested][node-ver-test-url] on darwin, linux and win32 platforms. All active and maintenance [LTS](https://nodejs.org/en/about/releases/) node releases are supported.

## Installation

Use next docker images:

```bash
  docker pull pustovitdmytro/ianus-worker
  docker pull pustovitdmytro/ianus-admin
```

## Usage

Run admin panel
```bash
  docker run -p 3000:8010 --env-file .env pustovitdmytro/ianus-admin:latest
```

Open localhost:3000

Run worker
```bash
  docker run --env-file .env pustovitdmytro/ianus-worker:latest
```

Jobs can be managed via bull dashboard:
![Dashboard](.docs/../docs/screenshots/bull_dashboard.png)

to access dashboard, visits
```
  /admin/bull
```

to retrieve project information, check
```
  /admin/info
```

healthcheck:
```
  /health
```

### Administration credentials

*User*: `admin`

*Password*: configured via `BASIC_ADMIN_PASSWORD` variable, 'password' by default.


**Note!** It is recomended to change default `BASIC_ADMIN_PASSWORD`.


## Contribute

Make the changes to the code and tests. Then commit to your branch. Be sure to follow the commit message conventions. Read [Contributing Guidelines](.github/CONTRIBUTING.md) for details.

[npm]: https://www.npmjs.com/package/ianus
[github]: https://github.com/pustovitDmytro/ianus
[coveralls]: https://coveralls.io/github/pustovitDmytro/ianus?branch=master
[badge-deps]: https://img.shields.io/librariesio/release/npm/ianus.svg
[badge-vers]: https://img.shields.io/npm/v/ianus.svg
[badge-lic]: https://img.shields.io/github/license/pustovitDmytro/ianus.svg
[badge-coverage]: https://coveralls.io/repos/github/pustovitDmytro/ianus/badge.svg?branch=master
[url-coverage]: https://coveralls.io/github/pustovitDmytro/ianus?branch=master

[snyk-badge]: https://snyk-widget.herokuapp.com/badge/npm/ianus/badge.svg
[snyk-url]: https://snyk.io/advisor/npm-package/ianus

[tests-badge]: https://img.shields.io/circleci/build/github/pustovitDmytro/ianus
[tests-url]: https://app.circleci.com/pipelines/github/pustovitDmytro/ianus

[codefactor-badge]: https://www.codefactor.io/repository/github/pustovitdmytro/ianus/badge
[codefactor-url]: https://www.codefactor.io/repository/github/pustovitdmytro/ianus

[commit-activity-badge]: https://img.shields.io/github/commit-activity/m/pustovitDmytro/ianus

[scrutinizer-badge]: https://scrutinizer-ci.com/g/pustovitDmytro/ianus/badges/quality-score.png?b=master
[scrutinizer-url]: https://scrutinizer-ci.com/g/pustovitDmytro/ianus/?branch=master

[lgtm-lg-badge]: https://img.shields.io/lgtm/grade/javascript/g/pustovitDmytro/ianus.svg?logo=lgtm&logoWidth=18
[lgtm-lg-url]: https://lgtm.com/projects/g/pustovitDmytro/ianus/context:javascript

[lgtm-alerts-badge]: https://img.shields.io/lgtm/alerts/g/pustovitDmytro/ianus.svg?logo=lgtm&logoWidth=18
[lgtm-alerts-url]: https://lgtm.com/projects/g/pustovitDmytro/ianus/alerts/

[codacy-badge]: https://app.codacy.com/project/badge/Grade/8667aa23afaa4725854f098c4b5e8890
[codacy-url]: https://www.codacy.com/gh/pustovitDmytro/ianus/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pustovitDmytro/ianus&amp;utm_campaign=Badge_Grade

[sonarcloud-badge]: https://sonarcloud.io/api/project_badges/measure?project=pustovitDmytro_ianus&metric=alert_status
[sonarcloud-url]: https://sonarcloud.io/dashboard?id=pustovitDmytro_ianus

[npm-downloads-badge]: https://img.shields.io/npm/dw/ianus
[npm-size-badge]: https://img.shields.io/bundlephobia/min/ianus
[npm-size-url]: https://bundlephobia.com/result?p=ianus

[node-ver-test-badge]: https://github.com/pustovitDmytro/ianus/actions/workflows/npt.yml/badge.svg?branch=master
[node-ver-test-url]: https://github.com/pustovitDmytro/ianus/actions?query=workflow%3A%22Node.js+versions%22

[fossa-badge]: https://app.fossa.com/api/projects/custom%2B24828%2Fianus.svg?type=shield
[fossa-url]: https://app.fossa.com/projects/custom%2B24828%2Fianus?ref=badge_shield