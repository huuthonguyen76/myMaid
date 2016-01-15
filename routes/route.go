package routes

import (
	"github.com/gorilla/mux"
	"myMaid/application"
	"myMaid/modules/user/controllers"
	"net/http"
)

func RouteStart() {
	r := mux.NewRouter()

	// Routes consist of a path and a handler function.
	r.HandleFunc("/", application.NewControllerHP).Methods("GET")

	r.PathPrefix("/public/").Handler(http.FileServer(http.Dir(".")))

	// User Management
	r.HandleFunc("/getUser", application.NewController(user_controllers.GetUser)).Methods("POST")
	r.HandleFunc("/register", application.NewController(user_controllers.Register)).Methods("POST")

	// Bind to a port and pass our router in
	http.ListenAndServe(":8000", r)
}
