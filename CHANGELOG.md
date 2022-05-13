# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2022-05-13

- data update (lawsuit_data.csv updated on s3)
- feat: increase Top Collectors visual from 5 to 10
- feat: implement CSV download (one file generated per county and state) - hidden for now

## [1.2.2] - 2022-02-15

- fix: update language on table section on state pages so the sub-geography is properly labeled (e.g. counties instead of census tracts)

## [1.2.1] - 2021-12-22

- fix: adjust wording in table footers to provide more context

## [1.2.0] - 2021-11-16

- feat: add "jump to map" feature to tables

## [1.1.0] - 2021-09-02

- pull lawsuit_data.csv and demographics_data.csv (containing new data) from s3 instead of storing locally
- only use completed lawsuits in calculating the default judgment %

## [1.0.0] - 2021-05-26

- initial release
