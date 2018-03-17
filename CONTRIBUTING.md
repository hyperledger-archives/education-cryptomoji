# Contributing

In order to unify the internal development of this curriculum, as well as guide
any external contributions, here are a few guidelines for contributing to this
repo.

## Reporting Bugs or Issues

This project uses GitHub issues to track bugs, enhancements, or other tasks.

To create a new Issue:

1. Click on the
[Issues tab](https://github.com/hyperledger/education-cryptobunnies/issues)
underneath the name of this repo above.
2. Click on the
[New Issue button](https://github.com/hyperledger/education-cryptobunnies/issues/new)
on the right side of the page.
3. Enter a title and description for the issue.
4. Select a label on the right side ([see below](#labels)).
5. Click _"Submit new issue"_.

The title should be a concise label identifying the bug or feature, while the
_"Leave a comment"_ section below the title should contain a description with
as much detail as possible. For bugs or typos be sure to include:

- The specific behavior, and what caused that behavior
- Any console logs or other diagnostic information
- Filenames and line numbers if possible (especially for typos)

### Labels

There are a few common labels we may use, and encourage any contributors to use
when opening an issue:

- **bug** - any bug, typo, or other misbehavior that needs to be fixed
- **enhancement** - the implementation of any new features
- **design** - blueprint for new features, this work may happen outside of this
repo but progress will still be tracked here
- **help wanted** - issues which we would specifically like external help for

## Submitting Pull Requests

1. Create a personal fork of this repository.
2. Create a topic branch specific to the bug/enhancement you are addressing.
3. Submit a pull request.
4. Add other developers as reviewers.
5. Make changes as requested by rebasing the appropriate commits, and then
force-pushing to your branch.

Pull requests can be merged once all requests for change have been addressed,
and when approved by at least one other developer. Project maintainers will
personally merge their own PRs, as well as those of external contributors which
have received the necessary approvals. When merging someone else's PR,
maintainers should use the _"Create a merge commit"_ option, but when merging
their own work it is preferable to use the _"Rebase and merge"_ option.

## Commit Style

Commits should be as small as possible, but no smaller. Ideally, they
should be an "atomic" change to the repo, which adds a single new piece of
functionality or fixes a single bug, but if broken down any smaller would not
provide anything of value. Great commits can be cherry-picked out of their PRs
and still function properly.

For commit message style, follow
[Chris Beams's Seven Rules](https://chris.beams.io/posts/git-commit/#seven-rules):

- Separate subject from body with a blank line
- Limit the subject line to 50 characters
- Capitalize the subject line
- Do not end the subject line with a period
- Use the imperative mood in the subject line
- Wrap the body at 72 characters
- Use the body to explain what and why vs. how

In addition to these rules, the commit body should reference the number for the
issue they address. For bug fixes use the syntax: `Fixes #XX`, and for
enhancements use the syntax: `Closes #XX`.

Finally, each commit message must include a _"Signed-off-by"_ line, including
the developer's name and email. This sign-off indicates that you agree the
commit satisfies the
[Developer Certificate of Origin (DCO)](http://developercertificate.org/).
Git can automatically add this signature by using the `-s` flag:

```bash
git commit -s
```

## JavaScript Style

This project follows the basic
[Hack Reactor Style Guide](https://github.com/hackreactor-labs/eslint-config-hackreactor),
with the addition that lines should be limited to 80 characters in length. An
`.eslintrc.json` file with these rules is included in the root project
directory. Any contributor writing JavaScript code should
[install ESLint](https://eslint.org/docs/user-guide/getting-started)
and run it on their code before submitting a PR. The easiest way to do this is
simply to run:

```bash
npm install -g eslint
```

```bash
eslint ./
```
