package services

import (
	"fmt"
	"net/http"
)

type UserHousesClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewUserHousesClient(baseURL string) *UserHousesClient {
	return &UserHousesClient{
		BaseURL:    baseURL,
		HTTPClient: &http.Client{},
	}
}

func (c *UserHousesClient) ListRooms() (*http.Response, error) {
	return c.HTTPClient.Get(fmt.Sprintf("%s/v1/rooms", c.BaseURL))
}


