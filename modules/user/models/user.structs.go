package user_models

import (
	"gopkg.in/mgo.v2/bson"
)

type UserStruct struct {
	ID       bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Username string        `json:"username" bson:"username"`
	Name     string        `json:"name" bson:"name"`
	Password string        `json:"password" bson:"password"`
	Email    string        `json:"email" bson:"email"`
}
