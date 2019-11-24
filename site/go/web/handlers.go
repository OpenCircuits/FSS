package web

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/OpenCircuits/OpenCircuits/site/go/auth"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/interfaces"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
)

type item struct {
	ID    string `json:"id"`
	Label string `json:"label"`
	Icon  string `json:"icon"`
	Not   bool   `json:"not"`
}

type section struct {
	ID    string `json:"id"`
	Label string `json:"label"`
	Items []item `json:"items"`
}

type navConfig struct {
	ImgRoot  string    `json:"imgRoot"`
	Sections []section `json:"sections"`
}

// var digitalNavConfig navConfig
// var analogNavConfig navConfig

// func loadNavConfig(path string, config *navConfig) {
// 	// Load the sections from the json file TODO: don't cache this (or make a way to make it dirty)
// 	file, err := ioutil.ReadFile(path)
// 	if err != nil {
// 		log.Printf("File error: %v\n", err)
// 		os.Exit(1)
// 	}
// 	err = json.Unmarshal(file, config)
// 	if err != nil {
// 		log.Printf("Failed to unmarshall json: %v\n", err)
// 		os.Exit(1)
// 	}
// }

func init() {
	// loadNavConfig("./data/digitalnavconfig.json", &digitalNavConfig)
	// loadNavConfig("./data/analognavconfig.json", &analogNavConfig)
}

func getLastModifiedTime(path string) time.Time {
	file, err := os.Stat(path)
	if err != nil {
		log.Printf("Invalid file path %s\n", path)
		return time.Now()
	}
	return file.ModTime()
}

func getBustedName(path string) string {
	return path + "?ver=" + strconv.FormatInt(getLastModifiedTime(path).Unix(), 10)
}

func indexHandler(manager auth.AuthenticationManager, examplesCsif interfaces.CircuitStorageInterfaceFactory) func(c *gin.Context) {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		userID := session.Get("user-id")
		loggedIn := userID != nil

		authData := struct {
			Headers []template.HTML
			Buttons []template.HTML
		}{}
		for _, a := range manager.AuthMethods {
			authData.Headers = append(authData.Headers, a.GetLoginHeader())
			authData.Buttons = append(authData.Buttons, a.GetLoginButton())
		}

		exampleCircuits := examplesCsif.CreateCircuitStorageInterface().EnumerateCircuits("example")

		c.HTML(http.StatusOK, "fss.gohtml", gin.H{
			"examples": exampleCircuits,
			"l":        loggedIn,
			"userId":   userID,
			"authData": authData,
			"bundleJs": getBustedName("./Bundle.js"),
		})
	}
}

// func analogHandler(manager auth.AuthenticationManager, examplesCsif interfaces.CircuitStorageInterfaceFactory) func(c *gin.Context) {
// 	return func(c *gin.Context) {
// 		session := sessions.Default(c)
// 		userID := session.Get("user-id")
// 		loggedIn := userID != nil

// 		authData := struct {
// 			Headers []template.HTML
// 			Buttons []template.HTML
// 		}{}
// 		for _, a := range manager.AuthMethods {
// 			authData.Headers = append(authData.Headers, a.GetLoginHeader())
// 			authData.Buttons = append(authData.Buttons, a.GetLoginButton())
// 		}

// 		c.HTML(http.StatusOK, "analog.gohtml", gin.H{
// 			"navConfig": analogNavConfig,
// 			"l":         loggedIn,
// 			"userId":    userID,
// 			"authData":  authData,
// 			"bundleJs":  getBustedName("./Bundle.analog.js"),
// 		})
// 	}
// }

func noCacheHandler(path string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.File(path)
	}
}
