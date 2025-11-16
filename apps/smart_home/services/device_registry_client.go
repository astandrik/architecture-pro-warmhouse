package services

import (
	"bytes"
	"fmt"
	"net/http"
	"net/url"
)

type DeviceRegistryClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewDeviceRegistryClient(baseURL string) *DeviceRegistryClient {
	return &DeviceRegistryClient{
		BaseURL:    baseURL,
		HTTPClient: &http.Client{},
	}
}

func (c *DeviceRegistryClient) ListDevices(typeCode string) (*http.Response, error) {
	u, _ := url.Parse(fmt.Sprintf("%s/v1/devices", c.BaseURL))
	if typeCode != "" {
		q := u.Query()
		q.Set("type_code", typeCode)
		u.RawQuery = q.Encode()
	}
	return c.HTTPClient.Get(u.String())
}

func (c *DeviceRegistryClient) CreateDevice(body []byte) (*http.Response, error) {
	u := fmt.Sprintf("%s/v1/devices", c.BaseURL)
	req, _ := http.NewRequest(http.MethodPost, u, bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	return c.HTTPClient.Do(req)
}

func (c *DeviceRegistryClient) DeleteDevice(id string) (*http.Response, error) {
	u := fmt.Sprintf("%s/v1/devices/%s", c.BaseURL, url.PathEscape(id))
	req, _ := http.NewRequest(http.MethodDelete, u, nil)
	return c.HTTPClient.Do(req)
}

func (c *DeviceRegistryClient) ListDeviceTypes() (*http.Response, error) {
	return c.HTTPClient.Get(fmt.Sprintf("%s/v1/device-types", c.BaseURL))
}

func (c *DeviceRegistryClient) ListRooms() (*http.Response, error) {
	return c.HTTPClient.Get(fmt.Sprintf("%s/v1/rooms", c.BaseURL))
}


