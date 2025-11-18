package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type DeviceMgmtClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewDeviceMgmtClient(baseURL string) *DeviceMgmtClient {
	return &DeviceMgmtClient{
		BaseURL:    baseURL,
		HTTPClient: &http.Client{},
	}
}

func (c *DeviceMgmtClient) CreateCommand(body map[string]any) (*http.Response, error) {
	url := fmt.Sprintf("%s/v1/device-commands", c.BaseURL)
	b, _ := json.Marshal(body)
	req, _ := http.NewRequest(http.MethodPost, url, bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	return c.HTTPClient.Do(req)
}

func (c *DeviceMgmtClient) GetCommand(id string) (*http.Response, error) {
	url := fmt.Sprintf("%s/v1/device-commands/%s", c.BaseURL, id)
	return c.HTTPClient.Get(url)
}


