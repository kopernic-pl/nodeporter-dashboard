{{/*
Helpers for nodeporter chart
*/}}
{{- define "nodeporter.fullname" -}}
{{- printf "%s" .Release.Name -}}
{{- end -}}

{{- define "nodeporter.labels" -}}
app.kubernetes.io/name: {{ include "nodeporter.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "nodeporter.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nodeporter.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "nodeporter.name" -}}
nodeporter
{{- end -}}
