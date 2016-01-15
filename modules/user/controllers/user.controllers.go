package user_controllers

import (
	"encoding/json"
	"fmt"
	"github.com/graphql-go/graphql"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"myMaid/application"
	"myMaid/helpers"
	"myMaid/modules/user/models"
	"net/http"
	"strings"
)

func getUserSchema(context *application.MyContext) graphql.Schema {
	var userType = graphql.Fields{
		"user": &graphql.Field{
			Type: graphql.NewObject(
				graphql.ObjectConfig{
					Name: "User",
					Fields: graphql.Fields{
						"id": &graphql.Field{
							Type: graphql.String,
						},
						"name": &graphql.Field{
							Type: graphql.String,
						},
						"password": &graphql.Field{
							Type: graphql.String,
						},
					},
				},
			),
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, isOK := p.Args["id"].(string)

				if isOK {
					var dbConnection = (context.GetDbConnection()).(*mgo.Database)
					var result = user_models.UserStruct{}
					err := dbConnection.C("users").Find(bson.M{"_id": bson.ObjectIdHex(id)}).One(&result)
					if err != nil {
						panic(err)
					}
					return result, nil
				}
				return nil, nil
			},
		},
	}
	var schema, _ = graphql.NewSchema(
		graphql.SchemaConfig{
			Query: graphql.NewObject(
				graphql.ObjectConfig{
					Name:   "UserQuery",
					Fields: userType,
				}),
		},
	)
	return schema
}

func executeQuery(query string, context *application.MyContext) *graphql.Result {
	result := graphql.Do(graphql.Params{
		Schema:        getUserSchema(context),
		RequestString: query,
	})
	if len(result.Errors) > 0 {
		fmt.Printf("wrong result, unexpected errors: %v", result.Errors)
	}
	return result
}

//
//
//
//
func GetUser(rw http.ResponseWriter, rq *http.Request, context *application.MyContext) {
	query := rq.FormValue("query")
	result := executeQuery(query, context)

	json.NewEncoder(rw).Encode(result)
}

func Register(rw http.ResponseWriter, rq *http.Request, context *application.MyContext) {
	username := rq.FormValue("username")
	password := rq.FormValue("password")

	isValid := helpers.ValidateRegister(username, password)

	if !isValid {
		application.ResponseData(rw, nil, http.StatusBadRequest)
		return
	}

	var newPerson = &user_models.UserStruct{Username: strings.ToLower(username), Password: password}
	var dbConnection = (context.GetDbConnection()).(*mgo.Database)
	err := dbConnection.C("users").Insert(newPerson)
	if err != nil {
		panic(err)
	}
	application.ResponseData(rw, newPerson, http.StatusGone)
}
