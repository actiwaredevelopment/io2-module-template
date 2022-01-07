package models

type ServiceStats struct {
	Product        string `json:"product"`
	ProductName    string `json:"product_name"`
	ProductVersion string `json:"product_version"`
	FileVersion    string `json:"file_version"`
	Status         bool   `json:"status"`
}
