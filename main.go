package main

import (
	"myMaid/application"
	"myMaid/routes"
)

func main() {
	application.Config.InitConfig()
	routes.RouteStart()
}
