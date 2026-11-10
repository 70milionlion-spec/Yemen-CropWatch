# Yemen-CropWatch

**Repository visibility target: PUBLIC.** The source code and GitHub Pages website in this repository are publicly accessible.

Arabic static research site for the Yemen-CropWatch Dhamar Sentinel-2 pilot.

## Scope

This repository publishes a static project overview through GitHub Pages. GitHub Pages does not execute Python, FastAPI, or PyTorch server-side code. No live model inference is provided by this website.

## Scientific caveats

- Labels are provisional proxy labels, not field-verified ground truth.
- EXP014-C2 metrics are development OOF metrics from the `balanced` setting and threshold 0.50.
- EXP014-C4A selected `unweighted` and threshold 0.50 using inner spatial validation; it does not change the recorded C2 metrics.
- Outer validation has been accessed during development and is not an untouched independent test.
- Do not interpret the reported metrics as proof of field performance or nationwide generalization.

## Privacy and artifact policy

Do not commit raw satellite rasters, private labels, embedding caches, credentials, access tokens, or model artifacts without a separate review. This release intentionally contains only the static website, deployment workflow, and handoff documentation.

## Deployment

GitHub Actions deploys the `site/` directory to GitHub Pages when changes are pushed to `main` or the workflow is run manually. Configure repository Settings → Pages → Build and deployment → Source: GitHub Actions if GitHub has not enabled Pages for the repository yet.


## Visibility

This repository is intended to be **public**. Do not add private imagery, raw labels, embedding caches, model checkpoints, OAuth files, API keys, or personal information. Review every future commit before pushing.
