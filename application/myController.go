package application

import (
	"encoding/json"
	"net/http"
)

type MyController func(http.ResponseWriter, *http.Request, *MyContext)

func NewController(controller MyController) func(http.ResponseWriter, *http.Request) {
	return func(rw http.ResponseWriter, rq *http.Request) {
		context := new(MyContext)
		defer context.CloseContext()
		context.NewContext(rq)

		controller(rw, rq, context)
	}
}

func NewControllerHP(rw http.ResponseWriter, rq *http.Request) {
	http.ServeFile(rw, rq, "public/main.html")
}

func ResponseData(rw http.ResponseWriter, result interface{}, statusCode int) {
	rw.WriteHeader(statusCode)
	json.NewEncoder(rw).Encode(result)
}
