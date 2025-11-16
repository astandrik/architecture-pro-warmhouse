package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"smarthome/services"
)

type ProxyHandler struct {
	DeviceMgmt *services.DeviceMgmtClient
	Telemetry  *services.TelemetryClient
}

func NewProxyHandler(dm *services.DeviceMgmtClient, t *services.TelemetryClient) *ProxyHandler {
	return &ProxyHandler{DeviceMgmt: dm, Telemetry: t}
}

func (h *ProxyHandler) RegisterRoutes(router *gin.RouterGroup) {
	// POST /api/v1/device-commands
	router.POST("/device-commands", h.createDeviceCommand)
	// GET /api/v1/telemetry
	router.GET("/telemetry", h.getTelemetry)
}

func (h *ProxyHandler) createDeviceCommand(c *gin.Context) {
	var body map[string]any
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.DeviceMgmt.CreateCommand(body)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}
	defer resp.Body.Close()
	copyResponse(c, resp)
}

func (h *ProxyHandler) getTelemetry(c *gin.Context) {
	deviceID := c.Query("device_id")
	limitStr := c.Query("limit")
	limit := 50
	if limitStr != "" {
		if v, err := strconv.Atoi(limitStr); err == nil {
			limit = v
		}
	}
	resp, err := h.Telemetry.Query(deviceID, limit)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}
	defer resp.Body.Close()
	copyResponse(c, resp)
}

func copyResponse(c *gin.Context, resp *http.Response) {
	b, _ := io.ReadAll(resp.Body)
	var payload any
	_ = json.Unmarshal(b, &payload)
	if payload == nil {
		c.Status(resp.StatusCode)
		return
	}
	c.JSON(resp.StatusCode, payload)
}


