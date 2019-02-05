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

## 0.1.1 - 2019-02-04
### Added
* ssh for loopback based off their template repo: [link](https://github.com/strongloop/loopback-example-ssl)
* update documentation on some of the ssh setup

### Breaking
* add new `.env` variable `HTTP` which needs set to true if not utilizing https and don't want to get annoying popups about invalid certs

## 0.1.0 - 2019-02-04
### Added
* `changelog.md`
* `.env` file to secure our MySQL connection information
* documentation around `.env` and `README.MD` file
