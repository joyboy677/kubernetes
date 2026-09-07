# Kubernetes

## Exercises

| Exercise | Link |
|----------|------|
| 1.1 | [Log output](https://github.com/joyboy677/kubernetes/tree/1.1/log-output) |
| 1.2 | [Todo app](https://github.com/joyboy677/kubernetes/tree/1.2/todo-app) |
| 1.3 | [Log output](https://github.com/joyboy677/kubernetes/tree/1.3/log-output) |
| 1.4 | [Todo app](https://github.com/joyboy677/kubernetes/tree/1.4/todo-app) |
| 1.5 | [Todo app](https://github.com/joyboy677/kubernetes/tree/1.5/todo-app) |
| 1.6 | [Todo app](https://github.com/joyboy677/kubernetes/tree/1.6/todo-app) |
| 1.7 | [Log output](https://github.com/joyboy677/kubernetes/tree/1.7/log-output) |
| 1.8 | [Todo app](https://github.com/joyboy677/kubernetes/tree/1.8/todo-app) |
| 1.9 | [ping pong](https://github.com/joyboy677/kubernetes/tree/1.9/ping-pong) |
| 1.10 | [Log output](https://github.com/joyboy677/kubernetes/tree/1.10/log-output) |
| 1.11 | [Log output](https://github.com/joyboy677/kubernetes/tree/1.11/log-output) |
| 1.12 | [Todo app](https://github.com/joyboy677/kubernetes/tree/1.12/todo-app) |
| 1.13 | [Todo app](https://github.com/joyboy677/kubernetes/tree/1.13/todo-app) |
| 2.1 | [Log output](https://github.com/joyboy677/kubernetes/tree/2.1/log-output) |
| 2.2 | [todo backend](https://github.com/joyboy677/kubernetes/tree/2.2/todo-backend) |
| 2.3 | [namespaces](https://github.com/joyboy677/kubernetes/tree/2.3/manifests) |
| 2.4 | [namespaces](https://github.com/joyboy677/kubernetes/tree/2.4/manifests) |
| 2.5 | [Log output](https://github.com/joyboy677/kubernetes/tree/2.5/log-output) |
| 2.6 | [Todo app](https://github.com/joyboy677/kubernetes/tree/2.6/todo-app) |
| 2.7 | [ping pong](https://github.com/joyboy677/kubernetes/tree/2.7/ping-pong) |
| 2.8 | [todo backend](https://github.com/joyboy677/kubernetes/tree/2.8/todo-backend) |
| 2.9 | [todo backend](https://github.com/joyboy677/kubernetes/tree/2.9/todo-backend) |
| 2.10 | [monitoring](https://github.com/joyboy677/kubernetes/tree/2.10/monitoring) |
| 3.1 | [ping pong](https://github.com/joyboy677/kubernetes/tree/3.1/ping-pong) |
| 3.2 | [ping pong](https://github.com/joyboy677/kubernetes/tree/3.2/ping-pong) |
| 3.3 | [Gateway](https://github.com/joyboy677/kubernetes/tree/3.3/manifests) |
| 3.4 | [Gateway](https://github.com/joyboy677/kubernetes/tree/3.4/manifests) |
| 3.5 | [Todo app](https://github.com/joyboy677/kubernetes/tree/3.5/todo-app) |
| 3.6 | [CICD](https://github.com/joyboy677/kubernetes/tree/3.6/.github/workflows) |
| 3.7 | [CICD](https://github.com/joyboy677/kubernetes/tree/3.7/.github/workflows) |
| 3.8 | [CICD](https://github.com/joyboy677/kubernetes/tree/3.8/.github/workflows) |
| 3.9 | [DBaaS vs DIY](https://github.com/joyboy677/kubernetes/tree/3.9) |

---

### Exercise 3.9: DBaaS vs DIY

#### Overview Comparison

| Metric | DBaaS (Managed - e.g., Cloud SQL) | DIY (In-Cluster GKE StatefulSet) |
| :--- | :--- | :--- |
| **Initialization Effort** | **Minimal**: Spin up in minutes via CLI or GCP Console. | **High**: Requires configuring StatefulSets, PVCs, StorageClasses, and Secrets. |
| **Initialization Cost** | **Higher Baseline**: Dedicated instance charges and managed vendor markup. | **Lower Initial Cost**: Runs directly on existing cluster node resources. |
| **Ongoing Maintenance** | **Automated**: GCP manages OS patches, engine updates, and HA failovers. | **High Effort**: Team must manually handle node drains, updates, and disk sizing. |
| **Backup Methods & Ease** | **Turnkey**: Automated daily snapshots and point-in-time recovery with 1 click. | **Manual**: Requires tools like `pgBackRest` or Velero to handle GCS backups and WAL logs. |

#### Pros & Cons

* **DBaaS (Managed Database)**
  * **Pros:** Zero operational overhead, reliable out-of-the-box HA/failover, and simple backup recovery.
  * **Cons:** Higher infrastructure cost, cloud vendor lock-in, and limited low-level database customization.

* **DIY (In-Cluster Database)**
  * **Pros:** Cheaper at raw resource cost, no vendor markups, and completely cloud-agnostic/portable via GitOps.
  * **Cons:** Risk of data loss during node maintenance, heavy operational burden, and complex disaster recovery setup.

| 3.10 | [Cronjob Backup](https://github.com/joyboy677/kubernetes/tree/3.10/postgres-backup) |

| 3.11 | [Todo app](https://github.com/joyboy677/kubernetes/tree/3.11/todo-app) |

| 3.12 | [GKE Logs Screenshot](https://github.com/joyboy677/kubernetes/tree/3.12/logs.png) |