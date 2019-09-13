# api changelog 📑

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and
the [Keep a CHANGELOG](http://keepachangelog.com/) writing style.

Format:

```
## 0.1.0 - 2018-10-26
### Added | Breaking | Changed | Fixed | Removed
...
```

## 1.0.0 - 2019-09-30

### Breaking

- .env params have changed and we are now supporting GCP Cloud SQL
  ~ DB => DB_NAME
  - INSTANCE_CONNECTION_NAME (only used in production and is to be set by Google Cloud Run)
- server now runs on port 8080 in localhost environments instead of 3333. This doesn't change production

## 0.1.1 - 2019-02-04

### Added

- ssh for loopback based off their template repo: [link](https://github.com/strongloop/loopback-example-ssl)
- update documentation on some of the ssh setup

### Breaking

- add new `.env` variable `HTTP` which needs set to true if not utilizing https and don't want to get annoying popups about invalid certs

## 0.1.0 - 2019-02-04

### Added

- `changelog.md`
- `.env` file to secure our MySQL connection information
- documentation around `.env` and `README.MD` file
