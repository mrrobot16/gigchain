# Gigchain Core Development Guidelines

Guidelines for the core development contributors on the Gigchain monorepo written to have a better understanding of Gigchain progress and coordination. Recommended read for new developers as part of onboarding.

### Issues management

All planned features, bugs, and enhancements are represented as a Github issue with appropriate description, examples, and issue labels.  

Once created, issues can be brought into the [repository's "project"](https://github.com/mrrobot16/gigchain/projects/1), an automated kanban board consisting of columns that mark the issue status and can be *Unassigned*, *Assigned*, *In progress* and *Done*. *Backlog* column is used for keeping the available issues that are up for grabs and also when creating new tasks such as features, bug fixes or ideas.  

![Github project board](https://i.imgur.com/aLWa5HQ.png)

Milestones in the Github projects are oriented to specific goals such as releases (bigger or smaller) as the progress can be measured for an estimate of time left until release.

### Branch Naming
For Feature: 
- ```git checkout -b feature-issue_number/some_description_of_feature```

For Bug: 
- ```git checkout -b bug-issue_number/some_description_of_bug```

For Refactor: 
- ```git checkout -b refactor-issue_number/some_description_of_refactor```

For Documentation: 
- ```git checkout -b documentation-issue_number/some_description_of_documentation```

For Improvements: 
- ```git checkout -b improvement-issue_number/some_description_of_documentation```

### Commit Message

For Feature:
- ```git commit -m "feature: user can select an NFT"```

For Bug:
- ```git commit -m "bug: user login bug"```

For Refactor:
- ```git commit -m "refactor: created Header component in UserScreen"```

For Documentation:
- ```git commit -m "documentation: Minor changed developer guidelines doc"```

For Improvements:
- ```git commit -m "improvement: added ESlint for React"```

### Pull Request Naming and Description

- Description Title

- Description Text about Pull Request

- Issue number for PR

- Link to another PR

In example

```
Title: Feature Circulating supply support

Description: Circulating Supply contract is now supported
dist folder is now being pushed to npm

Closes: Issue URL: https://github.com/mrrobot16/gigchain/issues/1

Link: PR URL: https://github.com/mrrobot16/gigchain/pull/1
```

### Example Issue and Pull Request

Issue: https://github.com/mrrobot16/gigchain/issues/1

Pull request: https://github.com/mrrobot16/gigchain/pull/1

## Best Practices
Inside each package there is a best practices document, that must be followed in order to merge Pull Requests.

- [UI](./docs/ui/BEST_PRACTICES.md)

- [Contracts](./docs/contracts/BEST_PRACTICES.md)

## Linters

Linting our code is important for readability and maintainable purposes.

Currently we are using: 
- [ESLint](https://eslint.org/)
- [Solhint](https://protofire.github.io/solhint/)

Before pushing to Github be sure that ESLint launches with no errors.

**Linting Scripts** 

For both contracts and UI run: ```yarn lint```

For contracts: ```yarn lint:contracts:ts && yarn lint:contracts```

For UI: ```yarn lint:ui```

[Learn more about ESLint](https://eslint.org/)

[Learn more about Solhint](https://protofire.github.io/solhint/)