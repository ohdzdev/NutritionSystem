---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: ''
assignees: ''

---

# Motivation and Context

- Why is change required?
- What does it solve?

`For any sections not utilized, leave header and remove the template helper text and put **N/A**`

## As the PR Creator - Have I?
 - [ ] run tests locally and refreshed snapshots?
 - [ ] Uploaded any changes to Rollbase dev environment?

## New Features

1. One line explaining a high level overview of functionality
    - Explanation of testing completed
    - More testing
2. another feature

## Bug Fixes

1. One line explaining a high level overview of fix
    - **Steps to Reproduce in current code base**
        1. neat step
        2. another step

## Breaking Changes

1. One line to explain what is changing that makes it incompatible with current functionality.
    - Why change this? _optional and should likely be explained in mot. / context_
    - **Changes to fix in dependencies** _(delete if not applicable)_
        - deprecated `import { Font } from 'expo-font'` in favor of individually named exports (`import * as Font from expo-font`) for better dead-export elimination potential. Upgrade `@expo/vector-icons` if you get a warning about this.

## Screenshots (if appropriate):

`![alt](https://link)`

## Checklist of items preventing merge

- [ ] back-end change needed
- [ ] other cool repo needs to update
