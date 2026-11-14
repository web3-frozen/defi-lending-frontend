# DeFi Lending Frontend

Rate table for the [DeFi Lending API](https://github.com/web3-frozen/defi-lending-api). Live site: https://lending.dummysui.monster/

The page lists supply and borrow as an equation. Supply is base plus reward. Borrow is interest minus reward, because the reward is paid to the borrower. Sorting uses those totals.

Filters:

- Chain: every chain returned by `/api/chains`, not a fixed list
- Asset: ticker search, for example `USDC`
- Stablecoins: any, only stablecoins, or exclude stablecoins
- Min TVL and row count

Asset and stablecoin filters are sent to the API before the row limit.

## CI and deploy

Pushes to `main` call `web3-frozen/homelab-apps/.github/workflows/ci-container.yaml`. The job label is `homelab-defi-lending-frontend`.

That label is the Argo CD Application `arc-private-defi-lending-frontend`, an Actions Runner Controller scale set in `actions-runner-system`. `Waiting for a runner` followed by `Job is about to start running on the runner: homelab-defi-lending-frontend` means that scale set picked up the job. It is not a GitHub-hosted runner. The set starts from zero pods, so the wait is normal.

Do not add `ubuntu-latest` jobs. The GitHub-hosted minute quota is exhausted.

Image builds use the pod-local BuildKit sidecar at `tcp://127.0.0.1:1234`. Do not put `# syntax=docker/dockerfile:1` back in the Dockerfile.

After the image scan passes, CI updates `workloads/defi-lending` in `web3-frozen/homelab-apps`. Argo CD then rolls the frontend.
