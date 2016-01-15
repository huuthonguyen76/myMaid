package application

import (
	"gopkg.in/mgo.v2"
)

type myMongo struct {
	session *mgo.Session
}

var MongoConnection myMongo

func (this *myMongo) StartSession() {
	session, err := mgo.Dial(Config.GetDBAddress())
	if err != nil {
		panic(err)
	}

	// Optional. Switch the session to a monotonic behavior.
	session.SetMode(mgo.Monotonic, true)
	this.session = session
}

func (this *myMongo) CloseSession() {
	this.session.Close()
}

func (this *myMongo) GetSession() interface{} {
	return this.session
}
