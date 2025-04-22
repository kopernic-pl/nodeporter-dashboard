// Next.js API route for /api/envtype
import accessLog from '../../utils/accessLog';

export default function handler(req, res) {
  accessLog(req, res);
  // This env var is set by Kubernetes in-cluster, see also nodes.js/services.js
  const inCluster = Boolean(process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT);
  res.status(200).json({
    envType: inCluster ? "in-cluster" : "local"
  });
}
