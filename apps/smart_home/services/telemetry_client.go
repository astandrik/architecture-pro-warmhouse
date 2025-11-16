package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type TelemetryClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewTelemetryClient(baseURL string) *TelemetryClient {
	return &TelemetryClient{
		BaseURL:    baseURL,
		HTTPClient: &http.Client{},
	}
}

func (c *TelemetryClient) Ingest(body map[string]any) (*http.Response, error) {
	u := fmt.Sprintf("%s/v1/telemetry", c.BaseURL)
	b, _ := json.Marshal(body)
	req, _ := http.NewRequest(http.MethodPost, u, bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	return c.HTTPClient.Do(req)
}

func (c *TelemetryClient) Query(deviceID string, limit int) (*http.Response, error) {
	u, _ := url.Parse(fmt.Sprintf("%s/v1/telemetry", c.BaseURL))
	q := u.Query()
	q.Set("device_id", deviceID)
	if limit > 0 {
		q.Set("limit", fmt.Sprintf("%d", limit))
	}
	u.RawQuery = q.Encode()
	return c.HTTPClient.Get(u.String())
}


